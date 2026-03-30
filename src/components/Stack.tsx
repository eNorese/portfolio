import { motion } from 'framer-motion'
import {
  SiNodedotjs,
  SiTypescript,
  SiSharp,
  SiDotnet,
  SiPostgresql,
  SiReact,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiOpenai,
} from 'react-icons/si'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../contexts/LanguageContext'
import { STACK, type StackCategory } from '../lib/constants'

// Mapa de iconKey → componente de react-icons/si
const ICON_MAP: Record<string, React.ElementType> = {
  SiNodedotjs,
  SiTypescript,
  SiSharp,
  SiDotnet,
  SiPostgresql,
  SiReact,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiOpenai,
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const CATEGORY_ORDER: StackCategory[] = ['cloud', 'backend', 'databases', 'ai', 'frontend']

function TechBadge({
  name,
  iconKey,
  color,
}: {
  name: string
  iconKey: string | null
  color: string
}) {
  const Icon = iconKey ? ICON_MAP[iconKey] : null

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-default"
    >
      {Icon ? (
        <Icon style={{ color }} className="w-4 h-4 flex-shrink-0" />
      ) : (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
        {name}
      </span>
    </motion.div>
  )
}

export default function Stack() {
  const { ref, controls } = useScrollAnimation()
  const { t } = useLanguage()

  return (
    <section id="stack" className="py-24 sm:py-32 relative overflow-hidden">
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[300px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="font-mono text-sky-500 dark:text-sky-400 text-sm mb-2 tracking-widest">
            {t('stack.section_label')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {t('stack.title_1')}{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              {t('stack.title_2')}
            </span>
          </h2>
        </motion.div>

        {/* Categories */}
        <div className="space-y-10">
          {CATEGORY_ORDER.map((cat) => (
            <motion.div
              key={cat}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
              }}
            >
              <motion.p
                variants={fadeUp}
                className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-4 uppercase tracking-widest"
              >
                {t(`stack.categories.${cat}`)}
              </motion.p>
              <div className="flex flex-wrap gap-2.5">
                {STACK[cat].map((item) => (
                  <TechBadge key={item.name} {...item} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
