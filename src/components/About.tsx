'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { SocialLinks } from '@/components/SocialLinks'

const techStack = [
  {
    name: 'Azure Cloud',
    icon: (
      <svg viewBox="0 0 96 96" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M33.004 6.667L4 73.333h22.667L48 26.667 33.004 6.667z" fill="#0089D6" />
        <path d="M38.667 13.333L22 58.667H4L33.004 6.667 38.667 13.333zM48 26.667L26.667 73.333H92L48 26.667z" fill="#0072C6" />
        <path d="M26.667 73.333L48 26.667 92 73.333H26.667z" fill="#0089D6" />
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="#3178C6" />
        <path d="M18.245 22.82v2.573c.418.214.913.376 1.483.487.57.11 1.172.166 1.806.166.617 0 1.2-.066 1.748-.197a4.05 4.05 0 0 0 1.408-.633 2.98 2.98 0 0 0 .941-1.107c.228-.454.342-.997.342-1.63 0-.463-.068-.87-.204-1.223a2.85 2.85 0 0 0-.594-.944 4.268 4.268 0 0 0-.95-.728 10.55 10.55 0 0 0-1.265-.596c-.344-.134-.648-.263-.913-.387a3.574 3.574 0 0 1-.672-.383 1.59 1.59 0 0 1-.418-.457.976.976 0 0 1-.14-.52c0-.18.042-.34.126-.48a1.1 1.1 0 0 1 .355-.361 1.77 1.77 0 0 1 .55-.224 2.9 2.9 0 0 1 .706-.079c.187 0 .382.014.585.042.203.028.405.074.607.137.202.063.398.145.587.246.19.1.363.22.52.36V16.64a6.2 6.2 0 0 0-1.142-.306 8.1 8.1 0 0 0-1.387-.107c-.609 0-1.185.07-1.727.208a4.048 4.048 0 0 0-1.388.647 3.047 3.047 0 0 0-.917 1.092c-.22.44-.33.955-.33 1.544 0 .765.22 1.414.662 1.948.44.534 1.104.979 1.99 1.335.363.14.696.277 1 .41.302.133.562.273.78.42.218.146.388.307.51.482.123.175.184.376.184.604 0 .17-.037.328-.11.472a.997.997 0 0 1-.33.365 1.65 1.65 0 0 1-.55.231 3.13 3.13 0 0 1-.77.085c-.504 0-1.003-.094-1.497-.28a5.01 5.01 0 0 1-1.356-.794zm-4.666-5.635h3.297V15H8v2.185h3.285V28h2.294V17.185z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Serverless',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent" fill="none" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
      </svg>
    ),
  },
  {
    name: 'IA Aplicada',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-accent" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Neural network: 3 layers of nodes connected by edges */}
        {/* Edges — drawn first so nodes sit on top */}
        <line x1="4" y1="7"  x2="10" y2="5"  stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="4" y1="7"  x2="10" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="4" y1="7"  x2="10" y2="19" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="4" y1="17" x2="10" y2="5"  stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="4" y1="17" x2="10" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="4" y1="17" x2="10" y2="19" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="10" y1="5"  x2="14" y2="9"  stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="10" y1="5"  x2="14" y2="15" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="10" y1="12" x2="14" y2="9"  stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="10" y1="12" x2="14" y2="15" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="10" y1="19" x2="14" y2="9"  stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="10" y1="19" x2="14" y2="15" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="14" y1="9"  x2="20" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="14" y1="15" x2="20" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        {/* Nodes */}
        <circle cx="4"  cy="7"  r="1.8" fill="currentColor" />
        <circle cx="4"  cy="17" r="1.8" fill="currentColor" />
        <circle cx="10" cy="5"  r="1.8" fill="currentColor" />
        <circle cx="10" cy="12" r="1.8" fill="currentColor" />
        <circle cx="10" cy="19" r="1.8" fill="currentColor" />
        <circle cx="14" cy="9"  r="1.8" fill="currentColor" />
        <circle cx="14" cy="15" r="1.8" fill="currentColor" />
        <circle cx="20" cy="12" r="1.8" fill="currentColor" />
      </svg>
    ),
  },
]

export function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="relative py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
            01 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('about.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('about.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Bio — wider column */}
          <div className="lg:col-span-3 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-base">
            <p>{t('about.bio_1')}</p>
            <p>{t('about.bio_2')}</p>
            <p>{t('about.bio_3')}</p>

            {/* Social + CV */}
            <div className="flex flex-wrap items-center gap-5 pt-4">
              <SocialLinks size={20} baseClass="text-gray-400 dark:text-gray-500" />
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 hidden sm:block" />
              <a
                href="/cv.pdf"
                download
                className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-accent transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {t('hero.cv_download')}
              </a>
            </div>
          </div>

          {/* Tech stack badges — narrower column */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {techStack.map(({ name, icon }) => (
              <div
                key={name}
                className="group border border-gray-200/60 dark:border-gray-700/60 rounded-xl p-5 flex flex-col items-center gap-3 text-center cursor-default backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-md hover:shadow-accent/10"
              >
                <span className="transition-transform duration-300 group-hover:scale-110">
                  {icon}
                </span>
                <span className="text-xs font-mono font-medium tracking-wide text-gray-600 dark:text-gray-300 group-hover:text-accent transition-colors duration-300">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* fade → Experience (white / gray-950) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-white dark:to-gray-950" />
    </section>
  )
}
