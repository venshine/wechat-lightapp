/**
 * 系统信息：用 getWindowInfo / getDeviceInfo / getAppBaseInfo / getSystemSetting 替代已停止维护的 wx.getSystemInfo。
 * 官方：https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfo.html
 */
export interface SystemSummary {
  sdkVersion: string
  theme: string
  brand: string
  model: string
  platform: string
  system: string
  windowSize: string
  pixelRatio: number
  statusBarHeight: number
  safeAreaBottom: number
  renderer: string
}

/** 汇总常用系统信息；各接口自 2.20.1 起提供，更低版本的基础库不在本示例支持范围 */
export function getSystemSummary(renderer: string): SystemSummary {
  const win = wx.getWindowInfo()
  const device = wx.getDeviceInfo()
  const app = wx.getAppBaseInfo()
  return {
    sdkVersion: app.SDKVersion,
    theme: app.theme || 'light',
    brand: device.brand,
    model: device.model,
    platform: device.platform,
    system: device.system,
    windowSize: `${win.windowWidth} x ${win.windowHeight}`,
    pixelRatio: win.pixelRatio,
    statusBarHeight: win.statusBarHeight,
    safeAreaBottom: win.screenHeight - (win.safeArea?.bottom ?? win.screenHeight),
    renderer,
  }
}

/** 设备开关类设置（蓝牙、定位、Wi-Fi），getSystemSetting 不会触发授权弹窗 */
export function getSwitches(): { bluetooth: boolean; location: boolean; wifi: boolean } {
  const s = wx.getSystemSetting()
  return { bluetooth: s.bluetoothEnabled, location: s.locationEnabled, wifi: s.wifiEnabled }
}

/** 基础库版本比较：a >= b 返回 true，用于需要新基础库的能力做降级 */
export function sdkAtLeast(current: string, required: string): boolean {
  const a = current.split('.').map(Number)
  const b = required.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    const x = a[i] || 0
    const y = b[i] || 0
    if (x !== y) return x > y
  }
  return true
}
