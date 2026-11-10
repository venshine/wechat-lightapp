/**
 * Skyline 示例页（页面级配置 renderer: skyline，其余页面仍用 WebView）。
 * worklet 函数以 'worklet' 指令声明，运行在 UI 线程；共享变量用 wx.worklet.shared 创建。
 * 官方：https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/worklet.html
 * 开发者工具需勾选「开启 Skyline 渲染调试」「编译 worklet 代码」，基础库 3.0.0 及以上。
 */
// wx.worklet 只在 Skyline 下存在，回退到 WebView 时不能在模块顶层解构
const getWorklet = () => wx.worklet as unknown as WorkletApi

/** onLoad 里挂到页面实例上的共享变量（官方示例同样用 this._xxx 保存） */
interface Shareds {
  ballX: WorkletShared
  ballY: WorkletShared
  boxX: WorkletShared
}

Page({
  data: {
    statusBarHeight: 20,
    renderer: 'webview',
    items: Array.from({ length: 12 }, (_, i) => i + 1),
  },
  onLoad() {
    this.setData({
      statusBarHeight: wx.getWindowInfo().statusBarHeight,
      renderer: this.renderer,
    })
    if (this.renderer !== 'skyline') return

    const { shared } = getWorklet()
    // 小球位置：x / y 两个共享变量，updater 在共享变量变化时于 UI 线程重新执行
    const x = shared(0)
    const y = shared(0)
    this.applyAnimatedStyle('#ball', () => {
      'worklet'
      return { transform: `translate(${x.value}px, ${y.value}px)` }
    })
    Object.assign(this, { ballX: x, ballY: y })

    // 方块平移
    const boxX = shared(0)
    this.applyAnimatedStyle('#box', () => {
      'worklet'
      return { transform: `translateX(${boxX.value}px)` }
    })
    Object.assign(this, { boxX })
  },
  onPan(evt: { state: number; deltaX: number; deltaY: number }) {
    'worklet'
    if (evt.state === GestureState.ACTIVE) {
      const self = this as unknown as Shareds
      self.ballX.value += evt.deltaX
      self.ballY.value += evt.deltaY
    }
  },
  runTiming() {
    const { boxX } = this as unknown as Partial<Shareds>
    if (!boxX) return
    const { timing, Easing } = getWorklet()
    boxX.value = timing(boxX.value > 0 ? 0 : 200, { duration: 300, easing: Easing.ease })
  },
  runSpring() {
    const { boxX } = this as unknown as Partial<Shareds>
    if (!boxX) return
    boxX.value = getWorklet().spring(0)
  },
  back() {
    wx.navigateBack({ fail: () => wx.reLaunch({ url: '/pages/index/index' }) })
  },
})
