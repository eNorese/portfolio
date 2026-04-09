'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950"
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-100/60 dark:bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-violet-100/60 dark:bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-50/40 dark:bg-sky-900/10 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay (subtle) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <span className="inline-block mb-5 text-xs font-mono tracking-[0.25em] uppercase text-indigo-600 dark:text-indigo-400">
          {t('hero.greeting')}
        </span>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          {t('hero.name')}
        </h1>

        {/* Title */}
        <p className="text-lg sm:text-xl lg:text-2xl font-light text-gray-500 dark:text-gray-400 mb-6">
          {t('hero.title')}
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-indigo-400/50 dark:bg-indigo-500/50 mb-6" />

        {/* Description */}
        <p className="max-w-xl text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
          {t('hero.description')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#projects"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium transition-colors duration-200"
          >
            {t('hero.cta_work')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
          >
            {t('hero.cta_contact')}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400 dark:text-gray-600">{t('hero.scroll')}</span>
        <div className="w-5 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex justify-center items-start pt-1.5">
          <div className="w-0.5 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
