import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export const PLANS = {
  scan: { name: 'Scan', price: 2900, priceId: process.env.STRIPE_SCAN_PRICE_ID!, mode: 'payment' as const },
  solo: { name: 'Solo', price: 1900, priceId: process.env.STRIPE_SOLO_PRICE_ID!, mode: 'subscription' as const },
  pro:  { name: 'Pro',  price: 4900, priceId: process.env.STRIPE_PRO_PRICE_ID!,  mode: 'subscription' as const },
}
