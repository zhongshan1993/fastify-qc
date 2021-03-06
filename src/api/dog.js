const { Get, Post } = require('../utils/route')
const { addDogSchema, dogsSchema, queryDogSchema } = require('../schemas/dog')
class Dog {
  @Post('/addDog', addDogSchema)
  async addDog (request, reply) {
    // reply.send({ data: request.body })
    // reply.send(new Error('该商品已经下架！'))
    reply.status(400).send({
      error: 10001,
      message: '该商品已经下架！'
    })
  }

  @Get('/dogs', dogsSchema)
  async dogs (request, reply, app) {
    const ret = await app.db.zeus.model.zeus_account_wechat_relation.findAll({
      where: {
        accountId: 103180927175708001
      }
    })
    console.log(ret[0].openId, 88888888888)
    reply.send({ hello: 'dog-list' })
  }

  @Get('/:dogId', queryDogSchema)
  async dog (request, reply, app) {
    const ret = await app.grpc.CompanyService.get({ companyIds: ['6'] })
    console.log(ret)
    reply.send({ hello: `dogId:${request.params.dogId}` })
  }
}

module.exports = Dog
