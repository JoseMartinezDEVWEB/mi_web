/* Widget de chat con el Agente IA J4 para la sección de contacto */
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Send } from 'lucide-react'
import api from '../../../services/api.js'

/* Genera un ID de sesión único para la conversación */
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`

/* Componente de indicador de escritura con 3 puntos animados */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: '#94A3B8' }}
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* Formatea la hora actual como HH:MM */
const formatTime = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export default function ChatWidget({ preloadedMessage = null }) {
  const { t, i18n } = useTranslation('contact')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const [rateLimited, setRateLimited] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  /* Scroll automático al último mensaje dentro del contenedor propio */
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages, typing])

  /* Enviar saludo automático al montar el componente */
  useEffect(() => {
    const greetingMsg = {
      role: 'assistant',
      content: t('contact:chat.greeting'),
      timestamp: formatTime(),
    }
    setMessages([greetingMsg])

    /* Si hay mensaje pre-cargado (desde CTA de servicios), enviarlo automáticamente */
    if (preloadedMessage) {
      setTimeout(() => sendMessage(preloadedMessage), 800)
    }
  }, [])

  /* Enviar mensaje al backend */
  const sendMessage = async (text) => {
    const messageText = text ?? input.trim()
    if (!messageText || typing || rateLimited) return

    setInput('')
    setShowSuggestions(false)

    /* Agregar mensaje del usuario al historial */
    const userMsg = { role: 'user', content: messageText, timestamp: formatTime() }
    setMessages((prev) => [...prev, userMsg])
    setTyping(true)

    try {
      const history = messages.map(({ role, content }) => ({ role, content }))
      const { data } = await api.post('/chat/message', {
        sessionId,
        message: messageText,
        history,
        language: i18n.language ?? 'es',
      })

      const botMsg = {
        role: 'assistant',
        content: data.response ?? data.message ?? 'Lo siento, hubo un problema.',
        timestamp: formatTime(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      /* Manejar límite de tasa alcanzado */
      if (err.response?.status === 429) {
        setRateLimited(true)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: t('contact:chat.rateLimitReached'),
            timestamp: formatTime(),
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Hubo un error al procesar tu mensaje. Por favor, contáctanos directamente.',
            timestamp: formatTime(),
          },
        ])
      }
    } finally {
      setTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  /* Chips de sugerencia rápida */
  const suggestions = t('contact:chat.suggestions', { returnObjects: true }) ?? []

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col w-full max-w-full h-[460px] sm:h-[520px]"
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Encabezado del chat */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        {/* Avatar del agente */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #F5C842)',
            color: '#0a0a0f',
          }}
        >
          J4
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>
            {t('contact:chat.title')}
          </p>
          {/* Indicador verde parpadeante "En línea" */}
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: '#10b981' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs" style={{ color: '#10b981' }}>
              {t('contact:chat.online')}
            </span>
          </div>
        </div>
      </div>

      {/* Área de mensajes con scroll */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? {
                        background: 'rgba(212, 175, 55, 0.2)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        color: '#F1F5F9',
                        borderBottomRightRadius: 4,
                      }
                    : {
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#F1F5F9',
                        borderLeft: '3px solid #00D4FF',
                        borderBottomLeftRadius: 4,
                      }
                }
              >
                {msg.content}
                {/* Timestamp del mensaje */}
                <div
                  className="text-[10px] mt-1 text-right"
                  style={{ color: 'rgba(148, 163, 184, 0.6)' }}
                >
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator mientras el agente procesa */}
        {typing && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: '3px solid #00D4FF',
              }}
            >
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        {/* Chips de sugerencia rápida (solo al inicio) */}
        {showSuggestions && Array.isArray(suggestions) && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full transition-colors duration-150 hover:bg-white/10"
                style={{
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  color: '#00D4FF',
                  background: 'rgba(0, 212, 255, 0.05)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input de mensaje */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={rateLimited ? t('contact:chat.rateLimitReached') : t('contact:chat.placeholder')}
            disabled={typing || rateLimited}
            className="flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
            style={{ color: '#F1F5F9' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || typing || rateLimited}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F5C842)' }}
          >
            <Send size={14} color="#0a0a0f" />
          </button>
        </div>
      </div>
    </div>
  )
}
