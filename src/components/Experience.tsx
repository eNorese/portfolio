'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// ── Minimal scroll-reveal hook ────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

// ── Single job entry ──────────────────────────────────────────────────
type Job = {
  role: string
  company: string
  period: string
  duration: string
  location: string
  description: string
  tags: readonly string[]
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const { ref, visible } = useReveal(0.1)
  const delay = index * 160  // stagger

  return (
    <div ref={ref} className="relative">
      {/* Timeline dot */}
      <span
        className="absolute -left-[calc(1.5rem+1px)] sm:-left-[calc(2rem+1px)] top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-white dark:border-gray-950 ring-2 ring-accent/30"
        style={{
          transform: visible ? 'scale(1)' : 'scale(0)',
          transition: `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${delay + 220}ms`,
        }}
      />

      {/* Card */}
      <div
        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-accent/30 transition-colors duration-200"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-28px)',
          transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-snug">
              {job.role}
            </h3>
            <p className="text-sm text-accent font-medium mt-0.5">
              {job.company}
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-start sm:items-end gap-0.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{job.period}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{job.duration}</span>
          </div>
        </div>

        {/* Location */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {job.location}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────
export function Experience() {
  const { locale, t } = useLanguage()
  const jobs = locale.experience.jobs

  const header = useReveal(0.2)

  const lineRef  = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const track = trackRef.current
      const line  = lineRef.current
      if (!track || !line) return

      const rect = track.getBoundingClientRect()
      const vh   = window.innerHeight

      const progress = Math.max(0, Math.min(1,
        (vh * 0.85 - rect.top) / (rect.height * 0.9)
      ))

      line.style.transform = `scaleY(${progress})`
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          update()
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="experience" className="relative py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          ref={header.ref}
          className="mb-14"
          style={{
            opacity: header.visible ? 1 : 0,
            transform: header.visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
            02 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('experience.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('experience.subtitle')}</p>
        </div>

        {/* Timeline track */}
        <div ref={trackRef} className="relative pl-6 sm:pl-8 space-y-10">

          {/* Static track line */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800" />
          {/* Animated fill line */}
          <div
            ref={lineRef}
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/70 to-accent/40 origin-top"
            style={{ transform: 'scaleY(0)', willChange: 'transform' }}
          />

          {jobs.map((job, index) => (
            <JobCard key={index} job={job} index={index} />
          ))}
        </div>
      </div>

      {/* fade → Skills (gray-50 / gray-900) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900" />
    </section>
  )
}
