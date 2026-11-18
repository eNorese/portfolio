import type { Metadata, Viewport } from 'next'
import '../globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DeferredTelemetry } from '@/components/DeferredTelemetry'
import { LanguageProvider, type Language } from '@/contexts/LanguageContext'
import en from '@/i18n/en.json'
import es from '@/i18n/es.json'

const messages = { en, es }
const LOCALES: Language[] = ['es', 'en']

// Solo `/es` y `/en` son válidas; cualquier otro valor → 404.
export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

function normalize(lang: string): Language {
  return lang === 'en' ? 'en' : 'es'
}

const DESCRIPTIONS: Record<Language, string> = {
  es: 'Desarrollador backend e ingeniero de software especializado en arquitecturas cloud sobre Microsoft Azure, TypeScript y Node.js. Referente técnico con experiencia en arquitecturas serverless, integración de IA y migración de sistemas empresariales. Basado en Santiago, Chile, con foco en Latinoamérica y España.',
  en: 'Backend developer and cloud architect specialized in Microsoft Azure, TypeScript and Node.js. Technical lead experienced in serverless architectures, AI integration, and enterprise system migrations. Based in Santiago, Chile.',
}

const KEYWORDS: Record<Language, string[]> = {
  es: ['desarrollador backend', 'ingeniero de software', 'arquitecto cloud', 'arquitecto de soluciones', 'programador backend', 'Microsoft Azure', 'TypeScript', 'Node.js', 'Azure Functions', 'serverless', 'inteligencia artificial', 'desarrollador Chile', 'desarrollador Latinoamérica', 'backend remoto'],
  en: ['backend developer', 'cloud architect', 'Microsoft Azure', 'TypeScript', 'Node.js', 'Azure Functions', 'serverless', 'artificial intelligence', 'Santiago Chile', 'software engineer'],
}

// Color de la barra del navegador según el esquema (tema por defecto: dark → gray-950).
export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
}

const KNOWS_ABOUT = [
  'Microsoft Azure',
  'TypeScript',
  'Node.js',
  'Azure Functions',
  'Serverless Architecture',
  'Artificial Intelligence',
  'Backend Development',
  'Cloud Architecture',
  'PostgreSQL',
  'CosmosDB',
]

/** Grafo Schema.org (Person + WebSite + ProfilePage) para SEO/AIO. */
function buildJsonLd(lang: Language) {
  const base = 'https://www.enorese.com'
  const pageUrl = `${base}/${lang}`
  const m = messages[lang]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Enzo Norese',
        url: base,
        image: `${base}/og-image.png`,
        email: 'enzo.norese@gmail.com',
        jobTitle: 'Backend Developer & Cloud Architect',
        description: DESCRIPTIONS[lang],
        worksFor: { '@type': 'Organization', name: 'TeamWork Capacitación Ltda.' },
        address: { '@type': 'PostalAddress', addressLocality: 'Santiago', addressCountry: 'CL' },
        nationality: { '@type': 'Country', name: 'Chile' },
        areaServed: [
          { '@type': 'Country', name: 'Chile' },
          { '@type': 'Country', name: 'Perú' },
          { '@type': 'Country', name: 'Argentina' },
          { '@type': 'Country', name: 'México' },
          { '@type': 'Country', name: 'España' },
          { '@type': 'Place', name: 'Latinoamérica' },
        ],
        knowsLanguage: ['es', 'en'],
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'degree',
          name: 'Ingeniería en Informática',
        },
        sameAs: [
          'https://www.linkedin.com/in/enzo-norese/',
          'https://github.com/eNorese',
          'https://x.com/enorese',
        ],
        knowsAbout: KNOWS_ABOUT,
        makesOffer: m.services.items.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.title, description: s.description },
        })),
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: base,
        name: 'Enzo Norese — Portfolio',
        inLanguage: ['es', 'en'],
        author: { '@id': `${base}/#person` },
        publisher: { '@id': `${base}/#person` },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}/#profilepage`,
        url: pageUrl,
        name: `${m.hero.name} — ${m.hero.title}`,
        inLanguage: lang === 'es' ? 'es-CL' : 'en-US',
        isPartOf: { '@id': `${base}/#website` },
        about: { '@id': `${base}/#person` },
        mainEntity: { '@id': `${base}/#person` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}/#faq`,
        inLanguage: lang === 'es' ? 'es-CL' : 'en-US',
        isPartOf: { '@id': `${base}/#website` },
        mainEntity: m.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const lang = normalize((await params).lang)
  const m = messages[lang]
  const url = `https://www.enorese.com/${lang}`
  const title = `${m.hero.name} — ${m.hero.title}`
  const description = DESCRIPTIONS[lang]

  return {
    metadataBase: new URL('https://www.enorese.com'),
    title,
    description,
    keywords: KEYWORDS[lang],
    authors: [{ name: 'Enzo Norese' }],
    robots: { index: true, follow: true },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [{ url: '/icon-180.png', sizes: '180x180' }],
      shortcut: '/favicon.ico',
    },
    alternates: {
      canonical: url,
      languages: {
        es: 'https://www.enorese.com/es',
        en: 'https://www.enorese.com/en',
        'x-default': 'https://www.enorese.com/es',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      locale: lang === 'es' ? 'es_CL' : 'en_US',
      alternateLocale: lang === 'es' ? ['es_ES', 'es_MX', 'es_AR', 'es_PE', 'en_US'] : ['es_CL', 'es_ES', 'es_MX'],
      images: [{ url: '/og-image.png', width: 1731, height: 909, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@enorese',
      images: ['/og-image.png'],
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const lang = normalize((await params).lang)
  const jsonLd = buildJsonLd(lang)

  // Google Analytics: solo en producción y si la ID está configurada
  // (variable pública NEXT_PUBLIC_GA_ID — definirla en el entorno de Vercel).
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const gaEnabled = process.env.NODE_ENV === 'production' && Boolean(gaId)

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content: apply dark class and data-theme before paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);if(['dark','ocean','midnight'].indexOf(t)!==-1)document.documentElement.classList.add('dark');}catch(e){}})()` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <LanguageProvider lang={lang}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <DeferredTelemetry gaId={gaEnabled ? gaId : undefined} />
      </body>
    </html>
  )
}
