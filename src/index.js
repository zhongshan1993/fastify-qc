const IS_NOT_PRODUCTION = process.env.NODE_ENV !== 'production'

// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: IS_NOT_PRODUCTION
})

// 加载配置
fastify.register(require('./plugins/fastify-config-loader'))
// eureka
fastify.register(require('./plugins/fastify-eureka'), parent => {
  return parent.config.eureka
})
// grpc
fastify.register(require('./plugins/fastify-grpc-client'), parent => {
  return parent.config.grpc
})
// db
fastify.register(require('./plugins/fastify-sequelize'), parent => {
  return parent.config.databases
})

// 非生产环境启动swagger
if (IS_NOT_PRODUCTION) {
  fastify.register(require('fastify-swagger'), parent => {
    return parent.config.swagger
  })
}

// 注册api
fastify.register(require('./plugins/fastify-api-loader'))

// Run the server!
fastify.listen(3000, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
fastify.ready(err => {
  if (err) throw err
  err || (fastify.swagger && fastify.swagger())
})
