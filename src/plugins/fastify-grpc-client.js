const fp = require('fastify-plugin')
const globby = require('globby')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')
const { resolve } = require('path')
const _ = require('lodash')
const Reach = require('reach')
const fs = require('fs-extra')
const opt = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

module.exports = fp(async (fastify, options, next) => {
  const { pbPathsRegExp, services } = options
  const pbPaths = await globby.sync(pbPathsRegExp)
  let protos = {}
  pbPaths.forEach(path => {
    const pbRoot = resolve(path, '../../')
    const packageDefinition = protoLoader.loadSync(
      path,
      Object.assign({}, opt, { includeDirs: [pbRoot] })
    )
    const packageObject = grpc.loadPackageDefinition(packageDefinition)
    protos = _.defaultsDeep(protos, packageObject)
  })
  fastify.decorate('protos', protos)
  let _grpc = {}
  for (let key in services) {
    const [url, serviceName, version] = services[key].split(':')
    _grpc[key] = proxyHandler(
      fastify,
      `${serviceName}:${version}`,
      Reach(protos, url),
      options
    )
  }
  fastify.decorate('grpc', _grpc)
  next()
})

function proxyHandler (fastify, eurekaServiceName, PB, grpcCconfig) {
  let cache = {}
  return new Proxy(
    {},
    {
      get: function (target, key, receiver) {
        const { eureka } = fastify
        return function (params, metaData = {}) {
          // todo 清除过期的client
          const host = _.sample(eureka[eurekaServiceName])
          let client
          if (cache[host]) {
            console.info('client from cache !')
            client = cache[host]
          } else {
            const pemPath = grpcCconfig.pemPath
            const sslCreds = grpc.credentials.createSsl(
              fs.readFileSync(pemPath)
            )
            const mcreds = grpc.credentials.createFromMetadataGenerator(
              function (_, callback) {
                const metadata = new grpc.Metadata()
                metadata.set('plugin_key', 'plugin_value')
                callback(null, metadata)
              }
            )
            const combinedCreds = grpc.credentials.combineChannelCredentials(
              sslCreds,
              mcreds
            )
            client = cache[host] = new PB(
              host,
              combinedCreds,
              grpcCconfig.options
            )
          }
          let retry = 0
          const maxRetry = grpcCconfig.retry || 5 // 最大重试次数， 默认5次
          let customMetadata = new grpc.Metadata()
          Object.keys(metaData).forEach(k => customMetadata.set(k, metaData[k]))
          return new Promise(function invoke (resolve, reject) {
            client[key](params, customMetadata, function (err, response) {
              if (err) {
                console.warn(`methods:${key}出现错误，错误原因:${err}`)
                if (++retry > maxRetry) {
                  console.error(`重试超过${maxRetry}次,放弃！`)
                  // 重试超过规定次数
                  reject(err)
                } else {
                  console.warn(`准备重试-->第${retry}次`)
                  invoke(resolve, reject)
                }
              } else {
                resolve(response)
              }
            })
          })
        }
      }
    }
  )
}
