'use client'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Arrow, SectionHeading } from '@/components/PortfolioUI'
import social from '@/config/social.json'
import { FeaturedProject } from '@/components/FeaturedProject'

const categories = ['all', 'fullstack', 'backend', 'cloud'] as const
const projectCategories = [
  'fullstack',
  'fullstack',
  'backend',
  'cloud',
  'cloud',
  'backend',
]
function ProjectVisual({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="project-visual schema-visual" aria-hidden="true">
        <div className="visual-toolbar">
          <span>◈ relational model</span>
          <span>schema / public</span>
        </div>
        <div className="schema-canvas">
          <svg viewBox="0 0 500 220" preserveAspectRatio="none">
            <path
              d="M185 78H253V141H308M185 110H228V175H308"
              fill="none"
              stroke="#98ad87"
              strokeWidth="1.5"
            />
            <circle cx="253" cy="141" r="3" fill="#c5ef77" />
          </svg>
          <div className="db-table db-users">
            <b>
              ▤ users <span>•••</span>
            </b>
            <p>
              <i>⌑</i> id <small>uuid</small>
            </p>
            <p>
              name <small>varchar</small>
            </p>
            <p>
              email <small>varchar</small>
            </p>
          </div>
          <div className="db-table db-projects">
            <b>
              ▤ projects <span>•••</span>
            </b>
            <p>
              <i>⌑</i> id <small>uuid</small>
            </p>
            <p>
              user_id <small>uuid ↗</small>
            </p>
            <p>
              title <small>varchar</small>
            </p>
          </div>
          <span className="canvas-coordinate">
            x: 128 &nbsp; y: 64 &nbsp; / &nbsp; 100%
          </span>
        </div>
      </div>
    )
  if (index === 1)
    return (
      <div className="project-visual ai-visual" aria-hidden="true">
        <div className="ai-window">
          <div className="visual-toolbar">
            <span>✳ EuforIA</span>
            <span>Claude · GPT · Gemini</span>
          </div>
          <div className="ai-body">
            <span className="ai-spark">✳</span>
            <strong>
              One space.
              <br />
              Multiple perspectives.
            </strong>
            <div className="model-chips">
              <span>Claude</span>
              <span>GPT-4o</span>
              <span>Gemini</span>
            </div>
            <div className="fake-prompt">
              Ask. Compare. Create.<span>↑</span>
            </div>
          </div>
        </div>
      </div>
    )
  const icons = ['', '', '⌘', '△', '↔', '{ }']
  const captions = [
    '',
    '',
    'IDENTITY / ACCESS',
    'LEARN / BUILD / CERTIFY',
    'EVENT-DRIVEN / REALTIME',
    'TYPESAFE / REUSABLE',
  ]
  return (
    <div
      className={`project-visual compact-visual visual-${index}`}
      aria-hidden="true"
    >
      <span className="compact-grid" />
      <span className="compact-icon">{icons[index]}</span>
      <span className="compact-caption">{captions[index]}</span>
      <span className="visual-corner">0{index + 1} ↗</span>
    </div>
  )
}
export function Projects() {
  const { locale, t } = useLanguage()
  const [filter, setFilter] = useState<string>('all')
  const projects = locale.projects.items
    .map((project, index) => ({ ...project, index }))
    .filter(
      (project) =>
        filter === 'all' || projectCategories[project.index] === filter,
    )
  return (
    <section id="proyectos" className="portfolio-section">
      <div className="shell">
        <SectionHeading
          number="01"
          label={t('nav.projects')}
          title={t('design.projects_title')}
          description={t('design.projects_description')}
          action={
            social.github.enabled && (
              <a
                href={social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="button-text"
              >
                GitHub
                <Arrow diagonal />
              </a>
            )
          }
        />
        <FeaturedProject />
        <h3 className="other-projects-title">
          {t('design.more_projects')}
          <span aria-hidden="true">↙</span>
        </h3>
        <div
          className="project-filter"
          role="group"
          aria-label={t('design.filter_projects')}
        >
          {categories.map((category) => (
            <button
              key={category}
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
            >
              {t(`design.filters.${category}`)}
              {category === 'all' && (
                <span>
                  {String(locale.projects.items.length).padStart(2, '0')}
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="sr-only" role="status">
          {projects.length} {t('design.results')}
        </p>
        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <ProjectVisual index={project.index} />
              <div className="project-content">
                <div className="project-kicker">
                  <span>
                    {t(`design.filters.${projectCategories[project.index]}`)}
                  </span>
                  <span>{t('design.concept_visual')}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <details className="project-details">
                  <summary>
                    {t('design.explore_project')}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <div>
                    <p>{t(`design.project_notes.${project.index}`)}</p>
                    <a className="button-text" href="#contacto">
                      {t('design.discuss_project')}
                      <Arrow diagonal />
                    </a>
                  </div>
                </details>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
