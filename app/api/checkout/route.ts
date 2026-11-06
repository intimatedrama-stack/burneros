import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { planKey } = await req.json() as { planKey: 'scan' | 'solo' | 'pro' }
  const plan = PLANS[planKey]
  if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single()

  const session = await stripe.checkout.sessions.create({
    mode: plan.mode,
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user.email,
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/settings`,
    metadata: { userId: user.id, planKey },
  })

  return NextResponse.json({ url: session.url })
}
