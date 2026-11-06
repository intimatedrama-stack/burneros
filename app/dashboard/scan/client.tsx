'use client'
import { useState } from 'react'
import type { Persona } from '@/lib/types'
import { SEVERITY_COLORS, SEVERITY_LABELS } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface ScanResult {
  risk_score: number
  findings: { field: string; severity: keyof typeof SEVERITY_COLORS; evidence: string; fix: string }[]
}

export default function ScanClient({ personas }: { personas: Persona[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>(personas.map(p => p.id))
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState('')

  function toggle(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  async function runScan() {
    if (selected.length < 2) { setError('Select at least 2 personas to compare.'); return }
    setScanning(true)
    setError('')
    setResult(null)
    const res = await fetch('/api/scan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personaIds: selected, scanType: 'overlap' }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Scan failed'); setScanning(false); return }
    setResult(data)
    setScanning(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Persona selector */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
        <h3 className="font-semibold mb-3">Select personas to compare</h3>
        <div className="space-y-2">
          {personas.map(p => (
            <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${selected.includes(p.id) ? 'bg-white border-white' : 'border-white/20 group-hover:border-white/40'}`}
                onClick={() => toggle(p.id)}>
                {selected.includes(p.id) && <span className="text-black text-xs">✓</span>}
              </div>
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                {p.handles?.length > 0 && <div className="text-xs text-white/30">{p.handles.slice(0, 2).join(', ')}</div>}
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>}

      <button onClick={runScan} disabled={scanning || selected.length < 2}
        className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50">
        {scanning ? 'Scanning for leaks...' : `Scan ${selected.length} Personas`}
      </button>

      {result && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Scan Results</h3>
            <span className={`text-lg font-bold ${result.risk_score >= 70 ? 'text-red-400' : result.risk_score >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
              {result.risk_score}/100
            </span>
          </div>

          {!result.findings?.length ? (
            <p className="text-green-400 text-sm">✓ No overlap detected between selected personas.</p>
          ) : (
            <div className="space-y-4">
              {result.findings.map((f, i) => (
                <div key={i} className="border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${SEVERITY_COLORS[f.severity]}`}>{SEVERITY_LABELS[f.severity]}</span>
                    <span className="font-medium text-sm">{f.field}</span>
                  </div>
                  <p className="text-sm text-white/50 mb-2">{f.evidence}</p>
                  <div className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white/70">
                    <span className="text-white/40">Fix: </span>{f.fix}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
