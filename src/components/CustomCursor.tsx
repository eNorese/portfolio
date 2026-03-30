import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { useCursor } from '../hooks/useCursor'

/**
 * Cursor personalizado: dot preciso + anillo con spring lag.
 * El anillo se expande sobre elementos interactivos.
 * Solo se renderiza en dispositivos no táctiles.
 */
export default function CustomCursor() {
  const { x, y, isHovering, isTouchDevice } = useCursor()

  const dotX = useMotionValue(x)
  const dotY = useMotionValue(y)
  const ringX = useSpring(dotX, { stiffness: 180, damping: 22, mass: 0.5 })
  const ringY = useSpring(dotY, { stiffness: 180, damping: 22, mass: 0.5 })

  useEffect(() => {
    dotX.set(x)
    dotY.set(y)
  }, [x, y, dotX, dotY])

  if (isTouchDevice) return null

  return (
    <>
      {/* Anillo — sigue con lag */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-sky-400/70"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 44 : 28,
          height: isHovering ? 44 : 28,
          opacity: isHovering ? 0.6 : 0.4,
          borderColor: isHovering ? 'rgb(167 139 250 / 0.8)' : 'rgb(56 189 248 / 0.7)',
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Dot preciso */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-sky-400"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 5,
          height: 5,
        }}
        animate={{ opacity: isHovering ? 0.9 : 0.7 }}
        transition={{ duration: 0.15 }}
      />
    </>
  )
}
