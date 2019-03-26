const bindWithFKAccountSchame = {
  body: {
    type: 'object',
    required: ['pwd', 'mobile', 'code', 'appId'],
    properties: {
      pwd: {
        type: 'string'
      },
      mobile: {
        type: 'string'
      },
      code: {
        type: 'string'
      },
      appId: {
        type: 'string'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean'
        }
      }
    }
  }
}

module.exports = {
  bindWithFKAccountSchame
}
