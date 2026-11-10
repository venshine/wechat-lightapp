import { logBehavior } from '../../behaviors/log'

/** 计数器组件：演示 properties / observers / triggerEvent / behaviors / 对外方法 */
Component({
  behaviors: [logBehavior],
  properties: {
    value: { type: Number, value: 0 },
    min: { type: Number, value: 0 },
    max: { type: Number, value: 10 },
  },
  data: {
    count: 0,
  },
  observers: {
    // value 由父组件改变时同步到内部状态，并限制在范围内
    value(v: number) {
      this.setData({ count: Math.min(Math.max(v, this.data.min), this.data.max) })
    },
  },
  methods: {
    inc() {
      this.change(this.data.count + 1)
    },
    dec() {
      this.change(this.data.count - 1)
    },
    change(next: number) {
      const count = Math.min(Math.max(next, this.data.min), this.data.max)
      if (count === this.data.count) return
      this.setData({ count })
      this.triggerEvent('change', { value: count })
    },
    /** 供父组件通过 selectComponent 调用 */
    reset() {
      this.change(this.data.min)
    },
  },
})
