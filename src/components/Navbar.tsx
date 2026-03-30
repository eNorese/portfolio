import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Terminal, Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const NAV_LINKS = [
    { labelKey: 'nav.about', href: '#about' },
    { labelKey: 'nav.experience', href: '#experience' },
    { labelKey: 'nav.stack', href: '#stack' },
    { labelKey: 'nav.projects', href: '#projects' },
    { labelKey: 'nav.contact', href: '#contact' },
  ]

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800/60 shadow-sm dark:shadow-lg dark:shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('#hero')}
          className="flex items-center gap-2 group"
        >
          <Terminal
            size={18}
            className="text-sky-500 dark:text-sky-400 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors"
          />
          <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight text-sm">
            eNorese
            <span className="text-sky-500 dark:text-sky-400 animate-blink">_</span>
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="relative px-3.5 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
              >
                {t(link.labelKey)}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-sky-500 dark:bg-sky-400 group-hover:w-4/5 transition-all duration-300" />
              </button>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="hidden md:flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden text-xs font-mono">
            <button
              onClick={() => setLang('es')}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === 'es'
                  ? 'bg-sky-500 text-white'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === 'en'
                  ? 'bg-sky-500 text-white'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* CTA Desktop */}
          <button
            onClick={() => handleNavClick('#contact')}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-sky-500/60 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500 transition-all duration-200"
          >
            {t('nav.cta')}
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800"
          >
            <ul className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-lg transition-all"
                  >
                    {t(link.labelKey)}
                  </button>
                </li>
              ))}
              {/* Mobile lang toggle */}
              <li className="flex items-center gap-2 px-4 py-2 mt-1">
                <span className="text-xs font-mono text-zinc-400">Lang:</span>
                <button
                  onClick={() => setLang('es')}
                  className={`text-xs font-mono px-2 py-1 rounded ${lang === 'es' ? 'bg-sky-500 text-white' : 'text-zinc-400'}`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`text-xs font-mono px-2 py-1 rounded ${lang === 'en' ? 'bg-sky-500 text-white' : 'text-zinc-400'}`}
                >
                  EN
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
