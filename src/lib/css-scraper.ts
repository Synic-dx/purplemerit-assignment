/**
 * Fetches a URL and extracts design tokens from its CSS.
 */

function resolveUrl(base: string, href: string): string {
  try {
    return new URL(href, base).href
  } catch {
    return ''
  }
}

function parseColors(css: string): Record<string, string> {
  const hexPattern = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g
  const rgbPattern = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g
  const hslPattern = /hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/g

  const colorFreq: Record<string, number> = {}

  let m: RegExpExecArray | null
  while ((m = hexPattern.exec(css)) !== null) {
    const hex = m[0].toLowerCase()
    const full = hex.length === 4
      ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
      : hex
    colorFreq[full] = (colorFreq[full] ?? 0) + 1
  }

  while ((m = rgbPattern.exec(css)) !== null) {
    const [r, g, b] = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])]
    const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
    colorFreq[hex] = (colorFreq[hex] ?? 0) + 1
  }

  while ((m = hslPattern.exec(css)) !== null) {
    const [h, s, l] = [parseInt(m[1]), parseInt(m[2]) / 100, parseInt(m[3]) / 100]
    const hex = hslToHex(h, s, l)
    colorFreq[hex] = (colorFreq[hex] ?? 0) + 1
  }

  // Filter out pure black/white noise and sort by frequency
  const allSorted = Object.entries(colorFreq)
    .filter(([c]) => c !== '#000000' && c !== '#ffffff' && c !== '#fff' && c !== '#000')
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => c)

  // Also collect light/dark candidates separately
  const darks = allSorted.filter((c) => isDark(c))
  const lights = allSorted.filter((c) => !isDark(c))

  return {
    primary: allSorted[0] ?? '#7c3aed',
    secondary: allSorted[1] ?? '#1e293b',
    accent: allSorted[2] ?? '#f59e0b',
    background: lights[0] ?? '#ffffff',
    surface: lights[1] ?? '#f8fafc',
    text: darks[0] ?? '#0f172a',
    textSecondary: darks[1] ?? '#64748b',
    border: lights[2] ?? '#e2e8f0',
    error: findClosestTo('#ef4444', allSorted) ?? '#ef4444',
    success: findClosestTo('#22c55e', allSorted) ?? '#22c55e',
  }
}

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

function hexDistance(a: string, b: string): number {
  const ra = parseInt(a.slice(1, 3), 16), ga = parseInt(a.slice(3, 5), 16), ba = parseInt(a.slice(5, 7), 16)
  const rb = parseInt(b.slice(1, 3), 16), gb = parseInt(b.slice(3, 5), 16), bb = parseInt(b.slice(5, 7), 16)
  return Math.abs(ra - rb) + Math.abs(ga - gb) + Math.abs(ba - bb)
}

function findClosestTo(target: string, colors: string[]): string | null {
  if (!colors.length) return null
  return colors.reduce((best, c) => hexDistance(c, target) < hexDistance(best, target) ? c : best)
}

function parseFonts(css: string): { heading: string; body: string } {
  const fontFamilyPattern = /font-family\s*:\s*([^;}{]+)/gi
  const fonts: string[] = []
  let m: RegExpExecArray | null
  while ((m = fontFamilyPattern.exec(css)) !== null) {
    const raw = m[1].replace(/["']/g, '').split(',')[0].trim()
    if (raw && !raw.startsWith('-') && raw !== 'inherit' && raw !== 'initial' && raw !== 'unset') {
      fonts.push(raw)
    }
  }
  const freq: Record<string, number> = {}
  for (const f of fonts) freq[f] = (freq[f] ?? 0) + 1
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([f]) => f)
  return {
    heading: sorted[0] ?? 'Inter',
    body: sorted[1] ?? sorted[0] ?? 'Inter',
  }
}

function parseBaseSize(css: string): string {
  const bodySizeMatch = css.match(/body\s*{[^}]*font-size\s*:\s*([^;]+)/i)
  if (bodySizeMatch) return bodySizeMatch[1].trim()
  const rootSizeMatch = css.match(/:root\s*{[^}]*font-size\s*:\s*([^;]+)/i)
  if (rootSizeMatch) return rootSizeMatch[1].trim()
  return '16px'
}

export async function extractTokensFromUrl(url: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  let html = ''
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StyleSync/1.0)' },
    })
    html = await res.text()
  } finally {
    clearTimeout(timeout)
  }

  // Collect stylesheet URLs from <link> tags
  const linkHrefs: string[] = []
  const linkPattern = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi
  const linkPattern2 = /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']stylesheet["']/gi
  let lm: RegExpExecArray | null
  while ((lm = linkPattern.exec(html)) !== null) linkHrefs.push(resolveUrl(url, lm[1]))
  while ((lm = linkPattern2.exec(html)) !== null) linkHrefs.push(resolveUrl(url, lm[1]))

  // Collect inline <style> blocks
  const styleBlocks: string[] = []
  const stylePattern = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let sm: RegExpExecArray | null
  while ((sm = stylePattern.exec(html)) !== null) styleBlocks.push(sm[1])

  // Fetch up to 5 stylesheets (avoid too many requests)
  const fetchedSheets = await Promise.allSettled(
    linkHrefs.slice(0, 5).map((href) =>
      fetch(href, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StyleSync/1.0)' },
      })
        .then((r) => r.text())
        .catch(() => '')
    )
  )

  const allCss = [
    ...styleBlocks,
    ...fetchedSheets.map((r) => (r.status === 'fulfilled' ? r.value : '')),
  ].join('\n')

  const colors = parseColors(allCss || html)
  const fonts = parseFonts(allCss)
  const baseSize = parseBaseSize(allCss)

  return {
    colors,
    typography: {
      headingFont: fonts.heading,
      bodyFont: fonts.body,
      monoFont: 'JetBrains Mono',
      baseSize,
      scaleRatio: 1.25,
      weights: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 },
      lineHeights: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
    },
    spacing: { unit: 4, scale: [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32] },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
    radii: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem', full: '9999px' },
  }
}
