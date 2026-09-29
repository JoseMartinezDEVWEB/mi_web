/* Tarjeta de artículo del blog */
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/* Gradientes de portada por categoría */
const CATEGORY_GRADIENTS = {
  'Transformación Digital': 'from-cyan-deep to-blue-900',
  'Desarrollo Web': 'from-purple-900 to-blue-900',
  'Desarrollo Web & Marca': 'from-purple-900 to-blue-900',
  'Inteligencia Artificial': 'from-amber-700 to-cyan-900',
  default: 'from-gray-800 to-gray-900',
}

export default function BlogCard({ article }) {
  const { t } = useTranslation('common')
  const gradient = CATEGORY_GRADIENTS[article.category] ?? CATEGORY_GRADIENTS.default

  return (
    <motion.div
      className="rounded-2xl overflow-hidden flex flex-col h-full group"
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      whileHover={{
        y: -8,
        borderColor: 'rgba(0, 212, 255, 0.35)',
        boxShadow: '0 20px 40px rgba(0, 212, 255, 0.12)',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Imagen de portada */}
      <div className="relative h-52 overflow-hidden bg-slate-900">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span
              className="text-4xl font-bold opacity-20 select-none"
              style={{ color: '#00D4FF' }}
            >
              J4
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-50 pointer-events-none" />
      </div>

      {/* Contenido del artículo */}
      <div className="p-6 flex flex-col flex-grow">
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
          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94A3B8' }}>
            <Clock size={13} className="text-[#00D4FF]" />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Título del artículo */}
        <h3 className="font-bold text-base md:text-lg mb-2.5 leading-snug" style={{ color: '#F1F5F9' }}>
          {article.title}
        </h3>

        {/* Extracto */}
        <p className="text-sm leading-relaxed mb-5 flex-grow" style={{ color: '#94A3B8' }}>
          {article.excerpt}
        </p>

        {/* Botón leer más */}
        <Link
          to={`/blog/${article.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 text-[#00D4FF] hover:text-[#38BDF8] group-hover:gap-3 mt-auto"
        >
          {t('buttons.readMore') || 'Leer más'}
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  )
}
