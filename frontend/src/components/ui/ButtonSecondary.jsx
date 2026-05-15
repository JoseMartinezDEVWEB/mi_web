/* Botón secundario con borde cian y efecto de fondo en hover */
import { motion } from 'framer-motion'

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
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center gap-2 px-6 py-3
        font-semibold rounded-xl border transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        borderColor: '#00D4FF',
        color: '#00D4FF',
        background: 'transparent',
      }}
      whileHover={{
        scale: disabled || loading ? 1 : 1.03,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
      }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
    >
      {iconLeft && <span>{iconLeft}</span>}
      <span>
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
          </span>
        ) : (
          children
        )}
      </span>
      {iconRight && <span>{iconRight}</span>}
    </motion.button>
  )
}
