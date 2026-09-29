/* Sección "Sobre Nosotros" con layout dos columnas y timeline vertical animado */
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Zap, Target, TrendingUp } from 'lucide-react'
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  viewportProps,
} from '../../hooks/useScrollAnimation.js'

/* Iconos para las tarjetas de valores */
const VALUE_ICONS = {
  innovation: Zap,
  commitment: Target,
  results: TrendingUp,
}

/* Claves de los valores para iterar */
const VALUE_KEYS = ['innovation', 'commitment', 'results']

export default function About() {
  const { t } = useTranslation(['about', 'common'])

  /* Obtener los hitos del timeline desde las traducciones */
  const timelineEvents = t('about:timeline.events', { returnObjects: true }) || []

  return (
    <section id="nosotros" className="relative z-10 py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Layout dos columnas: texto izquierda, timeline derecha */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportProps}
        >
          {/* Columna izquierda: etiqueta, título y párrafos */}
          <motion.div variants={fadeInLeft} className="flex flex-col justify-center">
            {/* Etiqueta de sección */}
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full w-fit"
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                color: '#D4AF37',
                border: '1px solid rgba(212, 175, 55, 0.25)',
              }}
            >
              {t('about:label') || t('about:sectionLabel')}
            </span>

            {/* Título principal */}
            <h2
              className="text-3xl md:text-4xl font-extrabold leading-tight mb-6"
              style={{ color: '#F1F5F9' }}
            >
              {t('about:title')}
            </h2>

            {/* Primer párrafo: misión */}
            <p className="text-base leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
              {t('about:paragraph1')}
            </p>

            {/* Segundo párrafo */}
            <p className="text-base leading-relaxed" style={{ color: '#94A3B8' }}>
              {t('about:paragraph2')}
            </p>
          </motion.div>

          {/* Columna derecha: timeline vertical animado */}
          <motion.div variants={fadeInRight} className="relative">
            {/* Título del timeline */}
            <h3
              className="text-lg font-bold mb-8"
              style={{ color: '#F1F5F9' }}
            >
              {t('about:timeline.title')}
            </h3>

            {/* Contenedor del timeline con línea vertical animada */}
            <div className="relative">
              {/* SVG para la línea vertical animada con pathLength */}
              <svg
                className="absolute left-[11px] top-0 h-full"
                width="2"
                style={{ overflow: 'visible' }}
              >
                <motion.line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="100%"
                  stroke="rgba(212, 175, 55, 0.3)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={viewportProps}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>

              {/* Lista de hitos del timeline */}
              <div className="space-y-6 pl-8">
                {Array.isArray(timelineEvents) && timelineEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    className="relative flex flex-col"
                    variants={fadeInLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportProps}
                    transition={{ delay: index * 0.15 }}
                  >
                    {/* Punto del timeline en dorado */}
                    <div
                      className="absolute -left-8 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        background: '#0a0a0f',
                        borderColor: '#D4AF37',
                        boxShadow: '0 0 8px rgba(212, 175, 55, 0.4)',
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#D4AF37' }}
                      />
                    </div>

                    {/* Año en dorado */}
                    <span
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: '#D4AF37' }}
                    >
                      {event.year}
                    </span>

                    {/* Descripción del hito */}
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'rgba(241, 245, 249, 0.8)' }}
                    >
                      {event.text || event.event}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tarjetas de valores en fila horizontal */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportProps}
        >
          {VALUE_KEYS.map((key) => {
            const Icon = VALUE_ICONS[key]
            return (
              <motion.div
                key={key}
                variants={fadeInUp}
                className="rounded-2xl p-6 text-center"
                style={{
                  background: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                whileHover={{
                  y: -6,
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 16px 32px rgba(212, 175, 55, 0.08)',
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Ícono con fondo dorado suave */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                  }}
                >
                  <Icon size={22} color="#D4AF37" />
                </div>

                {/* Título del valor */}
                <h4
                  className="font-bold text-base mb-2"
                  style={{ color: '#F1F5F9' }}
                >
                  {t(`about:values.${key}.title`)}
                </h4>

                {/* Descripción del valor */}
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                  {t(`about:values.${key}.description`)}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
