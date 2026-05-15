/* Tarjeta de estadística con contador animado */
import AnimatedCounter from './AnimatedCounter.jsx'

export default function StatCard({ value, suffix = '', label }) {
  return (
    <div
      className="flex flex-col items-center text-center px-6 py-4 rounded-2xl"
      style={{
        background: 'rgba(17, 24, 39, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Número grande animado con count-up */}
      <div className="text-3xl font-bold" style={{ color: '#D4AF37' }}>
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      {/* Etiqueta descriptiva */}
      <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
        {label}
      </p>
    </div>
  )
}
