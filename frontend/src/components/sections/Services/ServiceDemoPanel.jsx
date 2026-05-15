/* Panel sandbox que renderiza la demo del servicio seleccionado */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Circle, ChevronRight } from 'lucide-react'
import ButtonPrimary from '../../ui/ButtonPrimary.jsx'
import ButtonSecondary from '../../ui/ButtonSecondary.jsx'
import Badge from '../../ui/Badge.jsx'

/* Importar todas las demos */
import InventoryDemo from './demos/InventoryDemo.jsx'
import InvoiceDemo from './demos/InvoiceDemo.jsx'
import EcommerceDemo from './demos/EcommerceDemo.jsx'
import AgentDemo from './demos/AgentDemo.jsx'
import WebDemo from './demos/WebDemo.jsx'
import AppDemo from './demos/AppDemo.jsx'

/* Mapeo de serviceId a componente de demo */
const DEMO_COMPONENTS = {
  inventory: InventoryDemo,
  billing: InvoiceDemo,
  ecommerce: EcommerceDemo,
  chatbot: AgentDemo,
  webdev: WebDemo,
  mobileapp: AppDemo,
}

/* Estados de servicios para el badge */
const SERVICE_STATUS = {
  inventory: 'demoAvailable',
  billing: 'demoAvailable',
  ecommerce: 'demoAvailable',
  chatbot: 'beta',
  webdev: 'demoAvailable',
  mobileapp: 'demoAvailable',
  reservations: 'comingSoon',
  analytics: 'comingSoon',
}

export default function ServiceDemoPanel({ serviceId, onContact }) {
  const { t, i18n } = useTranslation(['services', 'common'])
  const [loading, setLoading] = useState(false)
  const [prevServiceId, setPrevServiceId] = useState(serviceId)

  /* Simular carga al cambiar de servicio */
  if (serviceId !== prevServiceId) {
    setLoading(true)
    setPrevServiceId(serviceId)
    setTimeout(() => setLoading(false), 600)
  }

  const DemoComponent = DEMO_COMPONENTS[serviceId]
  const status = SERVICE_STATUS[serviceId] ?? 'comingSoon'
  const features = t(`services.${serviceId}.features`, { returnObjects: true }) ?? []
  const demoUrl = `demo.j4technologyisnow.com/${serviceId}`

  /* Si el servicio no tiene demo aún */
  const isComingSoon = status === 'comingSoon'

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Encabezado del panel */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-lg" style={{ color: '#F1F5F9' }}>
              {t(`services.${serviceId}.name`)}
            </h3>
            <Badge status={status}>
              {t(`common:badges.${status}`)}
            </Badge>
          </div>
          <p className="text-sm" style={{ color: '#94A3B8' }}>
            {t(`services.${serviceId}.description`)}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ButtonSecondary onClick={onContact} className="!text-xs !py-2 !px-3">
            {t('common:buttons.viewPrices')}
          </ButtonSecondary>
          <ButtonPrimary onClick={onContact} className="!text-xs !py-2 !px-3">
            {t('common:buttons.hire')}
          </ButtonPrimary>
        </div>
      </div>

      {/* Barra de navegador simulada */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        {/* Dots estilo macOS */}
        <div className="flex gap-1.5">
          {['#ef4444', '#f59e0b', '#10b981'].map((color) => (
            <div key={color} className="w-3 h-3 rounded-full" style={{ background: color }} />
          ))}
        </div>

        {/* URL ficticia con barra de progreso de carga */}
        <div
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg overflow-hidden relative"
          style={{ background: 'rgba(0, 0, 0, 0.3)', maxWidth: 400 }}
        >
          {loading && (
            <motion.div
              className="absolute top-0 left-0 h-[2px] rounded-full"
              style={{ background: '#00D4FF' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}
          <span className="text-xs truncate" style={{ color: '#94A3B8' }}>
            {demoUrl}
          </span>
        </div>
      </div>

      {/* Área de contenido de la demo */}
      <div className="p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            /* Estado de carga */
            <motion.div
              key="loading"
              className="flex items-center justify-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: '#00D4FF', borderTopColor: 'transparent' }}
                />
                <p className="text-sm" style={{ color: '#94A3B8' }}>
                  {t('services:demo.loading')}
                </p>
              </div>
            </motion.div>
          ) : isComingSoon ? (
            /* Servicio sin demo disponible */
            <motion.div
              key="coming-soon"
              className="flex flex-col items-center justify-center h-64 text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.2)' }}
              >
                <ChevronRight size={28} color="#00D4FF" />
              </div>
              <h4 className="font-semibold text-lg mb-2" style={{ color: '#F1F5F9' }}>
                {t('common:badges.comingSoon')}
              </h4>
              <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>
                Esta demo estará disponible pronto. ¿Quieres más información sobre este servicio?
              </p>
              <ButtonPrimary onClick={onContact}>
                {t('common:buttons.contactUs')}
              </ButtonPrimary>
            </motion.div>
          ) : (
            /* Demo del servicio seleccionado */
            <motion.div
              key={serviceId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {DemoComponent && <DemoComponent language={i18n.language} onContact={onContact} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chips de features incluidos */}
      {Array.isArray(features) && features.length > 0 && (
        <div
          className="px-6 py-4"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>
            {t('services:demo.featuresIncluded')}
          </p>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, i) => (
              <motion.span
                key={feature}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(0, 212, 255, 0.06)',
                  border: '1px solid rgba(0, 212, 255, 0.15)',
                  color: '#94A3B8',
                }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                ✓ {feature}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
