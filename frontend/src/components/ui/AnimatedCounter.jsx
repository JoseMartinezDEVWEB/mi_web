/* Contador animado que se activa al entrar en el viewport */
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const hasAnimated = useRef(false)

  useEffect(() => {
    /* Solo animar una vez cuando el elemento entra en el viewport */
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const numericValue = parseInt(value, 10)
    const startTime = performance.now()
    const durationMs = duration * 1000

    /* Función de easing ease-out para la animación */
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const easedProgress = easeOut(progress)
      setCurrent(Math.round(easedProgress * numericValue))

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {suffix && suffix.startsWith('+') ? `+${current}` : current}{suffix && !suffix.startsWith('+') ? suffix : ''}
    </span>
  )
}
