'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { SocialLinks } from '@/components/SocialLinks'

const capabilityCards = [
  {
    key: 'cloud_architecture',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7.5 18.5h9.25a4.25 4.25 0 0 0 .58-8.46A5.75 5.75 0 0 0 6.5 8.25a5.13 5.13 0 0 0 1 10.25Z" />
        <path d="M9 13.25h6M10.5 16h3M12 13.25V16" />
      </svg>
    ),
  },
  {
    key: 'backend_systems',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="16" height="6" rx="1.5" />
        <rect x="4" y="14" width="16" height="6" rx="1.5" />
        <path d="M8 7h.01M8 17h.01M12 7h5M12 17h5" />
      </svg>
    ),
  },
  {
    key: 'applied_ai',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3.5c.7 3.65 2.85 5.8 6.5 6.5-3.65.7-5.8 2.85-6.5 6.5-.7-3.65-2.85-5.8-6.5-6.5 3.65-.7 5.8-2.85 6.5-6.5Z" />
        <path d="M18.5 15.5c.27 1.4 1.1 2.23 2.5 2.5-1.4.27-2.23 1.1-2.5 2.5-.27-1.4-1.1-2.23-2.5-2.5 1.4-.27 2.23-1.1 2.5-2.5ZM5 3v3M3.5 4.5h3" />
      </svg>
    ),
  },
  {
    key: 'technical_leadership',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="7" r="3" />
        <path d="M6.5 20c.45-3.1 2.35-5 5.5-5s5.05 1.9 5.5 5M5.5 10.5a2.5 2.5 0 1 0-2.25 4.95M18.5 10.5a2.5 2.5 0 1 1 2.25 4.95" />
      </svg>
    ),
  },
]

export function About() {
  const { t } = useLanguage()

  return (
    <section id="sobre-mi" className="section-atmosphere relative py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14" data-reveal>
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
            01 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('about.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('about.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Bio — wider column */}
          <div className="lg:col-span-3 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-base" data-reveal data-reveal-direction="left">
            <p>{t('about.bio_1')}</p>
            <p>{t('about.bio_2')}</p>
            <p>{t('about.bio_3')}</p>

            {/* Social + CV */}
            <div className="flex flex-wrap items-center gap-5 pt-4">
              <SocialLinks size={20} baseClass="text-gray-400 dark:text-gray-500" />
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 hidden sm:block" />
              <a
                href="/cv.pdf"
                download
                className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-accent transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {t('hero.cv_download')}
              </a>
            </div>
          </div>

          {/* Durable capability pillars — broader than specific tools. */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4" data-reveal data-reveal-direction="right" data-reveal-delay="1">
            {capabilityCards.map(({ key, icon }, index) => (
              <div
                key={key}
                className="motion-card group border border-gray-200/60 dark:border-gray-700/60 rounded-xl p-5 flex flex-col items-center gap-3 text-center cursor-default backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-md hover:shadow-accent/10"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <span className="transition-transform duration-300 group-hover:scale-110">
                  {icon}
                </span>
                <span className="text-xs font-mono font-medium tracking-wide text-gray-600 dark:text-gray-300 group-hover:text-accent transition-colors duration-300">
                  {t(`about.capabilities.${key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-gray-200/70 dark:border-gray-800/70 grid lg:grid-cols-[0.85fr_1.35fr] gap-8 lg:gap-12 items-start" data-reveal>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-accent mb-3">
              {t('about.beyond_code.eyebrow')}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t('about.beyond_code.title')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {t('about.beyond_code.description')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="motion-card group rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/40 dark:bg-gray-800/35 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-accent mb-4 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 10 5.5 6.5M15 10l3.5-3.5M9 14l-3.5 3.5M15 14l3.5 3.5" />
                <circle cx="4" cy="5" r="2" /><circle cx="20" cy="5" r="2" /><circle cx="4" cy="19" r="2" /><circle cx="20" cy="19" r="2" />
                <rect x="8" y="9" width="8" height="6" rx="2" /><path d="M11 12h2" />
              </svg>
              <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.beyond_code.fpv_title')}</h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {t('about.beyond_code.fpv_description')}
              </p>
            </div>

            <div className="motion-card group rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/40 dark:bg-gray-800/35 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-accent mb-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 7v10M8 4v16M12 8v8M16 5v14M20 9v6" />
              </svg>
              <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.beyond_code.music_title')}</h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {t('about.beyond_code.music_description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
