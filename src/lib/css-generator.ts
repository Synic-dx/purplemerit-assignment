import { ColorTokens, TypographyTokens, SpacingTokens, ShadowTokens, RadiiTokens } from '@/types/tokens'
import { computeTypeScale, computeSpacingScale } from './token-utils'

export function generateCssVariables(
  colors: ColorTokens,
  typography: TypographyTokens,
  spacing: SpacingTokens,
  shadows: ShadowTokens,
  radii: RadiiTokens
): string {
  const typeScale = computeTypeScale(typography.baseSize, typography.scaleRatio)
  const spacingScale = computeSpacingScale(spacing.unit, spacing.scale)

  const lines = [
    ':root {',
    `  --color-primary: ${colors.primary};`,
    `  --color-secondary: ${colors.secondary};`,
    `  --color-accent: ${colors.accent};`,
    `  --color-bg: ${colors.background};`,
    `  --color-surface: ${colors.surface};`,
    `  --color-text: ${colors.text};`,
    `  --color-text-secondary: ${colors.textSecondary};`,
    `  --color-border: ${colors.border};`,
    `  --color-error: ${colors.error};`,
    `  --color-success: ${colors.success};`,
    `  --font-heading: "${typography.headingFont}", sans-serif;`,
    `  --font-body: "${typography.bodyFont}", sans-serif;`,
    `  --font-mono: "${typography.monoFont}", monospace;`,
    ...Object.entries(typeScale).map(([k, v]) => `  --${k}: ${v};`),
    ...Object.entries(spacingScale).map(([k, v]) => `  --${k}: ${v};`),
    `  --radius-sm: ${radii.sm};`,
    `  --radius-md: ${radii.md};`,
    `  --radius-lg: ${radii.lg};`,
    `  --radius-full: ${radii.full};`,
    `  --shadow-sm: ${shadows.sm};`,
    `  --shadow-md: ${shadows.md};`,
    `  --shadow-lg: ${shadows.lg};`,
    '}',
  ]
  return lines.join('\n')
}
