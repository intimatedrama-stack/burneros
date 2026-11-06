import Link from 'next/link'

const FEATURES = [
  { title: 'Persona Vault', desc: 'Store handles, bios, payment info, timezones, and link hubs for each identity — fully separated.' },
  { title: 'Overlap Scan', desc: 'AI-powered analysis finds shared handles, bio phrases, payment bridges, and timezone clues across your personas.' },
  { title: 'Pre-Post Check', desc: 'Paste a caption or upload an image before posting. Get a risk report with severity, evidence, and exact fix.' },
  { title: 'EXIF Detection', desc: 'Scans uploaded images for GPS coordinates, device info, and timestamps before they go public.' },
  { title: 'Incident Mode', desc: 'Something slipped. Work through a structured response checklist: what to rotate, archive, and unlink.' },
]

const PLANS = [
  {
    name: 'Scan', price: '$29', period: ' one-time',
    features: ['1 account', 'Up to 2 personas', '10 scans', 'Text overlap checks', 'Image metadata checks', 'Pre-post report'],
  },
  {
    name: 'Solo', price: '$19', period: '/month', highlight: true,
    features: ['Up to 5 personas', 'Unlimited text scans', '100 media scans/month', 'Saved rules', 'Incident mode', 'Risk history'],
  },
  {
    name: 'Pro', price: '$49', period: '/month',
    features: ['Up to 15 personas', 'Unlimited scans', 'Advanced persona rules', 'Content vault tags', 'Priority scan queue', 'Exportable risk reports'],
  },
]

const FAQS = [
  { q: 'What is an anonymous creator?', a: 'Anyone running multiple online identities — adult creators, faceless influencers, whistleblowers, activists, or niche operators who need real separation between accounts.' },
  { q: 'What does "overlap" mean?', a: 'If two personas share a payment handle, similar bio phrases, the same timezone claim, or linked handles — that is overlap. It can link identities together and expose you.' },
  { q: 'Will it automatically fix my accounts?', a: 'No. BurnerOS tells you what the risk is, where it is, and exactly how to fix it. You stay in control.' },
  { q: 'Does it store my content?', a: 'No. Images are scanned for metadata in memory and discarded. Persona data is stored encrypted in your account only.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="text-lg font-bold tracking-tight">BurnerOS</span>
        <div className="flex gap-4 text-sm">
          <Link href="/auth/login" className="text-white/50 hover:text-white transition">Log in</Link>
          <Link href="/auth/signup" className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-white/90 transition">Get Early Access</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-20 pb-24">
        <div className="inline-block text-xs font-semibold tracking-widest text-white/30 uppercase mb-6 border border-white/10 px-3 py-1 rounded-full">
          Identity protection for anonymous creators
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
          Stay anonymous.<br />Stay impossible to trace.
        </h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          BurnerOS scans your personas for identity overlap, catches doxxing risks before you post, and gives you a step-by-step response plan when something slips.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/signup" className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition">
            Get Early Access
          </Link>
          <Link href="/auth/login" className="border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-white/40 transition">
            Log In
          </Link>
        </div>
        <p className="text-sm text-white/25 mt-6">Built for anonymous creators, faceless influencers, and anyone running multiple identities online.</p>
      </section>

      {/* Problem */}
      <section className="bg-white/[0.03] border-y border-white/5 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Most creators get exposed through tiny details they didn&apos;t notice.</h2>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            A reused username. A payment handle that appears on both accounts. A bio phrase copied from one profile to another. A caption that mentions a local landmark. An image uploaded with GPS coordinates still embedded. Any one of these can bridge your identities and end your anonymity.
          </p>
          <ul className="space-y-3">
            {[
              'Reused handles, phrases, or bios across personas',
              'Payment handles that link accounts (CashApp, Venmo, PayPal)',
              'Image metadata with GPS, device info, or timestamps',
              'Timezone and schedule patterns that narrow your location',
              'Style overlap that makes two accounts recognizable as one person',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-white/70">
                <span className="text-red-400 mt-1">⚠</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-14">Everything you need to stay separated and protected</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white/[0.03] border-y border-white/5 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">One workflow. Define. Detect. Fix. Respond.</h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Define personas', desc: 'Add your identities with handles, bios, payment info, and timezone claims.' },
              { step: '02', title: 'Detect overlap', desc: 'Run a scan. Get a risk score and every bridge between identities.' },
              { step: '03', title: 'Fix risks', desc: 'Each finding comes with exact fix instructions and severity.' },
              { step: '04', title: 'Respond if exposed', desc: 'Incident Mode walks you through what to rotate, archive, and unlink.' },
            ].map(s => (
              <div key={s.step} className="bg-black border border-white/5 rounded-2xl p-5">
                <div className="text-3xl font-bold text-white/10 mb-3">{s.step}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-center text-white/40 mb-14">Start with a one-time scan. Move to monthly if you need ongoing protection.</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {PLANS.map(p => (
            <div key={p.name} className={`rounded-2xl p-6 border flex flex-col ${p.highlight ? 'bg-white text-black border-white' : 'bg-white/[0.03] border-white/10'}`}>
              <div className="text-sm font-semibold mb-4 opacity-60">{p.name}</div>
              <div className="text-4xl font-bold mb-1">{p.price}<span className="text-lg font-normal opacity-50">{p.period}</span></div>
              <ul className="mt-6 space-y-2 flex-1">
                {p.features.map(f => (
                  <li key={f} className={`text-sm flex gap-2 ${p.highlight ? 'text-black/70' : 'text-white/50'}`}>
                    <span className={p.highlight ? 'text-black' : 'text-white'}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className={`mt-8 block text-center py-3 rounded-full font-semibold text-sm transition ${p.highlight ? 'bg-black text-white hover:bg-black/80' : 'border border-white/20 text-white hover:border-white/40'}`}>
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white/[0.03] border-y border-white/5 py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-8">
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 className="font-semibold mb-2">{f.q}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-2xl mx-auto text-center py-24 px-6">
        <h2 className="text-4xl font-bold mb-4">Your anonymity is only as strong as your weakest link.</h2>
        <p className="text-white/40 text-lg mb-8">Find it before someone else does.</p>
        <Link href="/auth/signup" className="bg-white text-black px-10 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition inline-block">
          Get Early Access
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-bold">BurnerOS</span>
          <p className="text-white/25 text-sm">Identity protection for anonymous creators.</p>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="/auth/login" className="hover:text-white transition">Log in</Link>
            <Link href="/auth/signup" className="hover:text-white transition">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

