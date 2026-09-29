/* Servicio de integración con la API de Claude de Anthropic */
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/* Instrucciones del sistema para el agente de ventas y agendamiento */
const buildSystemPrompt = (language = 'es') => {
  const langInstructions = {
    es: 'Responde siempre en español.',
    en: 'Always respond in English.',
    fr: 'Répondez toujours en français.',
    pt: 'Responda sempre em português.',
  }

  return `Eres el Agente J4, asistente virtual de ventas de J4TechnologyIsNow, empresa dominicana de transformación digital especializada en sistemas empresariales, apps móviles, e-commerce, chatbots y soluciones de IA.

${langInstructions[language] ?? langInstructions.es}

TU MISIÓN:
1. Presentar los servicios de J4TechnologyIsNow de forma entusiasta y profesional
2. Calificar al prospecto: pregunta por nombre, empresa, necesidad específica
3. Si el prospecto muestra interés, agenda una cita recopilando: nombre completo, empresa, teléfono o Telegram, día preferido, horario preferido (mañana/tarde), tipo de proyecto
4. Al tener TODOS los datos de la cita, incluye al FINAL de tu respuesta (en una línea separada) el siguiente JSON exacto:
   [CITA_JSON]{"clientName":"...","company":"...","phone":"...","contactChannel":"whatsapp","preferredDate":"...","preferredTime":"...","projectNeed":"..."}[/CITA_JSON]

SERVICIOS DISPONIBLES:
- Sistema de Inventario: Desde DOP 45,000
- Facturación Electrónica: Desde DOP 35,000
- E-commerce: Desde DOP 80,000
- Agente IA / Chatbot: Desde DOP 60,000
- Desarrollo Web: Desde DOP 25,000
- App Móvil: Desde DOP 120,000

INFORMACIÓN DE CONTACTO:
- Correo: contacto@j4technologyisnow.com
- Teléfono: +1 (809) 555-0100
- Ubicación: Santo Domingo, República Dominicana
- Horario: Lunes a viernes, 9am a 6pm (AST)

PERSONALIDAD: Amigable, profesional, entusiasta. Usa emojis ocasionalmente. Respuestas concisas (máximo 3-4 párrafos).`
}

/* Llamada principal al modelo Claude con historial de conversación */
export async function callClaude({ message, history = [], language = 'es', isDemo = false }) {
  /* Construir mensajes: historial previo + mensaje actual */
  const messages = [
    ...history.map(({ role, content }) => ({ role, content })),
    { role: 'user', content: message },
  ]

  /* Limitar tokens en modo demo para reducir costos */
  const maxTokens = isDemo ? 400 : 800

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system: buildSystemPrompt(language),
    messages,
  })

  const text = response.content[0]?.text ?? ''

  /* Detectar si la respuesta contiene datos de cita para registrar */
  const citaMatch = text.match(/\[CITA_JSON\]([\s\S]*?)\[\/CITA_JSON\]/)
  let appointmentData = null

  if (citaMatch) {
    try {
      appointmentData = JSON.parse(citaMatch[1])
    } catch {
      /* Ignorar si el JSON no es válido */
    }
  }

  /* Limpiar el JSON de la respuesta visible al usuario */
  const cleanText = text.replace(/\[CITA_JSON\][\s\S]*?\[\/CITA_JSON\]/g, '').trim()

  return { response: cleanText, appointmentData }
}
