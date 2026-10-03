/**
 * 当前部署根地址（无末尾斜杠）。优先读取显式环境变量，否则根据浏览器
 * 位置计算；因此既支持自定义域名，也支持 /repository/ 子路径的 GitHub Pages。
 */
export function getSiteOrigin(): string {
  const configured = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim()
  if (configured) return configured.replace(/\/+$/, '')
  if (typeof window === 'undefined') return ''
  const withoutFragment = new URL(window.location.href)
  withoutFragment.hash = ''
  withoutFragment.search = ''
  const base = new URL('./', withoutFragment)
  return base.href.replace(/\/+$/, '')
}

export function getResultUrl(hash?: string): string {
  const base = getSiteOrigin()
  return hash ? `${base}/#/result/${hash}` : `${base}/#/`
}

/** 可选：完整 OG 图绝对 URL（未设置 `VITE_OG_IMAGE` 时不输出 og:image） */
export function getOgImageUrl(): string {
  return (import.meta.env.VITE_OG_IMAGE as string | undefined) ?? ''
}
