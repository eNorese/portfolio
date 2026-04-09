'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { SocialLinks } from '@/components/SocialLinks'

export function About() {
  const { t } = useLanguage()

  const stats = [
    { value: t('about.years_value'), label: t('about.stats.years') },
    { value: t('about.projects_value'), label: t('about.stats.projects') },
    { value: t('about.technologies_value'), label: t('about.stats.technologies') },
    { value: t('about.coffees_value'), label: t('about.stats.coffees') },
  ]

  return (
    <section id="about" className="relative py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-2">
            01 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('about.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('about.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Bio — wider column */}
          <div className="lg:col-span-3 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-base">
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
                className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {t('hero.cv_download')}
              </a>
            </div>
          </div>

          {/* Stats — narrower column */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center text-center cursor-default transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5"
              >
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1 transition-transform duration-300 group-hover:scale-110">
                  {value}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* fade → Experience (white / gray-950) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-white dark:to-gray-950" />
    </section>
  )
}
