'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
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
  x: number; y: number; vy: number
  text: string; alpha: number; isBlue: boolean; size: number
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
  x: number; y: number; r: number
  baseAlpha: number; twinkleSpeed: number; twinklePhase: number
  // dark-mode rgb / light-mode rgb
  darkRgb: string; lightRgb: string
}

const DARK_STAR_COLORS  = ['255,255,255', '200,220,255', '220,210,255']
const LIGHT_STAR_COLORS = ['79,70,229',   '99,102,241',  '124,58,237']

function createStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => {
    const roll = Math.random()
    const r = roll < 0.6 ? 0.4 + Math.random() * 0.4
            : roll < 0.9 ? 0.7 + Math.random() * 0.6
            :               1.1 + Math.random() * 0.7
    const idx = Math.floor(Math.random() * DARK_STAR_COLORS.length)
    return {
      x: Math.random() * w, y: Math.random() * h, r,
      baseAlpha: 0.1 + Math.random() * 0.45,
      twinkleSpeed: 0.25 + Math.random() * 0.65,
      twinklePhase: Math.random() * Math.PI * 2,
      darkRgb:  DARK_STAR_COLORS[idx],
      lightRgb: LIGHT_STAR_COLORS[idx],
    }
  })
}

// ── Data pixels ─────────────────────────────────────────────────────
interface DataPixel {
  id: number; top: string; left: string
  delay: number; duration: number; blue: boolean
}

// ── Component ───────────────────────────────────────────────────────
export function Hero() {
  const { t }              = useLanguage()
  const { resolvedTheme }  = useTheme()
  const [mounted, setMounted] = useState(false)

  const sectionRef   = useRef<HTMLElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const spotlightRef   = useRef<HTMLDivElement>(null)
  const spotTargetRef  = useRef({ x: 0, y: 0 })   // where cursor actually is
  const spotPosRef     = useRef({ x: 0, y: 0 })   // interpolated position
  const spotRafRef     = useRef<number>(0)
  const isInsideRef    = useRef(false)
  const dropsRef       = useRef<Drop[]>([])
  const starsRef       = useRef<Star[]>([])
  const mouseRef       = useRef({ x: 0, y: 0 })
  const rafRef         = useRef<number>(0)
  // Keep a ref so the rAF draw loop always reads the current theme
  const isDarkRef      = useRef(true)

  const [pixels,         setPixels]         = useState<DataPixel[]>([])
  const [glowName,       setGlowName]       = useState(false)
  const [glowTitle,      setGlowTitle]      = useState(false)
  const [hoverPrimary,   setHoverPrimary]   = useState(false)
  const [hoverSecondary, setHoverSecondary] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Sync isDarkRef whenever resolved theme changes
  useEffect(() => {
    isDarkRef.current = resolvedTheme !== 'light'
  }, [resolvedTheme])

  // Generate data pixels once (client-only — avoids hydration mismatch)
  useEffect(() => {
    setPixels(
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        top:  `${4  + Math.random() * 92}%`,
        left: `${2  + Math.random() * 96}%`,
        delay:    Math.random() * 4,
        duration: 1.8 + Math.random() * 2.4,
        blue: Math.random() > 0.4,
      }))
    )
  }, [])

  // Spotlight lerp loop — runs independently of canvas rAF
  useEffect(() => {
    const EASE = 0.11   // lower = smoother lag; 0.11 ≈ slightly snappier trailing

    const tick = () => {
      const pos    = spotPosRef.current
      const target = spotTargetRef.current
      pos.x += (target.x - pos.x) * EASE
      pos.y += (target.y - pos.y) * EASE

      const spot = spotlightRef.current
      if (spot && isInsideRef.current) {
        const color = isDarkRef.current
          ? 'rgba(99,102,241,0.12)'
          : 'rgba(99,102,241,0.14)'
        spot.style.background =
          `radial-gradient(700px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 65%)`
      }

      spotRafRef.current = requestAnimationFrame(tick)
    }

    spotRafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(spotRafRef.current)
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
      const isMobile = canvas.width < 768
      dropsRef.current = createDrops(isMobile ? 25 : 58, canvas.width, canvas.height)
      starsRef.current = createStars(isMobile ? 50 : 110, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      const { x: mx, y: my } = mouseRef.current
      const isDark = isDarkRef.current

      ctx.clearRect(0, 0, W, H)

      // Parallax: shift drawing origin opposite to cursor
      const ox = (mx / (W || 1) - 0.5) * -22
      const oy = (my / (H || 1) - 0.5) * -11
      ctx.save()
      ctx.translate(ox, oy)

      // ── Stars ──────────────────────────────────────────────────────
      const now = performance.now() / 1000
      for (const s of starsRef.current) {
        const alpha = (isDark ? s.baseAlpha : s.baseAlpha * 1.8)
          * (0.45 + 0.55 * Math.sin(now * s.twinkleSpeed + s.twinklePhase))
        const rgb = isDark ? s.darkRgb : s.lightRgb
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`
        if (s.r > 1.1 && alpha > 0.3) {
          ctx.shadowBlur  = 4
          ctx.shadowColor = `rgba(${rgb},${(alpha * 0.5).toFixed(3)})`
        } else {
          ctx.shadowBlur = 0
        }
        ctx.fill()
      }
      ctx.shadowBlur = 0

      // ── Code rain ──────────────────────────────────────────────────
      for (const d of dropsRef.current) {
        ctx.font = `${d.size}px 'Courier New', monospace`
        const a = isDark ? d.alpha : Math.min(d.alpha * 2.8, 0.32)
        ctx.fillStyle = d.isBlue
          ? (isDark ? `rgba(96,165,250,${a})`  : `rgba(79,70,229,${a})`)
          : (isDark ? `rgba(167,139,250,${a})` : `rgba(124,58,237,${a})`)
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
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseRef.current = { x, y }
    spotTargetRef.current = { x, y }

    if (!isInsideRef.current) {
      // Snap interpolated position to cursor on first entry — avoids slide from (0,0)
      spotPosRef.current = { x, y }
      isInsideRef.current = true
      if (spotlightRef.current) spotlightRef.current.style.opacity = '1'
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 }
    isInsideRef.current = false
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0'
  }, [])

  // Derived from resolved theme (safe after mount)
  const isDark = mounted ? resolvedTheme !== 'light' : true

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950"
    >
      {/* ── Code rain canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── Cursor spotlight ── */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 3, opacity: 0, transition: 'opacity 0.5s ease' }}
      />

      {/* ── Ambient blobs ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-indigo-100/60 dark:bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-24 w-[400px] h-[400px] bg-violet-100/50 dark:bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[200px] bg-blue-50/60 dark:bg-blue-950/30 rounded-full blur-3xl" />
      </div>

      {/* ── Data pixels ── */}
      {pixels.map((px) => (
        <span
          key={px.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: px.top, left: px.left,
            width: '3px', height: '3px',
            background: px.blue
              ? (isDark ? 'rgba(96,165,250,0.85)'  : 'rgba(79,70,229,0.6)')
              : (isDark ? 'rgba(167,139,250,0.85)' : 'rgba(124,58,237,0.6)'),
            boxShadow: px.blue
              ? '0 0 5px rgba(96,165,250,0.7), 0 0 10px rgba(96,165,250,0.35)'
              : '0 0 5px rgba(167,139,250,0.7), 0 0 10px rgba(167,139,250,0.35)',
            animation: `pixel-blink ${px.duration}s ease-in-out ${px.delay}s infinite`,
            zIndex: 2,
          }}
        />
      ))}

      {/* ── Main content ── */}
      <div
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center"
        style={{ zIndex: 10 }}
      >
        {/* Eyebrow */}
        <span className="inline-block mb-5 text-xs font-mono tracking-[0.25em] uppercase text-indigo-600 dark:text-indigo-400">
          {t('hero.greeting')}
        </span>

        {/* Name — neon glow on hover */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 cursor-default select-none"
          onMouseEnter={() => setGlowName(true)}
          onMouseLeave={() => setGlowName(false)}
          style={{
            textShadow: glowName
              ? isDark
                ? '0 0 10px rgba(96,165,250,0.95), 0 0 30px rgba(96,165,250,0.6), 0 0 65px rgba(96,165,250,0.3)'
                : '0 0 12px rgba(79,70,229,0.55), 0 0 35px rgba(79,70,229,0.25)'
              : 'none',
            transition: 'text-shadow 0.35s ease',
          }}
        >
          {t('hero.name')}
        </h1>

        {/* Title — violet neon on hover */}
        <p
          className="text-lg sm:text-xl lg:text-2xl font-light text-gray-600 dark:text-gray-300 mb-6 cursor-default select-none"
          onMouseEnter={() => setGlowTitle(true)}
          onMouseLeave={() => setGlowTitle(false)}
          style={{
            textShadow: glowTitle
              ? isDark
                ? '0 0 8px rgba(167,139,250,0.95), 0 0 25px rgba(167,139,250,0.55), 0 0 55px rgba(167,139,250,0.25)'
                : '0 0 10px rgba(124,58,237,0.45), 0 0 28px rgba(124,58,237,0.2)'
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
        <p className="max-w-xl text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
          {t('hero.description')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">

          {/* Primary — neon bloom */}
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

          {/* Secondary — border + inner glow */}
          <a
            href="#contact"
            onMouseEnter={() => setHoverSecondary(true)}
            onMouseLeave={() => setHoverSecondary(false)}
            className="inline-flex items-center justify-center px-7 py-3 rounded-full text-sm font-medium"
            style={{
              border: `1px solid ${
                hoverSecondary
                  ? 'rgba(167,139,250,0.85)'
                  : isDark ? 'rgba(75,85,99,0.9)' : 'rgba(99,102,241,0.35)'
              }`,
              color: hoverSecondary
                ? isDark ? 'rgba(196,181,253,1)' : 'rgba(79,70,229,1)'
                : isDark ? 'rgba(209,213,219,1)' : 'rgba(55,65,81,1)',
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
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 mb-7"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {t('hero.cv_download')}
        </a>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <div className="h-px w-10 bg-gray-300/70 dark:bg-gray-700/60" />
          <SocialLinks size={20} baseClass="text-gray-400 dark:text-gray-500" />
          <div className="h-px w-10 bg-gray-300/70 dark:bg-gray-700/60" />
        </div>
      </div>

      {/* ── Bottom fade into About section (gray-50 / gray-900) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"
        style={{ zIndex: 9 }}
      />

      {/* ── Scroll indicator ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <span
          className="text-xs text-gray-400 dark:text-gray-500 font-mono"
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
