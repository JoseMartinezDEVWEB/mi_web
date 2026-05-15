/* Sección principal del catálogo de servicios con filtros, grid y panel de demo */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import ServiceFilter from './ServiceFilter.jsx'
import ServiceCard, { SERVICE_CATEGORIES } from './ServiceCard.jsx'
import ServiceDemoPanel from './ServiceDemoPanel.jsx'
import ButtonPrimary from '../../ui/ButtonPrimary.jsx'
import { fadeInUp, staggerContainer, viewportProps } from '../../../hooks/useScrollAnimation.js'

/* IDs de todos los servicios disponibles en el catálogo */
const ALL_SERVICES = [
  'inventory', 'billing', 'ecommerce', 'chatbot',
  'webdev', 'mobileapp', 'reservations', 'analytics',
]

export default function ServicesSection() {
  const { t } = useTranslation(['services', 'common'])
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeServiceId, setActiveServiceId] = useState('inventory')

  /* Filtrar servicios según la categoría activa */
  const filteredServices = activeFilter === 'all'
    ? ALL_SERVICES
    : ALL_SERVICES.filter((id) => SERVICE_CATEGORIES[id] === activeFilter)

  /* Si el servicio activo queda fuera del filtro, seleccionar el primero disponible */
  const resolvedActiveId = filteredServices.includes(activeServiceId)
    ? activeServiceId
    : filteredServices[0] ?? 'inventory'

  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openCustomChat = () => {
    /* Abrir chat y pre-cargar mensaje de sistema personalizado */
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="servicios" className="relative z-10 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* PARTE A: Encabezado */}
        <motion.div
          className="text-center mb-14"
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
            {t('services:sectionLabel')}
          </motion.span>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ color: '#F1F5F9' }}
          >
            {t('services:title')}
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: '#94A3B8' }}
          >
            {t('services:subtitle')}
          </motion.p>
        </motion.div>

        {/* PARTE B: Filtros de categoría */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportProps}
          transition={{ duration: 0.5 }}
        >
          <ServiceFilter
            activeFilter={activeFilter}
            onFilterChange={(f) => setActiveFilter(f)}
          />
        </motion.div>

        {/* PARTE C: Grid de tarjetas de servicio */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredServices.map((id) => (
              <motion.div
                key={id}
                variants={fadeInUp}
              >
                <ServiceCard
                  serviceId={id}
                  active={id === resolvedActiveId}
                  onClick={() => setActiveServiceId(id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* PARTE D: Panel sandbox de demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportProps}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <ServiceDemoPanel
            serviceId={resolvedActiveId}
            onContact={scrollToContact}
          />
        </motion.div>

        {/* PARTE E: CTA final para sistemas personalizados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportProps}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-8 md:p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,212,255,0.05))',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#F1F5F9' }}>
            {t('services:demo.customSystem')}
          </h3>
          <p className="mb-6" style={{ color: '#94A3B8' }}>
            Cada empresa es única. Diseñamos soluciones a medida que se adaptan exactamente a tus procesos.
          </p>
          <ButtonPrimary
            onClick={openCustomChat}
            iconLeft={<MessageCircle size={18} />}
          >
            {t('services:demo.tellUsYourIdea')}
          </ButtonPrimary>
        </motion.div>
      </div>
    </section>
  )
}
