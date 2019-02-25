const addDogSchema = {
  body: {
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
}

module.exports = {
  addDogSchema
}
