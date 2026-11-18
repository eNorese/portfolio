'use client'

import { lazy, Suspense, useEffect, useState } from 'react'

const EasterEgg = lazy(() =>
  import('@/components/EasterEgg').then((module) => ({ default: module.EasterEgg }))
)
const RubikCube = lazy(() =>
  import('@/components/RubikCube').then((module) => ({ default: module.RubikCube }))
)

/**
 * Keeps the sizeable, hidden experiences out of the initial page bundle.
 * Their opening events are replayed once the requested component is mounted.
 */
export function DeferredExperiences() {
  const [terminalLoaded, setTerminalLoaded] = useState(false)
  const [cubeLoaded, setCubeLoaded] = useState(false)

  useEffect(() => {
    const loadTerminal = () => setTerminalLoaded(true)
    const loadCube = () => setCubeLoaded(true)

    window.addEventListener('enorese:easter-egg', loadTerminal)
    window.addEventListener('enorese:rubik', loadCube)
    document.documentElement.dataset.deferredExperiences = 'ready'
    return () => {
      window.removeEventListener('enorese:easter-egg', loadTerminal)
      window.removeEventListener('enorese:rubik', loadCube)
      delete document.documentElement.dataset.deferredExperiences
    }
  }, [])

  return (
    <>
      {terminalLoaded && (
        <Suspense fallback={null}>
          <EasterEgg initiallyOpen />
        </Suspense>
      )}
      {cubeLoaded && (
        <Suspense fallback={null}>
          <RubikCube initiallyOpen />
        </Suspense>
      )}
    </>
  )
}
