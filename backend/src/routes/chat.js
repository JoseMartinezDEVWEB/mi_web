/* Ruta del chat principal con el Agente IA — guarda citas en base de datos */
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { callClaude } from '../services/claudeService.js'
import { sendWhatsAppNotification } from '../services/twilioService.js'
import { sendTelegramNotification } from '../services/telegramService.js'
import { chatLimiter } from '../middleware/rateLimit.js'

const router = Router()
const prisma = new PrismaClient()

/* POST /api/chat/message — Chat principal con el agente IA */
router.post('/message', chatLimiter, async (req, res) => {
  try {
    const { sessionId, message, history = [], language = 'es' } = req.body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' })
    }

    /* Llamar al servicio de Claude */
    const { response, appointmentData } = await callClaude({
      message: message.trim(),
      history,
      language,
      isDemo: false,
    })

    /* Si el agente detectó todos los datos de una cita, registrarla */
    if (appointmentData) {
      try {
        const appointment = await prisma.appointment.create({
          data: {
            clientName: appointmentData.clientName ?? 'Sin nombre',
            company: appointmentData.company,
            phone: appointmentData.phone ?? 'Sin teléfono',
            contactChannel: appointmentData.contactChannel ?? 'whatsapp',
            preferredDate: appointmentData.preferredDate ?? 'Por confirmar',
            preferredTime: appointmentData.preferredTime,
            projectNeed: appointmentData.projectNeed ?? 'Sin especificar',
            sessionId,
          },
        })

        /* Notificar al propietario por WhatsApp y Telegram en paralelo */
        await Promise.allSettled([
          sendWhatsAppNotification(appointment),
          sendTelegramNotification(appointment),
        ])
      } catch (dbErr) {
        console.error('Error guardando cita en BD:', dbErr.message)
      }
    }

    return res.json({ response, appointmentScheduled: !!appointmentData })
  } catch (err) {
    console.error('Error en /chat/message:', err.message)
    return res.status(500).json({ error: 'Error procesando tu mensaje. Intenta de nuevo.' })
  }
})

export default router
