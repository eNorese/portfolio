'use client'
import { useRef } from 'react'
import { CyberJourney } from '@/components/CyberJourney'
import { useLanguage } from '@/contexts/LanguageContext'
import { Arrow } from '@/components/PortfolioUI'

export function FeaturedProject({
  project = 'teamwork',
}: {
  project?: 'teamwork' | 'cyber'
}) {
  const { locale, t } = useLanguage()
  const content = locale[project]
  const storyRef = useRef<HTMLDetailsElement>(null)
  return (
    <article className={`featured-project featured-${project}`} id={project}>
      <div className="featured-top">
        <span className="eyebrow">
          <span className="status-dot" /> {content.eyebrow}
        </span>
        <span className="mono">{content.project_label}</span>
      </div>
      <div className="featured-grid">
        <div className="featured-copy">
          <p className="featured-category">{content.category}</p>
          {content.status && (
            <p className="case-status">
              <span className="status-dot" />
              {content.status}
            </p>
          )}
          <h3>{content.title}</h3>
          <p className="featured-intro">{content.intro}</p>
          <div className="featured-role">
            <span>{content.role_label}</span>
            <p>{content.role}</p>
          </div>
          <div className="tag-list">
            {content.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <a
            href={`#${project}-story`}
            className="button-primary"
            onClick={() => {
              if (storyRef.current) storyRef.current.open = true
            }}
          >
            {content.read_case}
            <Arrow diagonal />
          </a>
        </div>
        {project === 'cyber' ? <CyberJourney /> : <TeamworkArchitecture />}
      </div>
      <div className="featured-outcomes">
        {content.outcomes.map((item, index) => (
          <div key={item.title}>
            <span className="outcome-index">0{index + 1}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <a className="case-related" href={`#${content.related_id}`}>
        {content.related_label}
        <Arrow diagonal />
      </a>
      <details ref={storyRef} className="case-study" id={`${project}-story`}>
        <summary>
          {content.story_title}
          <span className="case-read-time">{content.read_time}</span>
          <span className="faq-plus" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="case-study-content">
          <div className="case-context">
            <h4>{content.context_title}</h4>
            <p>{content.context}</p>
          </div>
          <div className="case-phases">
            {content.phases.map((phase, index) => (
              <article className="case-phase" key={phase.title}>
                <div className="phase-marker">
                  <span>0{index + 1}</span>
                </div>
                <div>
                  <p className="eyebrow">
                    {content.phase_label} 0{index + 1}
                  </p>
                  <h4>{phase.title}</h4>
                  <p>{phase.description}</p>
                  <ul>
                    {phase.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <div className="case-impact">
            <p className="eyebrow">{content.impact_label}</p>
            <h4>{content.impact_title}</h4>
            <p>{content.impact}</p>
          </div>
          <a className="button-text" href="#contacto">
            {t('design.discuss_project')}
            <Arrow diagonal />
          </a>
        </div>
      </details>
    </article>
  )
}

function TeamworkArchitecture() {
  const { locale } = useLanguage()
  const content = locale.teamwork
  return (
    <div className="featured-visual">
      <div className="system-heading">
        <span className="status-dot" />
        <span>{content.system_label}</span>
        <span>↗</span>
      </div>
      <div className="system-flow" aria-label={content.flow_label}>
        <div className="flow-origin">
          <span className="flow-icon" aria-hidden="true">
            ▤
          </span>
          <div>
            <span className="mono">01 / INPUT</span>
            <strong>{content.flow_input}</strong>
          </div>
        </div>
        <div className="flow-connector" aria-hidden="true">
          <i />
        </div>
        <div className="flow-core">
          <span className="mono">02 / CORE</span>
          <strong>Azure Functions</strong>
          <span>TypeScript · Repository · DI</span>
          <span className="core-corner" aria-hidden="true">
            ⌘
          </span>
        </div>
        <div className="flow-branches" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="flow-services">
          {content.flow_services.map((service, index) => (
            <div key={service}>
              <span className="flow-service-icon" aria-hidden="true">
                {['▱', '≋', '↔'][index]}
              </span>
              <strong>{service}</strong>
            </div>
          ))}
        </div>
        <div className="system-tests">
          <span aria-hidden="true">✓</span>
          {content.monitoring}
          <span className="signal-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
      <p className="system-caption">{content.diagram_note}</p>
    </div>
  )
}
