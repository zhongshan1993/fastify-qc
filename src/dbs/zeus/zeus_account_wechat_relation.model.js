const Sequelize = require('sequelize')
const { STRING, DATE } = Sequelize
module.exports = {
  accountId: {
    type: STRING,
    field: 'account_id'
  },
  unionId: {
    type: STRING,
    field: 'union_id'
  },
  appId: {
    type: STRING,
    field: 'app_id'
  },
  openId: {
    type: STRING,
    field: 'open_id'
  },
  nickName: {
    type: STRING,
    field: 'nick_name'
  },
  gmtCreated: {
    type: DATE,
    field: 'gmt_created'
  },
  gmtModified: {
    type: DATE,
    field: 'gmt_modified'
  }
}
