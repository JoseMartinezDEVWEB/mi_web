/* Demo interactivo de servicios de desarrollo web con ejemplos interactivos reales y estimador de precios */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Clock,
  DollarSign,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  User,
  BookOpen,
  Layout
} from 'lucide-react'

import LandingPageDemo from './webExamples/LandingPageDemo'
import PersonalWebDemo from './webExamples/PersonalWebDemo'
import EcommerceWebDemo from './webExamples/EcommerceWebDemo'
import BlogPortalDemo from './webExamples/BlogPortalDemo'

/* Tipos de proyectos web disponibles con sus ejemplos correspondientes */
const TIPOS_PROYECTO = [
  {
    key:        'landing',
    type:       'Landing Page',
    priceBase:  25000,
    priceMax:   45000,
    priceRange: 'DOP 25,000 – 45,000',
    days:       '7-14 días',
    desc:       'Página de presentación de alta conversión para productos, servicios o campañas',
    icon:       Sparkles,
    badge:      'Conversión Rápida',
  },
  {
    key:        'personal',
    type:       'Web Personal / Portafolio',
    priceBase:  20000,
    priceMax:   40000,
    priceRange: 'DOP 20,000 – 40,000',
    days:       '7-10 días',
    desc:       'Sitio web de marca personal para profesionales, consultores y creadores',
    icon:       User,
    badge:      'Marca Personal',
  },
  {
    key:        'ecommerce',
    type:       'Tienda E-commerce',
    priceBase:  80000,
    priceMax:   150000,
    priceRange: 'DOP 80,000 – 150,000',
    days:       '30-60 días',
    desc:       'Tienda en línea completa con catálogo interactivo, carrito de compras y pasarela de pago',
    icon:       ShoppingBag,
    badge:      'Ventas Online',
  },
  {
    key:        'blog',
    type:       'Blog / Portal de Noticias',
    priceBase:  35000,
    priceMax:   65000,
    priceRange: 'DOP 35,000 – 65,000',
    days:       '14-30 días',
    desc:       'Portal de contenidos, revista digital o blog corporativo con categorías y buscador',
    icon:       BookOpen,
    badge:      'Contenidos & SEO',
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

export default function WebDemo() {
  /* Vista activa: 'selector' o clave de demo ('landing', 'personal', 'ecommerce', 'blog') */
  const [ejemploActivo, setEjemploActivo] = useState('selector')

  /* Tipo de proyecto seleccionado en el estimador rápido */
  const [tipoSeleccionado, setTipoSeleccionado] = useState('Landing Page')
  /* Set de claves de extras marcados en los checkboxes */
  const [extrasActivos, setExtrasActivos] = useState(new Set())

  /* Datos del tipo de proyecto seleccionado en el estimador */
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

  const toggleExtra = (key) => {
    setExtrasActivos(prev => {
      const nuevo = new Set(prev)
      nuevo.has(key) ? nuevo.delete(key) : nuevo.add(key)
      return nuevo
    })
  }

  return (
    <div className="space-y-4">
      {/* ── BARRA SUPERIOR DE NAVEGACIÓN ENTRE EJEMPLOS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/10 text-xs no-scrollbar">
        <button
          onClick={() => setEjemploActivo('selector')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all whitespace-nowrap ${
            ejemploActivo === 'selector'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          Opciones & Cotizador
        </button>

        <button
          onClick={() => setEjemploActivo('landing')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all whitespace-nowrap ${
            ejemploActivo === 'landing'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Ejemplo: Landing Page
        </button>

        <button
          onClick={() => setEjemploActivo('personal')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all whitespace-nowrap ${
            ejemploActivo === 'personal'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5 text-amber-400" />
          Ejemplo: Web Personal
        </button>

        <button
          onClick={() => setEjemploActivo('ecommerce')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all whitespace-nowrap ${
            ejemploActivo === 'ecommerce'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          Ejemplo: E-commerce
        </button>

        <button
          onClick={() => setEjemploActivo('blog')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all whitespace-nowrap ${
            ejemploActivo === 'blog'
              ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          Ejemplo: Blog / Portal
        </button>
      </div>

      {/* ── RENDERIZADO DINÁMICO DE LA VISTA / DEMO ── */}
      <AnimatePresence mode="wait">
        {/* 1. VISTA DE EJEMPLO: LANDING PAGE */}
        {ejemploActivo === 'landing' && (
          <motion.div
            key="demo-landing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <LandingPageDemo onBack={() => setEjemploActivo('selector')} />
          </motion.div>
        )}

        {/* 2. VISTA DE EJEMPLO: WEB PERSONAL / PORTAFOLIO */}
        {ejemploActivo === 'personal' && (
          <motion.div
            key="demo-personal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <PersonalWebDemo onBack={() => setEjemploActivo('selector')} />
          </motion.div>
        )}

        {/* 3. VISTA DE EJEMPLO: E-COMMERCE */}
        {ejemploActivo === 'ecommerce' && (
          <motion.div
            key="demo-ecommerce"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <EcommerceWebDemo onBack={() => setEjemploActivo('selector')} />
          </motion.div>
        )}

        {/* 4. VISTA DE EJEMPLO: BLOG / PORTAL */}
        {ejemploActivo === 'blog' && (
          <motion.div
            key="demo-blog"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <BlogPortalDemo onBack={() => setEjemploActivo('selector')} />
          </motion.div>
        )}

        {/* 5. VISTA POR DEFECTO: SELECTOR Y ESTIMADOR DE PRECIOS */}
        {ejemploActivo === 'selector' && (
          <motion.div
            key="demo-selector"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Grid 2x2 de Tipos de Proyectos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIPOS_PROYECTO.map((proyecto) => {
                const Icon = proyecto.icon

                return (
                  <motion.div
                    key={proyecto.key}
                    className="rounded-xl p-4 flex flex-col justify-between"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    whileHover={{ borderColor: 'rgba(0,212,255,0.4)', y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      {/* Encabezado de la tarjeta */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                            <Icon size={16} />
                          </div>
                          <p className="text-sm font-bold" style={{ color: '#F1F5F9' }}>{proyecto.type}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {proyecto.badge}
                        </span>
                      </div>

                      {/* Descripción */}
                      <p className="text-xs mb-3 leading-relaxed" style={{ color: '#94A3B8' }}>{proyecto.desc}</p>

                      {/* Rango de inversión y tiempo */}
                      <div className="space-y-1 mb-4">
                        <p className="text-xs font-bold" style={{ color: '#10b981' }}>{proyecto.priceRange}</p>
                        <div className="flex items-center gap-1">
                          <Clock size={11} style={{ color: '#94A3B8' }} />
                          <p className="text-xs" style={{ color: '#94A3B8' }}>Entrega: {proyecto.days}</p>
                        </div>
                      </div>
                    </div>

                    {/* Botón interactivo "Ver ejemplo" que carga el demo en el cuadro */}
                    <motion.button
                      onClick={() => setEjemploActivo(proyecto.key)}
                      className="text-xs px-3 py-2 rounded-xl font-bold w-full flex items-center justify-center gap-1.5 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,153,204,0.25))',
                        border: '1px solid rgba(0,212,255,0.4)',
                        color: '#00D4FF',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span>Ver ejemplo interactivo</span>
                      <span>→</span>
                    </motion.button>
                  </motion.div>
                )
              })}
            </div>

            {/* Formulario de Estimación Rápida */}
            <div
              className="rounded-xl p-4 space-y-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Cotizador de Inversión en Vivo</p>
                <span className="text-[11px] text-cyan-400 font-mono font-semibold">Precios en DOP</span>
              </div>

              {/* Selector de tipo */}
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Tipo de proyecto web</label>
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

              {/* Checkboxes de extras */}
              <div>
                <label className="text-xs mb-2 block" style={{ color: '#94A3B8' }}>Módulos y características adicionales</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {EXTRAS.map(extra => {
                    const activo = extrasActivos.has(extra.key)
                    return (
                      <label
                        key={extra.key}
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-all"
                        style={{
                          background: activo ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
                          border:     activo ? '1px solid rgba(0,212,255,0.4)' : '1px solid rgba(255,255,255,0.07)',
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

              {/* Resultado del cálculo */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}
              >
                <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>
                  Estimación para: <span style={{ color: '#00D4FF', fontWeight: 'bold' }}>{tipoSeleccionado}</span>
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <DollarSign size={20} style={{ color: '#10b981' }} />
                    <div>
                      <p className="text-xs" style={{ color: '#94A3B8' }}>Rango de inversión estimado</p>
                      <p className="text-base sm:text-lg font-black" style={{ color: '#10b981' }}>
                        {formatearDOP(precioEstimado)} – {formatearDOP(precioMax)}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs" style={{ color: '#94A3B8' }}>Tiempo estimado de entrega</p>
                    <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>{tipoActual.days}</p>
                    {diasExtras > 0 && (
                      <p className="text-[10px]" style={{ color: '#94A3B8' }}>+{diasExtras} días por servicios adicionales</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
