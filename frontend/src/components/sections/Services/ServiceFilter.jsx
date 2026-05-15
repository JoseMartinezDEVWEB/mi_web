/* Tabs de filtro de categorías para el catálogo de servicios */
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

/* Definición de filtros disponibles con sus claves de traducción */
const FILTERS = [
  { key: 'all',        label: 'filters.all'        },
  { key: 'management', label: 'filters.management' },
  { key: 'digital',    label: 'filters.digital'    },
  { key: 'ai',         label: 'filters.ai'         },
]

/* Componente de tabs animados para filtrar el catálogo de servicios */
export default function ServiceFilter({ activeFilter, onFilterChange }) {
  const { t } = useTranslation('services')

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {FILTERS.map(({ key, label }) => {
        const isActive = activeFilter === key

        return (
          <motion.button
            key={key}
            onClick={() => onFilterChange(key)}
            className="relative px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
            style={{
              color: isActive ? '#0a0a0f' : '#94A3B8',
              border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Indicador animado de filtro activo con layoutId compartido */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ background: '#00D4FF' }}
                layoutId="activeFilter"
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}

            {/* Texto del filtro posicionado sobre el fondo animado */}
            <span className="relative z-10">{t(label)}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
