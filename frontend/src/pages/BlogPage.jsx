/* Página de listado del blog */
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import BlogCard from '../components/ui/BlogCard.jsx'
import { staggerContainer, fadeInUp, viewportProps } from '../hooks/useScrollAnimation.js'

export default function BlogPage() {
  const { t } = useTranslation('blog')
  const articles = t('blog:articles', { returnObjects: true }) ?? []

  return (
    <>
      <Helmet>
        <title>Blog — J4TechnologyIsNow</title>
        <meta name="description" content="Artículos sobre transformación digital, desarrollo web e inteligencia artificial para empresas latinoamericanas." />
      </Helmet>

      <Navbar />

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <motion.div
            className="text-center mb-14"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4 px-4 py-2 rounded-full"
              style={{ border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF', background: 'rgba(0,212,255,0.05)' }}
            >
              {t('blog:sectionLabel')}
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: '#F1F5F9' }}
            >
              {t('blog:title')}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg" style={{ color: '#94A3B8' }}>
              {t('blog:subtitle')}
            </motion.p>
          </motion.div>

          {/* Grid de artículos */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportProps}
          >
            {Array.isArray(articles) && articles.map((article) => (
              <motion.div key={article.id} variants={fadeInUp}>
                <BlogCard article={article} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  )
}
