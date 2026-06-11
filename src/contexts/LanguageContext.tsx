'use client'

import { createContext, useContext, useCallback, useMemo, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import en from '@/i18n/en.json'
import es from '@/i18n/es.json'

export type Language = 'en' | 'es'

const translations = { en, es }

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  locale: typeof en
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ lang, children }: { lang: Language; children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const locale = useMemo(() => translations[lang] as typeof en, [lang])

  const t = useCallback((key: string): string => {
    const keys = key.split('.')
    let value: unknown = locale
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return typeof value === 'string' ? value : key
  }, [locale])

  // Cambiar de idioma = navegar a la misma ruta bajo el otro locale (Opción A).
  // Conserva el resto del path y el hash de sección activo.
  const setLanguage = useCallback((next: Language) => {
    const rest = pathname.replace(/^\/(es|en)(?=\/|$)/, '')
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    router.push(`/${next}${rest}${hash}`)
  }, [pathname, router])

  // Mantén <html lang> alineado tras la navegación de cliente entre locales.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(
    () => ({ language: lang, setLanguage, t, locale }),
    [lang, setLanguage, t, locale]
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
