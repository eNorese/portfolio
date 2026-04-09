'use client'

import { useLanguage } from '@/contexts/LanguageContext'

const SKILLS_DATA = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
  backend: ['Node.js', 'Express', 'TypeScript', 'SQL Server', 'PostgreSQL', 'Redis'],
  cloud: ['Microsoft Azure', 'Azure Functions', 'Docker', 'Terraform', 'CI/CD', 'Nginx'],
  tools: ['Git', 'Linux', 'Elasticsearch', 'Kafka', 'Grafana', 'Jest'],
} as const

export function Skills() {
  const { locale, t } = useLanguage()
  const stories = locale.skills.stories

  return (
    <section id="skills" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-2">
            03 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('skills.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('skills.subtitle')}</p>
        </div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {(Object.keys(SKILLS_DATA) as Array<keyof typeof SKILLS_DATA>).map((category) => (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5"
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                {t(`skills.categories.${category}`)}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {SKILLS_DATA[category].map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
          {t('skills.stories_title')}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors duration-200"
            >
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1 group-hover:scale-110 transition-transform duration-200">
                {story.metric}
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {story.label}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {story.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
