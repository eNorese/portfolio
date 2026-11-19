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

// Debe representar una actualización sustancial del contenido, no la fecha de cada build.
// Actualizar junto con el contenido principal y los archivos llms*.txt.
const CONTENT_LAST_MODIFIED = new Date('2026-11-18T00:00:00-03:00')

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(LANGS).map((url) => ({
    url,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: {
      languages: ALTERNATES,
    },
  }))
}
