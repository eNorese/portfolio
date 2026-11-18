'use client'

import { useEffect, useRef } from 'react'

export function MotionOrchestrator() {
  const progressRef = useRef<HTMLSpanElement>(null)

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

    let frame = 0
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`
      }
      frame = 0
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateProgress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // The bar already starts at scaleX(0). Avoid forcing a full layout read
    // during hydration; restored pages still receive an initial async update.
    if (window.scrollY > 0) onScroll()

    return () => {
      observer?.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
      root.classList.remove('motion-ready')
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={progressRef} />
    </div>
  )
}
