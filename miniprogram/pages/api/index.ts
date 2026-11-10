import { Article, fetchArticles } from '../../utils/mock'
import { getSwitches, getSystemSummary } from '../../utils/system'

const STORAGE_KEY = 'demo.visits'

function buildInfoRows(renderer: string): { k: string; v: string }[] {
  const s = getSystemSummary(renderer)
  const sw = getSwitches()
  return [
    { k: '基础库', v: s.sdkVersion },
    { k: '主题', v: s.theme },
    { k: '设备', v: `${s.brand} ${s.model}` },
    { k: '系统', v: `${s.platform} ${s.system}` },
    { k: '窗口', v: s.windowSize },
    { k: '像素比', v: String(s.pixelRatio) },
    { k: '状态栏高度', v: `${s.statusBarHeight}px` },
    { k: '渲染引擎', v: s.renderer },
    { k: '定位 / 蓝牙 / Wi-Fi 开关', v: [sw.location, sw.bluetooth, sw.wifi].map((b) => (b ? '开' : '关')).join(' / ') },
  ]
}

Page({
  data: {
    infoRows: [] as { k: string; v: string }[],
    visits: 0,
    feedback: '',
    loading: false,
    error: '',
    articles: [] as Article[],
  },
  onLoad() {
    this.refreshInfo()
    this.setData({ visits: Number(wx.getStorageSync(STORAGE_KEY)) || 0 })
  },
  refreshInfo() {
    this.setData({ infoRows: buildInfoRows(this.renderer) })
  },
  addVisit() {
    const visits = this.data.visits + 1
    wx.setStorageSync(STORAGE_KEY, visits)
    this.setData({ visits })
  },
  clearVisit() {
    wx.removeStorageSync(STORAGE_KEY)
    this.setData({ visits: 0 })
  },
  toast() {
    wx.showToast({ title: '操作成功', icon: 'success', duration: 1200 })
  },
  modal() {
    wx.showModal({
      title: '确认',
      content: '这是一个模态对话框',
      success: (res) => this.setData({ feedback: res.confirm ? '点了确定' : '点了取消' }),
    })
  },
  sheet() {
    const items = ['选项 A', '选项 B', '选项 C']
    wx.showActionSheet({
      itemList: items,
      success: (res) => this.setData({ feedback: items[res.tapIndex] }),
      // 用户取消时走 fail，不当作错误
      fail: () => this.setData({ feedback: '已取消' }),
    })
  },
  load() {
    this.request(false)
  },
  loadFail() {
    this.request(true)
  },
  async request(shouldFail: boolean) {
    this.setData({ loading: true, error: '', articles: [] })
    try {
      const articles = await fetchArticles(shouldFail)
      this.setData({ articles })
    } catch (err) {
      this.setData({ error: (err as Error).message })
    } finally {
      this.setData({ loading: false })
    }
  },
})
