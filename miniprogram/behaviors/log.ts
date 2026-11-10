/** 自定义 behavior：给组件注入一个带时间戳的 log 方法，演示 behaviors 复用 */
export const logBehavior = Behavior({
  data: {
    logs: [] as string[],
  },
  methods: {
    log(text: string) {
      const t = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      const line = `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())} ${text}`
      this.setData({ logs: [line, ...this.data.logs].slice(0, 6) })
    },
  },
})
