import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../contexts/LanguageContext'
import { Lock, ArrowUpRight, Clock } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

interface Placeholder {
  title: string
  description: string
  tags: string[]
}

function MainProjectCard() {
  const { t } = useLanguage()
  const tags: string[] = t('projects.main_project.tags')

  return (
    <motion.article
      variants={fadeUp}
      className="relative p-7 sm:p-8 rounded-2xl border border-sky-400/30 dark:border-sky-500/30 bg-gradient-to-br from-sky-50/80 to-violet-50/30 dark:from-sky-950/25 dark:to-violet-950/15 glow-blue overflow-hidden"
    >
      {/* Badge empresarial */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-zinc-500" />
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500">
            {t('projects.private_label')}
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600">
          {t('projects.no_repo')}
        </span>
      </div>

      {/* Role badge */}
      <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 mb-4">
        {t('projects.main_project.role')}
      </span>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 leading-tight">
        {t('projects.main_project.title')}
      </h3>

      {/* Description */}
      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
        {t('projects.main_project.description')}
      </p>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-center">
          <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {t('projects.main_project.metric_1').split(' ')[0]}
          </div>
          <div className="text-xs text-zinc-500 leading-tight mt-0.5">
            {t('projects.main_project.metric_1').split(' ').slice(1).join(' ')}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-center">
          <div className="text-lg font-bold font-mono text-sky-600 dark:text-sky-400">100%</div>
          <div className="text-xs text-zinc-500 leading-tight mt-0.5">
            continuidad operacional
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/90 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
    </motion.article>
  )
}

function PlaceholderCard({ item }: { item: Placeholder }) {
  const { t } = useLanguage()

  return (
    <motion.article
      variants={fadeUp}
      className="relative flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-300 overflow-hidden"
    >
      {/* WIP badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-zinc-400" />
          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
            {t('projects.coming_soon')}
          </span>
        </div>
        <ArrowUpRight size={14} className="text-zinc-300 dark:text-zinc-700" />
      </div>

      <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-base mb-2">{item.title}</h3>
      <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed flex-1 mb-5">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-500"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zinc-50/20 dark:to-zinc-900/30 pointer-events-none" />
    </motion.article>
  )
}

export default function Projects() {
  const { ref, controls } = useScrollAnimation()
  const { t } = useLanguage()
  const placeholders: Placeholder[] = t('projects.placeholders')

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div
        className="absolute right-0 bottom-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none"
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
          <p className="font-mono text-sky-500 dark:text-sky-400 text-sm mb-2 tracking-widest">
            {t('projects.section_label')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {t('projects.title_1')}{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              {t('projects.title_2')}
            </span>
          </h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-500 text-sm max-w-xl">
            {t('projects.description')}
          </p>
        </motion.div>

        {/* Grid: featured principal + placeholders */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
          }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Main project — ocupa 2 columnas en lg */}
          <div className="lg:col-span-2">
            <MainProjectCard />
          </div>

          {/* Placeholders */}
          {placeholders.map((p) => (
            <PlaceholderCard key={p.title} item={p} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
