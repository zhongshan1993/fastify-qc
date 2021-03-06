const ip = require('ip')
module.exports = {
  swagger: {
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Test swagger',
        description: 'testing the fastify swagger api',
        version: '0.1.0'
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      host: `${ip.address()}:3000`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'user', description: 'User related end-points' },
        { name: 'code', description: 'Code related end-points' }
      ],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header'
        }
      }
    }
  },
  eureka: {
    name: 'fastify', // 这个应用注册到eureka的名字
    version: '1.0.0',
    port: process.env.PORT || 3000,
    urls: 'http://eureka.dev.quancheng-ec.com/eureka/apps'
  },
  grpc: {
    pbPathsRegExp:
      process.cwd() +
      '/node_modules/@quancheng/**/src/main/proto/**/*_service.proto',
    pemPath: process.cwd() + '/grpc.pem',
    retry: 5,
    services: {
      UserService: 'com.quancheng.zeus.service.UserService:zeus-service:1.0.0',
      CompanyService:
        'com.quancheng.zeus.service.CompanyService:zeus-service:1.0.0',
      AccountService:
        'com.quancheng.zeus.service.AccountService:zeus-service:1.0.0'
    },
    options: {
      'grpc.ssl_target_name_override': 'grpc',
      'grpc.default_authority': 'grpc'
    }
  },
  databases: {
    zeus: {
      username: 'qc_test',
      password: 'Qcwl123456',
      dialect: 'mysql',
      host: 'rm-bp1ujlxk5146v9027o.mysql.rds.aliyuncs.com',
      port: 3306,
      define: {
        underscored: true,
        timestamps: false
      }
    }
  },
  wechatServiceUrl: 'http://wechat-service:7001',
  walaniMpCompanyId: '103170324104449001'
}
