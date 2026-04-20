'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const SKILLS_DATA = {
  frontend: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
  backend: ['Node.js', 'TypeScript', 'Express', 'Python', 'C# (.NET)', 'PostgreSQL', 'SQL Server', 'CosmosDB', 'MongoDB', 'Redis'],
  cloud: ['Microsoft Azure', 'Azure Functions', 'Azure Service Bus', 'Azure SignalR', 'Azure Blob Storage', 'GitHub Actions', 'Docker'],
  tools: ['Claude API', 'GPT-4o', 'Gemini', 'JWT / JWKS', 'Git', 'Linux'],
} as const

function parseMetric(metric: string): { num: number; suffix: string } {
  const match = metric.match(/^(\d+)(.*)$/)
  if (!match) return { num: 0, suffix: metric }
  return { num: parseInt(match[1], 10), suffix: match[2] }
}

function StoryCard({
  metric,
  label,
  description,
}: {
  metric: string
  label: string
  description: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [count, setCount] = useState(0)
  const { num, suffix } = parseMetric(metric)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || num === 0) return
    const duration = 1400
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * num))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, num])

  return (
    <div
      ref={ref}
      className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
    >
      <div className="text-3xl font-bold tabular-nums text-accent mb-1 transition-transform duration-300 group-hover:scale-110">
        {count}{suffix}
      </div>
      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{label}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

export function Skills() {
  const { locale, t } = useLanguage()
  const stories = locale.skills.stories
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  return (
    <section id="skills" className="relative py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
            03 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('skills.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('skills.subtitle')}</p>
        </div>

        {/* Skill category cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {(Object.keys(SKILLS_DATA) as Array<keyof typeof SKILLS_DATA>).map((category) => (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                {t(`skills.categories.${category}`)}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {SKILLS_DATA[category].map((skill) => {
                  const id = `${category}:${skill}`
                  const isHovered = hoveredBadge === id
                  const isDimmed = hoveredBadge?.startsWith(`${category}:`) && !isHovered
                  return (
                    <span
                      key={skill}
                      onMouseEnter={() => setHoveredBadge(id)}
                      onMouseLeave={() => setHoveredBadge(null)}
                      className={`text-xs px-2.5 py-1 rounded-md cursor-default select-none transition-all duration-200 ${
                        isHovered
                          ? 'bg-accent text-white scale-105 shadow-sm shadow-accent/30 -translate-y-px'
                          : isDimmed
                          ? 'bg-gray-100 dark:bg-gray-700/60 text-gray-400 dark:text-gray-500 scale-95 opacity-50'
                          : 'bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {skill}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
          {t('skills.stories_title')}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stories.map((story, index) => (
            <StoryCard
              key={index}
              metric={story.metric}
              label={story.label}
              description={story.description}
            />
          ))}
        </div>
      </div>

      {/* fade → Projects (white / gray-950) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-white dark:to-gray-950" />
    </section>
  )
}
