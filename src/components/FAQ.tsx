'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { SectionHeading } from '@/components/PortfolioUI'
export function FAQ() {
  const { locale, t } = useLanguage()
  return (
    <section id="faq" className="portfolio-section section-tinted">
      <div className="shell faq-grid">
        <SectionHeading
          number="06"
          label={t('nav.faq')}
          title={t('design.faq_title')}
          description={t('faq.subtitle')}
        />
        <div className="faq-list">
          {locale.faq.items.map((item, index) => (
            <details key={item.question}>
              <summary>
                <span className="mono">0{index + 1}</span>
                {item.question}
                <span className="faq-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
