'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// ── Minimal scroll-reveal hook (mismo patrón que Experience) ───────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

// ── Iconos por servicio (orden = orden de items en i18n) ───────────────
const ICONS: React.ReactNode[] = [
  // 1. Automatización de procesos con IA — engranaje + chispa
  <svg key="i0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 3h3l.4 2.1a6.6 6.6 0 0 1 1.8 1l2-.8 1.5 2.6-1.6 1.4a6.7 6.7 0 0 1 0 2.1l1.6 1.4-1.5 2.6-2-.8a6.6 6.6 0 0 1-1.8 1L13.5 21h-3l-.4-2.1a6.6 6.6 0 0 1-1.8-1l-2 .8L4.8 16l1.6-1.4a6.7 6.7 0 0 1 0-2.1L4.8 11l1.5-2.6 2 .8a6.6 6.6 0 0 1 1.8-1L10.5 3Z" />
    <circle cx="12" cy="12" r="2.4" />
  </svg>,
  // 2. Agentes y asistentes con IA — chat/bot
  <svg key="i1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="7" width="16" height="11" rx="2.5" />
    <path d="M12 7V4" /><circle cx="12" cy="3.2" r="1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
    <path d="M9.5 15h5" />
  </svg>,
  // 3. Arquitectura backend & cloud — nube + servidor
  <svg key="i2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 18h9a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 6 9.5 3.75 3.75 0 0 0 7 18Z" />
    <path d="M9.5 14.5h5" />
  </svg>,
  // 4. Integración de sistemas y APIs — nodos conectados
  <svg key="i3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" />
    <path d="M6.8 11 17.2 6.8M6.8 13l10.4 4.2" />
  </svg>,
  // 5. Migración a la nube sin downtime — nube con flecha
  <svg key="i4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 18h9a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 6 9.5 3.75 3.75 0 0 0 7 18Z" />
    <path d="M12 15.5v-5M12 10.5 10 12.5M12 10.5l2 2" />
  </svg>,
  // 6. Consultoría y revisión de arquitectura — lupa
  <svg key="i5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-3.5-3.5" />
    <path d="M9 11h4M11 9v4" />
  </svg>,
]

type ServiceItem = { title: string; description: string }

function ServiceCard({ item, icon, index }: { item: ServiceItem; icon: React.ReactNode; index: number }) {
  const { ref, visible } = useReveal(0.15)
  const delay = index * 90

  return (
    <div
      ref={ref}
      className="motion-card group relative flex flex-col bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
    >
      <div className="mb-4 w-11 h-11 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent transition-transform duration-300 group-hover:scale-110">
        <span className="w-6 h-6">{icon}</span>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors duration-200">
        {item.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {item.description}
      </p>
    </div>
  )
}

// ── Section ────────────────────────────────────────────────────────────
export function Services() {
  const { locale, t } = useLanguage()
  const items = locale.services.items as ServiceItem[]
  const cta = useReveal(0.2)

  return (
    <section id="servicios" className="section-atmosphere relative py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-8" data-reveal>
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
            03 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('services.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('services.subtitle')}</p>
        </div>

        {/* Intro */}
        <p className="max-w-2xl text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-12" data-reveal data-reveal-delay="1">
          {t('services.intro')}
        </p>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <ServiceCard key={i} item={item} icon={ICONS[i] ?? ICONS[0]} index={i} />
          ))}
        </div>

        {/* Conversion CTA band */}
        <div
          ref={cta.ref}
          className="relative mt-14 overflow-hidden rounded-2xl border border-accent/25 bg-accent/[0.06] dark:bg-accent/[0.08] p-8 sm:p-10 text-center"
          style={{
            opacity: cta.visible ? 1 : 0,
            transform: cta.visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* soft glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top, rgb(var(--accent) / 0.12), transparent 70%)' }}
          />
          <div className="relative">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t('services.cta_title')}
            </h3>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-7">
              {t('services.cta_description')}
            </p>
            <a
              href="#contacto"
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-accent text-white text-sm font-medium transition-all duration-300 hover:shadow-[0_0_22px_var(--accent-glow)] active:scale-95"
            >
              {t('services.cta_button')}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
