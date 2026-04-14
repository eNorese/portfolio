'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ThemeSelector } from '@/components/ThemeSelector'

const NAV_LINKS = [
  { key: 'about', href: '#about' },
  { key: 'experience', href: '#experience' },
  { key: 'skills', href: '#skills' },
  { key: 'projects', href: '#projects' },
  { key: 'contact', href: '#contact' },
] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    // Glass effect trigger on scroll
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Active section detection via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id === 'home' ? '' : entry.target.id)
          }
        })
      },
      { rootMargin: '-64px 0px -50% 0px', threshold: 0 }
    )

    const hero = document.getElementById('home')
    if (hero) observer.observe(hero)

    NAV_LINKS.forEach(({ key }) => {
      const el = document.getElementById(key)
      if (el) observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const toggleLanguage = () => {
    const next = language === 'en' ? 'es' : 'en'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svt: ((cb: () => void) => { finished: Promise<void> }) | undefined = (document as any).startViewTransition?.bind(document)

    if (!svt) {
      document.body.classList.add('lang-switching')
      setTimeout(() => setLanguage(next), 180)
      setTimeout(() => document.body.classList.remove('lang-switching'), 420)
      return
    }

    document.documentElement.classList.add('lang-switching')
    svt(() => setLanguage(next))
      .finished.finally(() => document.documentElement.classList.remove('lang-switching'))
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? 'backdrop-blur-xl backdrop-saturate-150 bg-white/60 dark:bg-gray-950/65 border-gray-200/10 dark:border-white/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="#"
            className="text-base font-bold tracking-tight text-gray-900 dark:text-white"
            onClick={() => setMobileOpen(false)}
          >
            eNorese
            <span className="text-accent">.</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ key, href }) => {
              const isActive = activeSection === key
              return (
                <a
                  key={key}
                  href={href}
                  className={`relative text-sm transition-colors duration-200 pb-0.5 ${
                    isActive
                      ? 'text-accent'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {t(`nav.${key}`)}
                  {/* Animated underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-accent transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </a>
              )
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="h-8 px-2.5 rounded-md text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
            >
              {language === 'en' ? 'ES' : 'EN'}
            </button>

            {/* Theme selector */}
            <ThemeSelector />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
            >
              <span
                className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${
                  mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''
                }`}
              />
              <span
                className={`block w-5 h-px bg-current transition-all duration-300 ${
                  mobileOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${
                  mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-950/90 border-t border-gray-200/10 dark:border-white/[0.04] px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ key, href }) => {
            const isActive = activeSection === key
            return (
              <a
                key={key}
                href={href}
                className={`flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm transition-colors duration-200 ${
                  isActive
                    ? 'text-accent bg-accent/[0.07]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                )}
                {t(`nav.${key}`)}
              </a>
            )
          })}
        </div>
      </div>
    </header>
  )
}
