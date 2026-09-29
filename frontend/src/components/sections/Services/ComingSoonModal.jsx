/* Modal interactivo cuando el usuario hace clic en un servicio o demo con estado PRÓXIMAMENTE */
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, MessageCircle, Send, CheckCircle2, Sparkles, PhoneCall } from 'lucide-react'

export default function ComingSoonModal({ isOpen, onClose, service }) {
  if (!isOpen || !service) return null

  const serviceName = service.name || 'este servicio'
  const serviceDesc = service.description || ''

  const whatsappMessage = encodeURIComponent(
    `Hola J4 Technology, deseo más información sobre el servicio de ${serviceName} para mi institución o empresa.`
  )
  const whatsappUrl = `https://wa.me/18096133196?text=${whatsappMessage}`
  const telegramUrl = 'https://t.me/J4technologyisnow'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Fondo oscuro para cerrar */}
        <motion.div
          className="fixed inset-0"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Ventana modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border text-left"
          style={{
            background: 'linear-gradient(145deg, #111827, #0B0F17)',
            borderColor: 'rgba(212, 175, 55, 0.35)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.15)',
          }}
        >
          {/* Header con gradiente */}
          <div
            className="p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(0,212,255,0.08))',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#FACC15',
                }}
              >
                <Clock size={13} className="animate-pulse" />
                Próximamente disponible
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              {serviceName}
            </h3>

            {serviceDesc && (
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                {serviceDesc}
              </p>
            )}
          </div>

          {/* Cuerpo del modal */}
          <div className="p-6 space-y-5">
            <div
              className="p-4 rounded-xl border flex items-start gap-3.5"
              style={{
                background: 'rgba(0, 212, 255, 0.05)',
                borderColor: 'rgba(0, 212, 255, 0.2)',
              }}
            >
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 flex-shrink-0 mt-0.5">
                <Sparkles size={20} />
              </div>
              <div className="text-sm">
                <h4 className="font-semibold text-white mb-1">
                  ¿Deseas implementar este servicio en tu negocio?
                </h4>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  Este sistema está en fase de despliegue y personalización. Agenda una conversación directa con nuestros ingenieros para conocer las funcionalidades completas o solicitar una demostración exclusiva.
                </p>
              </div>
            </div>

            {/* Beneficios de agendar */}
            <div className="space-y-2 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span>Asesoría personalizada sin costo ni compromiso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span>Demostración de funciones en vivo para tu equipo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span>Propuesta y cotización a la medida de tu institución</span>
              </div>
            </div>

            {/* Opciones de contacto */}
            <div className="pt-2">
              <p className="text-xs uppercase font-semibold tracking-wider text-gray-400 mb-3 text-center">
                Elige tu vía preferida para comunicarte:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                  }}
                >
                  <MessageCircle size={19} />
                  <span>WhatsApp</span>
                </a>

                {/* Telegram */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #2AABEE, #229ED9)',
                    boxShadow: '0 4px 14px rgba(42, 171, 238, 0.35)',
                  }}
                >
                  <Send size={19} />
                  <span>Telegram</span>
                </a>
              </div>

              {/* Teléfono directo */}
              <div className="mt-4 text-center">
                <a
                  href="tel:+18096133196"
                  className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <PhoneCall size={13} />
                  <span>O llámanos directamente: +1 (809) 613-3196</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
