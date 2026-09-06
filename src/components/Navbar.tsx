'use client'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ThemeSelector } from '@/components/ThemeSelector'
import { enabledNavSections, portfolioSections } from '@/config/sections'
import { Arrow } from '@/components/PortfolioUI'
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { language, setLanguage, t } = useLanguage()
  const menuButton = useRef<HTMLButtonElement>(null)
  const logoClicks = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const links = enabledNavSections.filter(({ key }) =>
    ['projects', 'about', 'experience', 'services'].includes(key),
  )
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-15% 0px -65% 0px' },
    )
    document
      .querySelectorAll('section[id]')
      .forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])
  useEffect(() => {
    if (!mobileOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        menuButton.current?.focus()
      }
    }
    const resize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('keydown', close)
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('keydown', close)
      window.removeEventListener('resize', resize)
    }
  }, [mobileOpen])
  function handleLogoClick() {
    setMobileOpen(false)
    logoClicks.current++
    if (timer.current) clearTimeout(timer.current)
    if (logoClicks.current >= 5) {
      logoClicks.current = 0
      window.dispatchEvent(new CustomEvent('enorese:easter-egg'))
    }
    timer.current = setTimeout(() => {
      logoClicks.current = 0
    }, 2000)
  }
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        {t('design.skip')}
      </a>
      <nav className="shell nav-inner" aria-label={t('design.navigation')}>
        <a href="#home" className="wordmark" onClick={handleLogoClick}>
          <span className="brand-mark" aria-hidden="true">
            en<span>↗</span>
          </span>
          enorese<span className="accent">.dev</span>
        </a>
        <div className="desktop-links">
          {links.map(({ key, id, href }) => (
            <a
              key={key}
              href={href}
              aria-current={activeSection === id ? 'location' : undefined}
            >
              {t(`nav.${key}`)}
            </a>
          ))}
        </div>
        <div className="nav-controls">
          <button
            className="language-toggle"
            onClick={() => {
              setMobileOpen(false)
              setLanguage(language === 'es' ? 'en' : 'es')
            }}
            aria-label={t('design.switch_language')}
          >
            {language.toUpperCase()}
            <span aria-hidden="true">⌄</span>
          </button>
          <ThemeSelector />
          {portfolioSections.contact && (
            <a href="#contacto" className="nav-contact">
              {t('design.lets_talk')}
              <Arrow diagonal />
            </a>
          )}
          <button
            ref={menuButton}
            className="menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t(
              mobileOpen ? 'design.close_menu' : 'design.open_menu',
            )}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <span aria-hidden="true">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label={t('design.navigation')}
        >
          {enabledNavSections.map(({ key, href, id }) => (
            <a
              key={key}
              href={href}
              aria-current={activeSection === id ? 'location' : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {t(`nav.${key}`)}
              <Arrow diagonal />
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
