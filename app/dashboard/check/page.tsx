import { createClient } from '@/lib/supabase/server'
import { type Persona } from '@/lib/types'
import PrePostClient from './client'

export default async function PrePostCheckPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: personas } = await supabase
    .from('personas').select('id, name').eq('user_id', user!.id).eq('is_active', true) as { data: Pick<Persona, 'id' | 'name'>[] | null }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Pre-Post Check</h1>
      <p className="text-white/30 text-sm mb-8">Paste a caption or upload a photo before posting. Get a risk report with severity, evidence, and exact fixes.</p>
      <PrePostClient personas={personas ?? []} />
    </div>
  )
}
