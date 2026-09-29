/* Página independiente para Términos, Privacidad y Cookies */
import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, ShieldCheck, Cookie, Lock, Printer, CheckCircle2, ChevronRight } from 'lucide-react'
import { LEGAL_SECTIONS } from '../data/legalContent.js'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

export default function LegalPage({ defaultTab }) {
  const { tab } = useParams()
  const [searchParams] = useSearchParams()
  const initialTab = tab || searchParams.get('tab') || defaultTab || 'terms'
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    if (tab && LEGAL_SECTIONS[tab]) {
      setActiveTab(tab)
    } else if (defaultTab && LEGAL_SECTIONS[defaultTab]) {
      setActiveTab(defaultTab)
    }
  }, [tab, defaultTab])

  const currentSection = LEGAL_SECTIONS[activeTab] || LEGAL_SECTIONS.terms

  const getTabIcon = (id) => {
    switch (id) {
      case 'privacy':
        return <ShieldCheck size={18} />
      case 'cookies':
        return <Cookie size={18} />
      case 'terms':
      default:
        return <FileText size={18} />
    }
  }

  return (
    <>
      <Helmet>
        <title>{currentSection.title} — J4TechnologyIsNow</title>
        <meta name="description" content={currentSection.summary} />
      </Helmet>

      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Botón de volver */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Volver al Inicio</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Printer size={14} />
            <span>Imprimir Documento</span>
          </button>
        </div>

        {/* Encabezado */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Lock size={12} />
            <span>Marco Legal & Cumplimiento</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {currentSection.title}
          </h1>
          <p className="text-sm text-cyan-400 font-mono">{currentSection.subtitle}</p>
        </div>

        {/* Pestañas de navegación */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0B0F19] border border-white/10 mb-8 overflow-x-auto scrollbar-none">
          {Object.keys(LEGAL_SECTIONS).map((key) => {
            const sec = LEGAL_SECTIONS[key]
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {getTabIcon(key)}
                <span>{sec.title}</span>
              </button>
            )
          })}
        </div>

        {/* Resumen */}
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 mb-8 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-cyan-300">Resumen ejecutivo:</strong> {currentSection.summary}
          </p>
        </div>

        {/* Bloques de contenido */}
        <div className="space-y-6">
          {currentSection.content.map((block, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-2xl bg-[#0F172A]/70 backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                {block.heading}
              </h2>
              <div className="text-slate-300 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                {block.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner de contacto */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">¿Necesita asistencia legal o contractual?</h3>
            <p className="text-xs text-slate-400">
              Nuestro equipo está disponible para responder cualquier duda sobre nuestras políticas de servicio.
            </p>
          </div>
          <Link
            to="/#contacto"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5C842] hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2"
          >
            <span>Ir a Contacto</span>
            <ChevronRight size={15} />
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
