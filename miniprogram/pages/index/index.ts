import { getSystemSummary } from '../../utils/system'

interface Entry {
  title: string
  desc: string
  path: string
}

const ENTRIES: Entry[] = [
  { title: '组件', desc: '常用基础组件：表单、选择器、swiper、scroll-view', path: '/pages/components/index' },
  { title: '接口', desc: '存储、反馈、新版系统信息 API、本地 mock 请求', path: '/pages/api/index' },
  { title: '自定义组件', desc: 'properties、observers、behaviors、slot、事件', path: '/pages/custom/index' },
  { title: 'Skyline 与 worklet', desc: 'Skyline 渲染、手势组件、worklet 动画（需 Skyline 环境）', path: '/pages/skyline/index' },
  { title: '分包', desc: '分包加载与 preloadRule 预下载', path: '/packageSub/pages/hello/index' },
  { title: '云开发', desc: '独立分包内的云函数与云数据库，未配置环境时给出提示', path: '/packageCloud/pages/cloud/index' },
  { title: '隐私与授权', desc: '隐私协议授权、相册 / 定位 / 剪贴板等隐私接口', path: '/pages/privacy/index' },
]

Page({
  data: {
    entries: ENTRIES,
    sdkVersion: '',
    theme: '',
    renderer: '',
  },
  onLoad() {
    const info = getSystemSummary(this.renderer)
    this.setData({ sdkVersion: info.sdkVersion, theme: info.theme, renderer: info.renderer })
  },
  open(e: WechatMiniprogram.TouchEvent) {
    const path = e.currentTarget.dataset.path as string
    wx.navigateTo({
      url: path,
      fail: (err) => wx.showToast({ title: `打开失败 ${err.errMsg}`, icon: 'none' }),
    })
  },
})
