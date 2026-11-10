/**
 * 补充 miniprogram-api-typings 中缺失或不准确的声明。
 * 以下均来自官方文档，参见 README 的官方文档表。
 */

/** worklet 手势状态常量，只能在 worklet 函数内使用（官方 worklet 文档示例直接引用 GestureState.ACTIVE） */
declare const GestureState: {
  readonly ACTIVE: number
  readonly END: number
}

/** wx.worklet 共享变量 */
interface WorkletShared {
  // 赋值时既可以是数字，也可以是 timing / spring 返回的动画对象
  value: any
}

/** wx.worklet 中本示例用到的部分，类型声明比 miniprogram-api-typings 更宽松 */
interface WorkletApi {
  shared(initial: number): WorkletShared
  timing(toValue: number, options?: { duration?: number; easing?: unknown }, callback?: (finished: boolean) => void): unknown
  spring(toValue: number, options?: Record<string, unknown>, callback?: (finished: boolean) => void): unknown
  Easing: { ease: unknown }
}
