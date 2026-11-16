'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { SocialLinks } from '@/components/SocialLinks'
import { Arrow } from '@/components/PortfolioUI'
import { portfolioSections } from '@/config/sections'
import { useMotion } from '@/components/MotionProvider'

export function Hero() {
  const { t } = useLanguage()
  const { active, reduced, toggle } = useMotion()
  return (
    <section id="home" className="hero-section maker-hero">
      <div className="shell">
        <div className="hero-meta"><span><span className="status-dot" />{t('contact.info.availability_value')}</span><span>{t('contact.info.location_value')} ↗</span></div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow hero-signature">ENZO NORESE <span aria-hidden="true">/</span> AI BUILDER &amp; ENGINEER</p>
            <h1>{t('design.hero_line_1')}<br /><em>{t('design.hero_line_2')}</em></h1>
            <p className="hero-role">{t('design.backend_role')} <span>/</span> {t('design.cloud_role')}</p>
            <p className="hero-statement">{t('design.hero_statement')}</p>
            <p className="hero-description">{t('design.hero_description')}</p>
            <div className="hero-actions">
              {portfolioSections.projects && <a href="#proyectos" className="button-primary"><span className="hero-cta-index">01 /</span>{t('hero.cta_work')}<Arrow /></a>}
              {portfolioSections.contact && <a href="#contacto" className="button-text">{t('design.lets_talk')}<Arrow diagonal /></a>}
            </div>
            <div className="hero-social"><SocialLinks size={18} baseClass="muted" /><span className="social-rule" /><span className="mono">{t('design.built_with_intent')}</span></div>
          </div>
          <div className="maker-workbench" role="img" aria-label={t('design.workbench_label')}>
            <div className="workbench-header"><span><i /> EN / BUILD LOG</span><span>001 — 003</span></div>
            <div className="workbench-main">
              <p className="workbench-overline">{t('design.workbench_kicker')}</p>
              <p className="workbench-title">{t('design.workbench_title')}</p>
              <p className="workbench-description">{t('design.workbench_description')}</p>
              <div className="workbench-flow" aria-hidden="true">
                <div className="flow-node"><span>01 / INPUT</span><strong>{t('design.workbench_input')}</strong><small>Formulario · WhatsApp · API</small></div>
                <div className="flow-track"><span /><span /><span /></div>
                <div className="flow-node flow-node-active"><span>02 / INTELLIGENCE</span><strong>{t('design.workbench_intelligence')}</strong><small>Models · Rules · Human review</small></div>
                <div className="flow-track"><span /><span /><span /></div>
                <div className="flow-node"><span>03 / OUTPUT</span><strong>{t('design.workbench_output')}</strong><small>Azure Functions · PostgreSQL</small></div>
              </div>
            </div>
            <div className="workbench-footer"><span className="workbench-pulse" />{t('design.workbench_caption')}<span className="workbench-arrow">↗</span></div>
          </div>
        </div>
        <div className="hero-bottom">
          <p className="eyebrow">{t('design.core_stack')}</p>
          <div className="stack-line"><span>Microsoft Azure</span><span>TypeScript</span><span>Node.js</span><span>PostgreSQL</span><span>Applied AI</span></div>
          <button className="motion-toggle" onClick={toggle} disabled={reduced} aria-pressed={active} aria-label={t(reduced ? 'design.reduced_motion' : active ? 'design.pause_motion' : 'design.resume_motion')} title={t(reduced ? 'design.reduced_motion' : active ? 'design.pause_motion' : 'design.resume_motion')}><span aria-hidden="true">{active ? 'Ⅱ' : '▷'}</span><span className="mono">{active ? 'ON' : 'OFF'}</span></button>
          <a className="explore-link" href={portfolioSections.projects ? '#proyectos' : '#sobre-mi'} aria-label={t('hero.scroll')}>↓</a>
        </div>
      </div>
    </section>
  )
}
