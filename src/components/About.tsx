import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import {
  Shield,
  Brain,
  Music2,
  Plane,
  Database,
  Server,
  Code2,
  GitBranch,
} from 'lucide-react'

const INTERESTS = [
  {
    icon: Shield,
    label: 'Ciberseguridad',
    description: 'Pentesting & hardening de sistemas',
    color: 'text-red-400',
    bg: 'bg-red-400/5 border-red-400/20 hover:border-red-400/50',
  },
  {
    icon: Brain,
    label: 'IA / RAG',
    description: 'Retrieval-Augmented Generation',
    color: 'text-violet-400',
    bg: 'bg-violet-400/5 border-violet-400/20 hover:border-violet-400/50',
  },
  {
    icon: Music2,
    label: 'DJing',
    description: 'Mezclas y producción musical',
    color: 'text-sky-400',
    bg: 'bg-sky-400/5 border-sky-400/20 hover:border-sky-400/50',
  },
  {
    icon: Plane,
    label: 'FPV Drones',
    description: '@eNorese.fpv',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/5 border-emerald-400/20 hover:border-emerald-400/50',
  },
]

const SKILLS = [
  { icon: Database, label: 'SQL Server / MySQL', level: 90 },
  { icon: Server, label: 'Node.js / .NET', level: 80 },
  { icon: Code2, label: 'Stored Procedures', level: 88 },
  { icon: GitBranch, label: 'Integración ERP', level: 85 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function About() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="about" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500/5 rounded-full blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          className="mb-16"
        >
          <p className="font-mono text-sky-400 text-sm mb-2 tracking-widest">02. /about</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
            Sobre{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              mí
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Columna izquierda: texto + skills */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
            }}
            className="space-y-6"
          >
            <motion.p variants={fadeUp} className="text-zinc-300 text-base leading-relaxed">
              Soy un desarrollador backend apasionado por construir la{' '}
              <span className="text-zinc-100 font-medium">infraestructura invisible</span> que
              sostiene los sistemas críticos de negocio. Mi foco está en diseñar consultas SQL
              altamente optimizadas, stored procedures robustos y arquitecturas de datos que
              escalan sin ceder.
            </motion.p>

            <motion.p variants={fadeUp} className="text-zinc-400 text-base leading-relaxed">
              Actualmente trabajo en la migración de sistemas ERP críticos de{' '}
              <span className="font-mono text-sky-400">Softland</span> hacia{' '}
              <span className="font-mono text-violet-400">Rex+</span>, asegurando la continuidad
              de procesos contables y de inventario para empresas que no pueden permitirse el
              tiempo de inactividad.
            </motion.p>

            <motion.p variants={fadeUp} className="text-zinc-400 text-base leading-relaxed">
              Creo que el backend es el corazón de cualquier producto: si la lógica de negocio es
              sólida y la base de datos es eficiente, todo lo demás fluye. Me obsesiona la
              performance y la trazabilidad.
            </motion.p>

            {/* Skill bars */}
            <motion.div variants={fadeUp} className="pt-4 space-y-4">
              {SKILLS.map(({ icon: Icon, label, level }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <Icon size={14} className="text-sky-400" />
                      <span className="font-mono">{label}</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{level}%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={controls}
                      variants={{
                        hidden: { width: 0 },
                        visible: {
                          width: `${level}%`,
                          transition: { duration: 0.9, ease: 'easeOut', delay: 0.4 },
                        },
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Columna derecha: badges de intereses */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {INTERESTS.map(({ icon: Icon, label, description, color, bg }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`p-5 rounded-2xl border ${bg} transition-colors duration-300 cursor-default`}
              >
                <Icon size={28} className={`${color} mb-3`} />
                <h3 className="font-semibold text-zinc-100 text-sm mb-1">{label}</h3>
                <p className="text-xs text-zinc-500 font-mono">{description}</p>
              </motion.div>
            ))}

            {/* Quote card */}
            <motion.div
              variants={fadeUp}
              className="sm:col-span-2 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40"
            >
              <p className="text-zinc-400 text-sm italic leading-relaxed">
                "La optimización prematura es la raíz de todo mal — pero la base de datos lenta
                en producción también."
              </p>
              <p className="text-xs font-mono text-zinc-600 mt-2">— Enzo Norese</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
