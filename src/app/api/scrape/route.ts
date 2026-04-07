import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: site, error } = await supabase
    .from('scraped_sites')
    .insert({
      url: parsedUrl.href,
      domain: parsedUrl.hostname,
      extraction_status: 'pending',
    })
    .select()
    .single()

  if (error || !site) {
    return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })
  }

  // Trigger scraper async (don't await)
  const scraperUrl = process.env.SCRAPER_API_URL
  if (scraperUrl) {
    fetch(`${scraperUrl}/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: parsedUrl.href, siteId: site.id }),
    }).catch(() => {})
  } else {
    // Dev: insert mock tokens immediately
    await supabase.from('design_tokens').insert({
      site_id: site.id,
      colors: {
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
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        monoFont: 'JetBrains Mono',
        baseSize: '16px',
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
    })
    await supabase
      .from('scraped_sites')
      .update({ extraction_status: 'completed' })
      .eq('id', site.id)
  }

  return NextResponse.json({ siteId: site.id })
}
