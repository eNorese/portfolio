'use client'

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import en from '@/i18n/en.json'
import es from '@/i18n/es.json'

type Language = 'en' | 'es'

const translations = { en, es }

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  locale: typeof en
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')

  const locale = useMemo(() => translations[language] as typeof en, [language])

  const t = useCallback((key: string): string => {
    const keys = key.split('.')
    let value: unknown = locale
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return typeof value === 'string' ? value : key
  }, [locale])

  const value = useMemo(
    () => ({ language, setLanguage, t, locale }),
    [language, setLanguage, t, locale]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
