/**
 * v2 字体加载。走 fontsource npm 包，不走 Google Fonts CDN。
 *
 * - Inter variable: body / UI（variable font，支持 100-900 全段）
 * - JetBrains Mono variable: mono · 代码 · meta
 * - 中文优先使用设备自带的 Noto Sans SC / 苹方 / 微软雅黑，避免下载数 MB 字体。
 */

import '@fontsource-variable/inter'

import '@fontsource-variable/jetbrains-mono'
