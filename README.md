# wechat-miniprogram-demo

微信小程序现代化示例：TypeScript、Skyline 渲染引擎 + glass-easel、worklet 动画、自定义组件、分包、云开发、隐私授权，附中文入门指南。

> 本仓库原名 wechat-lightapp（lightapp / 应用号是 2016 年小程序公测前的旧称），旧链接会自动跳转到这里。

所有代码均为原创示例，Apache-2.0 协议；没有复制官方 `miniprogram-demo` 的代码。官方示例见 [wechat-miniprogram/miniprogram-demo](https://github.com/wechat-miniprogram/miniprogram-demo)（MIT）。

## 环境搭建

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)（请使用最新稳定版，Skyline 要求 Stable 1.06.2307260 及以上），用微信扫码登录。
2. 安装 Node.js（仅用于类型检查和自动化脚本，小程序本身不依赖 Node）：

   ```bash
   npm install
   npm run typecheck   # 等价于 tsc --noEmit
   ```

3. 在开发者工具中「导入项目」，目录选本仓库根目录。`project.config.json` 里 `appid` 是占位值 `touristappid`（游客模式），只能预览 WebView 页面，云开发和多数开放接口不可用。
4. 使用自己的 AppID：在 [小程序后台](https://mp.weixin.qq.com/) 「开发 - 开发设置」查看 AppID，或申请[测试号](https://developers.weixin.qq.com/miniprogram/dev/devtools/sandbox.html)。在开发者工具「详情 - 基本信息」里修改后，工具会把它写入 `project.private.config.json`，该文件已被 `.gitignore` 忽略（官方说明：`project.private.config.json` 的同名设置优先于 `project.config.json`，适合放个人配置，见 [项目配置文件](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)）。
5. 要看 Skyline 页面：「详情 - 本地设置」勾选「开启 Skyline 渲染调试」「编译 worklet 代码」，调试基础库选 3.0.0 以上。

## 项目结构

```
miniprogram/            小程序源码（project.config.json 的 miniprogramRoot）
  app.ts / app.json     全局入口与配置（深色模式、Skyline 全局选项、分包、预下载）
  pages/                主包页面：index 首页、components、api、custom、skyline、privacy
  packageSub/           分包示例
  packageCloud/         云开发分包
  components/           自定义组件：demo-card、counter、privacy-dialog
  behaviors/            自定义 behavior
  utils/                系统信息、mock 请求、隐私授权封装
  typings.d.ts          补充官方类型包里缺失的声明
cloudfunctions/hello/   示例云函数（cloudfunctionRoot）
scripts/e2e.js          开发者工具自动化冒烟脚本
```

## 示例与官方文档

| 示例 | 页面 | 官方文档 |
| --- | --- | --- |
| 基础组件 | `pages/components` | [组件](https://developers.weixin.qq.com/miniprogram/dev/component/) |
| 接口：存储、反馈、系统信息、mock 请求 | `pages/api` | [API](https://developers.weixin.qq.com/miniprogram/dev/api/)、[网络](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html) |
| 自定义组件 | `pages/custom` | [自定义组件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/) |
| Skyline、手势、worklet | `pages/skyline` | [Skyline](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html)、[worklet](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/worklet.html)、[手势](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/gesture.html) |
| 分包与预下载 | `packageSub` | [分包](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html) |
| 云开发 | `packageCloud`、`cloudfunctions` | [云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/basis/getting-started.html)、[云函数](https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/guide/functions/getting-started.html) |
| 隐私授权 | `pages/privacy` | [隐私协议开发指南](https://developers.weixin.qq.com/miniprogram/dev/framework/user-privacy/PrivacyAuthorize.html) |
| 深色模式 | 全局 | [DarkMode 适配](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/darkmode.html) |

其他官方入口：[框架总览](https://developers.weixin.qq.com/miniprogram/dev/framework/)、[快速开始](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/)、[基础库更新日志](https://developers.weixin.qq.com/miniprogram/dev/framework/release/)。

## 关键口径（均核对自上表官方文档）

- **基础库版本**：撰写时（2026-11）最新为 3.18.0。本项目的最低要求取决于你启用的能力：Skyline 需基础库 3.0.2 及以上；WebView 下用 glass-easel 需 3.8.12 及以上；隐私授权接口需 2.32.3 及以上；新版系统信息 API 需 2.20.1 及以上。**推荐在小程序后台把最低基础库设为 3.8.12 以上**（这是综合上述要求后的建议，不是官方硬性规定）。
- **TypeScript**：开发者工具内置编译插件，在 `project.config.json` 的 `setting.useCompilerPlugins` 里写 `["typescript"]` 即可，无需手动生成 `.js`。注意工具只用 Babel 去掉类型，**不会报类型错误**，类型检查要靠编辑器或 `tsc --noEmit`。类型包用 [miniprogram-api-typings](https://www.npmjs.com/package/miniprogram-api-typings)。
- **新版系统信息**：`wx.getSystemInfo` 自基础库 2.20.1 起停止维护，改用 `wx.getWindowInfo`、`wx.getDeviceInfo`、`wx.getAppBaseInfo`、`wx.getSystemSetting`、`wx.getAppAuthorizeSetting`，示例见 `utils/system.ts`。
- **深色模式**：`app.json` 配 `darkmode: true` 与 `themeLocation`，导航栏等走 `theme.json` 变量；页面样式用 `@media (prefers-color-scheme: dark)`。

## Skyline 与 WebView 的差异

Skyline 是官方在 WebView 之外提供的渲染引擎，只支持 glass-easel 组件框架。本项目全局默认仍是 WebView，只有 `pages/skyline` 在页面配置里声明了 `"renderer": "skyline"`，其余页面保持稳定写法。

- 启用：`app.json` 配 `lazyCodeLoading: requiredComponents`、`componentFramework: glass-easel`（建议同时配 `glassEaselWebview: true`，不要只配其中一个）和 `rendererOptions.skyline`；页面再配 `renderer: skyline`。
- 差异：没有 `navigation-bar` 组件，需要 `navigationStyle: custom` 自绘导航；`overflow: scroll` 不支持，滚动必须用 `scroll-view`（需显式 `type="list"` 等）；内联文本只能用 `text` / `span`；选择器、`position: sticky`、`media query`（仅支持深色模式）等有限制；`movable-view`、`editor`、`web-view` 等暂不支持，`web-view` 页面应单独配 `"renderer": "webview"`。完整列表见 [组件支持](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/component.html) 与 [WXSS 支持](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/wxss.html)。
- **真机默认仍是 WebView**：Skyline 默认接入 We 分析的 AB 实验，未配置时页面仍走 WebView。调试用小程序菜单「开发调试 - Switch Render」强制切到 Skyline，详见[迁移指南](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/migration/)。可以在代码里读 `this.renderer` 判断实际引擎。
- 低版本或 PC 端会回退到 WebView，所以 worklet 相关接口（`wx.worklet`）要在 `renderer === 'skyline'` 时才使用，示例页已做判断。

## 隐私合规要点

依据 [隐私协议开发指南](https://developers.weixin.qq.com/miniprogram/dev/framework/user-privacy/PrivacyAuthorize.html)：

1. 在小程序后台配置《用户隐私保护指引》；**只有声明过的信息，才能调用对应接口或组件**，否则接口被禁用（错误码 `errno: 112`，补充声明 5 分钟后生效）。
2. 用户需先同意隐私政策再调用已声明的隐私接口：用 `wx.getPrivacySetting` 主动查询 `needAuthorization`，或用 `wx.onNeedPrivacyAuthorization` 被动监听；同意按钮必须是 `<button open-type="agreePrivacyAuthorization">`，同意后用 `resolve({ buttonId, event: 'agree' })` 回传。
3. 开发者不响应时，微信会弹官方隐私弹窗；用户拒绝会返回错误（官方文档列出错误码 103 / 104），10 秒内不会重复弹出。
4. 官方文档记载：自 2023-10-17 起隐私功能默认启用，不再需要 `__usePrivacyCheck__`；低于 2.32.3 的基础库不拦截。
5. 调试：开发者工具「清除模拟器缓存 - 清除授权数据」可重置同意状态。

示例见 `components/privacy-dialog`、`utils/privacy.ts` 与 `pages/privacy`。

## 云开发开通步骤

1. 用自己的 AppID（游客模式不能用云开发），在开发者工具工具栏点「云开发」，按指引开通并创建环境。
2. 开发者工具「云开发」控制台创建数据库集合 `demo_notes`。
3. 在 `cloudfunctions/hello` 上右键「上传并部署：云端安装依赖」。
4. 运行示例，进入「云开发」页，粘贴环境 ID 并初始化（环境 ID 只保存在本机缓存，不入库）。
5. 没有配置环境时，该页只显示提示，不会报错。

云函数依赖版本见 `cloudfunctions/hello/package.json`；云开发的计费以官方说明为准。

## 常见问题

- **导入后提示「不存在此 AppID」**：仓库里的 `appid` 只是占位值，开发者工具不接受。请在不入库的 `project.private.config.json` 里填自己的 AppID 或[测试号](https://mp.weixin.qq.com/wxamp/sandbox)，并确认开发者工具已登录。
- **ts 报类型错误但工具能编译**：见上文，工具编译不做类型检查，请以 `npm run typecheck` 为准。
- **Skyline 页面白屏或回退为 WebView**：检查「开启 Skyline 渲染调试」是否勾选、调试基础库是否 3.0.0 以上、`app.json` 的 `rendererOptions` 是否完整；热重载在 Skyline 下暂不支持。
- **`wx.request` 报域名不合法**：到小程序后台配置合法域名，开发阶段可在项目设置勾选「不校验合法域名」；本示例用本地 mock，不依赖域名。
- **真机看不到 Skyline**：见上文 AB 实验与 Switch Render。

## 自动化冒烟

开发者工具需已登录，并在「设置 - 安全设置」开启服务端口：

```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli islogin   # 期望 {"login":true}
npm run test:e2e                                                  # 逐页打开并截图到 .tmp/round3/shots/
```

## Credits

- 类型定义：[miniprogram-api-typings](https://github.com/wechat-miniprogram/api-typings)（MIT），仅作为开发依赖。
- 自动化：[miniprogram-automator](https://www.npmjs.com/package/miniprogram-automator)，仅作为开发依赖。
- 示例中没有第三方字体、图片与图标素材。

## License

[Apache-2.0](LICENSE)
