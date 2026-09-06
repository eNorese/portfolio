'use client'
import { useLanguage } from '@/contexts/LanguageContext'

export function CyberJourney() {
  const { locale } = useLanguage()
  const content = locale.cyber.visual
  return (
    <figure className="featured-visual cyber-journey">
      <div className="system-heading">
        <span className="status-dot" />
        <span>{content.label}</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div className="cyber-sources">
        {content.sources.map((source, index) => (
          <div key={source}>
            <span aria-hidden="true">{['◎', '↗', '▦'][index]}</span>
            {source}
          </div>
        ))}
      </div>
      <div className="cyber-connectors" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="campaign-preview">
        <div className="campaign-banner">
          <span>{content.campaign}</span>
          <span aria-hidden="true">↗</span>
        </div>
        <h4>{content.title}</h4>
        <div className="returning-applicant">
          <span aria-hidden="true">↺</span>
          <div>
            <strong>{content.returning}</strong>
            <p>{content.reuse}</p>
          </div>
        </div>
        <ol className="application-steps">
          {content.fields.map((field, index) => (
            <li key={field}>
              <span className="mono">0{index + 1}</span>
              <span>{field}</span>
              <span aria-hidden="true">{index === 2 ? '↗' : '✓'}</span>
            </li>
          ))}
        </ol>
        <p className="application-validation">{content.validated}</p>
      </div>
      <div className="flow-connector" aria-hidden="true">
        <i />
      </div>
      <div className="ats-destination">
        <span className="ats-icon" aria-hidden="true">
          ▤
        </span>
        <div>
          <strong>{content.destination}</strong>
          <p>{content.trace}</p>
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
