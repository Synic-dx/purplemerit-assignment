import { ColorTokens, TypographyTokens, SpacingTokens } from '@/types/tokens'
import { computeTypeScale } from './token-utils'

export function generateTailwindConfig(
  colors: ColorTokens,
  typography: TypographyTokens,
  spacing: SpacingTokens
): string {
  const typeScale = computeTypeScale(typography.baseSize, typography.scaleRatio)

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${colors.primary}',
        secondary: '${colors.secondary}',
        accent: '${colors.accent}',
        background: '${colors.background}',
        surface: '${colors.surface}',
        text: {
          DEFAULT: '${colors.text}',
          secondary: '${colors.textSecondary}',
        },
        border: '${colors.border}',
        error: '${colors.error}',
        success: '${colors.success}',
      },
      fontFamily: {
        heading: ['${typography.headingFont}', 'sans-serif'],
        body: ['${typography.bodyFont}', 'sans-serif'],
        mono: ['${typography.monoFont}', 'monospace'],
      },
      fontSize: ${JSON.stringify(typeScale, null, 8)},
      spacing: {
        unit: '${spacing.unit}px',
        ${spacing.scale.map((s, i) => `'${i}': '${s * spacing.unit}px'`).join(',\n        ')},
      },
    },
  },
}`
}
