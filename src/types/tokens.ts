export interface ColorTokens {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  error: string
  success: string
}

export interface TypographyTokens {
  headingFont: string
  bodyFont: string
  monoFont: string
  baseSize: string
  scaleRatio: number
  weights: {
    light: number
    regular: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeights: {
    tight: string
    normal: string
    relaxed: string
  }
}

export interface SpacingTokens {
  unit: number
  scale: number[]
}

export interface ShadowTokens {
  sm: string
  md: string
  lg: string
}

export interface RadiiTokens {
  sm: string
  md: string
  lg: string
  full: string
}

export interface DBTokenRow {
  id: string
  site_id: string
  colors: ColorTokens
  typography: TypographyTokens
  spacing: SpacingTokens
  shadows: ShadowTokens
  radii: RadiiTokens
  version: number
  created_at: string
}

export interface DBLockRow {
  id: string
  token_id: string
  session_id: string
  token_path: string
  locked_value: string
  locked_at: string
}

export interface DBSiteRow {
  id: string
  url: string
  domain: string
  screenshot_path: string | null
  extraction_status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface VersionHistoryRow {
  id: string
  token_id: string
  token_path: string
  old_value: string
  new_value: string
  change_type: 'user_edit' | 'rescrape' | 'lock' | 'unlock'
  session_id: string
  created_at: string
}
