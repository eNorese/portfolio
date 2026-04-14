'use client'

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { useEffect } from 'react'

// Themes that should activate Tailwind's dark: variant classes
const DARK_THEMES = ['dark', 'ocean', 'midnight']

function DarkClassManager() {
  const { theme } = useTheme()

  useEffect(() => {
    if (!theme) return
    document.documentElement.classList.toggle('dark', DARK_THEMES.includes(theme))
  }, [theme])

  return null
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      themes={['light', 'dark', 'forest', 'ocean', 'midnight']}
      defaultTheme="dark"
      enableSystem={false}
    >
      <DarkClassManager />
      {children}
    </NextThemesProvider>
  )
}
