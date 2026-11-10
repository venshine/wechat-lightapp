const ENV_KEY = 'demo.cloudEnv'
const COLLECTION = 'demo_notes'

interface Note {
  _id: string
  text: string
}

function errText(err: unknown): string {
  const e = err as { errCode?: number | string; errMsg?: string }
  return `失败 errCode=${e.errCode ?? '-'} ${e.errMsg ?? String(err)}`
}

Page({
  data: {
    envId: '',
    ready: false,
    status: '未初始化。请先在开发者工具「云开发」控制台创建环境，并使用你自己的 AppID（游客模式不能用云开发）。',
    helloResult: '',
    notes: [] as Note[],
  },
  onLoad() {
    this.setData({ envId: (wx.getStorageSync(ENV_KEY) as string) || '' })
  },
  onEnv(e: WechatMiniprogram.Input) {
    this.setData({ envId: e.detail.value.trim() })
  },
  init() {
    const { envId } = this.data
    if (!envId) {
      this.setData({ status: '未配置云环境：请先填写环境 ID。' })
      return
    }
    if (!wx.cloud) {
      this.setData({ status: '当前基础库不支持云开发（需要 2.2.3 及以上）。' })
      return
    }
    try {
      wx.cloud.init({ env: envId, traceUser: true })
      wx.setStorageSync(ENV_KEY, envId)
      this.setData({ ready: true, status: `已初始化环境 ${envId}` })
    } catch (err) {
      this.setData({ ready: false, status: errText(err) })
    }
  },
  /** 未初始化时给出提示而不是抛错 */
  guard(): boolean {
    if (this.data.ready) return true
    this.setData({ status: '未配置云环境：请先填写环境 ID 并点「初始化云环境」。' })
    return false
  },
  async callHello() {
    if (!this.guard()) return
    try {
      const res = await wx.cloud.callFunction({ name: 'hello', data: { from: 'wechat-lightapp' } })
      this.setData({ helloResult: JSON.stringify(res.result, null, 2) })
    } catch (err) {
      this.setData({ helloResult: errText(err) })
    }
  },
  async addNote() {
    if (!this.guard()) return
    try {
      await wx.cloud.database().collection(COLLECTION).add({ data: { text: `笔记 ${new Date().toLocaleTimeString()}` } })
      await this.listNotes()
    } catch (err) {
      this.setData({ status: errText(err) })
    }
  },
  async listNotes() {
    if (!this.guard()) return
    try {
      const res = await wx.cloud.database().collection(COLLECTION).limit(5).get()
      this.setData({ notes: res.data as unknown as Note[] })
    } catch (err) {
      this.setData({ status: errText(err) })
    }
  },
})
