'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { SectionHeading } from '@/components/PortfolioUI'
export function Experience() {
  const { locale, t } = useLanguage()
  return (
    <section id="experiencia" className="portfolio-section">
      <div className="shell">
        <SectionHeading
          number="03"
          label={t('nav.experience')}
          title={t('design.experience_title')}
          description={t('experience.subtitle')}
        />
        <div className="experience-list">
          {locale.experience.jobs.map((job, index) => (
            <article className="experience-row" key={job.company}>
              <div className="job-period">
                <span className={index === 0 ? 'job-dot current' : 'job-dot'} />
                <span>{job.period}</span>
                {index === 0 && (
                  <span className="current-label">{t('design.current')}</span>
                )}
              </div>
              <div className="job-content">
                <p className="eyebrow">{job.company}</p>
                <h3>{job.role}</h3>
                <p>{job.description}</p>
                <div className="tag-list">
                  {job.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
