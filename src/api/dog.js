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
  async dogs (request, reply) {
    reply.send({ hello: 'dog-list' })
  }

  @Get('/:dogId', queryDogSchema)
  async dog (request, reply) {
    reply.send({ hello: `dogId:${request.params.dogId}` })
  }
}

module.exports = Dog
