'use client'

import { create } from 'zustand'
import { ColorTokens, TypographyTokens, SpacingTokens, ShadowTokens, RadiiTokens, DBTokenRow, DBLockRow } from '@/types/tokens'
import { computeTypeScale, computeSpacingScale } from '@/lib/token-utils'

const DEFAULT_COLORS: ColorTokens = {
  primary: '#7c3aed',
  secondary: '#1e293b',
  accent: '#f59e0b',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  error: '#ef4444',
  success: '#22c55e',
}

const DEFAULT_TYPOGRAPHY: TypographyTokens = {
  headingFont: 'Inter',
  bodyFont: 'Inter',
  monoFont: 'JetBrains Mono',
  baseSize: '16px',
  scaleRatio: 1.25,
  weights: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeights: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
}

const DEFAULT_SPACING: SpacingTokens = {
  unit: 4,
  scale: [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32],
}

const DEFAULT_SHADOWS: ShadowTokens = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
}

const DEFAULT_RADII: RadiiTokens = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  full: '9999px',
}

interface TokenStore {
  siteId: string | null
  tokenId: string | null
  colors: ColorTokens
  typography: TypographyTokens
  spacing: SpacingTokens
  shadows: ShadowTokens
  radii: RadiiTokens
  lockedPaths: Set<string>

  initFromDB: (tokens: DBTokenRow, locks: DBLockRow[]) => void
  updateToken: (path: string, value: string | number) => void
  toggleLock: (path: string) => void
  isLocked: (path: string) => boolean
  getCssVars: () => Record<string, string>
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  siteId: null,
  tokenId: null,
  colors: DEFAULT_COLORS,
  typography: DEFAULT_TYPOGRAPHY,
  spacing: DEFAULT_SPACING,
  shadows: DEFAULT_SHADOWS,
  radii: DEFAULT_RADII,
  lockedPaths: new Set(),

  initFromDB: (tokens, locks) => {
    set({
      siteId: tokens.site_id,
      tokenId: tokens.id,
      colors: { ...DEFAULT_COLORS, ...tokens.colors },
      typography: { ...DEFAULT_TYPOGRAPHY, ...tokens.typography },
      spacing: { ...DEFAULT_SPACING, ...tokens.spacing },
      shadows: { ...DEFAULT_SHADOWS, ...tokens.shadows },
      radii: { ...DEFAULT_RADII, ...tokens.radii },
      lockedPaths: new Set(locks.map((l) => l.token_path)),
    })
  },

  updateToken: (path, value) => {
    const [category, ...rest] = path.split('.')
    const key = rest.join('.')
    set((state) => {
      if (category === 'colors') {
        return { colors: { ...state.colors, [key]: value } }
      }
      if (category === 'typography') {
        if (key.includes('.')) {
          const [subcat, subkey] = key.split('.')
          return {
            typography: {
              ...state.typography,
              [subcat]: {
                ...(state.typography as unknown as Record<string, Record<string, unknown>>)[subcat],
                [subkey]: value,
              },
            },
          }
        }
        return { typography: { ...state.typography, [key]: value } }
      }
      if (category === 'spacing') {
        return { spacing: { ...state.spacing, [key]: value } }
      }
      if (category === 'shadows') {
        return { shadows: { ...state.shadows, [key]: value } }
      }
      if (category === 'radii') {
        return { radii: { ...state.radii, [key]: value } }
      }
      return state
    })
  },

  toggleLock: (path) => {
    set((state) => {
      const next = new Set(state.lockedPaths)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return { lockedPaths: next }
    })
  },

  isLocked: (path) => get().lockedPaths.has(path),

  getCssVars: () => {
    const { colors, typography, spacing, shadows, radii } = get()
    const typeScale = computeTypeScale(typography.baseSize, typography.scaleRatio)
    const spacingScale = computeSpacingScale(spacing.unit, spacing.scale)
    return {
      '--color-primary': colors.primary,
      '--color-secondary': colors.secondary,
      '--color-accent': colors.accent,
      '--color-bg': colors.background,
      '--color-surface': colors.surface,
      '--color-text': colors.text,
      '--color-text-secondary': colors.textSecondary,
      '--color-border': colors.border,
      '--color-error': colors.error,
      '--color-success': colors.success,
      '--font-heading': `"${typography.headingFont}", sans-serif`,
      '--font-body': `"${typography.bodyFont}", sans-serif`,
      '--font-mono': `"${typography.monoFont}", monospace`,
      ...Object.fromEntries(Object.entries(typeScale).map(([k, v]) => [`--${k}`, v])),
      ...Object.fromEntries(Object.entries(spacingScale).map(([k, v]) => [`--${k}`, v])),
      '--radius-sm': radii.sm,
      '--radius-md': radii.md,
      '--radius-lg': radii.lg,
      '--radius-full': radii.full,
      '--shadow-sm': shadows.sm,
      '--shadow-md': shadows.md,
      '--shadow-lg': shadows.lg,
    }
  },
}))
