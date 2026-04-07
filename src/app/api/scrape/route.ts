import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractTokensFromUrl } from '@/lib/css-scraper'

export async function POST(req: NextRequest) {
  let body: { url?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { url } = body
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch (err) {
    console.error('Supabase client error:', err)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
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
    // No external scraper — extract tokens directly from the URL
    try {
      const tokens = await extractTokensFromUrl(parsedUrl.href)
      await supabase.from('design_tokens').insert({ site_id: site.id, ...tokens })
      await supabase
        .from('scraped_sites')
        .update({ extraction_status: 'completed' })
        .eq('id', site.id)
    } catch (err) {
      console.error('Extraction error:', err)
      await supabase
        .from('scraped_sites')
        .update({ extraction_status: 'failed', error_message: String(err) })
        .eq('id', site.id)
    }
  }

  return NextResponse.json({ siteId: site.id })
}
