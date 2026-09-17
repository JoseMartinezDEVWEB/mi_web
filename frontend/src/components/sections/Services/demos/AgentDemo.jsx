/* Demo interactivo de chat con el Agente IA de J4TechnologyIsNow */
import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, Sparkles, RefreshCw, CheckCircle2, MessageSquare } from 'lucide-react'
import api from '../../../../services/api.js'

/* Mensaje de bienvenida del asistente */
const MENSAJE_INICIAL = {
  role: 'assistant',
  content: '¡Hola! Soy el Asistente Inteligente de J4 Technology. ¿En qué puedo ayudarte hoy? Puedes consultarme sobre desarrollo web, facturación electrónica, apps móviles, inventario contable o agendar una demostración.',
  timestamp: new Date(),
}

/* Sugerencias rápidas para el usuario */
const SUGERENCIAS = [
  '¿Qué servicios ofrecen?',
  '¿Cuánto cuesta una web o app?',
  '¿Cómo funciona la facturación POS?',
  'Quiero agendar una demo en vivo'
]

/* Formatea la hora en formato HH:MM */
const formatearHora = (fecha) => {
  const d = new Date(fecha)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/* Motor inteligente local de respuestas para J4 Technology (garantiza funcionamiento sin errores) */
function generarRespuestaInteligente(mensaje, idioma = 'es') {
  const q = mensaje.toLowerCase().trim()

  // 1. Saludos
  if (/\b(hola|buenos dias|buenas tardes|buenas noches|saludos|hey|que tal)\b/.test(q)) {
    return '¡Hola! Un placer saludarte. Soy el Agente IA de **J4 Technology**. Estoy listo para responder tus dudas sobre desarrollo de software, sistemas de facturación, apps móviles y automatizaciones inteligentes. ¿Qué tipo de solución o proyecto tienes en mente?'
  }

  // 2. Servicios generales
  if (/\b(servicio|servicios|que hacen|que ofrecen|a que se dedican|soluciones|catalogo)\b/.test(q)) {
    return `En **J4 Technology** impulsamos la transformación digital de tu negocio con soluciones tecnológicas completas:

1. 🌐 **Desarrollo Web & Plataformas:** Sitios web modernos, responsivos y optimizados para SEO y conversión.
2. 📄 **Facturación Electrónica POS:** Sistema punto de venta con control fiscal (DGII/NCF), inventario y tickets.
3. 📦 **Sistema de Inventario para Contables:** Auditoría física en vivo, escaneo de códigos de barra y arqueo financiero.
4. 📱 **Desarrollo de Apps Móviles:** Aplicaciones nativas e híbridas para iOS y Android (ej. restaurantes, e-commerce, delivery).
5. 🤖 **Agentes IA & Chatbots:** Asistentes 24/7 con IA para atención a clientes e integración con WhatsApp y CRM.

¿Te gustaría profundizar en alguno de estos servicios o ver su demo interactiva?`
  }

  // 3. Precios y cotizaciones
  if (/\b(precio|precios|costo|costos|cuanto cuesta|cuanto vale|cotizacion|tarifa|presupuesto)\b/.test(q)) {
    return `Nuestros proyectos se cotizan a la medida según el alcance y requerimientos de tu negocio:

• **Desarrollo Web & Landing Pages:** Desde soluciones ágiles y económicas para emprendimientos hasta plataformas web corporativas de alto rendimiento.
• **Facturación POS & Inventario:** Planes flexibles mensuales o licencias sin comisiones ocultas.
• **Apps Móviles & Software a Medida:** Cotización personalizada basada en arquitectura y funcionalidades deseadas.

💡 Puedes solicitar una **cotización formal sin costo** dejando tus datos en la sección de **Contacto** o coordinando una llamada con nuestros ingenieros.`
  }

  // 4. Facturación electrónica y POS
  if (/\b(facturacion|factura|pos|caja|fiscal|dgii|ncf|ticket|punto de venta)\b/.test(q)) {
    return `Nuestro **Sistema de Facturación Electrónica POS** (del cual puedes probar el demo en vivo en la pestaña *Facturación electrónica*) ofrece:

• Emisión ágil de facturas, cotizaciones y tickets de venta.
• Compatible con comprobantes fiscales de República Dominicana (NCF / e-CF).
• Gestión de clientes, productos con código de barras y categorías.
• Múltiples métodos de pago (efectivo, tarjeta, transferencia) y arqueo diario de caja.
• Reportes de ventas y cierres financieros automáticos.`
  }

  // 5. Inventario contable
  if (/\b(inventario|inventarios|conteo|almacen|stock|contable|auditoria|arqueo)\b/.test(q)) {
    return `El **Sistema de Inventario para Contables** está diseñado específicamente para agilizar la auditoría física y contable:

• Creación de clientes o negocios auditados con RNC y teléfono.
• Sesiones de inventario con temporizador cronómetro en vivo.
• Conteo físico con buscador y lector de códigos de barra.
• Consola de arqueo financiero: Ventas, Gastos, Cuentas por Cobrar/Pagar, Efectivo, Activos Fijos y Capital.
• Exportación inmediata a Excel/CSV y reportes imprimibles.

¡Puedes probarlo directamente en la pestaña *Sistema de inventario* en esta misma sección de demos!`
  }

  // 6. Aplicaciones móviles
  if (/\b(app|apps|movil|moviles|android|ios|celular|telefono|restaurante|delivery)\b/.test(q)) {
    return `Creamos **aplicaciones móviles para iOS y Android** con diseño de primer nivel y máxima fluidez:

• Aplicaciones de e-commerce, delivery y catálogos interactivos.
• Menús digitales para restaurantes con comanda en cocina (¡acabamos de habilitar un demo interactivo en la pestaña *Desarrollo de Apps Móviles*!).
• Integración con pasarelas de pago seguras, notificaciones push y GPS.
• Paneles de administración en la nube para gestionar pedidos en tiempo real.`
  }

  // 7. Agentes IA y Chatbots
  if (/\b(ia|ai|chatbot|chatbots|bot|bots|inteligencia artificial|agente|whatsapp)\b/.test(q)) {
    return `¡Justo estás conversando con uno de nuestros desarrollos de IA! Nuestros **Agentes y Chatbots Inteligentes** permiten:

• Atención 24/7 sin colas ni demoras para tus clientes.
• Integración directa con WhatsApp Business, Instagram, Messenger y tu sitio web.
• Calificación automática de clientes potenciales y captura de contactos.
• Respuestas contextuales conectadas a tu catálogo o base de datos.
• Reducción de costos de soporte y aumento en la tasa de cierre de ventas.`
  }

  // 8. Agendar demostración o contacto
  if (/\b(demo|demostracion|agendar|reunion|cita|contacto|contactar|telefono|correo|whatsapp|llamar)\b/.test(q)) {
    return `¡Excelente! Estaremos encantados de coordinar una **sesión de demostración personalizada** para tu empresa.

Puedes comunicarte con nosotros de dos formas inmediatas:
1. Completa el formulario en la sección de **Contacto** al pie de la página con tu nombre, correo y teléfono.
2. Escríbenos directamente por **WhatsApp** a través del botón flotante para una respuesta inmediata.

¿Te gustaría que un asesor te contacte hoy mismo?`
  }

  // 9. Desarrollo web y tecnologías
  if (/\b(web|pagina|sitio|tecnologia|tecnologias|react|programacion|desarrollo)\b/.test(q)) {
    return `Desarrollamos soluciones digitales utilizando las tecnologías más avanzadas, seguras y escalables del mercado:

• **Frontend:** React, Next.js, Vite, Tailwind CSS, Framer Motion.
• **Backend:** Node.js, Express, Python, PostgreSQL, Prisma, MongoDB.
• **Móvil:** React Native, Flutter.
• **Infraestructura:** Despliegues en la nube de alta disponibilidad (Vercel, AWS), certificados SSL y arquitectura de microservicios.`
  }

  // 10. Agradecimientos o despedidas
  if (/\b(gracias|muchas gracias|perfecto|excelente|genial|ok|adios|chao|hasta luego)\b/.test(q)) {
    return '¡Ha sido un verdadero placer ayudarte! Si tienes cualquier otra pregunta o deseas iniciar un proyecto tecnológico con nosotros, aquí estaré para asistirte. ¡Que tengas un excelente día!'
  }

  // 11. Respuesta contextual general inteligente
  return `Comprendo perfectamente tu consulta sobre "${mensaje}". En **J4 Technology** contamos con un equipo especializado en ingeniería de software, inteligencia artificial y automatización empresarial para hacer realidad tu proyecto.

Puedes explorar las diferentes pestañas de esta sección de servicios para interactuar con nuestras demos en vivo (Facturación POS, Inventario Contable, Apps Móviles y Desarrollo Web), o escribirnos a través del formulario de **Contacto** para brindarte una asesoría personalizada.`
}

/* Indicador de "escribiendo..." */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1.1, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

/* Burbuja individual de mensaje */
function BurbujaMensaje({ mensaje }) {
  const esUsuario = mensaje.role === 'user'

  return (
    <motion.div
      className={`flex flex-col ${esUsuario ? 'items-end' : 'items-start'} gap-1`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`max-w-[85%] sm:max-w-[80%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
          esUsuario
            ? 'bg-blue-600 text-white rounded-br-sm shadow-md shadow-blue-500/20'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 border-l-4 border-l-blue-500 rounded-bl-sm shadow-sm'
        }`}
      >
        {mensaje.content}
      </div>
      <span className="text-[10px] text-slate-400 px-1 font-mono">
        {formatearHora(mensaje.timestamp)}
      </span>
    </motion.div>
  )
}

export default function AgentDemo() {
  const { i18n } = useTranslation()

  const [mensajes, setMensajes] = useState([MENSAJE_INICIAL])
  const [input, setInput] = useState('')
  const [cargando, setCargando] = useState(false)
  const historialRef = useRef(null)

  // Scroll automático hacia el final del chat
  useEffect(() => {
    if (historialRef.current) {
      historialRef.current.scrollTop = historialRef.current.scrollHeight
    }
  }, [mensajes, cargando])

  // Envío seguro de mensaje
  const enviarMensaje = async (texto) => {
    const textoLimpio = texto.trim()
    if (!textoLimpio || cargando) return

    // Agregar mensaje del usuario al chat
    const mensajeUsuario = { role: 'user', content: textoLimpio, timestamp: new Date() }
    setMensajes(prev => [...prev, mensajeUsuario])
    setInput('')
    setCargando(true)

    try {
      // Intentar primero con la API del backend si estuviese disponible
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3500)
      )

      const apiPromise = api.post('/chat/demo', {
        message: textoLimpio,
        history: mensajes.map(m => ({ role: m.role, content: m.content })),
        language: i18n.language || 'es',
      })

      const { data } = await Promise.race([apiPromise, timeoutPromise])

      const respuestaBackend = data.response || data.reply || data.message
      if (respuestaBackend && typeof respuestaBackend === 'string') {
        setMensajes(prev => [
          ...prev,
          { role: 'assistant', content: respuestaBackend, timestamp: new Date() },
        ])
        return
      }
      throw new Error('Respuesta no válida')
    } catch {
      // Si la API falla (ej. en Vercel estático o backend desconectado), el motor inteligente local responde de forma instantánea y perfecta
      await new Promise(resolve => setTimeout(resolve, 600)) // Simulación natural de typing
      const respuestaLocal = generarRespuestaInteligente(textoLimpio, i18n.language)
      setMensajes(prev => [
        ...prev,
        { role: 'assistant', content: respuestaLocal, timestamp: new Date() },
      ])
    } finally {
      setCargando(false)
    }
  }

  const manejarTecla = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje(input)
    }
  }

  const reiniciarConversacion = () => {
    setMensajes([
      {
        ...MENSAJE_INICIAL,
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl" style={{ height: 480 }}>
      {/* ── Encabezado del Asistente Virtual ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold leading-tight">Asistente IA de J4 Technology</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-200 font-semibold uppercase">
                Demo 24/7
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-blue-100/90 font-medium">En línea para responder tus preguntas</span>
            </div>
          </div>
        </div>

        <button
          onClick={reiniciarConversacion}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all text-xs flex items-center gap-1"
          title="Reiniciar conversación"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>
      </div>

      {/* ── Historial de Mensajes ── */}
      <div
        ref={historialRef}
        className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50"
      >
        {mensajes.map((msg, idx) => (
          <BurbujaMensaje key={idx} mensaje={msg} />
        ))}

        {cargando && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TypingIndicator />
          </motion.div>
        )}
      </div>

      {/* ── Sugerencias Rápidas ── */}
      {mensajes.length <= 2 && (
        <div className="flex gap-2 px-3 py-2 bg-slate-100/60 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 overflow-x-auto shrink-0 scrollbar-none">
          {SUGERENCIAS.map((sugerencia) => (
            <button
              key={sugerencia}
              onClick={() => enviarMensaje(sugerencia)}
              className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all font-medium active:scale-95 shadow-sm"
            >
              {sugerencia}
            </button>
          ))}
        </div>
      )}

      {/* ── Barra de Entrada de Texto ── */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            enviarMensaje(input)
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={manejarTecla}
            placeholder="Haz una pregunta al asistente (ej. ¿Qué servicios ofrecen?)..."
            className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />

          <button
            type="submit"
            disabled={!input.trim() || cargando}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center shrink-0"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
