'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { SectionHeading, Arrow } from '@/components/PortfolioUI'
import social from '@/config/social.json'
export function About() {
  const { t } = useLanguage()
  return (
    <section id="sobre-mi" className="portfolio-section section-tinted">
      <div className="shell">
        <SectionHeading
          number="02"
          label={t('nav.about')}
          title={t('design.about_title')}
        />
        <div className="about-grid">
          <div className="about-note">
            <span className="note-symbol" aria-hidden="true">
              ✳
            </span>
            <p>{t('design.philosophy')}</p>
            <span className="mono">— Enzo Norese</span>
            <div className="note-bottom">
              {t('design.augmented_engineering')}
              <Arrow diagonal />
            </div>
          </div>
          <div className="about-copy">
            <p className="lead-copy">{t('design.about_intro')}</p>
            <p>{t('about.bio_1')}</p>
            <p>{t('design.about_journey')}</p>
            {social.linkedin.enabled && (
              <a
                href={social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="button-text"
              >
                {t('design.linkedin')}
                <Arrow diagonal />
              </a>
            )}
          </div>
        </div>
        <div className="stats-strip">
          {['years', 'projects', 'technologies'].map((key) => (
            <div key={key}>
              <strong>{t(`about.${key}_value`)}</strong>
              <span>{t(`about.stats.${key}`)}</span>
            </div>
          ))}
          <div className="stats-location">
            <span className="status-dot" />
            <span>
              Santiago, Chile
              <br />
              {t('design.remote')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
