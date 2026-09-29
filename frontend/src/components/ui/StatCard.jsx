/* Tarjeta de estadística con contador animado y soporte de tema claro/oscuro */
import AnimatedCounter from './AnimatedCounter.jsx'
import { useTheme } from '../../context/ThemeContext'

export default function StatCard({ value, suffix = '', label }) {
  const { isLight } = useTheme()

  return (
    <div
      className="flex flex-col items-center text-center px-6 py-4 rounded-2xl transition-all duration-300"
      style={{
        background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(17, 24, 39, 0.6)',
        border: isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(8px)',
        boxShadow: isLight ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : 'none',
      }}
    >
      {/* Número grande animado con count-up */}
      <div
        className="text-3xl font-black"
        style={{ color: isLight ? '#B45309' : '#D4AF37' }}
      >
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      {/* Etiqueta descriptiva */}
      <p
        className="text-sm mt-1 font-medium"
        style={{ color: isLight ? '#334155' : '#94A3B8' }}
      >
        {label}
      </p>
    </div>
  )
}
