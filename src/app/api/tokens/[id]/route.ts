import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { path, value, sessionId, oldValue } = body

  const supabase = await createClient()

  // Fetch current tokens
  const { data: token } = await supabase
    .from('design_tokens')
    .select('*')
    .eq('id', id)
    .single()

  if (!token) return NextResponse.json({ error: 'Token not found' }, { status: 404 })

  // Build the update patch
  const [category] = path.split('.')
  const validCategories = ['colors', 'typography', 'spacing', 'shadows', 'radii']
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  // Record history
  if (oldValue !== undefined) {
    await supabase.from('version_history').insert({
      token_id: id,
      token_path: path,
      old_value: String(oldValue),
      new_value: String(value),
      change_type: 'user_edit',
      session_id: sessionId || 'unknown',
    })
  }

  // Update token version
  await supabase
    .from('design_tokens')
    .update({ version: (token.version || 1) + 1 })
    .eq('id', id)

  return NextResponse.json({ ok: true })
}
