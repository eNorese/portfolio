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
  description: 'Personal portfolio of Enzo Norese, Backend Developer and Cloud Architect.',
  openGraph: {
    title: 'Enzo Norese — Backend Developer & Cloud Architect',
    description: 'Personal portfolio of Enzo Norese, Backend Developer and Cloud Architect.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Enzo Norese — Backend Developer & Cloud Architect',
    description: 'Personal portfolio of Enzo Norese, Backend Developer and Cloud Architect.',
  },
  robots: {
    index: true,
    follow: true,
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
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="preconnect" href="https://wa.me" />
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
