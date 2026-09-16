import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Briefcase,
  Code2,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  ExternalLink,
  Download,
  Send,
  Linkedin,
  Github,
  Globe
} from 'lucide-react'

export default function PersonalWebDemo({ onBack }) {
  const [pestaña, setPestaña] = useState('sobre-mi')
  const [mensajeEnviado, setMensajeEnviado] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' })

  const skills = [
    { name: 'React / Next.js', nivel: 'Avanzado', cat: 'Frontend' },
    { name: 'Node.js / Express', nivel: 'Avanzado', cat: 'Backend' },
    { name: 'TypeScript', nivel: 'Avanzado', cat: 'Lenguaje' },
    { name: 'AWS Cloud & Docker', nivel: 'Intermedio+', cat: 'DevOps' },
    { name: 'PostgreSQL / MongoDB', nivel: 'Avanzado', cat: 'Bases de Datos' },
    { name: 'Tailwind CSS', nivel: 'Experto', cat: 'UI/UX' },
  ]

  const proyectos = [
    {
      titulo: 'Plataforma Fintech de Micropréstamos',
      desc: 'Sistema web para evaluación crediticia en tiempo real con pasarela de pagos integrada.',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      año: '2025',
    },
    {
      titulo: 'Dashboard ERP Hospitalario',
      desc: 'Portal de gestión de pacientes, citas médicas y facturación de seguros médicos.',
      tags: ['Next.js', 'Tailwind', 'MongoDB', 'AWS'],
      año: '2024',
    },
    {
      titulo: 'App Móvil de Entregas & Logística',
      desc: 'Seguimiento satelital de conductores en mapa y liquidación diaria de envíos.',
      tags: ['React Native', 'Firebase', 'Google Maps API'],
      año: '2024',
    },
  ]

  const handleEnviar = (e) => {
    e.preventDefault()
    if (!formData.nombre || !formData.email) return
    setMensajeEnviado(true)
    setTimeout(() => {
      setMensajeEnviado(false)
      setFormData({ nombre: '', email: '', mensaje: '' })
    }, 4000)
  }

  return (
    <div className="w-full bg-slate-900 text-slate-100 rounded-xl overflow-hidden font-sans border border-slate-700 shadow-2xl">
      {/* ── Barra Superior / Header del Sitio Personal ── */}
      <header className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/70 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-xs shadow-sm">
            CM
          </div>
          <div>
            <span className="font-extrabold text-sm text-white block leading-tight">
              Carlos Mendoza
            </span>
            <span className="text-[10px] text-amber-400 font-semibold">
              Senior Full Stack Engineer & Consultor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="text-xs px-2.5 py-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ← Volver
          </button>
          <button
            onClick={() => setPestaña('contacto')}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow transition-all active:scale-95"
          >
            Contactar
          </button>
        </div>
      </header>

      {/* ── Perfil Hero ── */}
      <section className="px-5 sm:px-8 py-8 bg-gradient-to-b from-slate-950 to-slate-900/60 border-b border-slate-800">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-2 border-amber-400/80 flex items-center justify-center text-3xl shadow-xl">
              👨‍💻
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Disponible para contratación" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Ing. Carlos Mendoza</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                ● Disponible para proyectos
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Especialista en arquitectura web escalable, desarrollo de aplicaciones SaaS y modernización de sistemas empresariales con más de 8 años de experiencia.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Santo Domingo, RD</span>
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-amber-400" /> Remoto / Consultoría</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-amber-400" /> Español / Inglés C1</span>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación del Sitio */}
        <div className="flex items-center justify-center sm:justify-start gap-1 max-w-3xl mx-auto mt-6 border-b border-slate-800 text-xs">
          {[
            { id: 'sobre-mi', label: 'Sobre Mí', icon: User },
            { id: 'habilidades', label: 'Tech Stack', icon: Code2 },
            { id: 'proyectos', label: 'Proyectos Destacados', icon: Briefcase },
            { id: 'contacto', label: 'Agendar Consulta', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon
            const activa = pestaña === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setPestaña(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 font-semibold border-b-2 transition-all ${
                  activa
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Contenido de Pestañas ── */}
      <div className="p-5 sm:p-8 max-w-3xl mx-auto min-h-[300px]">
        <AnimatePresence mode="wait">
          {pestaña === 'sobre-mi' && (
            <motion.div
              key="sobre-mi"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-xl font-black text-amber-400">+8</div>
                  <div className="text-[10px] text-slate-400">Años de experiencia</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-xl font-black text-amber-400">+45</div>
                  <div className="text-[10px] text-slate-400">Proyectos completados</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-xl font-black text-amber-400">100%</div>
                  <div className="text-[10px] text-slate-400">Clientes satisfechos</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <h3 className="font-bold text-sm text-white">Biografía Profesional</h3>
                <p>
                  Apasionado por la creación de soluciones digitales eficientes, robustas y atractivas. He liderado equipos de desarrollo en proyectos para el sector financiero, comercio electrónico y salud.
                </p>
                <p>
                  Mi enfoque combina una rigurosa arquitectura de software con una experiencia de usuario (UX) pulida y centrada en resultados de negocio.
                </p>
              </div>
            </motion.div>
          )}

          {pestaña === 'habilidades' && (
            <motion.div
              key="habilidades"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h3 className="font-bold text-sm text-white">Tecnologías & Herramientas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {skills.map((s) => (
                  <div
                    key={s.name}
                    className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs text-white block">{s.name}</span>
                      <span className="text-[10px] text-slate-400">{s.cat}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      {s.nivel}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {pestaña === 'proyectos' && (
            <motion.div
              key="proyectos"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-sm text-white">Portafolio Seleccionado</h3>
              <div className="space-y-3">
                {proyectos.map((p) => (
                  <div
                    key={p.titulo}
                    className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 hover:border-amber-400/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white">{p.titulo}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{p.año}</span>
                    </div>
                    <p className="text-xs text-slate-300">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {pestaña === 'contacto' && (
            <motion.div
              key="contacto"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-center max-w-md mx-auto">
                <h3 className="font-bold text-base text-white">¿Tienes un proyecto en mente?</h3>
                <p className="text-xs text-slate-400">Envíame un mensaje y te responderé en menos de 24 horas.</p>
              </div>

              <form onSubmit={handleEnviar} className="max-w-md mx-auto space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre o empresa"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Detalles del Proyecto</label>
                  <textarea
                    rows={3}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    placeholder="Cuéntame brevemente sobre los requerimientos..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar Propuesta
                </button>

                {mensajeEnviado && (
                  <p className="text-center text-xs text-emerald-400 font-bold">
                    ✓ ¡Mensaje enviado con éxito! Carlos se pondrá en contacto pronto.
                  </p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="px-6 py-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-500">
        © 2026 Carlos Mendoza • Portafolio Web Desarrollado con React & Tailwind
      </footer>
    </div>
  )
}
