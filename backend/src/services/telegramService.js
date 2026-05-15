/* Servicio de notificaciones via Telegram Bot API */

/* Enviar notificación al propietario por Telegram cuando se agenda una cita */
export async function sendTelegramNotification(appointment) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.OWNER_TELEGRAM_CHAT_ID

  /* Fallback a consola si Telegram no está configurado */
  if (!token || !chatId) {
    console.log('📨 [Telegram Fallback] Nueva cita agendada:')
    console.log(JSON.stringify(appointment, null, 2))
    return
  }

  const message = `🎉 *Nueva cita agendada — J4TechnologyIsNow*

👤 *Cliente:* ${appointment.clientName}
🏢 *Empresa:* ${appointment.company ?? 'No especificada'}
📞 *Teléfono:* ${appointment.phone}
📅 *Fecha preferida:* ${appointment.preferredDate}
⏰ *Horario:* ${appointment.preferredTime ?? 'No especificado'}
💼 *Proyecto:* ${appointment.projectNeed}`

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    console.log('✅ Notificación Telegram enviada al propietario')
  } catch (err) {
    console.error('❌ Error enviando Telegram:', err.message)
    console.log('📨 [Fallback] Datos de la cita:', JSON.stringify(appointment, null, 2))
  }
}
