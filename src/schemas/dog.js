const _ = require('lodash')
const DOG_INPUT = {
  type: 'object',
  required: ['name', 'age', 'friends'],
  properties: {
    name: {
      type: 'string',
      minLength: 5
    },
    age: {
      type: 'integer',
      minimum: 0,
      maximum: 50
    },
    friends: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 5
          },
          age: {
            type: 'integer',
            minimum: 0,
            maximum: 50
          }
        }
      }
    }
  }
}

const DOG_OUTPUT = _.defaultsDeep(
  {
    required: ['name', 'age', 'friends', 'id'],
    properties: {
      id: {
        type: 'integer'
      },
      friends: {
        items: {
          required: ['name', 'id'],
          properties: {
            id: {
              type: 'integer'
            }
          }
        }
      }
    }
  },
  DOG_INPUT
)

const addDogSchema = {
  body: DOG_INPUT,
  response: {
    200: DOG_OUTPUT
  }
}

const dogsSchema = {
  response: {
    200: {
      type: 'array',
      items: DOG_OUTPUT
    }
  }
}

const queryDogSchema = {
  params: {
    type: 'object',
    required: ['dogId'],
    properties: {
      dogId: {
        type: 'integer'
      }
    }
  },
  response: {
    200: DOG_OUTPUT
  }
}

module.exports = {
  addDogSchema,
  dogsSchema,
  queryDogSchema
}
