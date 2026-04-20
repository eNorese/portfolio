import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Enzo Norese — Backend Developer & Cloud Architect',
  description: 'Backend developer y arquitecto cloud especializado en Microsoft Azure, TypeScript y Node.js. Referente técnico con experiencia en arquitecturas serverless, integración de IA y migración de sistemas empresariales. Basado en Santiago, Chile.',
  keywords: ['backend developer', 'cloud architect', 'Microsoft Azure', 'TypeScript', 'Node.js', 'Azure Functions', 'serverless', 'inteligencia artificial', 'Santiago Chile', 'desarrollador backend'],
  authors: [{ name: 'Enzo Norese' }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://enorese.dev',
  },
  openGraph: {
    title: 'Enzo Norese — Backend Developer & Cloud Architect',
    description: 'Backend developer y arquitecto cloud especializado en Microsoft Azure, TypeScript y Node.js.',
    type: 'website',
    url: 'https://enorese.dev',
    locale: 'es_CL',
  },
  twitter: {
    card: 'summary',
    title: 'Enzo Norese — Backend Developer & Cloud Architect',
    description: 'Backend developer y arquitecto cloud especializado en Microsoft Azure, TypeScript y Node.js.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
              "url": "https://enorese.dev",
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
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
