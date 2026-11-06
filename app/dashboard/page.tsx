import { createClient } from '@/lib/supabase/server'
import { type Persona } from '@/lib/types'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: personas } = await supabase
    .from('personas')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false }) as { data: Persona[] | null }

  const { data: profile } = await supabase.from('profiles').select('plan, scan_credits').eq('id', user!.id).single()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Personas</h1>
          <p className="text-white/30 text-sm mt-1">{personas?.length ?? 0} active identities</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 border border-white/10 px-3 py-1.5 rounded-full">
            {profile?.scan_credits ?? 0} scans left
          </span>
          <Link href="/dashboard/personas/new"
            className="bg-white text-black px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-white/90 transition">
            + Add Persona
          </Link>
        </div>
      </div>

      {!personas?.length ? (
        <div className="text-center py-24 border border-white/5 rounded-2xl">
          <p className="text-white/20 text-lg mb-2">No personas yet.</p>
          <p className="text-white/20 text-sm mb-6">Add your first identity to start scanning for leaks.</p>
          <Link href="/dashboard/personas/new" className="text-white underline text-sm">Create first persona →</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {personas.map(p => (
            <Link key={p.id} href={`/dashboard/personas/${p.id}`}
              className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                  🎭
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${p.is_active ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-white/30 border-white/10'}`}>
                  {p.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
              <div className="space-y-1">
                {p.handles?.length > 0 && (
                  <p className="text-white/30 text-xs">{p.handles.slice(0, 2).join(', ')}{p.handles.length > 2 ? ` +${p.handles.length - 2}` : ''}</p>
                )}
                {p.payment_handles?.length > 0 && (
                  <p className="text-white/30 text-xs">💳 {p.payment_handles.slice(0, 1).join(', ')}</p>
                )}
                {p.timezone_claim && (
                  <p className="text-white/30 text-xs">🕐 {p.timezone_claim}</p>
                )}
              </div>
              <div className="mt-4 text-xs text-white/20 group-hover:text-white/40 transition">View & scan →</div>
            </Link>
          ))}
        </div>
      )}

      {personas && personas.length >= 2 && (
        <div className="mt-8 bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Run Overlap Scan</h3>
            <p className="text-white/30 text-sm mt-1">Check all {personas.length} personas for identity bridges and leak risks.</p>
          </div>
          <Link href="/dashboard/scan"
            className="bg-white text-black px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-white/90 transition whitespace-nowrap">
            Scan Now →
          </Link>
        </div>
      )}
    </div>
  )
}
