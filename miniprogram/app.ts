/** 全局入口：这里只放真正全局的状态，页面自己的数据放在页面里 */
App({
  globalData: {
    startedAt: Date.now(),
  },
  onLaunch() {
    // 深浅色切换由 darkmode + prefers-color-scheme 自动处理；需要在 JS 里响应时再监听
    wx.onThemeChange?.((res) => console.log('theme changed:', res.theme))
  },
  onError(msg) {
    console.error('app error:', msg)
  },
})
