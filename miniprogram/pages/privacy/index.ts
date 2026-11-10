import { openContract } from '../../utils/privacy'

interface DialogInstance {
  check(): Promise<boolean>
}

/** 把隐私接口失败信息展示成「错误码 + 说明」，errno 112 / 103 / 104 含义见 README */
function describeFail(err: unknown): string {
  const e = err as { errMsg?: string; errno?: number }
  return `失败 errno=${e.errno ?? '-'} ${e.errMsg ?? String(err)}`
}

Page({
  data: {
    needAuth: null as boolean | null,
    imagePath: '',
    result: '',
  },
  dialog(): DialogInstance {
    return this.selectComponent('#dialog') as unknown as DialogInstance
  },
  async check() {
    const ok = await this.dialog().check()
    this.setData({ needAuth: !ok })
  },
  openContract() {
    openContract()
  },
  onAgree() {
    this.setData({ needAuth: false, result: '用户已同意隐私协议' })
  },
  onDisagree() {
    this.setData({ result: '用户拒绝了隐私协议，相关功能不可用' })
  },
  pickImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => this.setData({ imagePath: res.tempFiles[0].tempFilePath, result: '' }),
      fail: (err) => this.setData({ result: describeFail(err) }),
    })
  },
  pickLocation() {
    wx.chooseLocation({
      success: (res) => this.setData({ result: `${res.name} (${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)})` }),
      fail: (err) => this.setData({ result: describeFail(err) }),
    })
  },
  readClipboard() {
    wx.getClipboardData({
      success: (res) => this.setData({ result: `剪贴板：${res.data}` }),
      fail: (err) => this.setData({ result: describeFail(err) }),
    })
  },
})
