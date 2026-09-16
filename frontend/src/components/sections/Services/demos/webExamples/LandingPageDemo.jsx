import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  BarChart,
  Star,
  Users,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

export default function LandingPageDemo({ onBack }) {
  const [anual, setAnual] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)
  const [emailInput, setEmailInput] = useState('')

  const planes = [
    {
      nombre: 'Inicial',
      precioMensual: 29,
      precioAnual: 24,
      desc: 'Ideal para profesionales y emprendedores',
      features: ['Hasta 3 proyectos activos', 'Analíticas básicas', 'Soporte por email 24/7', 'Dominio personalizado'],
      popular: false,
    },
    {
      nombre: 'Profesional',
      precioMensual: 79,
      precioAnual: 65,
      desc: 'Para empresas en crecimiento y equipos',
      features: ['Proyectos ilimitados', 'Inteligencia Artificial integrada', 'Analíticas en tiempo real', 'API de alta velocidad', 'Soporte prioritario VIP'],
      popular: true,
    },
    {
      nombre: 'Corporativo',
      precioMensual: 199,
      precioAnual: 160,
      desc: 'Infraestructura dedicada y SLAs garantizados',
      features: ['Todo lo de Profesional', 'Servidores dedicados', 'SLA 99.99% garantizado', 'Auditorías de seguridad', 'Gerente de cuenta dedicado'],
      popular: false,
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!emailInput) return
    setEmailEnviado(true)
    setTimeout(() => {
      setEmailEnviado(false)
      setEmailInput('')
    }, 4000)
  }

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-xl overflow-hidden font-sans border border-slate-800 shadow-2xl">
      {/* ── Barra de Navegación del Sitio Web Demo ── */}
      <header className="px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-cyan-500/20">
            N
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            Nova<span className="text-cyan-400">Cloud</span>
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold ml-1 hidden sm:inline-block">
            DEMO LANDING
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Características</a>
          <a href="#precios" className="hover:text-cyan-400 transition-colors">Planes</a>
          <a href="#testimonios" className="hover:text-cyan-400 transition-colors">Testimonios</a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="text-xs px-2.5 py-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ← Volver
          </button>
          <a
            href="#precios"
            className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            Empezar Gratis
          </a>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="px-4 sm:px-8 py-10 sm:py-14 text-center relative overflow-hidden bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            Nueva Versión 3.0 con IA Autónoma
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            La plataforma inteligente para escalar tu <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">negocio digital</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Automatiza procesos, sincroniza datos en tiempo real y aumenta tus ventas con infraestructura web de última generación optimizada para conversión.
          </p>

          {/* Formulario de Captura Rápida */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Escribe tu correo empresarial..."
              className="w-full sm:flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              Comenzar Ahora <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {emailEnviado && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-400 font-semibold">
              ✓ ¡Excelente! Te hemos enviado el enlace de prueba gratuita a tu correo.
            </motion.p>
          )}

          {/* Métricas / Social Proof */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-800/80 max-w-lg mx-auto text-center">
            <div>
              <div className="text-lg sm:text-xl font-black text-white">99.99%</div>
              <div className="text-[10px] text-slate-400">Disponibilidad SLA</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-cyan-400">+15,000</div>
              <div className="text-[10px] text-slate-400">Empresas activas</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-emerald-400">4.9 / 5</div>
              <div className="text-[10px] text-slate-400">Valoración usuarios</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARACTERÍSTICAS CLAVE ── */}
      <section id="features" className="px-4 sm:px-8 py-10 bg-slate-900/40 border-t border-slate-800">
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Potencia sin límites</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Todo lo que necesitas para crecer
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Velocidad Ultrarrápida</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Carga tus páginas en menos de 0.8 segundos con red CDN global distribuida en más de 200 ciudades.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Seguridad Bancaria</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cifrado de extremo a extremo SSL/TLS 1.3, protección anti-DDoS y respaldos automáticos cada 6 horas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BarChart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Analíticas en Vivo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Descubre de dónde provienen tus clientes y cuáles páginas generan mayor tasa de conversión.
            </p>
          </div>
        </div>
      </section>

      {/* ── PLANES Y PRECIOS ── */}
      <section id="precios" className="px-4 sm:px-8 py-10">
        <div className="text-center max-w-lg mx-auto mb-6">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Inversión Transparente</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Planes a la medida de tu proyecto
          </h2>

          {/* Selector Mensual / Anual */}
          <div className="inline-flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mt-4 text-xs font-semibold">
            <button
              onClick={() => setAnual(false)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !anual ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Facturación Mensual
            </button>
            <button
              onClick={() => setAnual(true)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                anual ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Anual <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded-full font-black">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {planes.map((p) => {
            const precio = anual ? p.precioAnual : p.precioMensual

            return (
              <div
                key={p.nombre}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  p.popular
                    ? 'bg-slate-900 border-cyan-500/80 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50 relative'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Más Elegido
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-base text-white">{p.nombre}</h3>
                  <p className="text-[11px] text-slate-400 mb-3">{p.desc}</p>

                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-2xl sm:text-3xl font-black text-white">US$ {precio}</span>
                    <span className="text-xs text-slate-400">/ mes</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 py-3 border-t border-slate-800">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    p.popular
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md active:scale-95'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Elegir Plan {p.nombre}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── FOOTER DE LA LANDING ── */}
      <footer className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <div>© 2026 NovaCloud Inc. Diseñado y Desarrollado por J4 Technology.</div>
        <div className="flex items-center gap-3">
          <span>Privacidad</span>
          <span>Términos</span>
          <span>Soporte</span>
        </div>
      </footer>
    </div>
  )
}
