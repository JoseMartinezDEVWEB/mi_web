/* Botón / Switch animado para alternar entre Tema Claro y Oscuro */
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, toggleTheme, isLight } = useTheme()

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl transition-all ${
        isLight
          ? 'bg-slate-200/80 hover:bg-slate-300/80 text-amber-600 border border-slate-300 shadow-sm'
          : 'bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10'
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      title={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {isLight ? (
          <Moon size={18} className="text-slate-800 fill-slate-800/10" />
        ) : (
          <Sun size={18} className="text-amber-400 fill-amber-400/20" />
        )}
      </motion.div>

      {showLabel && (
        <span className="text-xs font-semibold">
          {isLight ? 'Modo Oscuro' : 'Modo Claro'}
        </span>
      )}
    </motion.button>
  )
}
