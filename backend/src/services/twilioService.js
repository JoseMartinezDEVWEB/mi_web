/* Servicio de notificaciones WhatsApp via Twilio */
/* Se importa Twilio al nivel del módulo para evitar await dinámico */
import twilio from 'twilio'

let twilioClient = null

/* Inicializar el cliente Twilio con las credenciales del .env */
const getClient = () => {
  if (twilioClient) return twilioClient

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return null

  try {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    return twilioClient
  } catch {
    return null
  }
}

/* Enviar notificación WhatsApp al propietario cuando se agenda una cita */
export async function sendWhatsAppNotification(appointment) {
  const from = process.env.TWILIO_WHATSAPP_FROM
  const to = process.env.OWNER_WHATSAPP

  /* Fallback a consola si WhatsApp no está configurado en el .env */
  if (!from || !to || !process.env.TWILIO_ACCOUNT_SID) {
    console.log('📱 [WhatsApp Fallback] Nueva cita agendada:')
    console.log(JSON.stringify(appointment, null, 2))
    return
  }

  const message = `🎉 *Nueva cita agendada — J4TechnologyIsNow*

👤 *Cliente:* ${appointment.clientName}
🏢 *Empresa:* ${appointment.company ?? 'No especificada'}
📞 *Teléfono:* ${appointment.phone}
📅 *Fecha preferida:* ${appointment.preferredDate}
⏰ *Horario:* ${appointment.preferredTime ?? 'No especificado'}
💼 *Proyecto:* ${appointment.projectNeed}

Responde pronto para confirmar la cita ✅`

  try {
    const client = getClient()
    if (!client) throw new Error('Cliente Twilio no disponible')

    await client.messages.create({ from, to, body: message })
    console.log('✅ Notificación WhatsApp enviada al propietario')
  } catch (err) {
    console.error('❌ Error enviando WhatsApp:', err.message)
    console.log('📱 [Fallback] Datos de la cita:', JSON.stringify(appointment, null, 2))
  }
}
