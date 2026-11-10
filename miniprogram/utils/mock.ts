/**
 * 本地 mock 请求：示例不依赖任何服务器，避免合法域名校验。
 * 真实项目使用 wx.request 时，需在小程序后台配置 request 合法域名（开发阶段可在开发者工具勾选「不校验合法域名」）。
 * 官方：https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html
 */
export interface Article {
  id: number
  title: string
  author: string
}

const ARTICLES: Article[] = [
  { id: 1, title: 'Skyline 渲染引擎入门', author: '示例' },
  { id: 2, title: '用 TypeScript 写小程序', author: '示例' },
  { id: 3, title: '隐私授权接入清单', author: '示例' },
]

/** 模拟网络延迟，shouldFail 为 true 时返回失败，用于演示错误处理 */
export function fetchArticles(shouldFail = false, delay = 600): Promise<Article[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('mock: 网络异常 (E_MOCK_FAIL)'))
      } else {
        resolve(ARTICLES.map((a) => ({ ...a })))
      }
    }, delay)
  })
}
