import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../contexts/LanguageContext'
import { Shield, Brain, Music2, Plane, TrendingUp, Award } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const INTEREST_ICONS = [Shield, Brain, Music2, Plane]
const INTEREST_COLORS = [
  { text: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-400/5 border-red-200 dark:border-red-400/20 hover:border-red-300 dark:hover:border-red-400/50' },
  { text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-400/5 border-violet-200 dark:border-violet-400/20 hover:border-violet-300 dark:hover:border-violet-400/50' },
  { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-400/5 border-sky-200 dark:border-sky-400/20 hover:border-sky-300 dark:hover:border-sky-400/50' },
  { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-400/5 border-emerald-200 dark:border-emerald-400/20 hover:border-emerald-300 dark:hover:border-emerald-400/50' },
]
const INTEREST_KEYS = ['cybersecurity', 'ai_rag', 'djing', 'fpv'] as const

export default function About() {
  const { ref, controls } = useScrollAnimation()
  const { t } = useLanguage()

  const metrics = [
    {
      value: t('about.metrics.years_teamwork'),
      label: t('about.metrics.years_teamwork_label'),
      icon: TrendingUp,
    },
    {
      value: t('about.metrics.years_exp'),
      label: t('about.metrics.years_exp_label'),
      icon: TrendingUp,
    },
    {
      value: '1',
      label: t('about.metrics.erp_label'),
      sub: t('about.metrics.erp_sublabel'),
      icon: Award,
    },
    {
      value: t('about.metrics.cert_value'),
      label: t('about.metrics.cert_label'),
      icon: Award,
    },
  ]

  return (
    <section id="about" className="py-24 sm:py-32 relative overflow-hidden">
      <div
        className="absolute right-0 top-1/3 w-96 h-96 bg-violet-500/5 rounded-full blur-[90px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="font-mono text-sky-500 dark:text-sky-400 text-sm mb-2 tracking-widest">
            {t('about.section_label')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {t('about.title_1')}{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              {t('about.title_2')}
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Columna izquierda */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
            }}
            className="space-y-5"
          >
            <motion.p
              variants={fadeUp}
              className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed"
            >
              {t('about.bio_1')}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed"
            >
              {t('about.bio_2')}
            </motion.p>

            {/* Diferencial card */}
            <motion.div
              variants={fadeUp}
              className="p-5 rounded-2xl border border-violet-200 dark:border-violet-500/20 bg-violet-50 dark:bg-violet-500/5"
            >
              <p className="text-xs font-mono text-violet-600 dark:text-violet-400 mb-2 tracking-widest">
                {t('about.differentiator_label')}
              </p>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                {t('about.differentiator')}
              </p>
            </motion.div>

            {/* Métricas */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-2 gap-3 pt-2"
            >
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40"
                >
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-mono mb-0.5">
                    {m.value}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-500 leading-tight">
                    {m.label}
                  </div>
                  {m.sub && (
                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {m.sub}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Columna derecha: intereses */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
            className="grid grid-cols-2 gap-4"
          >
            {INTEREST_KEYS.map((key, i) => {
              const Icon = INTEREST_ICONS[i]
              const colors = INTEREST_COLORS[i]
              return (
                <motion.div
                  key={key}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`p-5 rounded-2xl border ${colors.bg} transition-colors duration-300`}
                >
                  <Icon size={26} className={`${colors.text} mb-3`} />
                  <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 text-sm mb-1">
                    {t(`about.interests.${key}`)}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    {t(`about.interests.${key}_desc`)}
                  </p>
                </motion.div>
              )
            })}

            {/* Quote */}
            <motion.div
              variants={fadeUp}
              className="col-span-2 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40"
            >
              <p className="text-zinc-600 dark:text-zinc-400 text-sm italic leading-relaxed">
                "{t('about.quote')}"
              </p>
              <p className="text-xs font-mono text-zinc-400 dark:text-zinc-600 mt-2">
                {t('about.quote_author')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
