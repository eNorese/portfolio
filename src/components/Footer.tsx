import { motion } from 'framer-motion'
import { Terminal, Github, Linkedin } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { SOCIAL_LINKS } from '../lib/constants'

export default function Footer() {
  const { t } = useLanguage()

  const socialLinks = [
    {
      icon: Github,
      href: SOCIAL_LINKS.github, // TODO: actualiza en src/lib/constants.ts
      label: 'GitHub',
    },
    {
      icon: Linkedin,
      href: SOCIAL_LINKS.linkedin, // TODO: actualiza en src/lib/constants.ts
      label: 'LinkedIn',
    },
  ]

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/60 py-10 bg-white/50 dark:bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Brand */}
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500">
            <Terminal size={15} className="text-sky-500/70 dark:text-sky-400/70" />
            <span className="font-mono text-sm">eNorese.dev</span>
          </div>

          {/* Tagline técnica — un guiño, no un cliché */}
          <p className="text-xs font-mono text-zinc-400 dark:text-zinc-600 text-center">
            {t('footer.tagline')}
          </p>

          {/* Right: social + copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3 }}
                  className="p-2 rounded-lg text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
            <p className="text-xs font-mono text-zinc-400 dark:text-zinc-600">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
