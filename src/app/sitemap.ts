import type { MetadataRoute } from 'next'

const LANGS = {
  es: 'https://www.enorese.com/es',
  en: 'https://www.enorese.com/en',
}

// hreflang: incluye x-default → /es (foco hispanohablante: LatAm/España por defecto).
const ALTERNATES = {
  ...LANGS,
  'x-default': LANGS.es,
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return Object.values(LANGS).map((url) => ({
    url,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: {
      languages: ALTERNATES,
    },
  }))
}
