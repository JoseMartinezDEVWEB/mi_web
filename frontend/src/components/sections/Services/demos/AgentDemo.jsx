/* Demo de chat con el agente IA de J4TechnologyIsNow */
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot } from 'lucide-react'
import api from '../../../../services/api.js'

/* Mensaje de bienvenida del bot al abrir el chat */
const MENSAJE_INICIAL = {
  role:      'assistant',
  content:   '¡Hola! Soy el asistente de J4Technology. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre nuestros servicios, precios o agendar una demo.',
  timestamp: new Date(),
}

/* Chips de sugerencia rápida para el usuario */
const SUGERENCIAS = [
  '¿Qué servicios ofrecen?',
  '¿Cuánto cuesta una web?',
  'Quiero agendar una demo',
]

/* Formatea una fecha como hora:minutos en formato de 2 dígitos */
const formatearHora = (fecha) => {
  const d = new Date(fecha)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/* Indicador de "el bot está escribiendo" con 3 puntos animados */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2.5 rounded-2xl rounded-bl-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', width: 'fit-content' }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#94A3B8', display: 'block' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

/* Burbuja individual de mensaje (usuario o bot) */
function BurbujaMensaje({ mensaje }) {
  const esUsuario = mensaje.role === 'user'

  return (
    <motion.div
      className={`flex flex-col ${esUsuario ? 'items-end' : 'items-start'} gap-1`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Burbuja de texto con estilo diferenciado por rol */}
      <div
        className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
        style={
          esUsuario
            ? /* Burbuja del usuario: fondo dorado translúcido, alineada a la derecha */
              {
                background:   'rgba(212,175,55,0.18)',
                border:       '1px solid rgba(212,175,55,0.3)',
                color:        '#F1F5F9',
                borderRadius: '18px 18px 4px 18px',
              }
            : /* Burbuja del bot: fondo oscuro con borde izquierdo destacado, alineada a la izquierda */
              {
                background:   'rgba(255,255,255,0.06)',
                border:       '1px solid rgba(255,255,255,0.1)',
                borderLeft:   '3px solid #00D4FF',
                color:        '#F1F5F9',
                borderRadius: '4px 18px 18px 18px',
              }
        }
      >
        {mensaje.content}
      </div>

      {/* Timestamp del mensaje */}
      <span style={{ fontSize: 10, color: '#94A3B8' }}>{formatearHora(mensaje.timestamp)}</span>
    </motion.div>
  )
}

/* Componente principal del demo de chat con IA */
export default function AgentDemo() {
  const { i18n } = useTranslation()

  /* Historial de mensajes del chat */
  const [mensajes, setMensajes] = useState([MENSAJE_INICIAL])

  /* Texto actual del input del usuario */
  const [input, setInput] = useState('')

  /* Indica si el bot está procesando una respuesta */
  const [cargando, setCargando] = useState(false)

  /* Mensaje de error mostrado al usuario (rate limit, etc.) */
  const [error, setError] = useState(null)

  /* Referencia al contenedor de mensajes para el scroll automático interno */
  const historialRef = useRef(null)

  /* Desplaza el scroll interno hasta el último mensaje */
  useEffect(() => {
    if (historialRef.current) {
      historialRef.current.scrollTop = historialRef.current.scrollHeight
    }
  }, [mensajes, cargando])

  /* Envía el mensaje al backend y agrega la respuesta al historial */
  const enviarMensaje = async (texto) => {
    const textoLimpio = texto.trim()
    if (!textoLimpio || cargando) return

    /* Agrega el mensaje del usuario al historial local */
    const mensajeUsuario = { role: 'user', content: textoLimpio, timestamp: new Date() }
    setMensajes(prev => [...prev, mensajeUsuario])
    setInput('')
    setError(null)
    setCargando(true)

    try {
      /* Llama al endpoint de chat del backend con el historial completo */
      const { data } = await api.post('/chat/demo', {
        message:  textoLimpio,
        history:  mensajes.map(m => ({ role: m.role, content: m.content })),
        language: i18n.language,
      })

      /* Agrega la respuesta del asistente al historial */
      setMensajes(prev => [
        ...prev,
        { role: 'assistant', content: data.reply ?? data.message ?? 'Sin respuesta', timestamp: new Date() },
      ])
    } catch (err) {
      /* Manejo específico para el error de límite de peticiones (429) */
      if (err.response?.status === 429) {
        setError('Has alcanzado el límite de mensajes del demo. Por favor, intenta de nuevo en unos minutos.')
      } else {
        setError('Ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.')
      }
    } finally {
      setCargando(false)
    }
  }

  /* Maneja la tecla Enter para enviar el mensaje sin Shift */
  const manejarTecla = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje(input)
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 440 }}>

      {/* ── Encabezado del chat ── */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 rounded-t-xl shrink-0"
        style={{ background: 'rgba(0,212,255,0.08)', borderBottom: '1px solid rgba(0,212,255,0.15)' }}
      >
        {/* Avatar del bot */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.2)' }}>
          <Bot size={16} color="#00D4FF" />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Asistente J4</p>
          {/* Indicador de estado en línea */}
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
            <span style={{ fontSize: 10, color: '#10b981' }}>En línea</span>
          </div>
        </div>
      </div>

      {/* ── Historial de mensajes con scroll ── */}
      <div
        ref={historialRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        {/* Renderiza cada burbuja del historial */}
        {mensajes.map((msg, idx) => (
          <BurbujaMensaje key={idx} mensaje={msg} />
        ))}

        {/* Indicador de escritura mientras el bot procesa */}
        {cargando && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TypingIndicator />
          </motion.div>
        )}

        {/* Mensaje de error (incluyendo rate limit) */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl px-4 py-2.5 text-xs"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chips de sugerencias rápidas ── */}
      {mensajes.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-4 py-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {SUGERENCIAS.map(sugerencia => (
            <motion.button
              key={sugerencia}
              onClick={() => enviarMensaje(sugerencia)}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00D4FF' }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ background: 'rgba(0,212,255,0.18)' }}
            >
              {sugerencia}
            </motion.button>
          ))}
        </div>
      )}

      {/* ── Barra de entrada de mensaje ── */}
      <div
        className="flex gap-2 items-end px-4 py-3 shrink-0"
        style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.08)', borderRadius: '0 0 12px 12px' }}
      >
        {/* Área de texto multilinea para el mensaje */}
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={manejarTecla}
          placeholder="Escribe tu mensaje... (Enter para enviar)"
          rows={1}
          className="flex-1 px-3 py-2 rounded-xl text-sm resize-none outline-none"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border:     '1px solid rgba(255,255,255,0.1)',
            color:      '#F1F5F9',
            maxHeight:  80,
            lineHeight: '1.4',
          }}
        />

        {/* Botón de envío con estado deshabilitado mientras carga */}
        <motion.button
          onClick={() => enviarMensaje(input)}
          disabled={!input.trim() || cargando}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: input.trim() && !cargando ? '#00D4FF' : 'rgba(255,255,255,0.08)',
            color:      input.trim() && !cargando ? '#0a0a0f' : '#94A3B8',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Send size={15} />
        </motion.button>
      </div>
    </div>
  )
}
