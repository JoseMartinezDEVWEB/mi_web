/* Tarjeta individual de servicio con ícono temático, badge de estado y soporte de filtro */
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Package, FileText, ShoppingCart, Bot, Globe, Smartphone,
  Calendar, BarChart2, Landmark, GraduationCap,
} from 'lucide-react'
import Badge from '../../ui/Badge.jsx'

/* Mapeo de serviceId a componente de ícono, fondo y color temáticos */
const SERVICE_ICONS = {
  inventory:    { Icon: Package,    bg: 'rgba(0,212,255,0.1)',   color: '#00D4FF' },
  billing:      { Icon: FileText,   bg: 'rgba(212,175,55,0.1)',  color: '#D4AF37' },
  prestamos:    { Icon: Landmark,   bg: 'rgba(212,175,55,0.1)',  color: '#D4AF37' },
  ecommerce:    { Icon: ShoppingCart, bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  chatbot:      { Icon: Bot,        bg: 'rgba(139,92,246,0.1)',  color: '#8b5cf6' },
  webdev:       { Icon: Globe,      bg: 'rgba(0,153,204,0.1)',   color: '#0099CC' },
  mobileapp:    { Icon: Smartphone, bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b' },
  school:       { Icon: GraduationCap, bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  reservations: { Icon: Calendar,   bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
  analytics:    { Icon: BarChart2,  bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
}

/* Mapeo de serviceId a estado del badge visible en la tarjeta */
export const SERVICE_STATUS = {
  inventory:    'demoAvailable',
  billing:      'demoAvailable',
  prestamos:    'demoAvailable',
  ecommerce:    'demoAvailable',
  chatbot:      'beta',
  webdev:       'demoAvailable',
  mobileapp:    'demoAvailable',
  school:       'comingSoon',
  reservations: 'comingSoon',
  analytics:    'comingSoon',
}

/* Categorías de cada servicio, usadas por el sistema de filtros */
export const SERVICE_CATEGORIES = {
  inventory:    'management',
  billing:      'management',
  prestamos:    'management',
  ecommerce:    'digital',
  chatbot:      'ai',
  webdev:       'digital',
  mobileapp:    'digital',
  school:       'management',
  reservations: 'management',
  analytics:    'ai',
}

/* Tarjeta de servicio con animación hover, borde de selección activa y badge */
export default function ServiceCard({ serviceId, active, onClick }) {
  /* Namespace services para nombre y descripción del servicio */
  const { t }  = useTranslation('services')
  /* Namespace common para los textos de badges */
  const { t: tc } = useTranslation('common')

  /* Fallback a webdev si el serviceId no tiene configuración registrada */
  const { Icon, bg, color } = SERVICE_ICONS[serviceId] ?? SERVICE_ICONS.webdev
  const status = SERVICE_STATUS[serviceId] ?? 'comingSoon'

  return (
    <motion.div
      className="rounded-2xl p-6 cursor-pointer"
      style={{
        background: '#111827',
        border:     active
          ? '1px solid rgba(212,175,55,0.5)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow:  active ? '0 0 20px rgba(212,175,55,0.15)' : 'none',
      }}
      onClick={onClick}
      whileHover={{
        y:          -6,
        borderColor: 'rgba(0,212,255,0.35)',
        boxShadow:  '0 15px 30px rgba(0,212,255,0.1)',
      }}
      transition={{ duration: 0.25 }}
    >
      {/* Zona de ícono con fondo temático correspondiente al tipo de servicio */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: bg }}
      >
        <Icon size={22} color={color} />
      </div>

      {/* Nombre del servicio obtenido del namespace de traducciones */}
      <h3 className="font-bold text-base mb-2" style={{ color: '#F1F5F9' }}>
        {t(`services.${serviceId}.name`)}
      </h3>

      {/* Descripción corta del servicio */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
        {t(`services.${serviceId}.description`)}
      </p>

      {/* Badge de estado con texto traducido desde el namespace common */}
      <Badge status={status}>
        {tc(`badges.${status}`)}
      </Badge>
    </motion.div>
  )
}
