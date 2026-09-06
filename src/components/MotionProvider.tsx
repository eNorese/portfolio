'use client'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const MotionContext = createContext({
  active: true,
  reduced: false,
  toggle: () => {},
})

export function MotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(preference.matches)
    sync()
    preference.addEventListener('change', sync)
    try {
      setEnabled(localStorage.getItem('portfolio-motion') !== 'paused')
    } catch {}
    return () => preference.removeEventListener('change', sync)
  }, [])
  const active = enabled && !reduced
  useEffect(() => {
    document.documentElement.dataset.motion = active ? 'active' : 'paused'
    return () => {
      delete document.documentElement.dataset.motion
    }
  }, [active])
  function toggle() {
    setEnabled((previous) => {
      try {
        localStorage.setItem('portfolio-motion', previous ? 'paused' : 'active')
      } catch {}
      return !previous
    })
  }
  return (
    <MotionContext.Provider value={{ active, reduced, toggle }}>
      {children}
    </MotionContext.Provider>
  )
}
export const useMotion = () => useContext(MotionContext)
