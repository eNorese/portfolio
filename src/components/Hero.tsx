'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { SocialLinks } from '@/components/SocialLinks'

// ── Code rain ──────────────────────────────────────────────────────
const CODE_FRAGMENTS = [
  'import', 'async function', 'const fn =', 'await', 'return {',
  'cloud_fn()', 'deploy()', '.then(cb)', 'Promise<T>', 'interface',
  'export default', 'try { }', '{ id, name }', '=> {}', '.catch(e)',
  'process.env', 'docker run', 'kubectl get', 'git push', 'CI/CD',
  '200 OK', 'SELECT *', 'LEFT JOIN', 'Redis.set(', 'EventBus',
  'SignalR', '0xFF3A', 'null', '...rest', 'useEffect(', 'Azure',
  'type T =', 'as const', 'node:fs', 'npm run dev', 'Promise.all(',
  'new Map()', 'Object.keys', 'if (err)', 'class Service', '@Injectable',
]

interface Drop {
  x: number
  y: number
  vy: number
  text: string
  alpha: number
  isBlue: boolean
  size: number
}

function createDrops(count: number, w: number, h: number): Drop[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h * 1.5 - h * 0.5,
    vy: 0.2 + Math.random() * 0.5,
    text: CODE_FRAGMENTS[Math.floor(Math.random() * CODE_FRAGMENTS.length)],
    alpha: 0.05 + Math.random() * 0.13,
    isBlue: Math.random() > 0.35,
    size: 10 + Math.floor(Math.random() * 4),
  }))
}

// ── Stars ───────────────────────────────────────────────────────────
interface Star {
  x: number
  y: number
  r: number            // radius
  baseAlpha: number    // resting opacity
  twinkleSpeed: number
  twinklePhase: number
  // pre-built color prefix (rgb portion without alpha)
  rgb: string
}

const STAR_COLORS = [
  '255,255,255',   // pure white       — most common
  '200,220,255',   // cool blue-white
  '220,210,255',   // warm violet-white
]

function createStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => {
    const roll = Math.random()
    // 60% tiny, 30% medium, 10% slightly bright
    const r = roll < 0.6 ? 0.4 + Math.random() * 0.4
            : roll < 0.9 ? 0.7 + Math.random() * 0.6
            :               1.1 + Math.random() * 0.7
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r,
      baseAlpha: 0.1 + Math.random() * 0.45,
      twinkleSpeed: 0.25 + Math.random() * 0.65,
      twinklePhase: Math.random() * Math.PI * 2,
      rgb: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    }
  })
}

// ── Data pixels ─────────────────────────────────────────────────────
interface DataPixel {
  id: number
  top: string
  left: string
  delay: number
  duration: number
  blue: boolean
}

// ── Component ───────────────────────────────────────────────────────
export function Hero() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const dropsRef   = useRef<Drop[]>([])
  const starsRef   = useRef<Star[]>([])
  const mouseRef   = useRef({ x: 0, y: 0 })
  const rafRef     = useRef<number>(0)

  const [pixels,         setPixels]         = useState<DataPixel[]>([])
  const [glowName,       setGlowName]       = useState(false)
  const [glowTitle,      setGlowTitle]      = useState(false)
  const [hoverPrimary,   setHoverPrimary]   = useState(false)
  const [hoverSecondary, setHoverSecondary] = useState(false)

  // Generate data pixels once (client only — avoids hydration mismatch)
  useEffect(() => {
    setPixels(
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        top: `${4 + Math.random() * 92}%`,
        left: `${2 + Math.random() * 96}%`,
        delay: Math.random() * 4,
        duration: 1.8 + Math.random() * 2.4,
        blue: Math.random() > 0.4,
      }))
    )
  }, [])

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      dropsRef.current = createDrops(58, canvas.width, canvas.height)
      starsRef.current  = createStars(110, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      const { x: mx, y: my } = mouseRef.current

      ctx.clearRect(0, 0, W, H)

      // Parallax: shift drawing origin opposite to cursor (subtle depth illusion)
      const ox = (mx / (W || 1) - 0.5) * -22
      const oy = (my / (H || 1) - 0.5) * -11
      ctx.save()
      ctx.translate(ox, oy)

      // ── Stars (drawn first, behind code rain) ──────────────────────
      const t = performance.now() / 1000
      for (const s of starsRef.current) {
        // Twinkle: alpha oscillates between 0 and baseAlpha
        const alpha = s.baseAlpha * (0.45 + 0.55 * Math.sin(t * s.twinkleSpeed + s.twinklePhase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.rgb},${alpha.toFixed(3)})`
        // Brightest stars get a soft glow
        if (s.r > 1.1 && alpha > 0.3) {
          ctx.shadowBlur  = 4
          ctx.shadowColor = `rgba(${s.rgb},${(alpha * 0.5).toFixed(3)})`
        } else {
          ctx.shadowBlur = 0
        }
        ctx.fill()
      }
      ctx.shadowBlur = 0

      // ── Code rain ──────────────────────────────────────────────────
      for (const d of dropsRef.current) {
        ctx.font = `${d.size}px 'Courier New', monospace`
        ctx.fillStyle = d.isBlue
          ? `rgba(96,165,250,${d.alpha})`
          : `rgba(167,139,250,${d.alpha})`
        ctx.fillText(d.text, d.x, d.y)

        d.y += d.vy
        if (d.y > H + 30) {
          d.y    = -20
          d.x    = Math.random() * W
          d.text = CODE_FRAGMENTS[Math.floor(Math.random() * CODE_FRAGMENTS.length)]
          d.alpha = 0.05 + Math.random() * 0.13
        }
      }

      ctx.restore()
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950"
    >
      {/* ── Code rain canvas (z-0) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── Ambient blobs (z-1) ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-24 w-[400px] h-[400px] bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[200px] bg-blue-950/30 rounded-full blur-3xl" />
      </div>

      {/* ── Data pixels (z-2) ── */}
      {pixels.map((px) => (
        <span
          key={px.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: px.top,
            left: px.left,
            width: '3px',
            height: '3px',
            background: px.blue ? 'rgba(96,165,250,0.85)' : 'rgba(167,139,250,0.85)',
            boxShadow: px.blue
              ? '0 0 5px rgba(96,165,250,0.7), 0 0 10px rgba(96,165,250,0.35)'
              : '0 0 5px rgba(167,139,250,0.7), 0 0 10px rgba(167,139,250,0.35)',
            animation: `pixel-blink ${px.duration}s ease-in-out ${px.delay}s infinite`,
            zIndex: 2,
          }}
        />
      ))}

      {/* ── Main content (z-10) ── */}
      <div
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center"
        style={{ zIndex: 10 }}
      >
        {/* Eyebrow */}
        <span className="inline-block mb-5 text-xs font-mono tracking-[0.25em] uppercase text-indigo-400">
          {t('hero.greeting')}
        </span>

        {/* Name — blue neon on hover */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 cursor-default select-none"
          onMouseEnter={() => setGlowName(true)}
          onMouseLeave={() => setGlowName(false)}
          style={{
            textShadow: glowName
              ? '0 0 10px rgba(96,165,250,0.95), 0 0 30px rgba(96,165,250,0.6), 0 0 65px rgba(96,165,250,0.3)'
              : 'none',
            transition: 'text-shadow 0.35s ease',
          }}
        >
          {t('hero.name')}
        </h1>

        {/* Title — violet neon on hover */}
        <p
          className="text-lg sm:text-xl lg:text-2xl font-light text-gray-300 mb-6 cursor-default select-none"
          onMouseEnter={() => setGlowTitle(true)}
          onMouseLeave={() => setGlowTitle(false)}
          style={{
            textShadow: glowTitle
              ? '0 0 8px rgba(167,139,250,0.95), 0 0 25px rgba(167,139,250,0.55), 0 0 55px rgba(167,139,250,0.25)'
              : 'none',
            transition: 'text-shadow 0.35s ease',
          }}
        >
          {t('hero.title')}
        </p>

        {/* Neon divider */}
        <div
          className="w-12 h-px mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent)' }}
        />

        {/* Description */}
        <p className="max-w-xl text-base sm:text-lg text-gray-400 leading-relaxed mb-10">
          {t('hero.description')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">

          {/* Primary — blue neon bloom */}
          <a
            href="#projects"
            onMouseEnter={() => setHoverPrimary(true)}
            onMouseLeave={() => setHoverPrimary(false)}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-white text-sm font-medium"
            style={{
              backgroundColor: hoverPrimary ? 'rgba(67,56,202,1)' : 'rgba(99,102,241,1)',
              boxShadow: hoverPrimary
                ? '0 0 18px rgba(99,102,241,0.75), 0 0 45px rgba(99,102,241,0.35), 0 0 80px rgba(99,102,241,0.15)'
                : 'none',
              transition: 'background-color 0.25s ease, box-shadow 0.35s ease',
            }}
          >
            {t('hero.cta_work')}
            <svg
              width="16" height="16" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}
              style={{
                transform: hoverPrimary ? 'translateX(4px)' : 'translateX(0)',
                transition: 'transform 0.25s ease',
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>

          {/* Secondary — purple neon border + inner glow */}
          <a
            href="#contact"
            onMouseEnter={() => setHoverSecondary(true)}
            onMouseLeave={() => setHoverSecondary(false)}
            className="inline-flex items-center justify-center px-7 py-3 rounded-full text-sm font-medium"
            style={{
              border: `1px solid ${hoverSecondary ? 'rgba(167,139,250,0.85)' : 'rgba(75,85,99,0.9)'}`,
              color: hoverSecondary ? 'rgba(196,181,253,1)' : 'rgba(209,213,219,1)',
              boxShadow: hoverSecondary
                ? '0 0 14px rgba(139,92,246,0.45), inset 0 0 28px rgba(99,102,241,0.1)'
                : 'none',
              transition: 'border-color 0.25s ease, color 0.25s ease, box-shadow 0.35s ease',
            }}
          >
            {t('hero.cta_contact')}
          </a>
        </div>

        {/* CV download */}
        <a
          href="/cv.pdf"
          download
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-indigo-400 transition-colors duration-200 mb-7"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {t('hero.cv_download')}
        </a>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <div className="h-px w-10 bg-gray-700/60" />
          <SocialLinks size={20} baseClass="text-gray-500" />
          <div className="h-px w-10 bg-gray-700/60" />
        </div>
      </div>

      {/* ── Scroll indicator — breathing neon (z-10) ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <span
          className="text-xs text-gray-500 font-mono"
          style={{ animation: 'breathe 2.8s ease-in-out infinite' }}
        >
          {t('hero.scroll')}
        </span>
        <div
          className="w-5 h-8 rounded-full flex justify-center items-start pt-1.5"
          style={{
            border: '1px solid rgba(99,102,241,0.45)',
            boxShadow: '0 0 8px rgba(99,102,241,0.2)',
            animation: 'breathe 2.8s ease-in-out infinite',
          }}
        >
          <div
            className="w-0.5 h-2 rounded-full"
            style={{
              background: 'rgba(99,102,241,0.9)',
              animation: 'scroll-bob 1.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}
