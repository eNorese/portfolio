'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 text-accent transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

export function FAQ() {
  const { locale, t } = useLanguage()
  const items = locale.faq.items
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
            05 —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('faq.section_title')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{t('faq.subtitle')}</p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-200 hover:border-accent/30"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {item.question}
                  </span>
                  <ChevronIcon open={isOpen} />
                </button>

                {/* Answer — animated open/close via grid-rows */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* fade → Contact (white / gray-950) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-white dark:to-gray-950" />
    </section>
  )
}
