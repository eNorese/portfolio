'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { SectionHeading, Arrow } from '@/components/PortfolioUI'
export function Services() {
  const { locale, t } = useLanguage()
  const symbols = ['✳', '⌘', '△', '↔', '↑', '◎']
  return (
    <section id="servicios" className="portfolio-section section-tinted">
      <div className="shell">
        <SectionHeading
          number="04"
          label={t('nav.services')}
          title={t('design.services_title')}
          description={t('services.intro')}
        />
        <div className="services-grid">
          {locale.services.items.map((item, index) => (
            <article className="service-card" key={item.title}>
              <div className="service-top">
                <span aria-hidden="true">{symbols[index]}</span>
                <span className="mono">0{index + 1}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <div className="services-cta">
          <p>{t('services.cta_title')}</p>
          <a className="button-text" href="#contacto">
            {t('services.cta_button')}
            <Arrow diagonal />
          </a>
        </div>
      </div>
    </section>
  )
}
