/* Barra de progreso de lectura en la parte superior de la página */
import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      /* Calcular porcentaje de scroll actual */
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    /* Barra fija en la parte superior con z-index alto para quedar encima del navbar */
    <motion.div
      className="fixed top-0 left-0 h-[3px] z-[9998] origin-left"
      style={{
        scaleX: smoothProgress,
        background: 'linear-gradient(90deg, #D4AF37, #F5C842)',
        transformOrigin: 'left',
        scaleX: progress / 100,
      }}
      initial={{ scaleX: 0 }}
    />
  )
}
