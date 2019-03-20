const globby = require('globby')
const registerAPI = fastify => APIConstructor => {
  const apisInstance = new APIConstructor()
  const apisName = Object.getOwnPropertyNames(
    Object.getPrototypeOf(apisInstance)
  ).filter(key => key !== 'constructor')
  apisName.map(apiName => {
    const { routes } = apisInstance[apiName]
    fastify
      .register(async (fastify, options) => {
        routes.map(route => {
          const { method, url, schema } = route
          fastify.route({
            url: `/${APIConstructor.name.toLocaleLowerCase()}${url}`,
            method,
            handler: (request, reply) =>
              apisInstance[apiName](request, reply, fastify),
            schema
          })
        })
      })
      .after(() => {
        delete apisInstance[apiName].routes
      })
  })
}

module.exports = async (fastify, options, next) => {
  const { path = '/src/api' } = options
  const apiDirectory = process.cwd() + path
  const apiPaths = await globby(apiDirectory)
  apiPaths.map(require).forEach(registerAPI(fastify))
  next()
}
