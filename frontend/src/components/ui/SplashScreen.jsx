/* Pantalla de carga inicial con animación del logo J4 dorado 3D */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    /* Ocultar la pantalla después de 2.6 segundos */
    const timer = setTimeout(() => {
      setVisible(false)
    }, 2600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
          style={{ background: '#0a0a0f' }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Resplandor radial tecnológico de fondo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.12) 0%, rgba(0, 212, 255, 0.06) 40%, transparent 70%)',
            }}
          />

          <div className="relative flex flex-col items-center gap-6 px-4">
            {/* Contenedor del Logo 3D J4 Dorado */}
            <motion.div
              className="relative"
              initial={{ scale: 0.6, opacity: 0, y: 25 }}
              animate={{
                scale: [0.6, 1.06, 1],
                opacity: 1,
                y: [25, -4, 0],
              }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Anillo de resplandor exterior animado */}
              <motion.div
                className="absolute -inset-3 rounded-full blur-xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.45), rgba(0, 212, 255, 0.25), transparent 70%)',
                }}
                animate={{
                  scale: [0.95, 1.15, 0.95],
                  opacity: [0.5, 0.85, 0.5],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Marco con la imagen 3D J4 dorada */}
              <motion.div
                className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden p-1 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(0, 212, 255, 0.2))',
                  border: '2px solid rgba(212, 175, 55, 0.5)',
                  boxShadow: '0 0 50px rgba(212, 175, 55, 0.4), 0 0 90px rgba(0, 212, 255, 0.25)',
                }}
                animate={{
                  y: [-3, 3, -3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.1,
                }}
              >
                <img
                  src="/j4-gold-logo.png"
                  alt="J4 Technology"
                  className="w-full h-full object-cover rounded-2xl select-none pointer-events-none"
                />
              </motion.div>
            </motion.div>

            {/* Nombre de la empresa con tipografía dorada/cyan */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white flex items-center justify-center gap-1.5">
                <span style={{ color: '#D4AF37' }}>J4</span>
                <span className="bg-gradient-to-r from-slate-200 via-white to-slate-300 bg-clip-text text-transparent">
                  TechnologyIsNow
                </span>
              </h2>
              <p
                className="text-xs font-semibold tracking-[0.25em] uppercase mt-1"
                style={{ color: '#00D4FF' }}
              >
                Transformación Digital
              </p>
            </motion.div>

            {/* Barra de progreso de carga ultra estilizada */}
            <motion.div
              className="w-48 h-1.5 rounded-full overflow-hidden relative"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #D4AF37 0%, #F5C842 40%, #00D4FF 100%)',
                  boxShadow: '0 0 12px rgba(212, 175, 55, 0.8)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
