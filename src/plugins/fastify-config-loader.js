const _ = require('lodash')
const fp = require('fastify-plugin')
module.exports = fp((fastify, options, next) => {
  const { path = '/src/config' } = options
  const configPath = process.cwd() + path
  const NODE_ENV = process.env.NODE_ENV
  const defaultConfig = require(`${configPath}/index.default.js`)
  const localConfig = require(`${configPath}/index.local.js`)
  const developConfig = require(`${configPath}/index.develop.js`)
  const productionConfig = require(`${configPath}/index.production.js`)
  let destinationConfig
  if (NODE_ENV === 'develop') {
    destinationConfig = _.defaultsDeep(developConfig, defaultConfig)
  } else if (NODE_ENV === 'production') {
    destinationConfig = _.defaultsDeep(productionConfig, defaultConfig)
  } else {
    destinationConfig = _.defaultsDeep(localConfig, defaultConfig)
  }
  fastify.decorate('config', destinationConfig)
  next()
})
