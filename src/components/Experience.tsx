import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Briefcase, Calendar, MapPin, ArrowUpRight, CheckCircle2 } from 'lucide-react'

interface ExperienceItem {
  company: string
  role: string
  period: string
  location: string
  description: string
  highlights: string[]
  tags: string[]
  isFeatured?: boolean
  link?: string
}

const EXPERIENCES: ExperienceItem[] = [
  {
    company: 'TeamWork Chile',
    role: 'Backend Developer',
    period: 'Ene 2023 — Presente',
    location: 'Santiago, Chile · Remoto',
    description:
      'Lideré la migración técnica del ERP corporativo desde Softland hacia Rex+, asegurando continuidad operativa para módulos críticos de contabilidad, inventario y facturación electrónica.',
    highlights: [
      'Migración de +200 stored procedures críticos con zero downtime',
      'Optimización de consultas SQL que redujo tiempos de reporte en un 60%',
      'Desarrollo de capa de integración API REST entre Rex+ y sistemas internos',
      'Documentación técnica de arquitectura de base de datos heredada',
    ],
    tags: ['SQL Server', 'Rex+', 'Softland', 'Node.js', 'REST APIs', 'T-SQL'],
    isFeatured: true,
  },
  {
    company: 'Freelance',
    role: 'Database Consultant',
    period: '2021 — 2022',
    location: 'Remoto',
    description:
      'Consultoría de optimización de bases de datos para PyMEs. Diagnóstico, refactorización de queries y diseño de índices para mejorar performance en entornos de producción.',
    highlights: [
      'Auditorías de performance en bases de datos SQL Server y MySQL',
      'Diseño e implementación de estrategias de indexación',
      'Capacitaciones internas sobre buenas prácticas T-SQL',
    ],
    tags: ['SQL Server', 'MySQL', 'Performance Tuning', 'Indexing'],
    isFeatured: false,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function ExperienceCard({ item, index }: { item: ExperienceItem; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
      className={`relative p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
        item.isFeatured
          ? 'border-sky-500/30 bg-gradient-to-br from-sky-950/30 to-violet-950/20 glow-blue hover:border-sky-500/60'
          : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
      }`}
    >
      {item.isFeatured && (
        <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-mono bg-sky-500/15 text-sky-400 border border-sky-500/30">
          ★ Destacado
        </span>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className={`p-2.5 rounded-xl ${item.isFeatured ? 'bg-sky-500/15' : 'bg-zinc-800'}`}
        >
          <Briefcase size={20} className={item.isFeatured ? 'text-sky-400' : 'text-zinc-400'} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-100 text-lg leading-tight">{item.role}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`font-semibold text-sm ${item.isFeatured ? 'text-sky-400' : 'text-zinc-300'}`}
            >
              {item.company}
            </span>
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight size={14} className="text-zinc-500 hover:text-sky-400 transition-colors" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs font-mono text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} />
          {item.period}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={12} />
          {item.location}
        </span>
      </div>

      {/* Description */}
      <p className="text-zinc-400 text-sm leading-relaxed mb-5">{item.description}</p>

      {/* Highlights */}
      <ul className="space-y-2 mb-6">
        {item.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-zinc-300">
            <CheckCircle2
              size={14}
              className={`mt-0.5 flex-shrink-0 ${item.isFeatured ? 'text-sky-400' : 'text-zinc-500'}`}
            />
            {h}
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/50"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="experience" className="py-24 sm:py-32 relative">
      <div
        className="absolute left-0 top-1/3 w-72 h-72 bg-sky-500/5 rounded-full blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          className="mb-12"
        >
          <p className="font-mono text-sky-400 text-sm mb-2 tracking-widest">03. /experience</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
            Experiencia{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              profesional
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1fr_1fr]"
        >
          {EXPERIENCES.map((item, i) => (
            <ExperienceCard key={item.company} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
