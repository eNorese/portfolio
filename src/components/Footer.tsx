import { motion } from 'framer-motion'
import { Terminal, Github, Linkedin, Instagram, Heart } from 'lucide-react'

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/enorese', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/enorese', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/enorese.fpv', label: 'Instagram' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-800/60 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2 text-zinc-500">
            <Terminal size={16} className="text-sky-400/70" />
            <span className="font-mono text-sm">eNorese.dev</span>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -3, color: '#38bdf8' }}
                className="p-2 rounded-lg text-zinc-600 hover:text-zinc-300 border border-transparent hover:border-zinc-700 transition-all"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs font-mono text-zinc-600 flex items-center gap-1.5">
            © {year} Enzo Norese · Hecho con{' '}
            <Heart size={11} className="text-rose-500 fill-rose-500" /> y React
          </p>
        </div>
      </div>
    </footer>
  )
}
