/* Botón secundario con borde cian / azul y efecto de fondo en hover */
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function ButtonSecondary({
  children,
  onClick,
  disabled = false,
  loading = false,
  iconLeft = null,
  iconRight = null,
  className = '',
  type = 'button',
}) {
  const { isLight } = useTheme()

  const borderColor = isLight ? '#0284C7' : '#00D4FF'
  const textColor = isLight ? '#0284C7' : '#00D4FF'
  const hoverBg = isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(0, 212, 255, 0.1)'

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center gap-2 px-6 py-3
        font-bold rounded-xl border transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        borderColor,
        color: textColor,
        background: 'transparent',
      }}
      whileHover={{
        scale: disabled || loading ? 1 : 1.03,
        backgroundColor: hoverBg,
      }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
    >
      {iconLeft && <span>{iconLeft}</span>}
      <span>
        {loading ? (
          <span className="flex items-center gap-2">
            <span
              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor }}
            />
          </span>
        ) : (
          children
        )}
      </span>
      {iconRight && <span>{iconRight}</span>}
    </motion.button>
  )
}
