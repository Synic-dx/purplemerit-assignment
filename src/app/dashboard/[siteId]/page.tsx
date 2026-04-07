import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DashboardClient } from './dashboard-client'

interface Props {
  params: Promise<{ siteId: string }>
}

export default async function DashboardPage({ params }: Props) {
  const { siteId } = await params
  const supabase = await createClient()

  const { data: site } = await supabase
    .from('scraped_sites')
    .select('*')
    .eq('id', siteId)
    .single()

  if (!site) notFound()

  if (site.extraction_status !== 'completed') {
    return <DashboardClient site={site} tokens={null} locks={[]} />
  }

  const { data: tokens } = await supabase
    .from('design_tokens')
    .select('*')
    .eq('site_id', siteId)
    .single()

  const { data: locks } = await supabase
    .from('locked_tokens')
    .select('*')
    .eq('token_id', tokens?.id ?? '')

  return <DashboardClient site={site} tokens={tokens} locks={locks ?? []} />
}
