import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../contexts/LanguageContext'
import { CONTACT_EMAIL, SOCIAL_LINKS } from '../lib/constants'
import { Send, Github, Linkedin, Mail, MapPin, CheckCircle, ChevronDown } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

export default function Contact() {
  const { ref, controls } = useScrollAnimation()
  const { t } = useLanguage()
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const subjectOptions: string[] = t('contact.form.subject_options')

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {}
    if (!form.name.trim()) newErrors.name = '·'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = '·'
    if (!form.subject) newErrors.subject = '·'
    if (!form.message.trim()) newErrors.message = '·'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    // TODO: Configurar EmailJS
    // import emailjs from '@emailjs/browser'
    // await emailjs.send(
    //   'YOUR_SERVICE_ID',    // de https://dashboard.emailjs.com/admin
    //   'YOUR_TEMPLATE_ID',   // de https://dashboard.emailjs.com/admin/templates
    //   { from_name: form.name, from_email: form.email, subject: form.subject, message: form.message },
    //   'YOUR_PUBLIC_KEY'     // de https://dashboard.emailjs.com/admin/account
    // )

    await new Promise((r) => setTimeout(r, 1200)) // placeholder
    setLoading(false)
    setSubmitted(true)
  }

  const inputBase =
    'w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:outline-none transition-all'
  const inputValid = 'border-zinc-200 dark:border-zinc-700 focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/30'
  const inputError = 'border-red-400/60 focus:border-red-400/70 focus:ring-1 focus:ring-red-400/20'

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      handle: '@enorese', // TODO: tu handle real
      href: SOCIAL_LINKS.github,
      hover: 'hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      handle: 'Enzo Norese',
      href: SOCIAL_LINKS.linkedin,
      hover: 'hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-400/50 dark:hover:border-sky-500/50',
    },
  ]

  return (
    <section id="contact" className="py-24 sm:py-32 relative overflow-hidden">
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-[300px] bg-sky-500/5 rounded-full blur-[110px] pointer-events-none"
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
            {t('contact.section_label')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {t('contact.title_1')}{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              {t('contact.title_2')}
            </span>
          </h2>
          <p className="mt-2 text-2xl font-bold text-zinc-700 dark:text-zinc-300">
            {t('contact.subtitle')}
          </p>
          <p className="mt-3 text-zinc-500 dark:text-zinc-500 text-sm max-w-lg">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          {/* Form */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
            }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-4 text-center"
              >
                <CheckCircle size={44} className="text-emerald-500 dark:text-emerald-400" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {t('contact.form.success_title')}
                </h3>
                <p className="text-zinc-500 text-sm max-w-xs">
                  {t('contact.form.success_desc')}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', subject: '', message: '' })
                  }}
                  className="mt-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-mono transition-colors"
                >
                  {t('contact.form.send_another')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div variants={fadeUp}>
                    <label htmlFor="name" className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-2">
                      {t('contact.form.name_label')}
                    </label>
                    <input
                      id="name" name="name" type="text"
                      value={form.name} onChange={handleChange}
                      placeholder={t('contact.form.name_placeholder')}
                      className={`${inputBase} ${errors.name ? inputError : inputValid}`}
                    />
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <label htmlFor="email" className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-2">
                      {t('contact.form.email_label')}
                    </label>
                    <input
                      id="email" name="email" type="email"
                      value={form.email} onChange={handleChange}
                      placeholder={t('contact.form.email_placeholder')}
                      className={`${inputBase} ${errors.email ? inputError : inputValid}`}
                    />
                  </motion.div>
                </div>

                {/* Subject */}
                <motion.div variants={fadeUp}>
                  <label htmlFor="subject" className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-2">
                    {t('contact.form.subject_label')}
                  </label>
                  <div className="relative">
                    <select
                      id="subject" name="subject"
                      value={form.subject} onChange={handleChange}
                      className={`${inputBase} ${errors.subject ? inputError : inputValid} appearance-none pr-10`}
                    >
                      <option value="" disabled>
                        {t('contact.form.subject_placeholder')}
                      </option>
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                    />
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div variants={fadeUp}>
                  <label htmlFor="message" className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-2">
                    {t('contact.form.message_label')}
                  </label>
                  <textarea
                    id="message" name="message"
                    rows={5} value={form.message} onChange={handleChange}
                    placeholder={t('contact.form.message_placeholder')}
                    className={`${inputBase} ${errors.message ? inputError : inputValid} resize-none`}
                  />
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeUp}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 hover:shadow-sky-500/35 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        {t('contact.form.sending')}
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        {t('contact.form.submit')}
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
            }}
            className="space-y-5"
          >
            {/* Direct contact */}
            <motion.div
              variants={fadeUp}
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-3.5"
            >
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {t('contact.direct_contact')}
              </h3>
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <Mail size={15} className="text-sky-500 dark:text-sky-400 flex-shrink-0" />
                {/* TODO: actualiza CONTACT_EMAIL en src/lib/constants.ts */}
                <span className="font-mono text-xs">{CONTACT_EMAIL}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <MapPin size={15} className="text-sky-500 dark:text-sky-400 flex-shrink-0" />
                <span className="text-sm">Santiago, Chile</span>
              </div>
            </motion.div>

            {/* Social */}
            <motion.div variants={fadeUp} className="space-y-2.5">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {t('contact.social_title')}
              </h3>
              {socialLinks.map(({ icon: Icon, label, handle, href, hover }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 transition-all duration-200 ${hover}`}
                >
                  <Icon size={17} />
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
