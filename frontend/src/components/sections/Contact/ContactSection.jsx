/* Sección de contacto con datos de la empresa y chat del agente IA */
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Mail, Clock, MessageCircle, Send as TelegramIcon } from 'lucide-react'
import { Instagram, Linkedin, Github, Twitter } from 'lucide-react'
import ChatWidget from './ChatWidget.jsx'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, viewportProps } from '../../../hooks/useScrollAnimation.js'

export default function ContactSection() {
  const { t } = useTranslation('contact')

  /* Datos de contacto con íconos */
  const contactInfo = [
    { Icon: MapPin, label: t('contact:address'), color: '#00D4FF' },
    { Icon: Phone, label: t('contact:phone'), color: '#D4AF37' },
    { Icon: Mail, label: t('contact:email'), color: '#00D4FF' },
    { Icon: Clock, label: t('contact:schedule'), color: '#94A3B8' },
  ]

  /* Redes sociales */
  const socialLinks = [
    { Icon: Instagram, href: '#', label: 'Instagram' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
    { Icon: Github, href: '#', label: 'GitHub' },
    { Icon: Twitter, href: '#', label: 'Twitter/X' },
  ]

  return (
    <section id="contacto" className="relative z-10 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado centrado */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportProps}
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4 px-4 py-2 rounded-full"
            style={{
              border: '1px solid rgba(0, 212, 255, 0.3)',
              color: '#00D4FF',
              background: 'rgba(0, 212, 255, 0.05)',
            }}
          >
            {t('contact:sectionLabel')}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#F1F5F9' }}
          >
            {t('contact:title')}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: '#94A3B8' }}
          >
            {t('contact:subtitle')}
          </motion.p>
        </motion.div>

        {/* Layout dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna izquierda: datos de contacto */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportProps}
          >
            {/* Lista de datos de contacto */}
            <div className="space-y-5 mb-8">
              {contactInfo.map(({ Icon, label, color }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={18} color={color} />
                  </div>
                  <p className="text-sm mt-2.5 leading-relaxed" style={{ color: '#94A3B8' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Botones de contacto directo */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {/* WhatsApp */}
              <a
                href="https://wa.me/18095550100?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20servicios"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.4)',
                  color: '#25D366',
                }}
              >
                <MessageCircle size={16} />
                {t('contact:whatsapp')}
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/J4TechnologyIsNow?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20servicios"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'rgba(0, 136, 204, 0.15)',
                  border: '1px solid rgba(0, 136, 204, 0.4)',
                  color: '#0088cc',
                }}
              >
                <TelegramIcon size={16} />
                {t('contact:telegram')}
              </a>
            </div>

            {/* Redes sociales */}
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94A3B8',
                  }}
                  whileHover={{
                    color: '#00D4FF',
                    borderColor: 'rgba(0,212,255,0.4)',
                    background: 'rgba(0,212,255,0.08)',
                  }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Columna derecha: chat con el agente IA */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportProps}
          >
            <ChatWidget />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
