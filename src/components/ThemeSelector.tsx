'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/contexts/LanguageContext'
export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <div className="theme-control">
      <span aria-hidden="true">◐</span>
      <select
        aria-label={t('design.select_theme')}
        value={mounted ? theme : 'dark'}
        onChange={(event) => setTheme(event.target.value)}
      >
        {['dark', 'light', 'forest', 'ocean', 'midnight'].map((id) => (
          <option value={id} key={id}>
            {t(`design.themes.${id}`)}
          </option>
        ))}
      </select>
    </div>
  )
}
