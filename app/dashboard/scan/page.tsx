import { createClient } from '@/lib/supabase/server'
import { SEVERITY_COLORS, SEVERITY_LABELS, type Persona, type Scan } from '@/lib/types'
import ScanClient from './client'

export default async function ScanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: personas } = await supabase
    .from('personas').select('*').eq('user_id', user!.id)
    .eq('is_active', true).order('name') as { data: Persona[] | null }

  const { data: recentScans } = await supabase
    .from('scans').select('*').eq('user_id', user!.id).eq('scan_type', 'overlap')
    .order('created_at', { ascending: false }).limit(3) as { data: Scan[] | null }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Leak Scan</h1>
      <p className="text-white/30 text-sm mb-8">Analyze all your personas for identity overlap — shared handles, payment bridges, bio patterns, timezone clues.</p>

      {!personas?.length ? (
        <div className="text-center py-16 border border-white/5 rounded-2xl text-white/20">
          <p>Add at least 2 personas to run an overlap scan.</p>
        </div>
      ) : (
        <ScanClient personas={personas} />
      )}

      {recentScans?.length ? (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Recent Scans</h2>
          <div className="space-y-4">
            {recentScans.map(s => (
              <div key={s.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Overlap Scan</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${s.risk_score >= 70 ? 'text-red-400' : s.risk_score >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                      Risk Score: {s.risk_score}/100
                    </span>
                    <span className="text-xs text-white/20">{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {(s.findings as { severity: keyof typeof SEVERITY_COLORS; field: string; evidence: string; fix: string }[])?.map((f, i) => (
                  <div key={i} className="border-t border-white/5 pt-3 mt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${SEVERITY_COLORS[f.severity]}`}>{SEVERITY_LABELS[f.severity]}</span>
                      <span className="text-sm font-medium">{f.field}</span>
                    </div>
                    <p className="text-xs text-white/40 mb-1">{f.evidence}</p>
                    <p className="text-xs text-white/60">→ {f.fix}</p>
                  </div>
                ))}
                {!s.findings?.length && (
                  <p className="text-xs text-green-400">✓ No overlap found</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
