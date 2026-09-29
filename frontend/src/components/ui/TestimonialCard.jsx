/* Tarjeta de testimonio con avatar de iniciales y estrellas doradas */
import { Star } from 'lucide-react'

/* Colores de fondo para los avatares de iniciales */
const AVATAR_COLORS = [
  'from-cyan-deep to-blue-700',
  'from-gold/60 to-amber-600',
  'from-purple-700 to-blue-700',
]

export default function TestimonialCard({ testimonial, index = 0 }) {
  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length]

  return (
    <div
      className="rounded-2xl p-8"
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Encabezado: avatar + nombre + empresa */}
      <div className="flex items-center gap-4 mb-5">
        {/* Avatar con iniciales */}
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>
            {testimonial.name}
          </p>
          <p className="text-xs" style={{ color: '#94A3B8' }}>
            {testimonial.company}
          </p>
        </div>
      </div>

      {/* Estrellas de calificación */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} fill="#D4AF37" color="#D4AF37" />
        ))}
      </div>

      {/* Texto del testimonio con comilla decorativa */}
      <blockquote className="text-sm leading-relaxed italic" style={{ color: '#94A3B8' }}>
        "{testimonial.text}"
      </blockquote>
    </div>
  )
}
