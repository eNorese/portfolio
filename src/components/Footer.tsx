'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { SocialLinks } from '@/components/SocialLinks'
import { Arrow } from '@/components/PortfolioUI'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="site-footer maker-footer">
      <div className="shell">
        <div className="footer-cta">
          <p className="eyebrow"><span className="status-dot" /> {t('design.footer_eyebrow')}</p>
          <h2>{t('design.footer_cta_1')}<br /><em>{t('design.footer_cta_2')}</em></h2>
          <div className="footer-action">
            <p>{t('design.footer_invite')}</p>
            <a href="mailto:enzo.norese@gmail.com" className="footer-email">enzo.norese@gmail.com <Arrow diagonal /></a>
          </div>
        </div>
        <div className="footer-social"><p className="eyebrow">{t('design.footer_social_label')}</p><SocialLinks size={24} variant="footer" /></div>
        <div className="footer-top"><a className="wordmark" href="#home">enorese<span className="accent">.dev</span></a><a className="button-text" href="#home">{t('design.back_top')}<Arrow diagonal /></a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Enzo Norese</span><span>{t('design.footer_note')}</span><span>Santiago, Chile ↗</span></div>
      </div>
    </footer>
  )
}
