/* Página de artículo individual del blog */
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import { motion } from 'framer-motion'

export default function BlogPostPage() {
  const { id } = useParams()
  const { t } = useTranslation('blog')
  const articles = t('blog:articles', { returnObjects: true }) ?? []
  const article = Array.isArray(articles) ? articles.find((a) => a.id === id) : null

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="relative z-10 min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4" style={{ color: '#F1F5F9' }}>
              Artículo no encontrado
            </h1>
            <Link to="/blog" className="text-sm" style={{ color: '#00D4FF' }}>
              ← Volver al blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{article.title} — J4TechnologyIsNow Blog</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <Navbar />

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Botón regresar */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-[#00D4FF]"
            style={{ color: '#94A3B8' }}
          >
            <ArrowLeft size={14} />
            Volver al blog
          </Link>

          {/* Imagen de portada */}
          <div
            className="w-full h-64 rounded-2xl mb-8 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #0099CC 0%, #003366 100%)',
            }}
          >
            <span className="text-6xl font-black opacity-20 text-white">J4</span>
          </div>

          {/* Metadata del artículo */}
          <div className="flex items-center gap-4 mb-4">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              {article.category}
            </span>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
              <Clock size={12} /> {article.readTime}
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
              <Calendar size={12} /> {article.date}
            </div>
          </div>

          {/* Título */}
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
            style={{ color: '#F1F5F9' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {article.title}
          </motion.h1>

          {/* Extracto como introducción */}
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#94A3B8' }}>
            {article.excerpt}
          </p>

          {/* Contenido de demostración */}
          <div
            className="prose prose-invert max-w-none p-8 rounded-2xl"
            style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p style={{ color: '#94A3B8', lineHeight: '1.8' }}>
              Este es un artículo de demostración. El contenido completo estará disponible próximamente.
              Por ahora puedes contactarnos para recibir asesoría personalizada sobre este tema.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
