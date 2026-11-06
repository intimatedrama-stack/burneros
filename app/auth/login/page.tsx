'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-2xl font-bold mb-1">BurnerOS</div>
          <p className="text-white/30 text-sm">Log in to your account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
          <button type="submit" disabled={loading}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="text-center text-white/30 text-sm mt-6">
          No account? <Link href="/auth/signup" className="text-white hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
