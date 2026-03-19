import { useEffect, useRef } from 'react'
import { useInView, useAnimation, AnimationControls } from 'framer-motion'

/**
 * Hook que dispara animaciones de Framer Motion cuando el elemento
 * entra en el viewport.
 */
export function useScrollAnimation(threshold = 0.15): {
  ref: React.RefObject<HTMLDivElement>
  controls: AnimationControls
} {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const isInView = useInView(ref, { once: true, amount: threshold })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return { ref, controls }
}
