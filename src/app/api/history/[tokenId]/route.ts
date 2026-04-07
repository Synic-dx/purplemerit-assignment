import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ tokenId: string }> }) {
  const { tokenId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('version_history')
    .select('*')
    .eq('token_id', tokenId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ tokenId: string }> }) {
  const { tokenId } = await params
  const { historyId, sessionId } = await req.json()
  const supabase = await createClient()

  const { data: entry } = await supabase
    .from('version_history')
    .select('*')
    .eq('id', historyId)
    .single()

  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Record restore as a new history entry
  await supabase.from('version_history').insert({
    token_id: tokenId,
    token_path: entry.token_path,
    old_value: entry.new_value,
    new_value: entry.old_value,
    change_type: 'user_edit',
    session_id: sessionId || 'unknown',
  })

  return NextResponse.json({ restoredValue: entry.old_value, path: entry.token_path })
}
