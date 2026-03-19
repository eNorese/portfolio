import { useState, useEffect } from 'react'

/**
 * Hook para efecto de máquina de escribir.
 * Cicla entre los strings del array `texts` con velocidades configurables.
 */
export function useTypewriter(
  texts: string[],
  typingSpeed = 60,
  deletingSpeed = 35,
  pauseDuration = 2200,
) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentText.length) {
            setDisplayText(currentText.slice(0, charIndex + 1))
            setCharIndex((c) => c + 1)
          } else {
            // Pausa antes de borrar
            setTimeout(() => setIsDeleting(true), pauseDuration)
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(currentText.slice(0, charIndex - 1))
            setCharIndex((c) => c - 1)
          } else {
            setIsDeleting(false)
            setTextIndex((i) => (i + 1) % texts.length)
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    )

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration])

  return displayText
}
