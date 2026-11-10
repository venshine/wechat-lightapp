interface CounterInstance {
  reset(): void
  log(text: string): void
  data: { logs: string[] }
}

Page({
  data: {
    value: 1,
    logs: [] as string[],
  },
  counter(): CounterInstance {
    return this.selectComponent('#counter') as unknown as CounterInstance
  },
  onChange(e: WechatMiniprogram.CustomEvent<{ value: number }>) {
    this.setData({ value: e.detail.value })
  },
  reset() {
    this.counter().reset()
  },
  setMax() {
    this.setData({ value: 9 })
  },
  writeLog() {
    const c = this.counter()
    c.log('父页面触发')
    this.setData({ logs: c.data.logs })
  },
})
