'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Incident } from '@/lib/types'

const DEFAULT_CHECKLIST = [
  'Change the username or handle that was exposed',
  'Delete or archive the post that caused the leak',
  'Update any shared bios or descriptions',
  'Rotate payment handles associated with this persona',
  'Remove or update links that bridge personas',
  'Check if any images with metadata were posted',
  'Notify anyone who needs to know',
  'Document what happened for future reference',
]

export default function IncidentClient({ incident }: { incident: Incident }) {
  const router = useRouter()
  const [checklist, setChecklist] = useState<{ action: string; done: boolean }[]>(
    incident.checklist?.length ? (incident.checklist as { action: string; done: boolean }[]) : DEFAULT_CHECKLIST.map(a => ({ action: a, done: false }))
  )
  const [saving, setSaving] = useState(false)
  const [resolving, setResolving] = useState(false)

  async function toggle(i: number) {
    const next = checklist.map((c, idx) => idx === i ? { ...c, done: !c.done } : c)
    setChecklist(next)
    const supabase = createClient()
    await supabase.from('incidents').update({ checklist: next }).eq('id', incident.id)
    router.refresh()
  }

  async function resolve() {
    setResolving(true)
    const supabase = createClient()
    await supabase.from('incidents').update({ status: 'resolved' }).eq('id', incident.id)
    setResolving(false)
    router.refresh()
  }

  return (
    <div className="space-y-2">
      {checklist.map((item, i) => (
        <label key={i} className="flex items-start gap-3 cursor-pointer group">
          <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition ${item.done ? 'bg-white border-white' : 'border-white/20 group-hover:border-white/40'}`}
            onClick={() => toggle(i)}>
            {item.done && <span className="text-black text-xs">✓</span>}
          </div>
          <span className={`text-sm ${item.done ? 'line-through text-white/20' : 'text-white/70'}`}>{item.action}</span>
        </label>
      ))}
      {incident.status === 'active' && (
        <button onClick={resolve} disabled={resolving}
          className="mt-3 w-full border border-white/10 text-white/40 py-2 rounded-xl text-sm hover:border-white/20 hover:text-white/60 transition disabled:opacity-50">
          {resolving ? 'Marking resolved...' : 'Mark as Resolved'}
        </button>
      )}
    </div>
  )
}
