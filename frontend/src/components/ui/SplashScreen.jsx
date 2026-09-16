/* Pantalla de carga inicial con animación del logo J4 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    /* Ocultar la pantalla después de 2.5 segundos */
    const timer = setTimeout(() => {
      setVisible(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ background: '#0a0a0f' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="relative flex flex-col items-center gap-6">
            {/* Logo J4 con animación de trazo SVG */}
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Letra J */}
              <motion.path
                d="M 35 20 L 35 80 Q 35 100 15 100 Q 5 100 5 90"
                stroke="#D4AF37"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              {/* Letra 4 */}
              <motion.path
                d="M 55 20 L 55 70 M 75 20 L 55 70 L 90 70 M 75 20 L 75 100"
                stroke="#00D4FF"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.4 }}
              />
              {/* Punto decorativo */}
              <motion.circle
                cx="105"
                cy="100"
                r="6"
                fill="#D4AF37"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.3 }}
              />
            </motion.svg>

            {/* Nombre de la empresa */}
            <motion.p
              className="text-sm font-medium tracking-[0.3em] uppercase"
              style={{ color: '#94A3B8' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              TechnologyIsNow
            </motion.p>

            {/* Barra de progreso de carga */}
            <motion.div
              className="w-40 h-[2px] rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #D4AF37, #00D4FF)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
