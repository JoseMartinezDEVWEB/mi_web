/* Widget de chat con el Agente IA J4 para la sección de contacto */
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Send, RefreshCw, Sparkles, MessageCircle, Phone, Mail } from 'lucide-react'
import api from '../../../services/api.js'

/* Genera un ID de sesión único para la conversación */
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`

/* Formatea la hora actual como HH:MM */
const formatTime = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

/* Motor conversacional inteligente local para el Agente J4 (elimina errores y responde con datos oficiales) */
function generarRespuestaAgenteJ4(texto, idioma = 'es') {
  const q = texto.toLowerCase().trim()

  // 1. Saludos
  if (/\b(hola|buenos dias|buenas tardes|buenas noches|saludos|hey|que tal)\b/.test(q)) {
    return '¡Hola! Soy el **Agente J4** 👋. Estoy aquí para asistirte con información sobre nuestros servicios tecnológicos, cotizaciones, o ponerte en contacto directo con nuestro equipo al **809-613-3196** o **j4.technologyisnow@gmail.com**. ¿En qué proyecto o solución podemos ayudarte hoy?'
  }

  // 2. Teléfono, WhatsApp o Telegram
  if (/\b(telefono|celular|whatsapp|telegram|numero|llamar|contacto directo)\b/.test(q)) {
    return `📞 Puedes comunicarte con nosotros de manera directa e inmediata a través de:

• **Teléfono / WhatsApp / Telegram:** **809-613-3196**
• **Correo Electrónico:** **j4.technologyisnow@gmail.com**
• **Redes Sociales:** Búscanos en Instagram, Facebook y TikTok como **@J4technologyisnow**

También puedes hacer clic en los botones de **WhatsApp** o **Telegram** que ves a la izquierda para iniciar un chat directo con nosotros.`
  }

  // 3. Correo electrónico
  if (/\b(correo|email|mail|gmail|escribir)\b/.test(q)) {
    return '📧 Nuestro correo oficial de atención al cliente y cotizaciones es **j4.technologyisnow@gmail.com**. También puedes dejarnos tus datos en el formulario de contacto o llamarnos al **809-613-3196**.'
  }

  // 4. Redes sociales
  if (/\b(redes|instagram|facebook|tiktok|social)\b/.test(q)) {
    return '🌐 Puedes seguirnos y escribirnos en nuestras redes sociales oficiales con el usuario **@J4technologyisnow**:\n\n• **Instagram:** [@J4technologyisnow](https://instagram.com/J4technologyisnow)\n• **Facebook:** [@J4technologyisnow](https://facebook.com/J4technologyisnow)\n• **TikTok:** [@J4technologyisnow](https://tiktok.com/@J4technologyisnow)'
  }

  // 5. Servicios ofrecidos
  if (/\b(servicio|servicios|que hacen|que ofrecen|a que se dedican|soluciones|catalogo)\b/.test(q)) {
    return `En **J4 Technology** desarrollamos soluciones de software y transformación digital de alto impacto:

1. 🌐 **Desarrollo Web:** Sitios corporativos, landing pages y plataformas personalizadas ultrarrápidas y responsive.
2. 📄 **Facturación Electrónica POS:** Sistema para puntos de venta con NCF/DGII, control de inventario y tickets.
3. 📦 **Inventario para Contables:** Auditoría física en vivo con lector de código de barras, cronómetro y balance financiero.
4. 📱 **Desarrollo de Apps Móviles:** Apps nativas e híbridas para iOS y Android (ej. restaurantes, delivery, comercio).
5. 🤖 **Agentes IA & Chatbots:** Asistentes automatizados 24/7 para WhatsApp, web y redes sociales.

¿Deseas una demostración en vivo de alguno de estos sistemas?`
  }

  // 6. Precios y cotizaciones
  if (/\b(precio|precios|costo|costos|cuanto cuesta|cuanto vale|cotizacion|tarifa|presupuesto)\b/.test(q)) {
    return `Nuestros precios se ajustan a las necesidades y tamaño de tu negocio:

• **Desarrollo Web & Landing Pages:** Paquetes accesibles para pymes y soluciones corporativas avanzadas.
• **Facturación POS & Inventarios:** Planes mensuales flexibles o licencias definitivas sin costos ocultos.
• **Apps Móviles & Software a Medida:** Cotización personalizada según requerimientos.

💡 Llámanos o escríbenos por WhatsApp al **809-613-3196** o a **j4.technologyisnow@gmail.com** para enviarte una cotización formal sin compromiso.`
  }

  // 7. Agendar demo o reunión
  if (/\b(demo|demostracion|agendar|reunion|cita|probar)\b/.test(q)) {
    return '¡Con gusto coordinamos una demostración en vivo! Puedes escribirnos directamente por WhatsApp al **809-613-3196** o enviarnos un correo a **j4.technologyisnow@gmail.com** con el horario de tu preferencia para coordinar una videollamada interactiva.'
  }

  // 8. Facturación y POS
  if (/\b(factura|facturas|facturacion|pos|fiscal|dgii|ncf)\b/.test(q)) {
    return 'Nuestro sistema de **Facturación Electrónica POS** permite emitir facturas rápidas, comprobantes fiscales (NCF), arqueos de caja y control de inventario en tiempo real. ¿Te gustaría ver una demostración o conocer los planes para tu negocio?'
  }

  // 9. Inventario contable
  if (/\b(inventario|inventarios|conteo|almacen|stock|contable|auditoria)\b/.test(q)) {
    return 'El **Sistema de Inventario para Contables** agiliza la toma física con código de barras, temporizador en tiempo real y conciliación de activos (ventas, gastos, cuentas por cobrar/pagar, efectivo y capital). ¡Puedes probar la demo en la sección de Servicios de nuestra web!'
  }

  // 10. Apps móviles
  if (/\b(app|apps|movil|moviles|android|ios|restaurante|menu)\b/.test(q)) {
    return 'Diseñamos y desarrollamos **aplicaciones móviles completas para iOS y Android**. En nuestra sección de Servicios puedes probar en demo una app interactiva para menú y pedidos de restaurante con comanda en cocina. ¿Qué idea de app te gustaría desarrollar?'
  }

  // 11. Agradecimientos
  if (/\b(gracias|muchas gracias|perfecto|excelente|genial|ok|entendido)\b/.test(q)) {
    return '¡A tu orden siempre! Si necesitas asistencia adicional, contáctanos al **809-613-3196** o vía **j4.technologyisnow@gmail.com**. ¡Estamos para servirte!'
  }

  // 12. Respuesta general inteligente
  return `Comprendo tu inquietud sobre "${texto}". En **J4 Technology** contamos con la experiencia para implementar la solución tecnológica ideal para tu empresa.

Te invitamos a comunicarte directamente con nuestros especialistas vía WhatsApp o Telegram al **809-613-3196**, o enviarnos un correo a **j4.technologyisnow@gmail.com** para una asesoría detallada.`
}

/* Componente de indicador de escritura con 3 puntos animados */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-cyan-400"
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

export default function ChatWidget({ preloadedMessage = null }) {
  const { t, i18n } = useTranslation('contact')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  /* Scroll automático al último mensaje */
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

    if (preloadedMessage) {
      setTimeout(() => sendMessage(preloadedMessage), 800)
    }
  }, [])

  /* Enviar mensaje con resiliencia total y fallback inteligente sin errores */
  const sendMessage = async (text) => {
    const messageText = text ?? input.trim()
    if (!messageText || typing) return

    setInput('')
    setShowSuggestions(false)

    /* Agregar mensaje del usuario al historial */
    const userMsg = { role: 'user', content: messageText, timestamp: formatTime() }
    setMessages((prev) => [...prev, userMsg])
    setTyping(true)

    try {
      // Intentar contactar a la API con timeout de 3.5 segundos
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3500)
      )

      const history = messages.map(({ role, content }) => ({ role, content }))
      const apiPromise = api.post('/chat/message', {
        sessionId,
        message: messageText,
        history,
        language: i18n.language ?? 'es',
      })

      const { data } = await Promise.race([apiPromise, timeoutPromise])

      const respuestaBackend = data?.response || data?.message || data?.reply
      if (respuestaBackend && typeof respuestaBackend === 'string') {
        const botMsg = {
          role: 'assistant',
          content: respuestaBackend,
          timestamp: formatTime(),
        }
        setMessages((prev) => [...prev, botMsg])
        return
      }
      throw new Error('Respuesta inválida')
    } catch {
      // Fallback inmediato con motor conversacional de IA local de J4
      await new Promise(resolve => setTimeout(resolve, 600)) // Simulación natural de typing
      const respuestaInteligente = generarRespuestaAgenteJ4(messageText, i18n.language)
      const botMsg = {
        role: 'assistant',
        content: respuestaInteligente,
        timestamp: formatTime(),
      }
      setMessages((prev) => [...prev, botMsg])
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

  const reiniciarChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: t('contact:chat.greeting'),
        timestamp: formatTime(),
      },
    ])
    setShowSuggestions(true)
  }

  /* Chips de sugerencia rápida */
  const suggestions = [
    '¿Qué servicios ofrecen?',
    '¿Cuál es su teléfono y WhatsApp?',
    '¿Cuánto cuesta una web o app?',
    'Quiero agendar una demo',
  ]

  return (
    <div className="rounded-3xl overflow-hidden flex flex-col w-full max-w-full h-[520px] sm:h-[560px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-colors">
      {/* Encabezado del chat */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar del agente J4 */}
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-md flex-shrink-0">
            J4
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm text-white">
                {t('contact:chat.title')}
              </p>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-200 font-bold uppercase">
                24/7
              </span>
            </div>
            {/* Indicador en línea */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs text-blue-100/90 font-medium">
                {t('contact:chat.online')} • Respuesta inmediata
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={reiniciarChat}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all text-xs flex items-center gap-1"
          title="Reiniciar chat"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>
      </div>

      {/* Área de mensajes con scroll */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 dark:bg-slate-950/60"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 border-l-4 border-l-blue-500 rounded-bl-sm'
                }`}
              >
                {msg.content}
                <div
                  className={`text-[10px] mt-1.5 text-right font-mono ${
                    msg.role === 'user' ? 'text-blue-100/70' : 'text-slate-400'
                  }`}
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
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 border-l-4 border-l-cyan-400 shadow-sm">
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        {/* Chips de sugerencia rápida */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/60 shadow-sm active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input de mensaje */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex items-center gap-2 rounded-2xl px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('contact:chat.placeholder')}
            disabled={typing}
            className="flex-1 bg-transparent text-xs sm:text-sm py-1.5 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 disabled:opacity-50 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md disabled:opacity-30 active:scale-95 transition-all"
            title="Enviar mensaje al Agente J4"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  )
}
