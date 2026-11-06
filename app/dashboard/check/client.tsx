'use client'
import { useState } from 'react'
import { SEVERITY_COLORS, SEVERITY_LABELS } from '@/lib/types'

interface ScanResult {
  risk_score: number
  findings: { field: string; severity: keyof typeof SEVERITY_COLORS; evidence: string; fix: string }[]
}

interface Props {
  personas: { id: string; name: string }[]
}

export default function PrePostClient({ personas }: Props) {
  const [caption, setCaption] = useState('')
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(personas.map(p => p.id))
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [exifWarning, setExifWarning] = useState(false)
  const [error, setError] = useState('')

  function toggle(id: string) {
    setSelectedPersonas(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch('/api/exif', { method: 'POST', body: formData })
    const data = await res.json()
    setExifWarning(data.hasExif)
  }

  async function runCheck() {
    if (!caption.trim()) { setError('Paste a caption to check.'); return }
    setScanning(true)
    setError('')
    setResult(null)
    const res = await fetch('/api/scan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personaIds: selectedPersonas, scanType: 'prepost', caption }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Check failed'); setScanning(false); return }
    setResult(data)
    setScanning(false)
  }

  return (
    <div className="space-y-5">
      {/* Persona context */}
      {personas.length > 0 && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <p className="text-sm text-white/40 mb-3">Which persona is this post for?</p>
          <div className="flex flex-wrap gap-2">
            {personas.map(p => (
              <button key={p.id} type="button" onClick={() => toggle(p.id)}
                className={`px-3 py-1 rounded-full text-sm border transition ${selectedPersonas.includes(p.id) ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image upload */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
        <p className="text-sm text-white/40 mb-3">Upload image (checks for EXIF metadata)</p>
        <input type="file" accept="image/*" onChange={handleImageUpload}
          className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white/70 file:text-sm hover:file:bg-white/20" />
        {exifWarning && (
          <div className="mt-3 bg-red-400/10 border border-red-400/20 text-red-400 text-sm px-4 py-3 rounded-xl">
            ⚠️ This image contains EXIF metadata (GPS, device info, timestamps). Strip it before posting.
          </div>
        )}
        {exifWarning === false && (
          <div className="mt-3 bg-green-400/10 border border-green-400/20 text-green-400 text-sm px-4 py-3 rounded-xl">
            ✓ No EXIF metadata detected.
          </div>
        )}
      </div>

      {/* Caption input */}
      <div>
        <label className="text-sm text-white/40 block mb-2">Caption / post text</label>
        <textarea value={caption} onChange={e => setCaption(e.target.value)}
          rows={5} placeholder="Paste the caption or text you're about to post..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 resize-none" />
      </div>

      {error && <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>}

      <button onClick={runCheck} disabled={scanning || !caption.trim()}
        className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50">
        {scanning ? 'Checking...' : 'Run Pre-Post Check'}
      </button>

      {result && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Risk Report</h3>
            <span className={`text-lg font-bold ${result.risk_score >= 70 ? 'text-red-400' : result.risk_score >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
              {result.risk_score}/100
            </span>
          </div>
          {!result.findings?.length ? (
            <p className="text-green-400 text-sm">✓ Caption looks clean. No identity leak risks detected.</p>
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
