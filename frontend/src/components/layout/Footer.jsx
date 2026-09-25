/* Footer del sitio con 4 columnas y suscripción al newsletter */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Send } from 'lucide-react'
import TikTokIcon from '../ui/TikTokIcon.jsx'
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
const LEGAL_LINKS = [
  { label: 'Privacidad', href: '#' },
  { label: 'Términos', href: '#' },
  { label: 'Cookies', href: '#' },
]
const SOCIAL_LINKS = [
  { icon: Instagram, href: 'https://instagram.com/J4technologyisnow', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/J4technologyisnow', label: 'Facebook' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@J4technologyisnow', label: 'TikTok' },
]

export default function Footer() {
  const { t } = useTranslation('common')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  /* Manejar suscripción al newsletter */
  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setLoading(true)
    try {
      await api.post('/newsletter', { email })
      toast.success(t('toast.subscribed'))
      setEmail('')
    } catch {
      toast.error(t('toast.error'))
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

          {/* Columna 4: Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: '#F1F5F9' }}>
              {t('footer.legal')}
            </h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm transition-colors duration-150 hover:text-[#00D4FF]"
                    style={{ color: '#94A3B8' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sección inferior: newsletter y copyright */}
        <div
          className="pt-8"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          {/* Formulario de newsletter */}
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 mb-6 max-w-md"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.newsletterPlaceholder')}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#F1F5F9',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F5C842)' }}
            >
              <Send size={14} />
              {t('footer.subscribe')}
            </button>
          </form>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: '#94A3B8' }}>
            <p>
              © {new Date().getFullYear()} J4TechnologyIsNow. {t('footer.copyright')}.
            </p>
            <p>{t('footer.madeWith')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
