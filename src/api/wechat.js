const { Post } = require('../utils/route')
const { bindWithFKAccountSchame } = require('../schemas/wechat')
const axios = require('axios')
class Wechat {
  @Post('/bindWithFKAccount', bindWithFKAccountSchame)
  async bindWithFKAccount (request, reply, app) {
    const { pwd, mobile, code, appId } = request.body
    const {
      data: { openid }
    } = await axios.post(
      `${app.config.wechatServiceUrl}/mp/jsCode2OpenidAndSessionKey`,
      {
        code,
        appId
      }
    )
    if (openid) {
      const { user } = await app.grpc.UserService.login({
        mobile,
        pwd
      })
      if (user) {
        const { accounts } = await app.grpc.AccountService.get({
          userId: user.userId
        })
        const targetAccountInfo = accounts.find(
          account =>
            account.companyId === app.config.walaniMpCompanyId &&
            account.status === 'ACCOUNT_ACTIVATED'
        )
        if (targetAccountInfo) {
          const _bindRet = await app.db.zeus.model.zeus_account_wechat_relation.findOrCreate(
            {
              where: {
                accountId: targetAccountInfo.accountId,
                openId: openid,
                appId: appId
              }
            }
          )
          reply.send({
            success: !!_bindRet && _bindRet.length
          })
        } else {
          reply.status(400).send({
            error: 10004,
            message: '在目标公司下没有找到对应的账户'
          })
        }
        reply.send(targetAccountInfo)
      } else {
        reply.status(400).send({
          error: 10003,
          message: '用户名或密码错误'
        })
      }
    } else {
      reply.status(400).send({
        error: 10002,
        message: '获取openid失败'
      })
    }
  }

  // 尝试用微信临时登录code登录，不保证登录成功
  // 对于已经绑定过的微信用户能登录成功
  // 没有绑定过的用户提示先去绑定
  async tryLoginWithJsCode (request, reply, app) {
    const { code, appId } = request.body
    const {
      data: { openid, unionid }
    } = await axios.post(
      `${app.config.wechatServiceUrl}/mp/jsCode2OpenidAndSessionKey`,
      {
        code,
        appId
      }
    )
    if (openid) {
      const bindedAccount = await app.db.zeus.model.zeus_account_wechat_relation.findOne(
        {
          where: {
            openId: openid,
            appId: appId
          }
        }
      )
      if (bindedAccount) {
        // 已经绑定过了
        // 还要检查下账户状态
        const {
          accounts: [targetAccount]
        } = app.grpc.AccountService.get({
          accountIds: [bindedAccount.accountId]
        })
        if (targetAccount.status === 'ACCOUNT_ACTIVATED') {
          // 一切正常
          // todo 生成token
          reply.send({
            token: 'token'
          })
        } else {
          reply.status(400).send({
            error: 10009,
            message: '账户被禁用'
          })
        }
      } else {
        // 需要先绑定才能登录
        reply.status(400).send({
          error: 10008,
          message: '需要先绑定才能登录'
        })
      }
    } else {
      reply.status(400).send({
        error: 10002,
        message: '获取openid失败'
      })
    }
  }
}

module.exports = Wechat
