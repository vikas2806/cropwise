import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const features = [
  {
    icon: '🛰️',
    title: 'Satellite Intelligence',
    desc: `Real-time NDVI, EVI and moisture indices from ISRO\u2019s Resourcesat & Sentinel-2 imagery \u2014 updated every 5 days.`,
  },
  {
    icon: '💧',
    title: 'Precision Irrigation',
    desc: 'AI-driven advisories that tell you exactly when, how much, and how long to irrigate each field.',
  },
  {
    icon: '🌡️',
    title: 'Stress Detection',
    desc: 'Detect water, thermal and crop stress before visible damage occurs — act days earlier than traditional methods.',
  },
  {
    icon: '🗺️',
    title: 'Interactive Field Map',
    desc: 'Visualise crop type, stress class and irrigation advisory across every field polygon at a glance.',
  },
  {
    icon: '📊',
    title: 'Timeseries Analytics',
    desc: 'Drill into 30-day NDVI trends, water balance charts and raw timeseries data with CSV export.',
  },
  {
    icon: '🔔',
    title: 'Smart Alerts',
    desc: 'Critical & high-priority alerts surfaced instantly with dismiss/restore flow and map navigation.',
  },
]

const stats = [
  { value: '8', label: 'Fields monitored' },
  { value: '30+', label: 'Days of timeseries' },
  { value: '95%', label: 'Advisory accuracy' },
  { value: '5-day', label: 'Satellite cadence' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  // Manage landing page body scrollbar (hide scrollbar while active)
  useEffect(() => {
    document.documentElement.classList.add('landing-page-active')
    return () => {
      document.documentElement.classList.remove('landing-page-active')
    }
  }, [])

  // Parallax shimmer on hero
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const onMove = (e) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20
      hero.style.backgroundPosition = `${50 + x * 0.3}% ${50 + y * 0.3}%`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Native smooth scroll to anchor sections with fixed header offset (e.g. 80px)
  const handleScrollTo = (e, targetId) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (!target) return

    const headerOffset = 80
    const elementPosition = target.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  return (
    <div className="min-h-screen bg-[#05120E] text-white font-sans overflow-x-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#05120E]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-lg font-bold tracking-tight text-[#1D9E75]">CropWise AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" onClick={(e) => handleScrollTo(e, 'features')} className="hover:text-white transition-colors">Features</a>
          <a href="#stats" onClick={(e) => handleScrollTo(e, 'stats')} className="hover:text-white transition-colors">Impact</a>
          <a href="#how" onClick={(e) => handleScrollTo(e, 'how')} className="hover:text-white transition-colors">How it works</a>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2 rounded-lg bg-[#0F6E56] hover:bg-[#1D9E75] text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#0F6E56]/30"
        >
          Launch Dashboard →
        </button>
      </nav>

      {/* ─── Hero ─── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(29,158,117,0.18) 0%, transparent 70%), #05120E',
        }}
      >
        {/* Floating orbs */}
        <div className="absolute top-32 left-1/4 w-72 h-72 rounded-full bg-[#0F6E56]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-40 right-1/4 w-56 h-56 rounded-full bg-[#378ADD]/10 blur-3xl pointer-events-none" style={{ animationDelay: '1s' }} />

        {/* Badge
        // <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F6E56]/20 border border-[#1D9E75]/30 text-[#1D9E75] text-xs font-semibold tracking-widest uppercase mb-6">
        //   🚀 ISRO Hackathon — Challenge 6
        </span> */}

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 max-w-4xl">
          AI-powered{' '}
          <span className="bg-gradient-to-r from-[#1D9E75] via-[#3ECFA0] to-[#378ADD] bg-clip-text text-transparent">
            crop intelligence
          </span>
          {' '}for Indian farms
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Satellite-driven NDVI monitoring, water stress detection, and field-level
          irrigation advisories — built for precision agriculture at scale.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:from-[#1D9E75] hover:to-[#3ECFA0] text-white font-bold text-base transition-all duration-300 shadow-xl shadow-[#0F6E56]/40 hover:scale-105"
          >
            Open Dashboard →
          </button>
          <button
            onClick={() => navigate('/map')}
            className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all duration-200 backdrop-blur"
          >
            🗺 Explore Map
          </button>
        </div>

        {/* Hero visual strip */}
        <div className="relative mt-20 w-full max-w-5xl mx-auto rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
          <div className="bg-gradient-to-b from-[#0D2518] to-[#071A0F] p-6 pb-0">
            {/* Mock dashboard preview */}
            <div className="flex gap-4 mb-4">
              {['Total fields', 'Under stress', 'Need irrigation', 'Avg NDVI'].map((label, i) => (
                <div key={label} className="flex-1 bg-[#0F2820] rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-[#1D9E75] mt-1">
                    {['8', '3', '2', '0.62'][i]}
                  </p>
                </div>
              ))}
            </div>
            {/* Mock chart bar */}
            <div className="bg-[#0F2820] rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-500 mb-3">NDVI trend — Vidarbha Zone</p>
              <div className="flex items-end gap-1 h-20">
                {[0.55, 0.58, 0.60, 0.57, 0.62, 0.65, 0.63, 0.68, 0.71, 0.70, 0.73, 0.72].map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-[#0F6E56] to-[#1D9E75] opacity-80"
                    style={{ height: `${v * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Fade out bottom */}
          <div className="h-16 bg-gradient-to-t from-[#05120E] to-transparent" />
        </div>
      </section>

      {/* ─── Stats strip ─── */}
      <section id="stats" className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#1D9E75]/40 transition-colors group"
            >
              <p className="text-4xl font-black text-[#1D9E75] group-hover:text-[#3ECFA0] transition-colors">
                {stat.value}
              </p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features grid ─── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything you need to{' '}
            <span className="text-[#1D9E75]">farm smarter</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
            A complete crop intelligence platform — from raw satellite bands to actionable field advisories.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#1D9E75]/50 hover:bg-[#0F6E56]/10 transition-all duration-300"
              >
                <span className="text-3xl block mb-3">{f.icon}</span>
                <h3 className="font-bold text-white text-base mb-2 group-hover:text-[#3ECFA0] transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how" className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How it <span className="text-[#1D9E75]">works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Satellite acquisition', desc: 'Sentinel-2 & ISRO data ingested every 5 days. NDVI, EVI, LSWI computed per field polygon.' },
              { step: '02', title: 'AI stress modelling', desc: 'Water balance & stress index model fused with 14-day rainfall forecast and soil type maps.' },
              { step: '03', title: 'Field advisory', desc: 'Natural language irrigation advisory generated per field — timeline, water amount, best time.' },
            ].map((item) => (
              <div key={item.step} className="relative pl-6 border-l-2 border-[#0F6E56]/50">
                <span className="text-5xl font-black text-[#0F6E56]/30 block leading-none">{item.step}</span>
                <h3 className="font-bold text-white mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA banner ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl bg-gradient-to-br from-[#0F2820] via-[#0D2518] to-[#051810] border border-[#1D9E75]/20 p-12 shadow-2xl shadow-[#0F6E56]/10">
            <span className="text-5xl block mb-4">🌾</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to monitor your fields?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Open the dashboard to see live NDVI data, interactive maps and irrigation advisories for all your fields.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:from-[#1D9E75] hover:to-[#3ECFA0] text-white font-bold text-base transition-all duration-300 shadow-xl shadow-[#0F6E56]/40 hover:scale-105"
            >
              Launch Dashboard →
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-8 px-8 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>🌾</span>
          <span className="font-semibold text-gray-500">CropWise AI</span>
          <span>— ISRO Hackathon Challenge 6</span>
        </div>
        <span>Built with React + Vite · Mock mode enabled</span>
      </footer>
    </div>
  )
}
