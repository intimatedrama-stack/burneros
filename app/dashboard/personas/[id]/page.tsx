import { createClient } from '@/lib/supabase/server'
import { SEVERITY_COLORS, SEVERITY_LABELS, type Persona, type Scan } from '@/lib/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PersonaEditClient from './client'

export default async function PersonaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: persona } = await supabase
    .from('personas').select('*').eq('id', id).eq('user_id', user!.id).single() as { data: Persona | null }
  if (!persona) notFound()

  const { data: recentScans } = await supabase
    .from('scans').select('*').eq('user_id', user!.id)
    .contains('persona_ids', [id])
    .order('created_at', { ascending: false }).limit(5) as { data: Scan[] | null }

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href="/dashboard" className="text-white/30 text-sm hover:text-white transition">← Personas</Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{persona.name}</h1>
          <p className="text-white/30 text-sm mt-1">{persona.handles?.slice(0, 3).join(' · ')}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full border ${persona.is_active ? 'text-green-400 border-green-400/20' : 'text-white/30 border-white/10'}`}>
          {persona.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Identity details */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-6 space-y-4">
        {[
          { label: 'Handles', val: persona.handles?.join(', ') },
          { label: 'Bios', val: persona.bios?.join(' | ') },
          { label: 'Timezone claim', val: persona.timezone_claim },
          { label: 'Payment handles', val: persona.payment_handles?.join(', ') },
          { label: 'Email aliases', val: persona.email_aliases?.join(', ') },
          { label: 'Link hubs', val: persona.link_hubs?.join(', ') },
          { label: 'Posting patterns', val: persona.posting_patterns },
          { label: 'Notes', val: persona.notes },
        ].filter(x => x.val).map(x => (
          <div key={x.label}>
            <div className="text-xs text-white/30 mb-0.5">{x.label}</div>
            <div className="text-sm text-white/70">{x.val}</div>
          </div>
        ))}
      </div>

      <PersonaEditClient persona={persona} />

      {/* Recent scans */}
      {recentScans?.length ? (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Recent Scans</h2>
          <div className="space-y-3">
            {recentScans.map(s => (
              <div key={s.id} className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">{s.scan_type} scan</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${s.risk_score >= 70 ? 'text-red-400 border-red-400/20' : s.risk_score >= 40 ? 'text-yellow-400 border-yellow-400/20' : 'text-green-400 border-green-400/20'}`}>
                    Risk: {s.risk_score}/100
                  </span>
                </div>
                {(s.findings as { severity: keyof typeof SEVERITY_COLORS; field: string }[])?.slice(0, 2).map((f, i) => (
                  <div key={i} className="flex gap-2 items-center mt-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${SEVERITY_COLORS[f.severity]}`}>{SEVERITY_LABELS[f.severity]}</span>
                    <span className="text-xs text-white/40">{f.field}</span>
                  </div>
                ))}
                <div className="text-xs text-white/20 mt-2">{new Date(s.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
