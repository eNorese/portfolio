'use client'

import { useLanguage } from '@/contexts/LanguageContext'

type ProjectItem = {
  title: string
  description: string
  tags: readonly string[] | string[]
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

function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <article className="motion-card group flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-gray-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <h3 className="font-semibold text-gray-900 transition-colors duration-200 group-hover:text-accent dark:text-white">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {project.description}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs text-accent">
            {tag}
          </span>
        ))}
      </div>
    </article>
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
            01 —
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

        <div className="grid sm:grid-cols-2 gap-4">
          {locale.projects.items.map((project, i) => (
            <div key={i} data-reveal data-reveal-delay={String((i % 3) + 1)}>
              <ProjectCard project={project as ProjectItem} />
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
