import type { MetadataRoute } from 'next'

const LANGS = {
  es: 'https://enorese.dev/es',
  en: 'https://enorese.dev/en',
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return (Object.values(LANGS)).map((url) => ({
    url,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: {
      languages: LANGS,
    },
  }))
}
