/* Sección de contacto con datos de la empresa y chat del agente IA */
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Mail, Clock, MessageCircle, Send as TelegramIcon, Instagram, Facebook } from 'lucide-react'
import TikTokIcon from '../../ui/TikTokIcon.jsx'
import ChatWidget from './ChatWidget.jsx'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, viewportProps } from '../../../hooks/useScrollAnimation.js'

export default function ContactSection() {
  const { t } = useTranslation('contact')

  /* Redes sociales exclusivas solicitadas: Instagram, Facebook, TikTok */
  const socialLinks = [
    {
      Icon: Instagram,
      href: 'https://instagram.com/J4technologyisnow',
      label: 'Instagram (@J4technologyisnow)',
      hoverColor: '#E1306C',
    },
    {
      Icon: Facebook,
      href: 'https://facebook.com/J4technologyisnow',
      label: 'Facebook (@J4technologyisnow)',
      hoverColor: '#1877F2',
    },
    {
      Icon: TikTokIcon,
      href: 'https://tiktok.com/@J4technologyisnow',
      label: 'TikTok (@J4technologyisnow)',
      hoverColor: '#00F2FE',
    },
  ]

  return (
    <section id="contacto" className="relative z-10 py-24 px-4 transition-colors">
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
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4 px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-500 dark:text-cyan-400 bg-cyan-500/10"
          >
            {t('contact:sectionLabel')}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900 dark:text-slate-100"
          >
            {t('contact:title')}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg max-w-2xl mx-auto text-slate-600 dark:text-slate-400 font-medium"
          >
            {t('contact:subtitle')}
          </motion.p>
        </motion.div>

        {/* Layout dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Columna izquierda: datos de contacto oficiales */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportProps}
            className="space-y-8"
          >
            {/* Lista de datos de contacto con enlaces directos */}
            <div className="space-y-5">
              {/* Dirección */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-sm">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Ubicación
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {t('contact:address')}
                  </p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Teléfono de Contacto
                  </p>
                  <a
                    href="tel:+18096133196"
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors inline-block mt-0.5"
                    title="Llamar al 809-613-3196"
                  >
                    809-613-3196
                  </a>
                </div>
              </div>

              {/* Correo Electrónico */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Correo Electrónico
                  </p>
                  <a
                    href="mailto:j4.technologyisnow@gmail.com"
                    className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors inline-block mt-0.5 break-all"
                    title="Enviar correo a j4.technologyisnow@gmail.com"
                  >
                    j4.technologyisnow@gmail.com
                  </a>
                </div>
              </div>

              {/* Horario */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-slate-500/15 border border-slate-500/30 text-slate-600 dark:text-slate-400 shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Horario de Atención
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                    {t('contact:schedule')}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de contacto directo: WhatsApp y Telegram (809-613-3196) */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Canales de Mensajería Instantánea
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Botón WhatsApp */}
                <a
                  href="https://wa.me/18096133196?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20servicios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl text-sm font-bold bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] active:scale-98 transition-all shadow-sm"
                  title="Abrir WhatsApp con 809-613-3196"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp (809-613-3196)</span>
                </a>

                {/* Botón Telegram */}
                <a
                  href="https://t.me/+18096133196"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl text-sm font-bold bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/40 text-[#0088cc] active:scale-98 transition-all shadow-sm"
                  title="Abrir Telegram con 809-613-3196"
                >
                  <TelegramIcon size={18} />
                  <span>Telegram (809-613-3196)</span>
                </a>
              </div>
            </div>

            {/* Redes Sociales exclusivas: Instagram, Facebook y TikTok (J4technologyisnow) */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Síguenos en Redes Sociales (@J4technologyisnow)
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ Icon, href, label, hoverColor }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 shadow-sm transition-all"
                    whileHover={{
                      scale: 1.08,
                      borderColor: hoverColor,
                      color: hoverColor,
                      backgroundColor: `${hoverColor}15`,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Columna derecha: chat interactivo del Agente IA J4 */}
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
