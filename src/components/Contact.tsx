'use client'
import { useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { SectionHeading, Arrow } from '@/components/PortfolioUI'
import social from '@/config/social.json'
type Fields = { name: string; email: string; message: string }
type Status = 'idle' | 'sending' | 'sent' | 'error'
export function Contact() {
  const { t } = useLanguage()
  const [fields, setFields] = useState<Fields>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Fields>>({})
  const [status, setStatus] = useState<Status>('idle')
  const honeypot = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const sending = useRef(false)
  function change(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const key = event.target.name as keyof Fields
    setFields((previous) => ({ ...previous, [key]: event.target.value }))
    setErrors((previous) => ({ ...previous, [key]: undefined }))
    if (status !== 'idle') setStatus('idle')
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (sending.current) return
    const next: Partial<Fields> = {}
    if (!fields.name.trim()) next.name = t('contact.form.error_name_required')
    else if (fields.name.trim().length < 2)
      next.name = t('contact.form.error_name_min')
    if (!fields.email.trim())
      next.email = t('contact.form.error_email_required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      next.email = t('contact.form.error_email_invalid')
    if (!fields.message.trim())
      next.message = t('contact.form.error_message_required')
    else if (fields.message.trim().length < 10)
      next.message = t('contact.form.error_message_min')
    setErrors(next)
    if (Object.keys(next).length) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus()
      return
    }
    sending.current = true
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          website: honeypot.current?.value ?? '',
        }),
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error('Contact request failed')
      setStatus('sent')
      setFields({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    } finally {
      sending.current = false
    }
  }
  return (
    <section id="contacto" className="portfolio-section contact-section">
      <div className="shell">
        <SectionHeading
          number="07"
          label={t('nav.contact')}
          title={t('design.contact_title')}
        />
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="lead-copy">{t('contact.description')}</p>
            <a className="contact-email" href="mailto:enzo.norese@gmail.com">
              enzo.norese@gmail.com
              <Arrow diagonal />
            </a>
            <p className="contact-status">
              <span className="status-dot" />
              {t('contact.info.availability_value')}
            </p>
            {social.whatsapp.enabled && (
              <a
                href={`https://wa.me/${social.whatsapp.number.replace(/\D/g, '')}?text=${encodeURIComponent(t('whatsapp.message'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button-text"
              >
                {t('design.whatsapp')}
                <Arrow diagonal />
              </a>
            )}
            <p className="contact-footnote">{t('design.contact_note')}</p>
          </div>
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            className="contact-form"
            aria-busy={status === 'sending'}
          >
            <input
              ref={honeypot}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="honeypot"
            />
            <div className="form-row">
              {(['name', 'email'] as const).map((key) => (
                <div className="field" key={key}>
                  <label htmlFor={`contact-${key}`}>
                    {t(`contact.form.placeholder_${key}`)}
                    <span aria-hidden="true"> *</span>
                  </label>
                  <input
                    id={`contact-${key}`}
                    name={key}
                    type={key === 'email' ? 'email' : 'text'}
                    autoComplete={key}
                    required
                    value={fields[key]}
                    onChange={change}
                    disabled={status === 'sending'}
                    maxLength={key === 'name' ? 100 : 254}
                    placeholder={t(`design.placeholder_${key}`)}
                    aria-invalid={Boolean(errors[key])}
                    aria-describedby={errors[key] ? `error-${key}` : undefined}
                  />
                  {errors[key] && (
                    <p id={`error-${key}`} className="field-error">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="field">
              <label htmlFor="contact-message">
                {t('design.message_label')}
                <span aria-hidden="true"> *</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                value={fields.message}
                onChange={change}
                disabled={status === 'sending'}
                maxLength={5000}
                placeholder={t('contact.form.placeholder_message')}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'error-message' : undefined}
              />
              {errors.message && (
                <p id="error-message" className="field-error">
                  {errors.message}
                </p>
              )}
            </div>
            <div aria-live="polite" aria-atomic="true">
              {status === 'sent' && (
                <p className="form-success">
                  {t('contact.form.success_message')}
                </p>
              )}
              {status === 'error' && (
                <p className="field-error" role="alert">
                  {t('contact.form.error_message')}{' '}
                  <a href="mailto:enzo.norese@gmail.com">
                    {t('design.email_instead')}
                  </a>
                </p>
              )}
            </div>
            <div className="form-bottom">
              <span className="muted">{t('design.required_fields')}</span>
              <button
                type="submit"
                className="button-primary"
                disabled={status === 'sending'}
              >
                {t(
                  status === 'sending'
                    ? 'contact.form.sending'
                    : 'contact.form.send',
                )}
                <Arrow diagonal />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
