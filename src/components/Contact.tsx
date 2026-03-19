import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Send, Github, Linkedin, Instagram, Mail, MapPin, CheckCircle } from 'lucide-react'

const SOCIAL_LINKS = [
  {
    icon: Github,
    label: 'GitHub',
    handle: '@enorese',
    href: 'https://github.com/enorese',
    color: 'hover:text-zinc-100 hover:border-zinc-600',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    handle: 'Enzo Norese',
    href: 'https://linkedin.com/in/enorese',
    color: 'hover:text-sky-400 hover:border-sky-500/50',
  },
  {
    icon: Instagram,
    label: 'Instagram / FPV',
    handle: '@enorese.fpv',
    href: 'https://instagram.com/enorese.fpv',
    color: 'hover:text-pink-400 hover:border-pink-500/50',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

interface FormState {
  name: string
  email: string
  message: string
}

export default function Contact() {
  const { ref, controls } = useScrollAnimation()
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulación de envío — reemplazar con tu endpoint real (Formspree, Resend, etc.)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      {/* Glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[500px] h-[300px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none"
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
          <p className="font-mono text-sky-400 text-sm mb-2 tracking-widest">05. /contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
            ¿Trabajamos{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              juntos?
            </span>
          </h2>
          <p className="mt-3 text-zinc-400 text-sm max-w-lg">
            Estoy disponible para proyectos freelance, consultoría de bases de datos o posiciones
            de backend. Escríbeme y hablamos.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Form */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
            }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full py-16 gap-4 text-center"
              >
                <CheckCircle size={48} className="text-emerald-400" />
                <h3 className="text-xl font-bold text-zinc-100">¡Mensaje enviado!</h3>
                <p className="text-zinc-400 text-sm max-w-xs">
                  Gracias por escribirme. Te responderé a la brevedad.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', message: '' })
                  }}
                  className="mt-2 text-sm text-sky-400 hover:text-sky-300 font-mono transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <motion.div variants={fadeUp}>
                  <label htmlFor="name" className="block text-xs font-mono text-zinc-400 mb-2">
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/30 transition-all"
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={fadeUp}>
                  <label htmlFor="email" className="block text-xs font-mono text-zinc-400 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/30 transition-all"
                  />
                </motion.div>

                {/* Message */}
                <motion.div variants={fadeUp}>
                  <label
                    htmlFor="message"
                    className="block text-xs font-mono text-zinc-400 mb-2"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Cuéntame sobre tu proyecto..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/30 transition-all resize-none"
                  />
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeUp}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 hover:shadow-sky-500/35 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <>
                        <Send size={15} />
                        Enviar mensaje
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            )}
          </motion.div>

          {/* Sidebar info */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
            className="space-y-6"
          >
            {/* Contact info */}
            <motion.div
              variants={fadeUp}
              className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4"
            >
              <h3 className="text-sm font-semibold text-zinc-300">Contacto directo</h3>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Mail size={16} className="text-sky-400 flex-shrink-0" />
                <span className="font-mono">enzo@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <MapPin size={16} className="text-sky-400 flex-shrink-0" />
                <span>Santiago, Chile</span>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeUp} className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-300">Redes sociales</h3>
              {SOCIAL_LINKS.map(({ icon: Icon, label, handle, href, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border border-zinc-800 text-zinc-500 transition-all duration-200 ${color}`}
                >
                  <Icon size={18} />
                  <div>
                    <div className="text-xs font-semibold leading-tight">{label}</div>
                    <div className="text-xs font-mono opacity-70">{handle}</div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
