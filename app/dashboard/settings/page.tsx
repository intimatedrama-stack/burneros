'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [plan, setPlan] = useState('free')
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('profiles').select('plan, scan_credits').eq('id', user!.id).single()
      if (data) { setPlan(data.plan); setCredits(data.scan_credits) }
      setLoading(false)
    }
    load()
  }, [])

  async function upgrade(planKey: string) {
    setUpgrading(planKey)
    const res = await fetch('/api/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planKey }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setUpgrading('')
  }

  const PLANS = [
    { key: 'scan', name: 'Scan', price: '$29 one-time', desc: '10 scans, text + image checks, pre-post report', credits: 10 },
    { key: 'solo', name: 'Solo', price: '$19/month', desc: 'Unlimited text scans, 100 media scans/month, saved rules, incident mode', credits: 999 },
    { key: 'pro', name: 'Pro', price: '$49/month', desc: 'Unlimited scans, advanced rules, content vault, priority queue, exportable reports', credits: 9999 },
  ]

  if (loading) return <div className="text-white/30">Loading...</div>

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-white/30 text-sm mb-8">Your account and plan.</p>

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-white/40 mb-1">Current plan</div>
            <div className="text-xl font-bold capitalize">{plan}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/40 mb-1">Scan credits</div>
            <div className="text-xl font-bold">{credits >= 9999 ? '∞' : credits}</div>
          </div>
        </div>
      </div>

      <h2 className="font-semibold mb-4">Upgrade</h2>
      <div className="space-y-3">
        {PLANS.map(p => (
          <div key={p.key} className={`bg-white/[0.03] border rounded-2xl p-5 flex items-start justify-between gap-4 ${plan === p.key ? 'border-white/20' : 'border-white/5'}`}>
            <div>
              <div className="font-semibold">{p.name} <span className="text-white/40 font-normal text-sm">— {p.price}</span></div>
              <p className="text-white/30 text-sm mt-1">{p.desc}</p>
            </div>
            {plan === p.key ? (
              <span className="text-xs text-white/30 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap">Current</span>
            ) : (
              <button onClick={() => upgrade(p.key)} disabled={upgrading === p.key}
                className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50 whitespace-nowrap">
                {upgrading === p.key ? '...' : 'Upgrade'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
