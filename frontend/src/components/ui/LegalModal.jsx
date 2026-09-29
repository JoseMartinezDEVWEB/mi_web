/* Modal interactivo de Términos y Condiciones, Privacidad y Cookies */
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, FileText, Cookie, CheckCircle2, Lock, ExternalLink, Printer } from 'lucide-react'
import { LEGAL_SECTIONS } from '../../data/legalContent.js'

export default function LegalModal({ isOpen, onClose, initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  // Evitar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

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

  const handlePrint = () => {
    window.print()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Fondo oscuro con desenfoque */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Contenedor del Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 bg-[#0B0F19] text-slate-100 z-10"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 212, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Cabecera del modal */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#0F172A] via-[#111C35] to-[#0F172A] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>Marco Legal y Transparencia</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    J4TechnologyIsNow
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Protección jurídica, derechos del usuario y cumplimiento Ley 172-13
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                title="Imprimir o Guardar PDF"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden sm:flex items-center gap-1.5 text-xs"
              >
                <Printer size={15} />
                <span>Imprimir</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Barra de pestañas */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-[#0B0F19] overflow-x-auto scrollbar-none">
            {Object.keys(LEGAL_SECTIONS).map((key) => {
              const sec = LEGAL_SECTIONS[key]
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {getTabIcon(key)}
                  <span>{sec.title}</span>
                </button>
              )
            })}
          </div>

          {/* Resumen del documento */}
          <div className="px-6 py-3 bg-cyan-950/20 border-b border-cyan-500/10 flex items-start gap-3">
            <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-cyan-300 mr-1">En resumen:</span>
              {currentSection.summary}
            </div>
          </div>

          {/* Cuerpo con Scroll */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{currentSection.title}</h3>
              <p className="text-xs text-cyan-400 font-mono mb-4">{currentSection.subtitle}</p>
            </div>

            {currentSection.content.map((block, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-colors"
              >
                <h4 className="text-base font-semibold text-white mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                  {block.heading}
                </h4>
                <div className="text-slate-300 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                  {block.text}
                </div>
              </div>
            ))}

            {/* Banner de contacto legal */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white block">¿Tiene dudas sobre nuestros términos o el tratamiento de sus datos?</span>
                Puede contactar a nuestro oficial de cumplimiento directamente en cualquier momento.
              </div>
              <a
                href="#contacto"
                onClick={() => {
                  onClose()
                  document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5C842] hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5"
              >
                <span>Contactar Soporte</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Pie del modal */}
          <div className="p-4 border-t border-white/10 bg-[#0F172A] flex items-center justify-between text-xs text-slate-400">
            <span>© {new Date().getFullYear()} J4TechnologyIsNow · República Dominicana 🇩🇴</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Entendido y Aceptar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
