import { createClient } from '@/lib/supabase/server'
import { scanPersonaOverlap, scanCaption } from '@/lib/openai'
import { type Persona } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { personaIds, scanType, caption } = await req.json()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('scan_credits').eq('id', user.id).single()
  if (!profile || profile.scan_credits <= 0) {
    return NextResponse.json({ error: 'No scan credits remaining. Upgrade your plan.' }, { status: 402 })
  }

  const { data: personas } = await supabase
    .from('personas').select('*').in('id', personaIds).eq('user_id', user.id) as { data: Persona[] | null }
  if (!personas?.length) return NextResponse.json({ error: 'No personas found' }, { status: 400 })

  let result: { risk_score: number; findings: unknown[] }
  if (scanType === 'overlap') {
    result = await scanPersonaOverlap(personas)
  } else if (scanType === 'prepost' && caption) {
    result = await scanCaption(caption, personas)
  } else {
    return NextResponse.json({ error: 'Invalid scan type' }, { status: 400 })
  }

  // Save scan + deduct credit
  await supabase.from('scans').insert({
    user_id: user.id,
    scan_type: scanType,
    persona_ids: personaIds,
    input_data: caption ? { caption } : {},
    risk_score: result.risk_score,
    findings: result.findings,
  })
  await supabase.from('profiles').update({ scan_credits: profile.scan_credits - 1 }).eq('id', user.id)

  return NextResponse.json(result)
}
