/* Botón fantasma sin borde visible con subrayado desde el centro en hover */
import { motion } from 'framer-motion'

export default function ButtonGhost({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex flex-col items-center gap-0.5
        text-white/60 font-medium transition-colors duration-200
        hover:text-white disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={{ color: '#FFFFFF' }}
    >
      {children}
      {/* Subrayado animado desde el centro */}
      <motion.span
        className="block h-[1px] bg-white"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        style={{ transformOrigin: 'center' }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  )
}
