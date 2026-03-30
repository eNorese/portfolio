import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin } from 'lucide-react'
import { useTypewriter } from '../hooks/useTypewriter'
import { useLanguage } from '../contexts/LanguageContext'
import { SOCIAL_LINKS } from '../lib/constants'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

/**
 * Efecto spotlight: un gradiente radial que sigue el mouse solo en esta sección.
 * Se desactiva en dispositivos táctiles.
 */
function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const isTouchDevice =
    typeof window !== 'undefined' &&
    (window.matchMedia('(hover: none)').matches || 'ontouchstart' in window)

  useEffect(() => {
    if (isTouchDevice) return
    const section = ref.current
    if (!section) return

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setPos({ x, y })
    }

    section.addEventListener('mousemove', onMove)
    return () => section.removeEventListener('mousemove', onMove)
  }, [isTouchDevice])

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 dark:opacity-40" />
      {/* Spotlight que sigue el cursor */}
      {!isTouchDevice && (
        <div
          className="absolute inset-0 transition-[background] duration-100"
          style={{
            background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(56,189,248,0.06) 0%, transparent 60%)`,
          }}
        />
      )}
      {/* Glows fijos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-sky-500/5 dark:bg-sky-500/5 blur-[130px]" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/5 dark:bg-violet-500/5 blur-[100px]" />
    </div>
  )
}

export default function Hero() {
  const { t } = useLanguage()
  const typewriterTexts: string[] = t('hero.typewriter')
  const typewriterText = useTypewriter(typewriterTexts)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <Spotlight />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Badge disponible */}
        <motion.div variants={itemVariants} className="mb-6 inline-flex">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            {t('hero.available')}
          </span>
        </motion.div>

        {/* Saludo */}
        <motion.p
          variants={itemVariants}
          className="font-mono text-sky-600 dark:text-sky-400 text-base sm:text-lg mb-3 tracking-widest"
        >
          {t('hero.greeting')}
        </motion.p>

        {/* Nombre — tamaños fijos por breakpoint */}
        <motion.h1
          variants={itemVariants}
          className="font-bold tracking-tight mb-2 leading-none"
          style={{ fontSize: 'clamp(72px, 10vw, 220px)' }}
        >
          <span className="text-zinc-900 dark:text-zinc-100">E</span>
          <span className="text-gradient">NZO</span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="font-bold tracking-tight mb-6 leading-none text-zinc-400 dark:text-zinc-600"
          style={{ fontSize: 'clamp(18px, 3vw, 52px)' }}
        >
          Norese
        </motion.p>

        {/* Subtítulo con typewriter */}
        <motion.div
          variants={itemVariants}
          className="h-9 sm:h-11 flex items-center justify-center mb-7"
        >
          <p className="font-mono text-lg sm:text-xl text-zinc-700 dark:text-zinc-300">
            {typewriterText}
            <span className="text-sky-500 dark:text-sky-400 animate-blink ml-0.5">|</span>
          </p>
        </motion.div>

        {/* Descripción */}
        <motion.p
          variants={itemVariants}
          className="max-w-xl mx-auto text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed mb-10"
        >
          {t('hero.description')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
        >
          <motion.button
            onClick={() =>
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
            }
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 hover:shadow-sky-500/35 transition-shadow duration-300"
          >
            {t('hero.cta_projects')}
          </motion.button>

          <motion.button
            onClick={() =>
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:border-sky-500/60 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-500/5 transition-all duration-200"
          >
            {t('hero.cta_contact')}
          </motion.button>
        </motion.div>

        {/* Social links */}
        <motion.div variants={itemVariants} className="flex justify-center gap-3">
          {/* TODO: actualiza los hrefs en src/lib/constants.ts */}
          <motion.a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            whileHover={{ y: -3 }}
            className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200"
          >
            <Github size={17} />
          </motion.a>
          <motion.a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            whileHover={{ y: -3 }}
            className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-200"
          >
            <Linkedin size={17} />
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-400 dark:text-zinc-600"
      >
        <span className="text-xs font-mono tracking-widest">{t('hero.scroll')}</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  )
}
