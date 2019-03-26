module.exports = {
  eureka: {
    urls:
      'http://eureka01:8761/eureka/apps,http://eureka02:8761/eureka/apps,http://eureka03:8761/eureka/apps'
  },
  databases: {
    zeus: {
      alias: 'zeus_production', // 为了解决daily和production库名不一致的问题
      username: 'myunion',
      password: 'fdsf#4342f#$%',
      dialect: 'mysql',
      host: 'quancheng-db01.mysql.rds.aliyuncs.com',
      port: 3306,
      define: {
        underscored: true,
        timestamps: false
      }
    }
  },
  walaniMpCompanyId: '103170427203411001'
}
