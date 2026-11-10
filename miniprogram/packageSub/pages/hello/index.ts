Page({
  data: { route: '', cost: 0 },
  onLoad() {
    const t0 = Date.now()
    this.setData({ route: this.route, cost: Date.now() - t0 })
  },
})
