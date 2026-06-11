import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider, type Language } from '@/contexts/LanguageContext'
import en from '@/i18n/en.json'
import es from '@/i18n/es.json'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

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
  es: 'Backend developer y arquitecto cloud especializado en Microsoft Azure, TypeScript y Node.js. Referente técnico con experiencia en arquitecturas serverless, integración de IA y migración de sistemas empresariales. Basado en Santiago, Chile.',
  en: 'Backend developer and cloud architect specialized in Microsoft Azure, TypeScript and Node.js. Technical lead experienced in serverless architectures, AI integration, and enterprise system migrations. Based in Santiago, Chile.',
}

const KEYWORDS: Record<Language, string[]> = {
  es: ['backend developer', 'arquitecto cloud', 'Microsoft Azure', 'TypeScript', 'Node.js', 'Azure Functions', 'serverless', 'inteligencia artificial', 'Santiago Chile', 'desarrollador backend'],
  en: ['backend developer', 'cloud architect', 'Microsoft Azure', 'TypeScript', 'Node.js', 'Azure Functions', 'serverless', 'artificial intelligence', 'Santiago Chile', 'software engineer'],
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const lang = normalize((await params).lang)
  const m = messages[lang]
  const url = `https://enorese.dev/${lang}`
  const title = `${m.hero.name} — ${m.hero.title}`
  const description = DESCRIPTIONS[lang]

  return {
    metadataBase: new URL('https://enorese.dev'),
    title,
    description,
    keywords: KEYWORDS[lang],
    authors: [{ name: 'Enzo Norese' }],
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        es: 'https://enorese.dev/es',
        en: 'https://enorese.dev/en',
        'x-default': 'https://enorese.dev/es',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      locale: lang === 'es' ? 'es_CL' : 'en_US',
      alternateLocale: lang === 'es' ? 'en_US' : 'es_CL',
    },
    twitter: {
      card: 'summary',
      title,
      description,
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

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content: apply dark class and data-theme before paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);if(['dark','ocean','midnight'].indexOf(t)!==-1)document.documentElement.classList.add('dark');}catch(e){}})()` }} />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="preconnect" href="https://wa.me" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Enzo Norese",
              "url": `https://enorese.dev/${lang}`,
              "email": "enzo.norese@gmail.com",
              "jobTitle": "Backend Developer & Cloud Architect",
              "worksFor": {
                "@type": "Organization",
                "name": "TeamWork Capacitación Ltda."
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Santiago",
                "addressCountry": "CL"
              },
              "sameAs": [
                "https://www.linkedin.com/in/enzo-norese/",
                "https://github.com/eNorese"
              ],
              "knowsLanguage": ["es", "en"],
              "knowsAbout": [
                "Microsoft Azure",
                "TypeScript",
                "Node.js",
                "Azure Functions",
                "Serverless Architecture",
                "Artificial Intelligence",
                "Backend Development",
                "Cloud Architecture",
                "PostgreSQL",
                "CosmosDB"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          <LanguageProvider lang={lang}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
