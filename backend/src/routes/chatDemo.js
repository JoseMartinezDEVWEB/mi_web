/* Ruta del chat de demo — no guarda en base de datos, tiene rate limit reducido */
import { Router } from 'express'
import { callClaude } from '../services/claudeService.js'
import { chatDemoLimiter } from '../middleware/rateLimit.js'

const router = Router()

/* POST /api/chat/demo — Chat del sandbox de servicios (sin persistencia) */
router.post('/demo', chatDemoLimiter, async (req, res) => {
  try {
    const { message, history = [], language = 'es' } = req.body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' })
    }

    /* Llamada a Claude en modo demo (tokens reducidos) */
    const { response } = await callClaude({
      message: message.trim(),
      history,
      language,
      isDemo: true,
    })

    return res.json({ response })
  } catch (err) {
    console.error('Error en /chat/demo:', err.message)
    return res.status(500).json({ error: 'Error procesando tu mensaje. Intenta de nuevo.' })
  }
})

export default router
