/* Tarjeta base reutilizable con efecto hover de elevación y glow */
import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  onClick = null,
  active = false,
}) {
  return (
    <motion.div
      className={`
        rounded-2xl p-6 transition-colors duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: '#111827',
        border: active
          ? '1px solid rgba(212, 175, 55, 0.5)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: active ? '0 0 20px rgba(212, 175, 55, 0.2)' : 'none',
      }}
      onClick={onClick}
      whileHover={onClick ? {
        y: -8,
        borderColor: 'rgba(0, 212, 255, 0.4)',
        boxShadow: '0 20px 40px rgba(0, 212, 255, 0.15)',
      } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
