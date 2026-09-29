/* Tabs de filtro de categorías para el catálogo de servicios con soporte de temas */
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../../context/ThemeContext'

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
  const { isLight } = useTheme()

  return (
    <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full max-w-full px-2 py-1">
      {FILTERS.map(({ key, label }) => {
        const isActive = activeFilter === key

        const inactiveColor = isLight ? '#334155' : '#94A3B8'
        const inactiveBorder = isLight ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.15)'
        const activeBg = isLight ? '#0284C7' : '#00D4FF'
        const activeColor = isLight ? '#FFFFFF' : '#0a0a0f'

        return (
          <motion.button
            key={key}
            onClick={() => onFilterChange(key)}
            className="relative px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap flex-shrink-0"
            style={{
              color: isActive ? activeColor : inactiveColor,
              border: isActive ? 'none' : inactiveBorder,
              background: isActive ? 'transparent' : (isLight ? '#FFFFFF' : 'transparent'),
              boxShadow: isLight && !isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Indicador animado de filtro activo con layoutId compartido */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ background: activeBg }}
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
