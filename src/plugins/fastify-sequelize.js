const fp = require('fastify-plugin')
const Sequelize = require('sequelize')
const globby = require('globby')

module.exports = fp(async (fastify, options, next) => {
  let db = {}
  const dbs = Object.keys(options)
  await Promise.all(
    dbs.map(async dbNmae => {
      const { username, password, alias, ...otherConfig } = options[dbNmae]
      const sequelizeInstance = new Sequelize(
        alias || dbNmae,
        username,
        password,
        otherConfig
      )
      fastify.addHook('onClose', (_, done) => {
        sequelizeInstance
          .close()
          .then(done)
          .catch(done)
      })
      const modelDirectory = process.cwd() + '/src/dbs/' + dbNmae
      const modelPaths = await globby(modelDirectory)
      let models = {}
      modelPaths.forEach(path => {
        const tableName = path.replace(/.+\/(.+)\.model\.js/, '$1')
        models[tableName] = sequelizeInstance.define(tableName, require(path), {
          tableName
        })
      })
      db[dbNmae] = {
        model: models
      }
    })
  )
  fastify.decorate('db', db)

  next()
})
