import OpenAI from 'openai'
import type { Persona, ScanFinding } from './types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function scanPersonaOverlap(personas: Persona[]): Promise<{ risk_score: number; findings: ScanFinding[] }> {
  const summary = personas.map(p => ({
    name: p.name,
    handles: p.handles,
    bios: p.bios,
    timezone: p.timezone_claim,
    payment_handles: p.payment_handles,
    email_aliases: p.email_aliases,
    link_hubs: p.link_hubs,
    posting_patterns: p.posting_patterns,
    notes: p.notes,
  }))

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are an OPSEC analyst for anonymous online creators. Analyze the provided personas for identity overlap risks.

Return JSON: { "risk_score": 0-100, "findings": [ { "field": string, "severity": "low"|"medium"|"high"|"critical", "evidence": string, "fix": string } ] }

Check for:
- Reused handles or similar usernames across personas
- Shared payment handles (CashApp, Venmo, PayPal tags)
- Bio text overlap or similar phrases
- Timezone inconsistencies that could narrow location
- Shared link hubs or email patterns
- Style/posting pattern overlap
- Any bridge between personas that could link them

If no overlap found, return empty findings and low score.`,
      },
      { role: 'user', content: JSON.stringify(summary) },
    ],
  })

  return JSON.parse(res.choices[0].message.content ?? '{"risk_score":0,"findings":[]}')
}

export async function scanCaption(caption: string, personas: Persona[]): Promise<{ risk_score: number; findings: ScanFinding[] }> {
  const personaContext = personas.map(p => ({ name: p.name, bios: p.bios, timezone: p.timezone_claim }))

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are an OPSEC analyst. Analyze this caption/post for identity leak risks given the creator's personas.

Return JSON: { "risk_score": 0-100, "findings": [ { "field": string, "severity": "low"|"medium"|"high"|"critical", "evidence": string, "fix": string } ] }

Check for:
- Location clues (city, landmarks, weather, timezone hints)
- Personal details (pets, family references, vehicle, workplace hints)
- Phrases matching known persona bios
- Time/schedule patterns revealing routine
- Slang or writing style that bridges personas`,
      },
      { role: 'user', content: JSON.stringify({ caption, personas: personaContext }) },
    ],
  })

  return JSON.parse(res.choices[0].message.content ?? '{"risk_score":0,"findings":[]}')
}
