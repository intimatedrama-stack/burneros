'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewPersonaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    handles: '',
    bios: '',
    timezone_claim: '',
    payment_handles: '',
    email_aliases: '',
    link_hubs: '',
    posting_patterns: '',
    notes: '',
  })

  function splitLines(s: string) {
    return s.split('\n').map(x => x.trim()).filter(Boolean)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('personas').insert({
      user_id: user!.id,
      name: form.name,
      handles: splitLines(form.handles),
      bios: splitLines(form.bios),
      timezone_claim: form.timezone_claim || null,
      payment_handles: splitLines(form.payment_handles),
      email_aliases: splitLines(form.email_aliases),
      link_hubs: splitLines(form.link_hubs),
      posting_patterns: form.posting_patterns || null,
      notes: form.notes || null,
    })
    router.push('/dashboard')
  }

  const field = (key: keyof typeof form, label: string, placeholder: string, multiline = false, hint?: string) => (
    <div>
      <label className="text-sm text-white/40 block mb-1">{label}</label>
      {multiline ? (
        <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={3} placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 resize-none text-sm" />
      ) : (
        <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
      )}
      {hint && <p className="text-white/20 text-xs mt-1">{hint}</p>}
    </div>
  )

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">New Persona</h1>
      <p className="text-white/30 text-sm mb-8">Define a new identity. The more detail you add, the more accurate the overlap scan.</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        {field('name', 'Persona name *', 'e.g. "Violet", "Work Account", "Side Hustle"')}
        {field('handles', 'Usernames / handles', '@violet_xo\n@violet.xo\nvioletcreates', true, 'One per line — all usernames for this persona across platforms')}
        {field('bios', 'Bio text', 'Your fav escape artist 🖤\nI make things disappear...', true, 'One per line — paste bio variants used across platforms')}
        {field('timezone_claim', 'Timezone claim', 'e.g. "EST", "Pacific", "London"', false, 'What timezone does this persona claim to be in?')}
        {field('payment_handles', 'Payment handles', '$violet-xo\nvenmo: violet.pay', true, 'One per line — CashApp, Venmo, PayPal, etc.')}
        {field('email_aliases', 'Email aliases', 'violet@proton.me', true, 'One per line')}
        {field('link_hubs', 'Link hubs / bio links', 'linktr.ee/violet\nbeacons.ai/violet', true, 'One per line')}
        {field('posting_patterns', 'Posting patterns / schedule', 'Posts 10pm-2am EST, weekdays only', false, 'When / how often does this persona post?')}
        {field('notes', 'Notes', 'Anything else to track for this persona...', true)}
        <button type="submit" disabled={loading}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Persona'}
        </button>
      </form>
    </div>
  )
}
