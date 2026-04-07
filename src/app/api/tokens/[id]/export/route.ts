import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateCssVariables } from '@/lib/css-generator'
import { generateTailwindConfig } from '@/lib/tailwind-generator'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const format = req.nextUrl.searchParams.get('format') || 'css'
  const supabase = await createClient()

  const { data: token } = await supabase
    .from('design_tokens')
    .select('*')
    .eq('id', id)
    .single()

  if (!token) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (format === 'css') {
    const css = generateCssVariables(
      token.colors,
      token.typography,
      token.spacing,
      token.shadows,
      token.radii
    )
    return new NextResponse(css, { headers: { 'Content-Type': 'text/css' } })
  }

  if (format === 'tailwind') {
    const config = generateTailwindConfig(token.colors, token.typography, token.spacing)
    return new NextResponse(config, { headers: { 'Content-Type': 'text/javascript' } })
  }

  // JSON
  return NextResponse.json({
    colors: token.colors,
    typography: token.typography,
    spacing: token.spacing,
    shadows: token.shadows,
    radii: token.radii,
  })
}
