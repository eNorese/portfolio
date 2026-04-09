'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="py-8 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {year} Enzo Norese. {t('footer.rights')}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          {t('footer.made_with')}{' '}
          <span className="text-gray-600 dark:text-gray-400">Next.js</span>{' '}
          {t('footer.and')}{' '}
          <span className="text-gray-600 dark:text-gray-400">Tailwind CSS</span>
        </p>
      </div>
    </footer>
  )
}
