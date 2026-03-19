import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Instagram } from 'lucide-react'
import { useTypewriter } from '../hooks/useTypewriter'

const TYPEWRITER_TEXTS = [
  'Desarrollador Backend',
  'Arquitecto de Bases de Datos',
  'Optimizador de Stored Procedures',
  'Integrador de Sistemas ERP',
]

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/enorese', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/enorese', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/enorese.fpv', label: 'Instagram' },
]

// Variantes de animación para stagger de hijos
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const typewriterText = useTypewriter(TYPEWRITER_TEXTS)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-40"
        aria-hidden="true"
      />

      {/* Radial glow detrás del título */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sky-500/5 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Contenido principal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Badge disponible */}
        <motion.div variants={itemVariants} className="mb-6 inline-flex">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Disponible para nuevos proyectos
          </span>
        </motion.div>

        {/* Saludo */}
        <motion.p
          variants={itemVariants}
          className="font-mono text-sky-400 text-lg sm:text-xl mb-4 tracking-widest"
        >
          &gt; Hola, soy
        </motion.p>

        {/* Nombre principal */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-gradient">Enzo Norese</span>
        </motion.h1>

        {/* Subtítulo con typewriter */}
        <motion.div
          variants={itemVariants}
          className="h-10 sm:h-12 flex items-center justify-center mb-8"
        >
          <p className="font-mono text-xl sm:text-2xl text-zinc-300">
            {typewriterText}
            <span className="text-sky-400 animate-blink ml-0.5">|</span>
          </p>
        </motion.div>

        {/* Descripción */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto text-zinc-400 text-base sm:text-lg leading-relaxed mb-10"
        >
          Construyo la arquitectura invisible que hace funcionar los sistemas. Especializado en
          bases de datos, optimización de queries y migración de plataformas ERP críticas.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.button
            onClick={() =>
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
            }
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-shadow duration-300"
          >
            Ver mi trabajo
          </motion.button>

          <motion.button
            onClick={() =>
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-sm hover:border-sky-500/60 hover:text-sky-400 hover:bg-sky-500/5 transition-all duration-200"
          >
            Hablemos
          </motion.button>
        </motion.div>

        {/* Social links */}
        <motion.div variants={itemVariants} className="flex justify-center gap-4">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ y: -3, color: '#38bdf8' }}
              className="p-2.5 rounded-lg border border-zinc-800 text-zinc-500 hover:border-zinc-600 transition-colors duration-200"
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600"
      >
        <span className="text-xs font-mono tracking-widest">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  )
}
