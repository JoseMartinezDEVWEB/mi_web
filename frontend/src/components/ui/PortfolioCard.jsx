/* Tarjeta de proyecto del portafolio con panel de hover */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

/* Paleta de gradientes para las imágenes de portada */
const PROJECT_GRADIENTS = [
  'linear-gradient(135deg, #0099CC 0%, #003366 100%)',
  'linear-gradient(135deg, #D4AF37 0%, #8B6914 100%)',
  'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
  'linear-gradient(135deg, #6366f1 0%, #0099CC 100%)',
  'linear-gradient(135deg, #D4AF37 0%, #00D4FF 100%)',
  'linear-gradient(135deg, #10b981 0%, #0099CC 100%)',
]

export default function PortfolioCard({ project, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const gradient = PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length]

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden aspect-[4/3]"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Fondo con gradiente */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: gradient }}
      >
        <span className="text-6xl font-black opacity-20 text-white select-none">
          {project.name.charAt(0)}
        </span>
      </div>

      {/* Overlay oscuro permanente en la parte inferior */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{
          background: 'linear-gradient(to top, rgba(10, 10, 15, 0.9), transparent)',
        }}
      >
        <h3 className="font-bold text-sm" style={{ color: '#F1F5F9' }}>
          {project.name}
        </h3>
        <p className="text-xs" style={{ color: '#94A3B8' }}>
          {project.client}
        </p>
      </div>

      {/* Panel de información que aparece en hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 flex flex-col justify-between p-5"
            style={{ background: 'rgba(10, 10, 15, 0.92)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: '#F1F5F9' }}>
                {project.name}
              </h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
                {project.description}
              </p>

              {/* Tags del proyecto */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(0, 212, 255, 0.1)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      color: '#00D4FF',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Resultado logrado */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)' }}
            >
              <TrendingUp size={14} color="#D4AF37" />
              <span className="text-xs font-semibold" style={{ color: '#D4AF37' }}>
                {project.result}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
