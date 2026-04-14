'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'

const THEMES = [
  { id: 'light',    label: 'Light',    swatch: '#6366f1', dark: false },
  { id: 'dark',     label: 'Dark',     swatch: '#818cf8', dark: true  },
  { id: 'forest',   label: 'Forest',   swatch: '#16a34a', dark: false },
  { id: 'ocean',    label: 'Ocean',    swatch: '#06b6d4', dark: true  },
  { id: 'midnight', label: 'Midnight', swatch: '#a78bfa', dark: true  },
] as const

export function ThemeSelector() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function selectTheme(id: string) {
    if (!('startViewTransition' in document)) {
      setTheme(id)
      setOpen(false)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(document as any).startViewTransition(() => {
      setTheme(id)
      setOpen(false)
    })
  }

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[1]

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger — shows current theme colour swatch */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Select theme"
        aria-expanded={open}
        className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
      >
        {mounted ? (
          <span
            className="w-3.5 h-3.5 rounded-full ring-2 ring-black/[0.08] dark:ring-white/[0.10]"
            style={{ backgroundColor: current.swatch }}
          />
        ) : (
          <span className="w-3.5 h-3.5 rounded-full bg-gray-300 dark:bg-gray-600" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 min-w-[148px] bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/60 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/40 py-1.5 z-50">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTheme(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs transition-colors duration-150 ${
                theme === t.id
                  ? 'text-gray-900 dark:text-white bg-gray-100/80 dark:bg-white/[0.07]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full ring-1 ring-black/[0.08] dark:ring-white/[0.08] shrink-0"
                style={{ backgroundColor: t.swatch }}
              />
              {t.label}
              {theme === t.id && (
                <svg
                  className="w-3 h-3 ml-auto shrink-0 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
