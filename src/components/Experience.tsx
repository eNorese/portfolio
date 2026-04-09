'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export function Experience() {
  const { locale, t } = useLanguage()
  const jobs = locale.experience.jobs

  return (
    <section id="experience" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-2">
            02 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('experience.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('experience.subtitle')}</p>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-gray-100 dark:border-gray-800 space-y-10">
          {jobs.map((job, index) => (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <span className="absolute -left-[calc(1.5rem+1px)] sm:-left-[calc(2rem+1px)] top-1.5 w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500 border-2 border-white dark:border-gray-950 ring-2 ring-indigo-200 dark:ring-indigo-900" />

              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors duration-200">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-snug">
                      {job.role}
                    </h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                      {job.company}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                    {job.period}
                  </span>
                </div>

                {/* Location */}
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  {job.location}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {job.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
