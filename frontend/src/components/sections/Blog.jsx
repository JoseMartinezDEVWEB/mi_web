/* Sección de blog con grid de 3 artículos y botón para ver todos */
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fadeInUp, staggerContainer, viewportProps } from '../../hooks/useScrollAnimation.js'
import BlogCard from '../ui/BlogCard.jsx'

export default function Blog() {
  const { t } = useTranslation(['blog', 'common'])

  /* Obtener artículos desde las traducciones y mostrar solo los primeros 3 */
  const articles = t('blog:articles', { returnObjects: true }) || []
  const featuredArticles = Array.isArray(articles) ? articles.slice(0, 3) : []

  return (
    <section id="blog" className="relative z-10 py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Encabezado centrado con etiqueta, título y subtítulo */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportProps}
        >
          {/* Etiqueta de sección */}
          <motion.span
            variants={fadeInUp}
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{
              background: 'rgba(0, 212, 255, 0.1)',
              color: '#00D4FF',
              border: '1px solid rgba(0, 212, 255, 0.2)',
            }}
          >
            {t('blog:label') || t('blog:sectionLabel')}
          </motion.span>

          {/* Título principal */}
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: '#F1F5F9' }}
          >
            {t('blog:title')}
          </motion.h2>

          {/* Subtítulo descriptivo */}
          <motion.p
            variants={fadeInUp}
            className="text-base max-w-2xl mx-auto"
            style={{ color: '#94A3B8' }}
          >
            {t('blog:subtitle')}
          </motion.p>
        </motion.div>

        {/* Grid de BlogCards con entrada por stagger */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportProps}
        >
          {featuredArticles.map((article, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <BlogCard article={article} />
            </motion.div>
          ))}
        </motion.div>

        {/* Botón centrado para ver todos los artículos */}
        <motion.div
          className="flex justify-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportProps}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group"
            style={{
              background: 'rgba(0, 212, 255, 0.08)',
              border: '1px solid rgba(0, 212, 255, 0.25)',
              color: '#00D4FF',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.5)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 212, 255, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.25)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {t('blog:viewAll')}
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
