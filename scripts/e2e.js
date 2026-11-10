/**
 * 开发者工具自动化冒烟：逐页打开并截图，收集 console 报错与未捕获异常。
 * 前提：开发者工具已登录（cli islogin 返回 {"login":true}），并已用你自己的 AppID 打开过本项目。
 * 用法：npm run test:e2e   （截图输出到 .tmp/round3/shots/）
 */
const automator = require('miniprogram-automator')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const CLI = process.env.WECHAT_DEVTOOLS_CLI || '/Applications/wechatwebdevtools.app/Contents/MacOS/cli'
const SHOTS = path.join(ROOT, '.tmp', 'round3', 'shots')

const PAGES = [
  '/pages/index/index',
  '/pages/components/index',
  '/pages/api/index',
  '/pages/custom/index',
  '/pages/skyline/index',
  '/pages/privacy/index',
  '/packageSub/pages/hello/index',
  '/packageCloud/pages/cloud/index',
]

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true })
  const errors = []
  const mini = await automator.launch({ cliPath: CLI, projectPath: ROOT })
  mini.on('console', (msg) => {
    if (msg.type === 'error') errors.push(`console.error: ${JSON.stringify(msg.args)}`)
  })
  mini.on('exception', (err) => errors.push(`exception: ${err.message}`))

  for (const url of PAGES) {
    const before = errors.length
    const page = await mini.reLaunch(url)
    await page.waitFor(1500)
    const name = url.replace(/^\//, '').replace(/\//g, '_')
    await mini.screenshot({ path: path.join(SHOTS, `${name}.png`) })
    const added = errors.length - before
    console.log(`${added === 0 ? 'OK  ' : 'FAIL'} ${url}${added ? ` (${added} errors)` : ''}`)
  }

  await mini.close()
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
