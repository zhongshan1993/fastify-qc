const { Get, Post, Schema } = require('../utils/route')
const { addDogSchema } = require('../schemas/dog')
class Dog {
  @Post('/addDog')
  @Schema(addDogSchema)
  async addDog (request, reply) {
    reply.send({ dog: request.body })
  }

  @Get('/dogs')
  async dogs (request, reply) {
    reply.send({ hello: 'dog-list' })
  }

  @Get('/:dogId')
  @Schema({
    params: {
      type: 'object',
      properties: {
        dogId: { type: 'number' }
      },
      required: ['dogId']
    }
  })
  async dog (request, reply) {
    reply.send({ hello: `dogId:${request.params.dogId}` })
  }
}

module.exports = Dog
