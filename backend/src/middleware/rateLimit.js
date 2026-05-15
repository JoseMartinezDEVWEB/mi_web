/* Configuración de rate limiting por ruta para proteger la API */
import rateLimit from 'express-rate-limit'

/* Rate limit para el chat principal: 20 mensajes por IP cada 15 minutos */
export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Límite de mensajes alcanzado. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

/* Rate limit para el chat de demo: 10 mensajes por IP cada 10 minutos */
export const chatDemoLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { error: 'Límite de mensajes de demo alcanzado. Intenta de nuevo en 10 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

/* Rate limit general para la API */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
})
