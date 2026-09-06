'use client'
import { useEffect } from 'react'
import { useMotion } from '@/components/MotionProvider'

const revealSelector =
  '.section-heading, .project-card, .experience-row, .service-card, .skill-row, .about-note, .about-copy, .stats-strip > div, .contact-grid, .faq-list details, .featured-project, .case-phase, .case-impact'
const hoverSelector =
  '.project-card, .service-card, .about-note, .featured-visual'
export function MotionEffects() {
  const { active } = useMotion()
  useEffect(() => {
    if (!active) return
    const seen = new Set<HTMLElement>()
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-reveal', 'visible')
          reveal.unobserve(entry.target)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    )
    function discover() {
      seen.forEach((element) => {
        if (!element.isConnected) {
          reveal.unobserve(element)
          seen.delete(element)
        }
      })
      document
        .querySelectorAll<HTMLElement>(revealSelector)
        .forEach((element) => {
          if (seen.has(element)) return
          if (element.parentElement?.closest('details:not([open])')) return
          seen.add(element)
          // Only enhance offscreen content: SSR and in-view content stay readable.
          if (element.getBoundingClientRect().top < innerHeight - 25) return
          const siblings = element.parentElement
            ? Array.from(element.parentElement.children)
            : []
          element.style.setProperty(
            '--reveal-delay',
            `${Math.min(siblings.indexOf(element) % 3, 2) * 75}ms`,
          )
          element.dataset.reveal = 'pending'
          reveal.observe(element)
        })
    }
    discover()
    const mutations = new MutationObserver(discover)
    const main = document.getElementById('main-content')
    if (main)
      mutations.observe(main, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['open'],
      })
    let scrollFrame = 0,
      pointerFrame = 0
    let current: HTMLElement | null = null
    function updateScroll() {
      const length = document.documentElement.scrollHeight - innerHeight
      document.documentElement.style.setProperty(
        '--scroll-progress',
        String(length > 0 ? Math.max(0, Math.min(1, scrollY / length)) : 0),
      )
      scrollFrame = 0
    }
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll)
    }
    const resetHover = () => {
      if (current) {
        current.removeAttribute('data-hover')
        current.style.removeProperty('--tilt-x')
        current.style.removeProperty('--tilt-y')
      }
      current = null
    }
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(hoverSelector)
          : null
      if (target !== current) {
        resetHover()
        current = target
      }
      cancelAnimationFrame(pointerFrame)
      if (!target) return
      const x = event.clientX,
        y = event.clientY
      pointerFrame = requestAnimationFrame(() => {
        if (target !== current) return
        const rect = target.getBoundingClientRect()
        const px = (x - rect.left) / rect.width,
          py = (y - rect.top) / rect.height
        target.style.setProperty('--pointer-x', `${px * 100}%`)
        target.style.setProperty('--pointer-y', `${py * 100}%`)
        target.style.setProperty('--tilt-x', `${(py - 0.5) * -4}deg`)
        target.style.setProperty('--tilt-y', `${(px - 0.5) * 4}deg`)
        target.dataset.hover = 'true'
      })
    }
    const onVisibility = () => {
      document.documentElement.dataset.documentHidden = String(document.hidden)
      if (document.hidden) resetHover()
    }
    updateScroll()
    const layoutObserver = new ResizeObserver(onScroll)
    if (main) layoutObserver.observe(main)
    document.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    document.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('pointerleave', resetHover)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      reveal.disconnect()
      mutations.disconnect()
      layoutObserver.disconnect()
      cancelAnimationFrame(scrollFrame)
      cancelAnimationFrame(pointerFrame)
      resetHover()
      seen.forEach((element) => {
        element.removeAttribute('data-reveal')
        element.style.removeProperty('--reveal-delay')
      })
      document.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', resetHover)
      document.removeEventListener('visibilitychange', onVisibility)
      document.documentElement.style.removeProperty('--scroll-progress')
      delete document.documentElement.dataset.documentHidden
    }
  }, [active])
  return <div className="reading-progress" aria-hidden="true" />
}
