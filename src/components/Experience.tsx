import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../contexts/LanguageContext'
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react'

interface Job {
  company: string
  role: string
  period: string
  type: string
  location: string
  description: string
  highlights: string[]
  tags: string[]
  isFeatured: boolean
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function JobCard({ job, typeLabel }: { job: Job; typeLabel: string }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
      className={`relative p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
        job.isFeatured
          ? 'border-sky-400/30 dark:border-sky-500/30 bg-sky-50/80 dark:bg-sky-950/20 glow-blue hover:border-sky-400/60 dark:hover:border-sky-500/60'
          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className={`p-2.5 rounded-xl flex-shrink-0 ${
            job.isFeatured
              ? 'bg-sky-100 dark:bg-sky-500/15'
              : 'bg-zinc-100 dark:bg-zinc-800'
          }`}
        >
          <Briefcase
            size={18}
            className={job.isFeatured ? 'text-sky-600 dark:text-sky-400' : 'text-zinc-500 dark:text-zinc-400'}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight">
            {job.role}
          </h3>
          <span
            className={`font-semibold text-sm ${
              job.isFeatured ? 'text-sky-600 dark:text-sky-400' : 'text-zinc-600 dark:text-zinc-300'
            }`}
          >
            {job.company}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs font-mono text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Calendar size={11} />
          {job.period}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={11} />
          {job.location}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
          {typeLabel}
        </span>
      </div>

      {/* Description */}
      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
        {job.description}
      </p>

      {/* Highlights */}
      <ul className="space-y-2 mb-5">
        {job.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <CheckCircle2
              size={13}
              className={`mt-0.5 flex-shrink-0 ${
                job.isFeatured ? 'text-sky-500 dark:text-sky-400' : 'text-zinc-400 dark:text-zinc-600'
              }`}
            />
            {h}
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60"
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
  const { t } = useLanguage()

  const jobs: Job[] = t('experience.jobs')
  const fullTimeLabel: string = t('experience.full_time')
  const partTimeLabel: string = t('experience.part_time')

  return (
    <section id="experience" className="py-24 sm:py-32 relative">
      <div
        className="absolute left-0 top-1/3 w-80 h-80 bg-sky-500/5 rounded-full blur-[90px] pointer-events-none"
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
            {t('experience.section_label')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {t('experience.title_1')}{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              {t('experience.title_2')}
            </span>
          </h2>
        </motion.div>

        {/* Timeline grid */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
          }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {jobs.map((job) => (
            <JobCard
              key={job.company}
              job={job}
              typeLabel={job.type === 'full_time' ? fullTimeLabel : partTimeLabel}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
