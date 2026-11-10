/**
 * 隐私协议授权：封装 wx.getPrivacySetting / wx.onNeedPrivacyAuthorization。
 * 官方：https://developers.weixin.qq.com/miniprogram/dev/framework/user-privacy/PrivacyAuthorize.html
 * 需基础库 2.32.3 及以上；更低版本不拦截隐私接口调用。
 */
type Resolve = (res: { buttonId?: string; event: 'agree' | 'disagree' }) => void

let pendingResolve: Resolve | null = null
let onNeed: ((referrer: string) => void) | null = null
let registered = false

/** 注册一次全局监听：隐私接口被调用且用户尚未同意时，通知当前页面展示自己的弹窗 */
export function listenNeedPrivacy(callback: (referrer: string) => void): void {
  onNeed = callback
  if (registered || typeof wx.onNeedPrivacyAuthorization !== 'function') return
  registered = true
  // 官方回调签名为 (resolve, eventInfo)，miniprogram-api-typings 里只声明了一个参数，这里手动断言
  const handler = (resolve: Resolve, eventInfo: { referrer: string }) => {
    pendingResolve = resolve
    onNeed?.(eventInfo.referrer)
  }
  wx.onNeedPrivacyAuthorization(handler as unknown as Parameters<typeof wx.onNeedPrivacyAuthorization>[0])
}

/** 用户点了同意按钮后回传给平台，buttonId 必须是同意按钮的 id */
export function resolveAgree(buttonId: string): void {
  pendingResolve?.({ buttonId, event: 'agree' })
  pendingResolve = null
}

/** 用户点了拒绝 */
export function resolveDisagree(): void {
  pendingResolve?.({ event: 'disagree' })
  pendingResolve = null
}

/** 查询用户是否还需要同意隐私协议；低版本基础库视为无需授权 */
export function queryNeedAuthorization(): Promise<{ need: boolean; contractName: string }> {
  return new Promise((resolve) => {
    if (typeof wx.getPrivacySetting !== 'function') {
      resolve({ need: false, contractName: '' })
      return
    }
    wx.getPrivacySetting({
      success: (res) => resolve({ need: res.needAuthorization, contractName: res.privacyContractName }),
      fail: () => resolve({ need: false, contractName: '' }),
    })
  })
}

/** 打开《用户隐私保护指引》 */
export function openContract(): void {
  wx.openPrivacyContract({ fail: () => wx.showToast({ title: '打开失败', icon: 'none' }) })
}
