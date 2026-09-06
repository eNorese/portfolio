'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { SocialLinks } from '@/components/SocialLinks'
import { Arrow } from '@/components/PortfolioUI'
export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <a className="wordmark" href="#home">
            enorese<span className="accent">.dev</span>
          </a>
          <SocialLinks size={18} baseClass="muted" />
          <a className="button-text" href="#home">
            {t('design.back_top')}
            <Arrow diagonal />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Enzo Norese</span>
          <span>{t('design.footer_note')}</span>
          <span>Santiago, Chile ↗</span>
        </div>
      </div>
    </footer>
  )
}
