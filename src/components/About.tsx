'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export function About() {
  const { t } = useLanguage()

  const stats = [
    { value: t('about.years_value'), label: t('about.stats.years') },
    { value: t('about.projects_value'), label: t('about.stats.projects') },
    { value: t('about.technologies_value'), label: t('about.stats.technologies') },
    { value: t('about.coffees_value'), label: t('about.stats.coffees') },
  ]

  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-gray-900">
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
          </div>

          {/* Stats — narrower column */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center text-center"
              >
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {value}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
