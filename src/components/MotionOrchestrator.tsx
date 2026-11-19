'use client'

import { useEffect } from 'react'

export function MotionOrchestrator() {
  useEffect(() => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    const showEverything = () => {
      revealItems.forEach((item) => item.classList.add('is-visible'))
    }

    let observer: IntersectionObserver | null = null

    if (reducedMotion.matches) {
      showEverything()
    } else {
      root.classList.add('motion-ready')
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const item = entry.target as HTMLElement
            item.classList.add('is-visible')
            window.setTimeout(() => item.removeAttribute('data-reveal-delay'), 1100)
            observer?.unobserve(entry.target)
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
      )

      revealItems.forEach((item) => observer?.observe(item))
    }

    return () => {
      observer?.disconnect()
      root.classList.remove('motion-ready')
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span />
    </div>
  )
}
