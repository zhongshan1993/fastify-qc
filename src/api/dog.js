const { Get, Post } = require('../utils/route')

class Dog {
  @Post('/addDog')
  async addDog (request, reply) {
    reply.send({ hello: 'addDog' })
  }

  @Get('/dogs')
  async dogs (request, reply) {
    reply.send({ hello: 'dog-list' })
  }

  @Get('/:dogId')
  async dog (request, reply) {
    reply.send({ hello: `dogId:${request.params.dogId}` })
  }
}

module.exports = Dog
