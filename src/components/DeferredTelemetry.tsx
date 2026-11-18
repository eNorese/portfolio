'use client'

import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Script from 'next/script'
import { GAPageView } from '@/components/GAPageView'

const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/next').then((module) => ({ default: module.SpeedInsights }))
)

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/** Load non-essential telemetry after engagement, keeping it off the critical path. */
export function DeferredTelemetry({ gaId }: { gaId?: string }) {
  const [enabled, setEnabled] = useState(false)
  const [gaReady, setGaReady] = useState(false)

  useEffect(() => {
    const activate = () => setEnabled(true)
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    const options: AddEventListenerOptions = { passive: true, once: true }

    events.forEach((event) => window.addEventListener(event, activate, options))
    const fallback = window.setTimeout(activate, 20_000)

    return () => {
      events.forEach((event) => window.removeEventListener(event, activate))
      window.clearTimeout(fallback)
    }
  }, [])

  const initializeAnalytics = useCallback(() => {
    if (!gaId) return
    window.dataLayer = window.dataLayer || []
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args)
    window.gtag('js', new Date())
    window.gtag('config', gaId)
    setGaReady(true)
  }, [gaId])

  if (!enabled) return null

  return (
    <>
      <Suspense fallback={null}>
        <SpeedInsights />
      </Suspense>
      {gaId && (
        <Script
          id="ga-gtag"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
          onLoad={initializeAnalytics}
        />
      )}
      {gaId && gaReady && <GAPageView gaId={gaId} />}
    </>
  )
}
