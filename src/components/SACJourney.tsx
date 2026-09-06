'use client'
import { useLanguage } from '@/contexts/LanguageContext'

export function SACJourney() {
  const { locale } = useLanguage()
  const content = locale.sac.visual
  return (
    <figure className="featured-visual sac-journey">
      <div className="system-heading">
        <span className="status-dot" />
        <span>{content.label}</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div className="sac-entry">
        <span aria-hidden="true">↳</span>
        {content.entry}
      </div>
      <div className="sac-bot">
        <span className="sac-bot-icon" aria-hidden="true">
          ⌘
        </span>
        <div>
          <strong>{content.bot}</strong>
          <p>{content.bot_note}</p>
        </div>
      </div>
      <div className="sac-fork" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="sac-paths">
        <div className="sac-resolved">
          <span aria-hidden="true">✓</span>
          <strong>{content.resolved}</strong>
        </div>
        <div className="sac-escalated">
          <p className="sac-route-label">{content.escalation}</p>
          <strong>{content.ticket}</strong>
          <p>{content.ticket_note}</p>
          <div className="sac-sla">
            <span aria-hidden="true">◷</span>
            {content.sla}
          </div>
        </div>
      </div>
      <div className="sac-merge" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="sac-survey">
        <span aria-hidden="true">◎</span>
        <div>
          <strong>{content.survey}</strong>
          <p>{content.survey_note}</p>
        </div>
      </div>
      <ol className="sac-lifecycle">
        {content.stages.map((stage) => (
          <li key={stage}>{stage}</li>
        ))}
      </ol>
      <div className="sac-data">
        <span aria-hidden="true">≋</span>
        <div>
          <strong>{content.data}</strong>
          <p>{content.sync}</p>
        </div>
        <span className="signal-bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
      <figcaption className="system-caption">{content.caption}</figcaption>
    </figure>
  )
}
