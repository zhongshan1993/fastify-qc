// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})

const apiDog = require('./api/dog')
registerAPI(apiDog)
// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})

function registerAPI (APIConstructor) {
  const apisInstance = new APIConstructor()
  const apisName = Object.getOwnPropertyNames(
    Object.getPrototypeOf(apisInstance)
  ).filter(key => key !== 'constructor')
  // console.log(apisName, 1111111)
  apisName.map(apiName => {
    const { routes, schema } = apisInstance[apiName]
    // console.log(routes, 2222222)
    fastify.register(async (fastify, options) => {
      routes.map(route => {
        const { method, url } = route
        fastify.route({
          url: `/${APIConstructor.name.toLocaleLowerCase()}${url}`,
          method,
          handler: apisInstance[apiName],
          schema
        })
      })
    })
  })
}
