'use client'
import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { useMotion } from '@/components/MotionProvider'

const fragments = [
  'async function',
  'await deploy()',
  'SELECT * FROM',
  'Azure Functions',
  'repository.find()',
  'git push',
  '200 OK',
  'interface Service',
  'Promise<T>',
  'queue.process()',
  'return result',
  'TypeScript',
  'jest.run()',
  'BlobStorage',
  'const engineer =',
  'cloud.connect()',
]
type Meteor = {
  x: number
  y: number
  age: number
  speed: number
  length: number
}

// One delta-time loop; pauses when the hero is offscreen, the tab is hidden,
// or motion is disabled. Resolution and particle counts are capped on mobile.
export function HeroSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const { active } = useMotion()
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const hero = canvas?.closest('section')
    if (!canvas || !context || !hero) return
    const ctx = context
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
      .trim()
      .split(/\s+/)
      .join(',')
    let width = 1,
      height = 1,
      frame = 0,
      last = 0,
      elapsed = 0,
      nextMeteor = 0.4,
      visible = true
    let stars: { x: number; y: number; r: number; phase: number }[] = []
    let drops: {
      x: number
      y: number
      speed: number
      text: string
      alpha: number
    }[] = []
    let meteors: Meteor[] = []
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
    function resize() {
      if (!canvas) return
      width = canvas.clientWidth
      height = canvas.clientHeight
      const reducedDensity = width < 768
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: reducedDensity ? 45 : 105 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
      }))
      drops = Array.from({ length: reducedDensity ? 14 : 34 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 9 + Math.random() * 16,
        text: fragments[i % fragments.length],
        alpha: 0.14 + Math.random() * 0.15,
      }))
      draw(0)
    }
    function draw(dt: number) {
      elapsed += dt
      pointer.x += (pointer.targetX - pointer.x) * Math.min(1, dt * 4)
      pointer.y += (pointer.targetY - pointer.y) * Math.min(1, dt * 4)
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.translate(pointer.x, pointer.y)
      for (const star of stars) {
        const alpha =
          0.2 + 0.35 * (0.5 + 0.5 * Math.sin(elapsed * 0.8 + star.phase))
        ctx.fillStyle = `rgba(${color},${alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.font = '11px ui-monospace, Consolas, monospace'
      for (const drop of drops) {
        drop.y += drop.speed * dt
        if (drop.y > height + 20) drop.y = -20
        ctx.fillStyle = `rgba(${color},${drop.alpha})`
        ctx.fillText(drop.text, drop.x, drop.y)
      }
      if (dt && elapsed >= nextMeteor) {
        meteors.push({
          x: Math.random() * width * 0.85,
          y: Math.random() * height * 0.4,
          age: 0,
          speed: 370 + Math.random() * 190,
          length: 90 + Math.random() * 90,
        })
        nextMeteor = elapsed + 1.8 + Math.random() * 2
      }
      for (const meteor of meteors) {
        meteor.age += dt
        meteor.x += meteor.speed * dt
        meteor.y += meteor.speed * 0.48 * dt
        const alpha = Math.max(
          0,
          Math.min(1, meteor.age * 5, (1.6 - meteor.age) * 2),
        )
        const tailX = meteor.x - meteor.length,
          tailY = meteor.y - meteor.length * 0.48
        const trail = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y)
        trail.addColorStop(0, `rgba(${color},0)`)
        trail.addColorStop(1, `rgba(${color},${alpha * 0.8})`)
        ctx.strokeStyle = trail
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(meteor.x, meteor.y)
        ctx.stroke()
        ctx.fillStyle = `rgba(${color},${alpha})`
        ctx.beginPath()
        ctx.arc(meteor.x, meteor.y, 1.8, 0, Math.PI * 2)
        ctx.fill()
      }
      meteors = meteors.filter((meteor) => meteor.age < 1.6)
      ctx.restore()
    }
    function tick(now: number) {
      // Cap at 30fps, preserving speed on high-refresh-rate displays.
      if (now - last >= 1000 / 30) {
        draw(Math.min((now - last) / 1000, 0.065))
        last = now
      }
      frame = requestAnimationFrame(tick)
    }
    function sync() {
      cancelAnimationFrame(frame)
      const running = active && visible && !document.hidden
      hero?.setAttribute('data-sky-active', String(running))
      if (running) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(hero)
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(canvas)
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !active) return
      const bounds = hero.getBoundingClientRect()
      pointer.targetX = (event.clientX - bounds.left - width / 2) * -0.018
      pointer.targetY = (event.clientY - bounds.top - height / 2) * -0.018
    }
    const leave = () => {
      pointer.targetX = 0
      pointer.targetY = 0
    }
    hero.addEventListener('pointermove', move)
    hero.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', sync)
    resize()
    sync()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizeObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
      hero.removeAttribute('data-sky-active')
    }
  }, [active, resolvedTheme])
  return <canvas ref={canvasRef} className="hero-sky" aria-hidden="true" />
}
