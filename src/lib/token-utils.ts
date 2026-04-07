import { ColorTokens, TypographyTokens, SpacingTokens } from '@/types/tokens'

export function computeTypeScale(baseSize: string, ratio: number): Record<string, string> {
  const base = parseFloat(baseSize)
  const sizes = {
    'text-xs': base / ratio / ratio,
    'text-sm': base / ratio,
    'text-base': base,
    'text-lg': base * ratio,
    'text-xl': base * ratio * ratio,
    'text-2xl': base * ratio * ratio * ratio,
    'text-3xl': base * ratio * ratio * ratio * ratio,
    'text-4xl': base * ratio * ratio * ratio * ratio * ratio,
  }
  return Object.fromEntries(
    Object.entries(sizes).map(([k, v]) => [k, `${Math.round(v * 10) / 10}px`])
  )
}

export function computeSpacingScale(unit: number, scale: number[]): Record<string, string> {
  return Object.fromEntries(scale.map((s, i) => [`spacing-${i}`, `${s * unit}px`]))
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0
    const sRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    )
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  }
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function getWcagLevel(ratio: number): { level: string; color: string } {
  if (ratio >= 7) return { level: 'AAA', color: '#22c55e' }
  if (ratio >= 4.5) return { level: 'AA', color: '#84cc16' }
  if (ratio >= 3) return { level: 'AA Large', color: '#f59e0b' }
  return { level: 'Fail', color: '#ef4444' }
}
