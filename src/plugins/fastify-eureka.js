const fp = require('fastify-plugin')
const Eureka = require('eureka-js-client').Eureka
const ip = require('ip')
const ipAddr = ip.address()
const randomHash = () =>
  Math.random()
    .toString(16)
    .slice(-10)

module.exports = fp(async (fastify, options, next) => {
  const { name, version, port, urls } = options
  const instanceName = `${name}:${version}`
  const genUrl = (pageName = '') => `http://${ipAddr}:${port}/${pageName}`
  const client = new Eureka({
    eureka: {
      serviceUrls: {
        default: urls.split(',')
      },
      heartbeatInterval: 5000,
      registryFetchInterval: 1000
    },
    instance: {
      app: instanceName,
      hostName: ipAddr,
      instanceId: `${randomHash()}:${instanceName}:${port}`,
      ipAddr: ipAddr,
      homePageUrl: genUrl(),
      statusPageUrl: genUrl('info'),
      healthCheckUrl: genUrl('health'),
      secureVipAddress: instanceName,
      vipAddress: instanceName,
      port: {
        $: port,
        '@enabled': 'true'
      },
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn'
      }
    }
  })

  const p = new Promise(resolve => {
    client.start(err => {
      err && console.log(err)
      resolve()
    })
  })

  await p

  const _eureka = new Proxy(
    {},
    {
      get: function (target, key, receiver) {
        return client
          .getInstancesByAppId(key)
          .map(instance => `${instance.ipAddr}:${instance.port.$ + 1}`)
      }
    }
  )
  fastify.decorate('eureka', {
    getter () {
      return _eureka
    }
  })
  next()
})
