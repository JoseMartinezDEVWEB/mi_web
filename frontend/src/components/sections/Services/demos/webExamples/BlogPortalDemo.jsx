import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Search,
  Clock,
  User,
  Calendar,
  Eye,
  Share2,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Bookmark
} from 'lucide-react'

export default function BlogPortalDemo({ onBack }) {
  const [categoria, setCategoria] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [articuloAbierto, setArticuloAbierto] = useState(null)

  const categorias = ['Todos', 'Inteligencia Artificial', 'Desarrollo Web', 'Ciberseguridad', 'Negocios & Startups']

  const articulos = [
    {
      id: 1,
      titulo: 'Cómo la Inteligencia Artificial Generativa está revolucionando el comercio en 2026',
      resumen: 'Desde agentes autónomos de atención al cliente hasta optimización predictiva de inventario y precios dinámicos.',
      categoria: 'Inteligencia Artificial',
      autor: 'Lic. Sofía Valenzuela',
      fecha: '14 Sep 2026',
      lectura: '5 min',
      vistas: '3.4k',
      portada: '🤖',
      contenido: [
        'En los últimos doce meses, el comercio digital ha experimentado una transformación sin precedentes impulsada por modelos de inteligencia artificial autónomos.',
        'Las empresas que han implementado agentes conversacionales 24/7 reportan un incremento del 38% en la tasa de retención de prospectos y una disminución del 50% en los tiempos de respuesta de soporte técnico.',
        'La clave del éxito reside en la integración profunda entre el catálogo de productos, las bases de datos transaccionales y los modelos de lenguaje, permitiendo una experiencia hiperpersonalizada para cada comprador.',
      ],
    },
    {
      id: 2,
      titulo: 'Arquitectura Web Moderna: De Monolitos a Microfrontends con Next.js y Vite',
      resumen: 'Guía práctica para estructurar aplicaciones web escalables que soportan millones de visitas sin caídas de rendimiento.',
      categoria: 'Desarrollo Web',
      autor: 'Ing. Marcos Santana',
      fecha: '12 Sep 2026',
      lectura: '8 min',
      vistas: '5.1k',
      portada: '⚡',
      contenido: [
        'A medida que las empresas crecen, mantener una base de código monolítica puede convertirse en un cuello de botella para los equipos de ingeniería.',
        'La arquitectura basada en microfrontends permite a diferentes escuadras trabajar de manera independiente en módulos clave (como Checkout, Catálogo o Autenticación) desplegando actualizaciones sin riesgo global.',
        'Combinando Vite para un empaquetado instantáneo y Next.js para renderizado híbrido (SSR + SSG), logramos puntajes de 100 en Google Lighthouse y una experiencia de usuario impecable.',
      ],
    },
    {
      id: 3,
      titulo: 'Ciberseguridad Empresarial: Protegiendo tu infraestructura cloud en la era de los ciberataques',
      resumen: 'Estrategias de autenticación Zero Trust, cifrado cuántico y auditoría continua para salvaguardar información sensible.',
      categoria: 'Ciberseguridad',
      autor: 'Dr. Alejandro Rivas',
      fecha: '10 Sep 2026',
      lectura: '6 min',
      vistas: '2.8k',
      portada: '🔒',
      contenido: [
        'El modelo perimetral tradicional ha muerto. Con el trabajo remoto y la infraestructura distribuida en la nube, el principio fundamental hoy es: "Nunca confíes, siempre verifica".',
        'Implementar autenticación multifactor biométrica (Passkeys/FIDO2) y rotación automática de credenciales reduce en un 99% el riesgo de intrusión por compromiso de contraseñas.',
      ],
    },
    {
      id: 4,
      titulo: 'Financiamiento y Escala: Claves para levantar capital semilla para tu startup en Latinoamérica',
      resumen: 'Métricas clave que los fondos de capital de riesgo analizan antes de emitir un term sheet.',
      categoria: 'Negocios & Startups',
      autor: 'Carla Morales',
      fecha: '08 Sep 2026',
      lectura: '7 min',
      vistas: '4.2k',
      portada: '🚀',
      contenido: [
        'Los inversores en etapas tempranas ya no buscan solo ideas innovadoras; buscan tracción comprobable y economía unitaria positiva.',
        'Tener claridad en el Costo de Adquisición de Cliente (CAC) frente al Valor de Vida del Cliente (LTV) es el factor determinante para cerrar una ronda de inversión exitosa.',
      ],
    },
  ]

  const articulosFiltrados = articulos.filter((art) => {
    const matchCat = categoria === 'Todos' || art.categoria === categoria
    const matchSearch =
      art.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      art.resumen.toLowerCase().includes(busqueda.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-xl overflow-hidden font-sans border border-slate-800 shadow-2xl relative">
      {/* ── Header del Portal ── */}
      <header className="px-4 sm:px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-purple-500/20">
            T
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-white block leading-tight">
              Tech<span className="text-purple-400">Horizon</span>
            </span>
            <span className="text-[9px] text-slate-400">Portal de Noticias & Tecnología</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="text-xs px-2.5 py-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ← Volver
          </button>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold hidden sm:inline-block">
            EDICIÓN DIGITAL
          </span>
        </div>
      </header>

      {/* ── Noticia Destacada (Breaking News Banner) ── */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-purple-400 font-bold mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>TENDENCIA DESTACADA</span>
        </div>
        <h2 className="text-base sm:text-xl font-extrabold text-white max-w-2xl leading-snug">
          La nueva era de portales web interactivos: cómo el contenido dinámico retiene 3 veces más lectores
        </h2>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
          <span>Por Redacción TechHorizon</span>
          <span>•</span>
          <span>Actualizado hace 2 horas</span>
        </div>
      </div>

      {/* ── Barra de Búsqueda y Categorías ── */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/30">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs no-scrollbar">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                categoria === cat
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar artículos..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* ── Grid de Artículos ── */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articulosFiltrados.map((art) => (
          <article
            key={art.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-purple-500/40 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {art.categoria}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {art.lectura}
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors leading-snug line-clamp-2">
                {art.titulo}
              </h3>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {art.resumen}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 block">{art.autor}</span>
                <span>{art.fecha}</span>
              </div>

              <button
                onClick={() => setArticuloAbierto(art)}
                className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
              >
                Leer <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ── Modal de Lectura de Artículo Completo ── */}
      <AnimatePresence>
        {articuloAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[85vh] flex flex-col"
            >
              {/* Barra de cabecera */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {articuloAbierto.categoria}
                </span>
                <button
                  onClick={() => setArticuloAbierto(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido del Artículo */}
              <div className="p-6 overflow-y-auto space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {articuloAbierto.titulo}
                </h2>

                <div className="flex items-center gap-3 text-xs text-slate-400 pb-3 border-b border-slate-800">
                  <span>Por <strong>{articuloAbierto.autor}</strong></span>
                  <span>•</span>
                  <span>{articuloAbierto.fecha}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {articuloAbierto.lectura}</span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                  {articuloAbierto.contenido.map((parrafo, i) => (
                    <p key={i}>{parrafo}</p>
                  ))}
                </div>

                {/* Caja de llamada a suscripción */}
                <div className="mt-6 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-xs text-white">¿Te gustó este artículo?</h4>
                    <p className="text-[11px] text-slate-400">Suscríbete para recibir nuestro boletín semanal de tecnología.</p>
                  </div>
                  <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold whitespace-nowrap">
                    Suscribirse
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="px-6 py-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-500">
        © 2026 TechHorizon • Portal de Contenidos y Revista Digital Interactiva
      </footer>
    </div>
  )
}
