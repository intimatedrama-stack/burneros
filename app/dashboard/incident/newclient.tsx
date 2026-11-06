'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

export default function IncidentNewClient() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [creating, setCreating] = useState(false)

  async function create() {
    if (!title.trim()) return
    setCreating(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('incidents').insert({
      user_id: user!.id,
      title,
      notes: notes || null,
      checklist: DEFAULT_CHECKLIST.map(a => ({ action: a, done: false })),
      status: 'active',
    })
    setCreating(false)
    setOpen(false)
    setTitle('')
    setNotes('')
    router.refresh()
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-red-500/30 transition">
        🚨 New Incident
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-bold text-lg mb-4">New Incident</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/30 block mb-1">What happened?</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Persona A handle linked to real name on Reddit"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="text-xs text-white/30 block mb-1">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              rows={3} placeholder="More context..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none resize-none text-sm" />
          </div>
          <div className="flex gap-3">
            <button onClick={create} disabled={creating || !title.trim()}
              className="flex-1 bg-white text-black py-2.5 rounded-xl font-semibold text-sm hover:bg-white/90 disabled:opacity-50 transition">
              {creating ? 'Creating...' : 'Create Incident'}
            </button>
            <button onClick={() => setOpen(false)}
              className="flex-1 border border-white/10 text-white/40 py-2.5 rounded-xl text-sm hover:border-white/20 transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
