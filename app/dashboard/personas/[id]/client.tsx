'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Persona } from '@/lib/types'

export default function PersonaEditClient({ persona }: { persona: Persona }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: persona.name,
    handles: persona.handles?.join('\n') ?? '',
    bios: persona.bios?.join('\n') ?? '',
    timezone_claim: persona.timezone_claim ?? '',
    payment_handles: persona.payment_handles?.join('\n') ?? '',
    notes: persona.notes ?? '',
  })

  function splitLines(s: string) {
    return s.split('\n').map(x => x.trim()).filter(Boolean)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('personas').update({
      name: form.name,
      handles: splitLines(form.handles),
      bios: splitLines(form.bios),
      timezone_claim: form.timezone_claim || null,
      payment_handles: splitLines(form.payment_handles),
      notes: form.notes || null,
    }).eq('id', persona.id)
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm(`Delete persona "${persona.name}"? This cannot be undone.`)) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('personas').delete().eq('id', persona.id)
    router.push('/dashboard')
  }

  if (!editing) {
    return (
      <div className="flex gap-3">
        <button onClick={() => setEditing(true)}
          className="flex-1 border border-white/10 text-white/60 py-2.5 rounded-xl text-sm font-semibold hover:border-white/30 hover:text-white transition">
          ✏️ Edit Persona
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="flex-1 border border-red-500/20 text-red-400/60 py-2.5 rounded-xl text-sm font-semibold hover:border-red-500/40 hover:text-red-400 transition disabled:opacity-50">
          {deleting ? 'Deleting...' : 'Delete Persona'}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold">Edit Persona</h3>
      {[
        { key: 'name' as const, label: 'Name', multi: false },
        { key: 'handles' as const, label: 'Handles (one per line)', multi: true },
        { key: 'bios' as const, label: 'Bios (one per line)', multi: true },
        { key: 'timezone_claim' as const, label: 'Timezone claim', multi: false },
        { key: 'payment_handles' as const, label: 'Payment handles (one per line)', multi: true },
        { key: 'notes' as const, label: 'Notes', multi: true },
      ].map(f => (
        <div key={f.key}>
          <label className="text-xs text-white/30 block mb-1">{f.label}</label>
          {f.multi ? (
            <textarea value={form[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))}
              rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" />
          ) : (
            <input value={form[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none" />
          )}
        </div>
      ))}
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving}
          className="flex-1 bg-white text-black py-2.5 rounded-xl text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={() => setEditing(false)}
          className="flex-1 border border-white/10 text-white/40 py-2.5 rounded-xl text-sm hover:border-white/20 transition">
          Cancel
        </button>
      </div>
    </div>
  )
}
