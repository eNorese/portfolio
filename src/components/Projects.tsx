'use client'

import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

function ExternalLinkIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}

type ProjectItem = {
  title: string
  description: string
  tags: readonly string[] | string[]
  live?: string
  liveDisabled?: boolean
  code?: string
  codeDisabled?: boolean
}

type CorporateProjectItem = ProjectItem & {
  category: string
  roleLabel: string
  role: string
  outcomes: {
    title: string
    description: string
  }[]
  storyTitle: string
  contextTitle: string
  context: string
  phaseLabel: string
  phases: {
    title: string
    description: string
    points: string[]
  }[]
  impactLabel: string
  impactTitle: string
  impact: string
}

function ProjectCard({ project, t }: { project: ProjectItem; t: (k: string) => string }) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card  = cardRef.current
    const glare = glareRef.current
    if (!card) return

    const r  = card.getBoundingClientRect()
    const x  = e.clientX - r.left
    const y  = e.clientY - r.top
    const rx = ((y - r.height / 2) / (r.height / 2)) * -9
    const ry = ((x - r.width  / 2) / (r.width  / 2)) *  9

    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`
    card.style.boxShadow = [
      '0 25px 55px rgb(var(--accent) / 0.18)',
      '0 10px 25px rgba(0,0,0,0.12)',
      'inset 0 0 0 1px rgb(var(--accent) / 0.22)',
    ].join(',')

    if (glare) {
      glare.style.background =
        `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.07) 0%, transparent 65%)`
    }
  }

  function onMouseLeave() {
    const card  = cardRef.current
    const glare = glareRef.current
    if (card) {
      card.style.transform = ''
      card.style.boxShadow = ''
    }
    if (glare) glare.style.background = 'none'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="motion-card group relative flex h-full flex-col bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 cursor-default"
      style={{
        transition: 'transform 0.5s ease, box-shadow 0.4s ease',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glare overlay */}
      <div
        ref={glareRef}
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ transition: 'background 0.12s ease', zIndex: 1 }}
      />

      {/* Card content */}
      <div className="relative flex flex-col flex-1" style={{ zIndex: 2 }}>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors duration-200">
          {project.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-800">
          {project.live !== undefined && (
            project.liveDisabled ? (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed select-none">
                <ExternalLinkIcon />
                {t('projects.view_live')}
              </span>
            ) : (
              <a
                href={project.live}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-accent transition-colors duration-200"
              >
                <ExternalLinkIcon />
                {t('projects.view_live')}
              </a>
            )
          )}
          {project.code !== undefined && (
            project.codeDisabled ? (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed select-none">
                <GitHubIcon />
                {t('projects.view_code')}
              </span>
            ) : (
              <a
                href={project.code}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-accent transition-colors duration-200"
              >
                <GitHubIcon />
                {t('projects.view_code')}
              </a>
            )
          )}
        </div>
      </div>
    </div>
  )
}

function CorporateProjectCard({
  project,
  index,
  total,
  t,
}: {
  project: CorporateProjectItem
  index: number
  total: number
  t: (key: string) => string
}) {
  const caseNumber = String(index + 1).padStart(2, '0')

  return (
    <article
      id={`corporate-case-${index + 1}`}
      className="motion-card scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-accent/[0.06] dark:border-gray-800 dark:bg-gray-900"
      data-reveal
      data-reveal-direction={index % 2 === 0 ? 'left' : 'right'}
      data-reveal-delay={String(Math.min(index, 3))}
    >
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-accent">{caseNumber}</span>
          <span className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {t('projects.case_label')}
          </span>
        </div>
        <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
          {caseNumber} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="p-6 sm:p-8 lg:p-10">
          <p className="mb-3 text-xs font-mono uppercase tracking-widest text-accent">
            {project.category}
          </p>
          <h3 className="max-w-2xl text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {project.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
            {project.description}
          </p>

          <div className="mt-7 border-l-2 border-accent/40 pl-4">
            <p className="text-xs font-mono uppercase tracking-widest text-accent">
              {project.roleLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {project.role}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <aside className="border-t border-gray-200 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40 sm:p-8 lg:border-l lg:border-t-0">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {t('projects.outcomes_label')}
          </p>
          <div className="mt-5 divide-y divide-gray-200 dark:divide-gray-800">
            {project.outcomes.map((outcome, outcomeIndex) => (
              <div key={outcome.title} className="grid grid-cols-[32px_1fr] gap-3 py-4 first:pt-0 last:pb-0">
                <span className="font-mono text-xs text-accent">0{outcomeIndex + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{outcome.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{outcome.description}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <details className="group/story border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950/50">
        <summary className="cursor-pointer list-none px-6 py-6 marker:content-none sm:px-8 lg:px-10 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-lg text-accent transition-transform duration-300 group-open/story:rotate-45" aria-hidden="true">+</span>
              <div className="min-w-0">
                <p className="text-xs font-mono uppercase tracking-widest text-accent">
                  {t('projects.full_story_label')} · {project.phases.length} {t('projects.chapters_label')}
                </p>
                <p className="mt-1 font-semibold text-gray-900 transition-colors group-hover/story:text-accent dark:text-white">
                  {project.storyTitle}
                </p>
              </div>
            </div>
            <span className="hidden shrink-0 text-xs font-mono text-gray-400 sm:block dark:text-gray-500">
              {t('projects.expand_label')} ↓
            </span>
          </div>
          <div className="mt-5 grid gap-2 pl-14 sm:grid-cols-2 lg:grid-cols-4">
            {project.phases.map((phase, phaseIndex) => (
              <span key={phase.title} className="truncate text-xs text-gray-500 dark:text-gray-400">
                <span className="mr-1.5 font-mono text-accent">0{phaseIndex + 1}</span>
                {phase.title}
              </span>
            ))}
          </div>
        </summary>

        <div className="border-t border-gray-200 px-6 py-8 dark:border-gray-800 sm:px-8 lg:px-10 lg:py-10">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-accent">{t('projects.context_label')}</p>
            <h4 className="mt-2 font-semibold text-gray-900 dark:text-white">{project.contextTitle}</h4>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{project.context}</p>
          </div>

          <ol className="relative mt-9 space-y-8 border-l border-gray-200 pl-7 dark:border-gray-800 sm:pl-9">
            {project.phases.map((phase, phaseIndex) => (
              <li key={phase.title} className="relative">
                <span className="absolute -left-[43px] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-accent/30 bg-white font-mono text-[10px] text-accent dark:bg-gray-950 sm:-left-[51px]">
                  0{phaseIndex + 1}
                </span>
                <p className="text-xs font-mono uppercase tracking-widest text-accent">
                  {project.phaseLabel} {String(phaseIndex + 1).padStart(2, '0')}
                </p>
                <h4 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{phase.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{phase.description}</p>
                <ul className="mt-4 grid gap-2 text-sm text-gray-600 dark:text-gray-400 lg:grid-cols-2">
                  {phase.points.map((point) => (
                    <li key={point} className="flex gap-2 rounded-lg border border-gray-200/80 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-gray-900/60">
                      <span className="text-accent" aria-hidden="true">—</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-9 rounded-xl border border-accent/25 bg-accent/[0.06] p-6 sm:p-8">
            <p className="text-xs font-mono uppercase tracking-widest text-accent">{project.impactLabel}</p>
            <h4 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{project.impactTitle}</h4>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{project.impact}</p>
          </div>
        </div>
      </details>
    </article>
  )
}

// ── Section ──────────────────────────────────────────────────────────
export function Projects() {
  const { locale, t } = useLanguage()

  return (
    <section id="proyectos" className="section-atmosphere section-atmosphere-reverse relative py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-14" data-reveal>
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
            02 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('projects.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('projects.subtitle')}</p>
        </div>

        <div className="mb-20">
          <div className="mb-7" data-reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-mono uppercase tracking-widest text-accent">
                  {t('projects.corporate_kicker')}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('projects.corporate_title')}
                </h3>
              </div>
              <span className="w-fit rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-mono text-accent">
                {locale.projects.corporate_items.length} {t('projects.case_studies_label')}
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {t('projects.corporate_subtitle')}
            </p>
          </div>

          <nav aria-label={t('projects.corporate_index_label')} className="mb-8 grid gap-3 md:grid-cols-3" data-reveal data-reveal-delay="1">
            {locale.projects.corporate_items.map((project, index) => (
              <a
                key={project.title}
                href={`#corporate-case-${index + 1}`}
                className="motion-card group flex min-h-28 flex-col justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.06] dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-accent">0{index + 1}</span>
                  <span className="text-xs text-gray-400 transition-transform duration-300 group-hover:translate-x-1 dark:text-gray-500">→</span>
                </div>
                <div>
                  <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">{project.title}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {project.phases.length} {t('projects.chapters_label')}
                  </p>
                </div>
              </a>
            ))}
          </nav>

          <div className="space-y-8">
            {locale.projects.corporate_items.map((project, index) => (
              <CorporateProjectCard
                key={project.title}
                project={project as CorporateProjectItem}
                index={index}
                total={locale.projects.corporate_items.length}
                t={t}
              />
            ))}
          </div>
        </div>

        <div className="mb-7" data-reveal>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('projects.other_title')}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('projects.other_subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {locale.projects.items.map((project, i) => (
            <div key={i} data-reveal data-reveal-delay={String((i % 3) + 1)}>
              <ProjectCard project={project as ProjectItem} t={t} />
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
