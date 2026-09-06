'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { SocialLinks } from '@/components/SocialLinks'
import { Arrow } from '@/components/PortfolioUI'
import { portfolioSections } from '@/config/sections'
import { HeroSky } from '@/components/HeroSky'
import { useMotion } from '@/components/MotionProvider'
export function Hero() {
  const { t } = useLanguage()
  const { active, reduced, toggle } = useMotion()
  return (
    <section id="home" className="hero-section">
      <HeroSky />
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="shell">
        <div className="hero-meta">
          <span>
            <span className="status-dot" />
            {t('contact.info.availability_value')}
          </span>
          <span>{t('contact.info.location_value')} ↗</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow hero-signature">
              {t('design.hero_signature')}
            </p>
            <h1>
              {t('design.hero_line_1')}
              <br />
              <em>{t('design.hero_line_2')}</em>
            </h1>
            <p className="hero-role">
              {t('design.backend_role')} <span>/</span> {t('design.cloud_role')}
            </p>
            <p className="hero-description">{t('design.hero_description')}</p>
            <div className="hero-actions">
              {portfolioSections.projects && (
                <a href="#proyectos" className="button-primary">
                  {t('hero.cta_work')}
                  <Arrow />
                </a>
              )}
              {portfolioSections.contact && (
                <a href="#contacto" className="button-text">
                  {t('design.lets_talk')}
                  <Arrow diagonal />
                </a>
              )}
            </div>
            <div className="hero-social">
              <SocialLinks size={18} baseClass="muted" />
              <span className="social-rule" />
              <span className="mono">{t('design.built_with_intent')}</span>
            </div>
          </div>
          <div className="architecture-art" aria-hidden="true">
            <div className="art-topline">
              <span>EN / SYSTEM ARCHITECTURE</span>
              <span>v.01</span>
            </div>
            <svg className="orbit-svg" viewBox="0 0 460 410" fill="none">
              <defs>
                <radialGradient id="orbit-glow">
                  <stop stopColor="currentColor" stopOpacity=".12" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="230" cy="205" r="190" fill="url(#orbit-glow)" />
              <g stroke="currentColor" className="orbital-paths">
                <ellipse
                  cx="230"
                  cy="205"
                  rx="181"
                  ry="70"
                  transform="rotate(-35 230 205)"
                  opacity=".35"
                />
                <ellipse
                  cx="230"
                  cy="205"
                  rx="181"
                  ry="70"
                  transform="rotate(35 230 205)"
                  opacity=".35"
                />
                <ellipse
                  cx="230"
                  cy="205"
                  rx="181"
                  ry="70"
                  transform="rotate(90 230 205)"
                  opacity=".2"
                />
                <circle
                  cx="230"
                  cy="205"
                  r="154"
                  strokeDasharray="2 8"
                  opacity=".22"
                />
              </g>
              <g className="orbit-points" fill="currentColor">
                <circle cx="88" cy="115" r="4" />
                <circle cx="374" cy="112" r="4" />
                <circle cx="230" cy="359" r="4" />
              </g>
              <g
                transform="translate(177 151)"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path
                  d="M53 0 106 30v60l-53 30L0 90V30Z"
                  fill="var(--surface)"
                />
                <path
                  d="m0 30 53 30 53-30M53 60v60M27 15l53 30v60M80 15 27 45v60M0 60l53 30 53-30"
                  opacity=".55"
                />
                <path
                  d="m0 30 53 30 53-30-53-30Z"
                  fill="currentColor"
                  fillOpacity=".15"
                />
              </g>
            </svg>
            <span className="orbit-label orbit-label-top">CLOUD</span>
            <span className="orbit-label orbit-label-left">BACKEND</span>
            <span className="orbit-label orbit-label-right">AI</span>
            <div className="code-caption">
              <span className="muted">const</span> approach = {'{'}
              <br />
              <span className="code-indent">
                architecture: <span>&apos;intentional&apos;</span>,
              </span>
              <br />
              <span className="code-indent">
                impact: <span>&apos;real&apos;</span>
              </span>
              <br />
              {'}'};
            </div>
            <div className="art-bottomline">
              <span className="status-dot" />
              {t('design.art_caption')}
              <span>01 / 03</span>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <p className="eyebrow">{t('design.core_stack')}</p>
          <div className="stack-line">
            <span>
              <b className="stack-symbol">△</b> Microsoft Azure
            </span>
            <span>
              <b className="ts-symbol">TS</b> TypeScript
            </span>
            <span>
              <b className="stack-symbol">⬡</b> Node.js
            </span>
            <span>
              <b className="stack-symbol">◎</b> PostgreSQL
            </span>
            <span>
              <b className="stack-symbol">✳</b> Applied AI
            </span>
          </div>
          <button
            className="motion-toggle"
            onClick={toggle}
            disabled={reduced}
            aria-pressed={active}
            aria-label={t(
              reduced
                ? 'design.reduced_motion'
                : active
                  ? 'design.pause_motion'
                  : 'design.resume_motion',
            )}
            title={t(
              reduced
                ? 'design.reduced_motion'
                : active
                  ? 'design.pause_motion'
                  : 'design.resume_motion',
            )}
          >
            <span aria-hidden="true">{active ? 'Ⅱ' : '▷'}</span>
            <span className="mono">{active ? 'ON' : 'OFF'}</span>
          </button>
          <a
            className="explore-link"
            href={portfolioSections.projects ? '#proyectos' : '#sobre-mi'}
            aria-label={t('hero.scroll')}
          >
            ↓
          </a>
        </div>
      </div>
    </section>
  )
}
