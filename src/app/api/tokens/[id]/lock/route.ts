import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { path, value, sessionId, locked } = await req.json()
  const supabase = await createClient()

  if (locked) {
    await supabase.from('locked_tokens').upsert(
      { token_id: id, session_id: sessionId, token_path: path, locked_value: String(value) },
      { onConflict: 'token_id,token_path' }
    )
    await supabase.from('version_history').insert({
      token_id: id,
      token_path: path,
      old_value: String(value),
      new_value: String(value),
      change_type: 'lock',
      session_id: sessionId || 'unknown',
    })
  } else {
    await supabase
      .from('locked_tokens')
      .delete()
      .eq('token_id', id)
      .eq('token_path', path)
    await supabase.from('version_history').insert({
      token_id: id,
      token_path: path,
      old_value: String(value),
      new_value: String(value),
      change_type: 'unlock',
      session_id: sessionId || 'unknown',
    })
  }

  return NextResponse.json({ ok: true })
}
