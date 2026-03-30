import { useState, useEffect, useRef } from 'react'

interface CursorState {
  x: number
  y: number
  isHovering: boolean
  isTouchDevice: boolean
}

/**
 * Detecta posición del cursor y si está sobre un elemento interactivo.
 * Devuelve isTouchDevice=true en dispositivos táctiles para desactivar efectos.
 */
export function useCursor(): CursorState {
  const isTouchDevice =
    typeof window !== 'undefined' &&
    (window.matchMedia('(hover: none)').matches || 'ontouchstart' in window)

  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (isTouchDevice) return

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [tabindex]'

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY })
        const target = e.target as Element
        setIsHovering(!!target.closest(INTERACTIVE))
      })
    }

    const onLeave = () => setPos({ x: -200, y: -200 })

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isTouchDevice])

  return { x: pos.x, y: pos.y, isHovering, isTouchDevice }
}
