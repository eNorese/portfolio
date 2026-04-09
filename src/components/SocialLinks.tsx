'use client'

import { useState } from 'react'
import socialConfig from '@/config/social.json'

// ── Brand metadata ───────────────────────────────────────────────────
const BRAND = {
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    glow: 'rgba(10,102,194,0.65)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  github: {
    label: 'GitHub',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.65)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    glow: 'rgba(225,48,108,0.65)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  tiktok: {
    label: 'TikTok',
    color: '#69C9D0',
    glow: 'rgba(105,201,208,0.65)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.99a8.28 8.28 0 0 0 4.83 1.53V7.07a4.85 4.85 0 0 1-1.06-.38z" />
      </svg>
    ),
  },
} as const

type Platform = keyof typeof BRAND
const PLATFORMS: Platform[] = ['linkedin', 'github', 'instagram', 'tiktok']

interface SocialLinksProps {
  /** Icon size in px (default 20) */
  size?: number
  /** Base color class for unhoverd icons (default: text-gray-400) */
  baseClass?: string
}

export function SocialLinks({ size = 20, baseClass = 'text-gray-400' }: SocialLinksProps) {
  const [hovered, setHovered] = useState<Platform | null>(null)

  const enabled = PLATFORMS.filter((p) => socialConfig[p].enabled)
  if (enabled.length === 0) return null

  return (
    <div className="flex items-center gap-4">
      {enabled.map((platform) => {
        const { label, color, glow, icon } = BRAND[platform]
        const isHovered = hovered === platform
        const cfg = socialConfig[platform] as { enabled: boolean; url: string }

        return (
          <a
            key={platform}
            href={cfg.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            onMouseEnter={() => setHovered(platform)}
            onMouseLeave={() => setHovered(null)}
            className={`${baseClass} transition-none`}
            style={{
              width: size,
              height: size,
              display: 'block',
              color: isHovered ? color : undefined,
              filter: isHovered ? `drop-shadow(0 0 7px ${glow})` : 'none',
              transform: isHovered ? 'translateY(-4px) scale(1.18)' : 'translateY(0) scale(1)',
              transition: 'color 0.2s ease, filter 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {icon}
          </a>
        )
      })}
    </div>
  )
}
