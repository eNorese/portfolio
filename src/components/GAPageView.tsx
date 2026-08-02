'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Envía un `page_view` a GA4 en cada navegación de cliente (p.ej. el cambio
 * de idioma /es ⇄ /en, que es client-side y no recarga la página).
 *
 * El page_view inicial ya lo emite `gtag('config', …)` al cargar, así que
 * se omite la primera ejecución para no contar la vista inicial dos veces.
 */
export function GAPageView({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (typeof window.gtag !== 'function') return

    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      send_to: gaId,
    })
  }, [pathname, gaId])

  return null
}
