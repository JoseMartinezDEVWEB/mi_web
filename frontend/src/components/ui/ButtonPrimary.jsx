/* Botón primario con efecto shimmer en hover */
import { motion } from 'framer-motion'

export default function ButtonPrimary({
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
        relative overflow-hidden inline-flex items-center gap-2 px-6 py-3
        font-semibold text-black rounded-xl transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      style={{ background: 'linear-gradient(135deg, #D4AF37, #F5C842)' }}
      whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
    >
      {/* Capa de efecto shimmer que pasa de izquierda a derecha en hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        initial={{ backgroundPosition: '-200% 0' }}
        whileHover={{ backgroundPosition: '200% 0' }}
        transition={{ duration: 0.6, ease: 'linear' }}
      />

      {/* Ícono izquierdo */}
      {iconLeft && <span className="relative z-10">{iconLeft}</span>}

      {/* Contenido o spinner de carga */}
      <span className="relative z-10">
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </span>
        ) : (
          children
        )}
      </span>

      {/* Ícono derecho */}
      {iconRight && <span className="relative z-10">{iconRight}</span>}
    </motion.button>
  )
}
