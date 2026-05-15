/* Demo interactivo de desarrollo de apps móviles con mockup navegable y formulario de contacto */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Smartphone, Bell, User, Home, Send } from 'lucide-react'

/* Pantallas del mockup de iPhone para navegar */
const PANTALLAS = [
  {
    id:      'login',
    titulo:  'Inicio de sesión',
    /* Contenido visual de la pantalla de login */
    contenido: (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
        <div className="w-12 h-12 rounded-full mb-1" style={{ background: 'rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={22} color="#00D4FF" />
        </div>
        <p className="text-xs font-bold text-white">Bienvenido</p>
        <div className="w-full rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.1)', fontSize: 10, color: '#94A3B8' }}>correo@ejemplo.com</div>
        <div className="w-full rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.1)', fontSize: 10, color: '#94A3B8' }}>••••••••</div>
        <div className="w-full rounded-lg py-2 text-center text-xs font-bold" style={{ background: '#00D4FF', color: '#0a0a0f' }}>Entrar</div>
        <p className="text-[9px]" style={{ color: '#94A3B8' }}>¿Olvidaste tu contraseña?</p>
      </div>
    ),
  },
  {
    id:      'home',
    titulo:  'Inicio / Dashboard',
    /* Contenido visual del dashboard principal */
    contenido: (
      <div className="flex flex-col h-full px-3 py-2 gap-2">
        <p className="text-[10px] font-bold text-white">Hola, Juan 👋</p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Ventas', val: 'DOP 45K', color: '#10b981' },
            { label: 'Pedidos', val: '23',      color: '#00D4FF' },
            { label: 'Clientes', val: '118',    color: '#D4AF37' },
            { label: 'Alertas', val: '2',       color: '#ef4444' },
          ].map(m => (
            <div key={m.label} className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 9, color: '#94A3B8' }}>{m.label}</p>
              <p className="font-bold" style={{ fontSize: 11, color: m.color }}>{m.val}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: 9, color: '#94A3B8', marginBottom: 4 }}>Actividad reciente</p>
          {['Pedido #201 creado', 'Cliente nuevo registrado', 'Alerta de stock'].map(item => (
            <p key={item} style={{ fontSize: 9, color: '#F1F5F9', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>• {item}</p>
          ))}
        </div>
      </div>
    ),
  },
  {
    id:      'perfil',
    titulo:  'Perfil',
    /* Contenido visual de la pantalla de perfil de usuario */
    contenido: (
      <div className="flex flex-col items-center h-full px-3 py-3 gap-2">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
          <User size={26} color="#D4AF37" />
        </div>
        <p className="text-xs font-bold text-white">Juan Pérez</p>
        <p style={{ fontSize: 9, color: '#94A3B8' }}>juan@empresa.com</p>
        <div className="w-full space-y-1.5 mt-1">
          {['Editar perfil', 'Cambiar contraseña', 'Notificaciones', 'Cerrar sesión'].map(op => (
            <div key={op} className="w-full rounded-lg px-3 py-2 flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 9, color: '#F1F5F9' }}>{op}</span>
              <ChevronRight size={10} color="#94A3B8" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id:      'notificaciones',
    titulo:  'Notificaciones',
    /* Contenido visual de la bandeja de notificaciones */
    contenido: (
      <div className="flex flex-col h-full px-3 py-2 gap-2">
        <div className="flex items-center gap-1 mb-1">
          <Bell size={12} color="#00D4FF" />
          <p className="text-[10px] font-bold text-white">Notificaciones</p>
          <span className="ml-auto text-[9px] font-bold px-1.5 rounded-full" style={{ background: '#ef4444', color: '#fff' }}>3</span>
        </div>
        {[
          { msg: 'Stock bajo: Laptop Dell XPS', time: '10:32', color: '#fbbf24', unread: true  },
          { msg: 'Nuevo pedido recibido #204',  time: '09:15', color: '#10b981', unread: true  },
          { msg: 'Factura #112 vencida',        time: 'Ayer',  color: '#ef4444', unread: true  },
          { msg: 'Backup completado',           time: 'Ayer',  color: '#94A3B8', unread: false },
        ].map((n, i) => (
          <div key={i} className="rounded-lg p-2 flex gap-2 items-start" style={{ background: n.unread ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)', border: n.unread ? `1px solid ${n.color}30` : '1px solid transparent' }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: n.color }} />
            <div className="flex-1">
              <p style={{ fontSize: 9, color: '#F1F5F9' }}>{n.msg}</p>
              <p style={{ fontSize: 8, color: '#94A3B8' }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
]

/* Tipos de app disponibles en el formulario de solicitud */
const TIPOS_APP = ['E-commerce', 'Delivery', 'Reservas', 'Otro']

/* Componente principal del demo de apps móviles */
export default function AppDemo() {
  /* Índice de la pantalla del mockup actualmente visible */
  const [pantallaActual, setPantallaActual] = useState(0)

  /* Campos del formulario de solicitud de mockup */
  const [formulario, setFormulario] = useState({ nombre: '', empresa: '', tipoApp: 'E-commerce' })

  /* Controla si el mensaje de éxito del formulario está visible */
  const [enviado, setEnviado] = useState(false)

  /* Navega a la pantalla anterior del mockup */
  const anterior = () => setPantallaActual(p => (p - 1 + PANTALLAS.length) % PANTALLAS.length)
  /* Navega a la pantalla siguiente del mockup */
  const siguiente = () => setPantallaActual(p => (p + 1) % PANTALLAS.length)

  /* Simula el envío del formulario de solicitud */
  const manejarEnvio = (e) => {
    e.preventDefault()
    if (!formulario.nombre) return
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3000)
    setFormulario({ nombre: '', empresa: '', tipoApp: 'E-commerce' })
  }

  const pantalla = PANTALLAS[pantallaActual]

  return (
    <div className="space-y-6">

      {/* ── Área de mockups side-by-side ── */}
      <div className="flex items-center justify-center gap-6">

        {/* Botón de navegación izquierdo */}
        <motion.button
          onClick={anterior}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={16} style={{ color: '#94A3B8' }} />
        </motion.button>

        {/* ── Dos mockups de iPhone ── */}
        <div className="flex gap-4 items-end">

          {/* Mockup principal (pantalla activa) */}
          <div
            className="relative rounded-[28px] overflow-hidden shrink-0"
            style={{
              width:      140,
              height:     260,
              background: '#0d1117',
              border:     '3px solid rgba(255,255,255,0.15)',
              boxShadow:  '0 20px 50px rgba(0,0,0,0.6)',
            }}
          >
            {/* Notch del iPhone */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 rounded-b-xl z-10" style={{ background: '#0d1117' }} />

            {/* Barra de estado superior */}
            <div className="flex justify-between items-center px-3 pt-1 pb-0.5" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <span style={{ fontSize: 7, color: '#fff' }}>9:41</span>
              <Smartphone size={8} color="#fff" />
            </div>

            {/* Título de pantalla */}
            <div className="px-3 py-1.5" style={{ background: 'rgba(0,212,255,0.08)', borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
              <p style={{ fontSize: 9, color: '#00D4FF', fontWeight: 600 }}>{pantalla.titulo}</p>
            </div>

            {/* Contenido animado de la pantalla */}
            <div className="relative overflow-hidden" style={{ height: 190 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={pantalla.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                >
                  {pantalla.contenido}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Barra de navegación inferior del mockup */}
            <div className="absolute bottom-0 w-full flex justify-around py-1.5 px-2" style={{ background: 'rgba(0,0,0,0.7)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[Home, User, Bell].map((Icono, i) => (
                <Icono key={i} size={12} color={i === 0 ? '#00D4FF' : '#94A3B8'} />
              ))}
            </div>
          </div>

          {/* Mockup secundario (pantalla siguiente, escalado y desvanecido) */}
          <div
            className="relative rounded-[22px] overflow-hidden shrink-0 opacity-40"
            style={{
              width:      110,
              height:     200,
              background: '#0d1117',
              border:     '2px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex justify-between items-center px-2 pt-1 pb-0.5" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <span style={{ fontSize: 6, color: '#fff' }}>9:41</span>
            </div>
            <div className="px-2 py-1" style={{ background: 'rgba(0,212,255,0.05)' }}>
              <p style={{ fontSize: 7, color: '#00D4FF' }}>
                {PANTALLAS[(pantallaActual + 1) % PANTALLAS.length].titulo}
              </p>
            </div>
            <div className="p-2 opacity-60">
              {PANTALLAS[(pantallaActual + 1) % PANTALLAS.length].contenido}
            </div>
          </div>
        </div>

        {/* Botón de navegación derecho */}
        <motion.button
          onClick={siguiente}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={16} style={{ color: '#94A3B8' }} />
        </motion.button>
      </div>

      {/* ── Indicadores de puntos de navegación ── */}
      <div className="flex justify-center gap-2">
        {PANTALLAS.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => setPantallaActual(idx)}
            className="rounded-full"
            style={{
              width:      idx === pantallaActual ? 20 : 8,
              height:     8,
              background: idx === pantallaActual ? '#00D4FF' : 'rgba(255,255,255,0.2)',
            }}
            animate={{ width: idx === pantallaActual ? 20 : 8 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* ── Formulario de solicitud de mockup personalizado ── */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-sm font-semibold mb-3" style={{ color: '#F1F5F9' }}>Solicitar mockup personalizado</p>

        <form onSubmit={manejarEnvio} className="space-y-3">
          {/* Campo de nombre */}
          <input
            value={formulario.nombre}
            onChange={e => setFormulario(f => ({ ...f, nombre: e.target.value }))}
            placeholder="Tu nombre"
            required
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
          />

          {/* Campo de empresa */}
          <input
            value={formulario.empresa}
            onChange={e => setFormulario(f => ({ ...f, empresa: e.target.value }))}
            placeholder="Empresa (opcional)"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
          />

          {/* Selector de tipo de app */}
          <select
            value={formulario.tipoApp}
            onChange={e => setFormulario(f => ({ ...f, tipoApp: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
          >
            {TIPOS_APP.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Botón de envío */}
          <motion.button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: '#00D4FF', color: '#0a0a0f' }}
            whileTap={{ scale: 0.97 }}
          >
            <Send size={14} />
            Solicitar mockup
          </motion.button>
        </form>

        {/* Mensaje de confirmación tras el envío */}
        <AnimatePresence>
          {enviado && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm mt-3"
              style={{ color: '#10b981' }}
            >
              ¡Solicitud recibida! Te contactaremos pronto.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
