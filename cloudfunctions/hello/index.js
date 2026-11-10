// 云函数 hello：返回调用者身份信息，演示 wx-server-sdk 的用法
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  return {
    echo: event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    serverTime: new Date().toISOString(),
  }
}
