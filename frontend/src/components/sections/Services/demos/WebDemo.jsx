/* Demo interactivo de servicios de desarrollo web con estimador de precios en tiempo real */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, X, Clock, DollarSign } from 'lucide-react'

/* Tipos de proyectos web disponibles con sus rangos base de precio y tiempo */
const TIPOS_PROYECTO = [
  {
    type:       'Landing Page',
    priceBase:  25000,
    priceMax:   45000,
    priceRange: 'DOP 25,000 – 45,000',
    days:       '7-14 días',
    desc:       'Página de presentación moderna y optimizada para conversión',
  },
  {
    type:       'E-commerce',
    priceBase:  80000,
    priceMax:   150000,
    priceRange: 'DOP 80,000 – 150,000',
    days:       '30-60 días',
    desc:       'Tienda en línea completa con pasarela de pago',
  },
  {
    type:       'Sistema Web',
    priceBase:  120000,
    priceMax:   300000,
    priceRange: 'DOP 120,000 – 300,000',
    days:       '60-120 días',
    desc:       'Aplicación web a medida con autenticación y base de datos',
  },
  {
    type:       'Blog / Portal',
    priceBase:  35000,
    priceMax:   65000,
    priceRange: 'DOP 35,000 – 65,000',
    days:       '14-30 días',
    desc:       'Portal de contenido con CMS integrado',
  },
]

/* Extras opcionales que el usuario puede seleccionar en el estimador */
const EXTRAS = [
  { key: 'diseño',      label: 'Diseño custom',   costo: 15000, diasExtra: 3  },
  { key: 'seo',         label: 'SEO avanzado',    costo: 8000,  diasExtra: 2  },
  { key: 'cms',         label: 'Blog / CMS',       costo: 12000, diasExtra: 5  },
  { key: 'multiidioma', label: 'Multi-idioma',     costo: 10000, diasExtra: 4  },
  { key: 'chat',        label: 'Chat en vivo',     costo: 20000, diasExtra: 3  },
]

/* Formatea un número como moneda DOP sin decimales */
const formatearDOP = (valor) =>
  new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(valor)

/* Componente principal del demo de desarrollo web */
export default function WebDemo() {
  /* Tipo de proyecto seleccionado en el estimador */
  const [tipoSeleccionado, setTipoSeleccionado] = useState('Landing Page')
  /* Set de claves de extras marcados en los checkboxes */
  const [extrasActivos, setExtrasActivos]       = useState(new Set())
  /* Proyecto cuyo modal de detalle está abierto */
  const [modalProyecto, setModalProyecto]       = useState(null)

  /* Datos del tipo de proyecto seleccionado */
  const tipoActual = TIPOS_PROYECTO.find(t => t.type === tipoSeleccionado) ?? TIPOS_PROYECTO[0]

  /* Precio estimado considerando el tipo base y los extras seleccionados */
  const costoExtras = EXTRAS
    .filter(e => extrasActivos.has(e.key))
    .reduce((acc, e) => acc + e.costo, 0)

  const precioEstimado = tipoActual.priceBase + costoExtras
  const precioMax      = tipoActual.priceMax  + costoExtras

  /* Días extra por los adicionales seleccionados */
  const diasExtras = EXTRAS
    .filter(e => extrasActivos.has(e.key))
    .reduce((acc, e) => acc + e.diasExtra, 0)

  /* Activa o desactiva un extra del checkbox */
  const toggleExtra = (key) => {
    setExtrasActivos(prev => {
      const nuevo = new Set(prev)
      nuevo.has(key) ? nuevo.delete(key) : nuevo.add(key)
      return nuevo
    })
  }

  return (
    <div className="space-y-4">

      {/* ── Grid 2x2 de tipos de proyecto ── */}
      <div className="grid grid-cols-2 gap-3">
        {TIPOS_PROYECTO.map((proyecto) => (
          <motion.div
            key={proyecto.type}
            className="rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            whileHover={{ borderColor: 'rgba(0,212,255,0.3)' }}
          >
            {/* Ícono y tipo de proyecto */}
            <div className="flex items-center gap-2 mb-2">
              <Globe size={14} style={{ color: '#00D4FF' }} />
              <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{proyecto.type}</p>
            </div>

            {/* Descripción breve */}
            <p className="text-xs mb-3 leading-relaxed" style={{ color: '#94A3B8' }}>{proyecto.desc}</p>

            {/* Precio y tiempo estimado */}
            <div className="space-y-1 mb-3">
              <p className="text-xs" style={{ color: '#10b981' }}>{proyecto.priceRange}</p>
              <div className="flex items-center gap-1">
                <Clock size={10} style={{ color: '#94A3B8' }} />
                <p className="text-xs" style={{ color: '#94A3B8' }}>{proyecto.days}</p>
              </div>
            </div>

            {/* Botón para abrir el modal de detalle */}
            <motion.button
              onClick={() => setModalProyecto(proyecto)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium w-full"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00D4FF' }}
              whileTap={{ scale: 0.97 }}
            >
              Ver ejemplo
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* ── Formulario de estimación rápida ── */}
      <div
        className="rounded-xl p-4 space-y-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Estimación rápida</p>

        {/* Selector de tipo de proyecto */}
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Tipo de proyecto</label>
          <select
            value={tipoSeleccionado}
            onChange={e => setTipoSeleccionado(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
          >
            {TIPOS_PROYECTO.map(t => (
              <option key={t.type} value={t.type}>{t.type}</option>
            ))}
          </select>
        </div>

        {/* Checkboxes de extras con costo adicional */}
        <div>
          <label className="text-xs mb-2 block" style={{ color: '#94A3B8' }}>Servicios adicionales</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {EXTRAS.map(extra => {
              const activo = extrasActivos.has(extra.key)
              return (
                <label
                  key={extra.key}
                  className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2"
                  style={{
                    background: activo ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
                    border:     activo ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={() => toggleExtra(extra.key)}
                    className="accent-cyan-400"
                  />
                  <div>
                    <p className="text-xs font-medium" style={{ color: activo ? '#00D4FF' : '#F1F5F9' }}>{extra.label}</p>
                    <p className="text-[10px]" style={{ color: '#94A3B8' }}>+{formatearDOP(extra.costo)}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Resultado de estimación en tiempo real */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}
        >
          <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>Estimación para: <span style={{ color: '#00D4FF' }}>{tipoSeleccionado}</span></p>
          <div className="flex justify-between items-center">
            {/* Rango de precio estimado */}
            <div className="flex items-center gap-2">
              <DollarSign size={16} style={{ color: '#10b981' }} />
              <div>
                <p className="text-xs" style={{ color: '#94A3B8' }}>Inversión estimada</p>
                <p className="text-base font-bold" style={{ color: '#10b981' }}>
                  {formatearDOP(precioEstimado)} – {formatearDOP(precioMax)}
                </p>
              </div>
            </div>
            {/* Tiempo de entrega estimado */}
            <div className="text-right">
              <p className="text-xs" style={{ color: '#94A3B8' }}>Entrega estimada</p>
              <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>{tipoActual.days}</p>
              {diasExtras > 0 && (
                <p className="text-[10px]" style={{ color: '#94A3B8' }}>+{diasExtras} días extras</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal de detalle de proyecto ── */}
      <AnimatePresence>
        {modalProyecto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalProyecto(null)}
          >
            <motion.div
              className="rounded-2xl p-6 max-w-sm w-full"
              style={{ background: '#111827', border: '1px solid rgba(0,212,255,0.25)' }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Encabezado del modal */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-base" style={{ color: '#F1F5F9' }}>{modalProyecto.type}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#00D4FF' }}>{modalProyecto.priceRange}</p>
                </div>
                <button onClick={() => setModalProyecto(null)}>
                  <X size={16} style={{ color: '#94A3B8' }} />
                </button>
              </div>

              {/* Descripción extendida del tipo de proyecto */}
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
                {modalProyecto.desc}
              </p>

              {/* Detalles del proyecto */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock size={13} style={{ color: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: '#F1F5F9' }}>Tiempo de entrega: <strong>{modalProyecto.days}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={13} style={{ color: '#10b981' }} />
                  <span className="text-sm" style={{ color: '#F1F5F9' }}>Precio desde: <strong>{formatearDOP(modalProyecto.priceBase)}</strong></span>
                </div>
              </div>

              {/* Acción de cierre */}
              <motion.button
                onClick={() => setModalProyecto(null)}
                className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)', color: '#00D4FF' }}
                whileTap={{ scale: 0.97 }}
              >
                Entendido
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
