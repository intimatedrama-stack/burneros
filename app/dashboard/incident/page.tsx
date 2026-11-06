import { createClient } from '@/lib/supabase/server'
import { type Incident } from '@/lib/types'
import IncidentClient from './client'
import Link from 'next/link'

export default async function IncidentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: incidents } = await supabase
    .from('incidents').select('*').eq('user_id', user!.id)
    .order('created_at', { ascending: false }) as { data: Incident[] | null }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Incident Mode</h1>
          <p className="text-white/30 text-sm mt-1">Something slipped. Work through the response checklist.</p>
        </div>
        <IncidentNewButton />
      </div>

      {!incidents?.length ? (
        <div className="text-center py-16 border border-white/5 rounded-2xl text-white/20 space-y-2">
          <p className="text-lg">No incidents.</p>
          <p className="text-sm">If something gets exposed, create an incident to track your response.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map(inc => <IncidentCard key={inc.id} incident={inc} />)}
        </div>
      )}
    </div>
  )
}

function IncidentCard({ incident }: { incident: Incident }) {
  const checklist = (incident.checklist ?? []) as { action: string; done: boolean }[]
  const done = checklist.filter(c => c.done).length
  const total = checklist.length

  return (
    <div className={`bg-white/[0.03] border rounded-2xl p-5 ${incident.status === 'active' ? 'border-red-500/20' : 'border-white/5'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold">{incident.title}</h3>
          <p className="text-white/30 text-xs mt-0.5">{new Date(incident.created_at).toLocaleDateString()}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${incident.status === 'active' ? 'text-red-400 border-red-400/20' : 'text-white/30 border-white/10'}`}>
          {incident.status}
        </span>
      </div>
      {total > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/30 mb-1">
            <span>Response progress</span><span>{done}/{total}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/60 rounded-full transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
          </div>
        </div>
      )}
      <IncidentClient incident={incident} />
    </div>
  )
}

function IncidentNewButton() {
  return <IncidentNewClient />
}

// Import at bottom to keep server component clean
import IncidentNewClient from './newclient'
