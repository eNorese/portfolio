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
      className="group relative flex flex-col bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 cursor-default"
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

// ── Section ──────────────────────────────────────────────────────────
export function Projects() {
  const { locale, t } = useLanguage()

  return (
    <section id="proyectos" className="relative py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
            04 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('projects.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('projects.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {locale.projects.items.map((project, i) => (
            <ProjectCard key={i} project={project as ProjectItem} t={t} />
          ))}
        </div>
      </div>

      {/* fade → Contact (gray-50 / gray-900) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900" />
    </section>
  )
}
