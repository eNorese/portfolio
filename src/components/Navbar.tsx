import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Terminal } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Sobre mí', href: '#about' },
  { label: 'Experiencia', href: '#experience' },
  { label: 'Proyectos', href: '#projects' },
  { label: 'Contacto', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
          ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60 shadow-lg shadow-black/20'
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
            size={20}
            className="text-sky-400 group-hover:text-violet-400 transition-colors"
          />
          <span className="font-mono font-semibold text-zinc-100 tracking-tight">
            eNorese
            <span className="text-sky-400 animate-blink">_</span>
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-sky-400 group-hover:w-4/5 transition-all duration-300" />
              </button>
            </li>
          ))}
        </ul>

        {/* CTA Desktop */}
        <a
          href="mailto:enzo@example.com"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:border-sky-400 transition-all duration-200"
        >
          Hablemos
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800"
          >
            <ul className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-zinc-300 hover:text-sky-400 hover:bg-zinc-800/50 rounded-lg transition-all"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
