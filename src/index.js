// Require the framework and instantiate it
const IS_NOT_PRODUCTION = process.env.NODE_ENV !== 'production'
const fastify = require('fastify')({
  logger: IS_NOT_PRODUCTION
})
const fp = require('fastify-plugin')
// 加载配置
fastify.register(require('./plugins/fastify-config-loader'))
// 非生产环境启动swagger
fastify.register(
  fp((fastify, opts, next) => {
    if (IS_NOT_PRODUCTION) {
      fastify.register(require('fastify-swagger'), fastify.config.swagger)
    }
    next()
  })
)
// 注册api
fastify.register(require('./plugins/fastify-api-loader'))

// Run the server!
fastify.listen(3000, function (err, address) {
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
