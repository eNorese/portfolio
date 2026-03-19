import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowUpRight, Github, Star, GitFork, Lock } from 'lucide-react'

interface Project {
  title: string
  description: string
  tags: string[]
  stars?: number
  forks?: number
  isPrivate?: boolean
  githubUrl?: string
  liveUrl?: string
  accent: string
  accentBg: string
}

const PROJECTS: Project[] = [
  {
    title: 'ERP Migration Toolkit',
    description:
      'Conjunto de scripts y utilidades para migrar datos entre Softland y Rex+. Incluye validación de integridad, reconciliación contable y logs auditables de cada operación.',
    tags: ['T-SQL', 'Node.js', 'SQL Server', 'ETL'],
    isPrivate: true,
    accent: 'text-sky-400',
    accentBg: 'border-sky-500/30 hover:border-sky-500/60 bg-sky-950/10',
  },
  {
    title: 'Query Performance Analyzer',
    description:
      'Herramienta CLI que analiza planes de ejecución de SQL Server e identifica cuellos de botella: table scans, índices faltantes y estadísticas desactualizadas.',
    tags: ['Python', 'T-SQL', 'SQL DMVs', 'CLI'],
    stars: 34,
    forks: 8,
    accent: 'text-violet-400',
    accentBg: 'border-violet-500/30 hover:border-violet-500/60 bg-violet-950/10',
  },
  {
    title: 'RAG Backend Service',
    description:
      'Servicio de Retrieval-Augmented Generation para búsqueda semántica sobre documentación técnica interna. Embeddings vectoriales + base de datos pgvector.',
    tags: ['Python', 'FastAPI', 'pgvector', 'OpenAI'],
    stars: 12,
    accent: 'text-emerald-400',
    accentBg: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/10',
  },
  {
    title: 'FPV Telemetry Logger',
    description:
      'Sistema de logging de telemetría para drones FPV. Captura datos de vuelo (GPS, batería, velocidad) y los persiste en SQLite para análisis post-vuelo.',
    tags: ['Python', 'SQLite', 'MSP Protocol', 'FPV'],
    accent: 'text-orange-400',
    accentBg: 'border-orange-500/30 hover:border-orange-500/60 bg-orange-950/10',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${project.accentBg}`}
    >
      {/* Repo meta */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {project.isPrivate ? (
            <Lock size={16} className="text-zinc-500" />
          ) : (
            <Github size={16} className="text-zinc-500" />
          )}
          <span className="text-xs font-mono text-zinc-500">
            {project.isPrivate ? 'private' : 'public'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {project.stars != null && (
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Star size={12} />
              {project.stars}
            </span>
          )}
          {project.forks != null && (
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <GitFork size={12} />
              {project.forks}
            </span>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-100 transition-colors"
              aria-label="Ver en GitHub"
            >
              <Github size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-100 transition-colors"
              aria-label="Ver live"
            >
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-bold text-base mb-2 ${project.accent}`}>{project.title}</h3>

      {/* Description */}
      <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-5">{project.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-zinc-800/80 text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div
        className="absolute right-0 bottom-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"
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
          <p className="font-mono text-sky-400 text-sm mb-2 tracking-widest">04. /projects</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
            Mis{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              proyectos
            </span>
          </h2>
          <p className="mt-3 text-zinc-400 text-sm max-w-xl">
            Una selección de proyectos que reflejan mi enfoque en sistemas robustos y
            soluciones de datos de alto rendimiento.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
          className="grid sm:grid-cols-2 gap-5"
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
