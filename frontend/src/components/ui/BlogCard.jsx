/* Tarjeta de artículo del blog */
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/* Gradientes de portada por categoría */
const CATEGORY_GRADIENTS = {
  'Transformación Digital': 'from-cyan-deep to-blue-900',
  'Desarrollo Web': 'from-purple-900 to-blue-900',
  'Inteligencia Artificial': 'from-gold/30 to-cyan-deep',
  default: 'from-gray-800 to-gray-900',
}

export default function BlogCard({ article }) {
  const { t } = useTranslation('common')
  const gradient = CATEGORY_GRADIENTS[article.category] ?? CATEGORY_GRADIENTS.default

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      whileHover={{
        y: -8,
        borderColor: 'rgba(0, 212, 255, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 212, 255, 0.1)',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Imagen de portada con gradiente */}
      <div className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span
          className="text-4xl font-bold opacity-20 select-none"
          style={{ color: '#00D4FF' }}
        >
          J4
        </span>
      </div>

      {/* Contenido del artículo */}
      <div className="p-6">
        {/* Badge de categoría y tiempo de lectura */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              background: 'rgba(0, 212, 255, 0.1)',
              color: '#00D4FF',
              border: '1px solid rgba(0, 212, 255, 0.2)',
            }}
          >
            {article.category}
          </span>
          <div className="flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
            <Clock size={12} />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Título del artículo */}
        <h3 className="font-bold text-base mb-2 leading-snug" style={{ color: '#F1F5F9' }}>
          {article.title}
        </h3>

        {/* Extracto */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
          {article.excerpt}
        </p>

        {/* Botón leer más */}
        <Link
          to={`/blog/${article.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:gap-3"
          style={{ color: '#00D4FF' }}
        >
          {t('buttons.readMore')}
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  )
}
