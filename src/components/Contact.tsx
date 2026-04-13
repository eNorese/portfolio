'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// ── Icons ──────────────────────────────────────────────────────────────
function MailIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  )
}

function StatusIcon() {
  return (
    <span className="w-4 h-4 shrink-0 flex items-center justify-center">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
    </span>
  )
}

// ── Types ──────────────────────────────────────────────────────────────
type FormFields = { name: string; email: string; message: string }
type FormErrors = Partial<FormFields>
type Status = 'idle' | 'sending' | 'sent' | 'error'

const FIELD_CLASS =
  'w-full px-4 py-3 rounded-xl text-sm border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200'
const FIELD_VALID =
  'border-gray-200 dark:border-gray-700 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-600'
const FIELD_INVALID =
  'border-red-400 dark:border-red-600 focus:ring-red-400/30 focus:border-red-400 dark:focus:border-red-500'

// ── Section ─────────────────────────────────────────────────────────────
export function Contact() {
  const { t } = useLanguage()

  const [fields, setFields] = useState<FormFields>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  // ── Validation ──────────────────────────────────────────────────────
  function validate(data: FormFields): FormErrors {
    const errs: FormErrors = {}
    if (!data.name.trim()) errs.name = t('contact.form.error_name_required')
    else if (data.name.trim().length < 2) errs.name = t('contact.form.error_name_min')

    if (!data.email.trim()) errs.email = t('contact.form.error_email_required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = t('contact.form.error_email_invalid')

    if (!data.message.trim()) errs.message = t('contact.form.error_message_required')
    else if (data.message.trim().length < 10) errs.message = t('contact.form.error_message_min')

    return errs
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    // Clear error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setStatus('sending')
    // Simulate async send (replace with real API call)
    setTimeout(() => {
      setStatus('sent')
      setFields({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    }, 1500)
  }

  const isSending = status === 'sending'
  const isSent    = status === 'sent'

  return (
    <section id="contact" className="relative py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-2">
            05 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('contact.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('contact.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Info column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              {t('contact.description')}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <MapPinIcon />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                    {t('contact.info.location_label')}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t('contact.info.location_value')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <StatusIcon />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                    {t('contact.info.availability_label')}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    {t('contact.info.availability_value')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 flex flex-col gap-4">

            {/* Success banner */}
            {isSent && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {t('contact.form.success_message')}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                  placeholder={t('contact.form.placeholder_name')}
                  disabled={isSending || isSent}
                  className={`${FIELD_CLASS} ${errors.name ? FIELD_INVALID : FIELD_VALID}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 ml-1">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  placeholder={t('contact.form.placeholder_email')}
                  disabled={isSending || isSent}
                  className={`${FIELD_CLASS} ${errors.email ? FIELD_INVALID : FIELD_VALID}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 ml-1">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <textarea
                rows={6}
                name="message"
                value={fields.message}
                onChange={handleChange}
                placeholder={t('contact.form.placeholder_message')}
                disabled={isSending || isSent}
                className={`${FIELD_CLASS} resize-none ${errors.message ? FIELD_INVALID : FIELD_VALID}`}
              />
              {errors.message && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 ml-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit button — shimmer + neon glow + arrow slide */}
            <button
              type="submit"
              disabled={isSending || isSent}
              className="group relative self-start inline-flex items-center gap-2 px-7 py-3 rounded-full overflow-hidden bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.45)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {/* Shimmer sweep */}
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              />

              {/* Label */}
              <span className="relative">
                {isSending ? t('contact.form.sending') : isSent ? t('contact.form.sent') : t('contact.form.send')}
              </span>

              {/* Icon */}
              <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                {isSending ? (
                  // Spinner
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                  </svg>
                ) : isSent ? (
                  // Checkmark
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  // Send arrow
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* fade → Footer (white / gray-950) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-white dark:to-gray-950" />
    </section>
  )
}
