/* Footer del sitio con 4 columnas, suscripción al newsletter y protección legal/anti-bot */
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Send, ShieldCheck } from 'lucide-react'
import TikTokIcon from '../ui/TikTokIcon.jsx'
import LegalModal from '../ui/LegalModal.jsx'
import { generateSecurityToken } from '../../utils/antiBot.js'
import { toast } from 'sonner'
import api from '../../services/api.js'

/* Links de las columnas del footer */
const SERVICES_LINKS = [
  'Inventario', 'Facturación', 'Préstamos', 'E-commerce', 'Chatbot IA',
  'Desarrollo Web', 'App Móvil',
]
const COMPANY_LINKS = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contacto', href: '#contacto' },
]

const SOCIAL_LINKS = [
  { icon: Instagram, href: 'https://instagram.com/J4technologyisnow', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/J4technologyisnow', label: 'Facebook' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@J4technologyisnow', label: 'TikTok' },
]

export default function Footer() {
  const { t } = useTranslation('common')
  const [email, setEmail] = useState('')
  const [hpField, setHpField] = useState('') // Honeypot invisible para atrapar bots
  const [securityToken, setSecurityToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [legalModalOpen, setLegalModalOpen] = useState(false)
  const [legalTab, setLegalTab] = useState('terms')

  // Generar token de seguridad al montar el componente
  useEffect(() => {
    setSecurityToken(generateSecurityToken())
  }, [])

  const openLegal = (tab) => {
    setLegalTab(tab)
    setLegalModalOpen(true)
  }

  /* Manejar suscripción al newsletter con validación anti-bot */
  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Por favor ingresa un correo electrónico válido.')
      return
    }

    setLoading(true)
    try {
      // Enviamos el correo junto con el campo trampa (honeypot) y el token temporal
      await api.post('/newsletter', {
        email,
        website_hp: hpField,
        securityToken: securityToken || generateSecurityToken(),
      })
      toast.success(t('toast.subscribed'))
      setEmail('')
      setHpField('')
      // Renovar token
      setSecurityToken(generateSecurityToken())
    } catch (err) {
      const errorMsg = err?.response?.data?.error || t('toast.error')
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const scrollTo = (href) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <footer
        className="relative z-10 pt-16 pb-8"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid de 4 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Columna 1: Logo + tagline + redes */}
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-3">
                <span style={{ color: '#D4AF37' }}>J4</span>
                <span style={{ color: '#F1F5F9' }}>TechnologyIsNow</span>
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#94A3B8' }}>
                {t('footer.tagline')}
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#94A3B8',
                    }}
                    whileHover={{ color: '#00D4FF', borderColor: 'rgba(0,212,255,0.4)' }}
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Columna 2: Servicios */}
            <div>
              <h4 className="font-semibold text-sm mb-4" style={{ color: '#F1F5F9' }}>
                {t('footer.services')}
              </h4>
              <ul className="space-y-2.5">
                {SERVICES_LINKS.map((svc) => (
                  <li key={svc}>
                    <button
                      onClick={() => scrollTo('#servicios')}
                      className="text-sm transition-colors duration-150 hover:text-[#00D4FF]"
                      style={{ color: '#94A3B8' }}
                    >
                      {svc}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 3: Empresa */}
            <div>
              <h4 className="font-semibold text-sm mb-4" style={{ color: '#F1F5F9' }}>
                {t('footer.company')}
              </h4>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <button
                      onClick={() => scrollTo(href)}
                      className="text-sm transition-colors duration-150 hover:text-[#00D4FF]"
                      style={{ color: '#94A3B8' }}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 4: Legal y Cumplimiento */}
            <div>
              <h4 className="font-semibold text-sm mb-4" style={{ color: '#F1F5F9' }}>
                {t('footer.legal')}
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => openLegal('privacy')}
                    className="text-sm transition-colors duration-150 hover:text-[#00D4FF] text-left"
                    style={{ color: '#94A3B8' }}
                  >
                    {t('footer.privacy', 'Política de Privacidad')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegal('terms')}
                    className="text-sm transition-colors duration-150 hover:text-[#00D4FF] text-left"
                    style={{ color: '#94A3B8' }}
                  >
                    {t('footer.terms', 'Términos y Condiciones')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegal('cookies')}
                    className="text-sm transition-colors duration-150 hover:text-[#00D4FF] text-left"
                    style={{ color: '#94A3B8' }}
                  >
                    {t('footer.cookies', 'Política de Cookies')}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Sección inferior: newsletter y copyright */}
          <div
            className="pt-8"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <div className="mb-2">
              <h5 className="text-sm font-semibold text-slate-200 mb-1">
                {t('footer.newsletter', 'Suscríbete al newsletter')}
              </h5>
              <p className="text-xs text-slate-400">
                Recibe novedades de tecnología, lanzamientos y consejos de transformación digital.
              </p>
            </div>

            {/* Formulario de newsletter con protección Anti-Bot Honeypot */}
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 mb-2 max-w-lg"
            >
              {/* Campo Trampa Honeypot invisible para humanos, pero visible para robots automáticos */}
              <div
                style={{
                  opacity: 0,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: 0,
                  width: 0,
                  zIndex: -1,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              >
                <input
                  type="text"
                  name="website_hp"
                  tabIndex="-1"
                  autoComplete="off"
                  value={hpField}
                  onChange={(e) => setHpField(e.target.value)}
                  placeholder="Leave empty"
                />
              </div>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletterPlaceholder', 'Tu correo electrónico')}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#F1F5F9',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50 shrink-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F5C842)' }}
              >
                <Send size={14} />
                {loading ? 'Procesando...' : t('footer.subscribe', 'Suscribirme')}
              </button>
            </form>

            {/* Aviso de consentimiento y protección anti-spam */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-6">
              <ShieldCheck size={14} className="text-cyan-400 shrink-0" />
              <span>
                Al suscribirte aceptas nuestros{' '}
                <button
                  type="button"
                  onClick={() => openLegal('terms')}
                  className="underline hover:text-cyan-400 transition-colors"
                >
                  Términos
                </button>{' '}
                y{' '}
                <button
                  type="button"
                  onClick={() => openLegal('privacy')}
                  className="underline hover:text-cyan-400 transition-colors"
                >
                  Política de Privacidad
                </button>
                . No enviamos spam y puedes darte de baja en cualquier momento.
              </span>
            </div>

            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: '#94A3B8' }}>
              <p>
                © {new Date().getFullYear()} J4TechnologyIsNow. {t('footer.copyright', 'Todos los derechos reservados')}.
              </p>
              <p>{t('footer.madeWith', 'Hecho con ❤️ en República Dominicana 🇩🇴')}</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Legal Global */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </>
  )
}

