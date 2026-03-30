import { createContext, useContext, useState } from 'react'
import es from '../i18n/es.json'
import en from '../i18n/en.json'

type Lang = 'es' | 'en'

const translations: Record<Lang, typeof es> = { es, en }

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  // Acceso dot-notation para strings. Para arrays/objetos usa t() con cast.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string) => any
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'es',
  setLang: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    return stored === 'en' ? 'en' : 'es'
  })

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem('lang', newLang)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (key: string): any => {
    const parts = key.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = translations[lang]
    for (const part of parts) {
      val = val?.[part]
      if (val === undefined) return key
    }
    return val
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
