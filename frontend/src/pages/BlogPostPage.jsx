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
        <div className="max-w-4xl mx-auto">
          {/* Botón regresar */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-[#00D4FF]"
            style={{ color: '#94A3B8' }}
          >
            <ArrowLeft size={16} />
            Volver al blog
          </Link>

          {/* Imagen de portada */}
          {article.image ? (
            <div className="w-full h-72 sm:h-96 rounded-2xl mb-8 overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-full h-64 rounded-2xl mb-8 flex items-center justify-center border border-white/10"
              style={{
                background: 'linear-gradient(135deg, #0099CC 0%, #003366 100%)',
              }}
            >
              <span className="text-6xl font-black opacity-20 text-white">J4</span>
            </div>
          )}

          {/* Metadata del artículo */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
              style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.25)' }}
            >
              {article.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94A3B8' }}>
              <Clock size={14} className="text-[#00D4FF]" /> {article.readTime}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94A3B8' }}>
              <Calendar size={14} className="text-[#D4AF37]" /> {article.date}
            </div>
          </div>

          {/* Título */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-[1.2]"
            style={{ color: '#F1F5F9' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {article.title}
          </motion.h1>

          {/* Extracto como introducción destacada */}
          <div
            className="p-6 rounded-2xl mb-10 text-lg leading-relaxed font-medium"
            style={{
              background: 'rgba(0, 212, 255, 0.05)',
              border: '1px solid rgba(0, 212, 255, 0.15)',
              color: '#CBD5E1',
            }}
          >
            {article.excerpt}
          </div>

          {/* Contenido completo del artículo con secciones */}
          <div
            className="p-6 sm:p-10 rounded-2xl mb-12"
            style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {Array.isArray(article.sections) && article.sections.length > 0 ? (
              article.sections.map((section, idx) => (
                <article key={idx} className="mb-12 last:mb-0">
                  {section.title && (
                    <h2
                      className="text-2xl sm:text-3xl font-extrabold mb-4 mt-2"
                      style={{ color: '#F1F5F9' }}
                    >
                      {section.title}
                    </h2>
                  )}

                  {section.subtitle && (
                    <h3
                      className="text-lg sm:text-xl font-bold mb-3"
                      style={{ color: '#00D4FF' }}
                    >
                      {section.subtitle}
                    </h3>
                  )}

                  {section.image && (
                    <figure className="my-6">
                      <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <img
                          src={section.image}
                          alt={section.title || article.title}
                          className="w-full h-64 sm:h-80 object-cover"
                          loading="lazy"
                        />
                      </div>
                      {section.caption && (
                        <figcaption className="text-xs text-slate-400 mt-2.5 text-center italic">
                          {section.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}

                  {Array.isArray(section.paragraphs) &&
                    section.paragraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-base sm:text-lg leading-relaxed mb-5"
                        style={{ color: '#94A3B8' }}
                      >
                        {para}
                      </p>
                    ))}

                  {Array.isArray(section.list) && section.list.length > 0 && (
                    <ul className="space-y-3.5 my-6 pl-4 border-l-2 border-[#00D4FF]/40">
                      {section.list.map((item, lIdx) => (
                        <li
                          key={lIdx}
                          className="text-base leading-relaxed flex items-start gap-2.5"
                          style={{ color: '#E2E8F0' }}
                        >
                          <span className="text-[#00D4FF] font-black text-lg leading-none mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.highlight && (
                    <blockquote
                      className="my-8 p-6 rounded-xl border-l-4 border-[#D4AF37] italic text-base sm:text-lg font-medium"
                      style={{
                        background: 'rgba(212, 175, 55, 0.06)',
                        color: '#FDE68A',
                      }}
                    >
                      "{section.highlight}"
                    </blockquote>
                  )}
                </article>
              ))
            ) : (
              <p style={{ color: '#94A3B8', lineHeight: '1.8' }}>
                {article.content || article.excerpt}
              </p>
            )}
          </div>

          {/* Banner de llamada a la acción / Asesoría */}
          <div
            className="rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(212, 175, 55, 0.1))',
              border: '1px solid rgba(0, 212, 255, 0.3)',
            }}
          >
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#F1F5F9' }}>
              ¿Quieres dar el siguiente paso digital en tu negocio o proyecto?
            </h3>
            <p className="text-sm sm:text-base max-w-xl mx-auto mb-6" style={{ color: '#94A3B8' }}>
              En J4TechnologyIsNow desarrollamos soluciones de software a medida, páginas web de alto impacto e integraciones de IA adaptadas a tu necesidad.
            </p>
            <Link
              to="/#contacto"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-sm text-[#0a0a0f] transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #38BDF8)',
                boxShadow: '0 8px 24px rgba(0, 212, 255, 0.25)',
              }}
            >
              Solicitar Asesoría Gratuita
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
