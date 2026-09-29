/* Rutas para solicitudes de estimación de precio */
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

/* Tabla de precios base y tiempo estimado por servicio */
const PRICE_TABLE = {
  inventory: { basePrice: 45000, baseDays: 30 },
  billing: { basePrice: 35000, baseDays: 20 },
  ecommerce: { basePrice: 80000, baseDays: 45 },
  chatbot: { basePrice: 60000, baseDays: 25 },
  webdev: { basePrice: 25000, baseDays: 14 },
  mobileapp: { basePrice: 120000, baseDays: 60 },
  reservations: { basePrice: 50000, baseDays: 35 },
  analytics: { basePrice: 90000, baseDays: 40 },
}

/* POST /api/services/estimate — Calcular estimado de precio y tiempo */
router.post('/estimate', async (req, res) => {
  try {
    const { serviceId, features = [], clientName, clientEmail, clientPhone, notes } = req.body

    if (!serviceId || !clientName || !clientEmail) {
      return res.status(400).json({ error: 'serviceId, clientName y clientEmail son requeridos' })
    }

    const base = PRICE_TABLE[serviceId]
    if (!base) {
      return res.status(400).json({ error: 'Servicio no reconocido' })
    }

    /* Calcular precio adicional según features seleccionados */
    const extraPerFeature = Math.round(base.basePrice * 0.1)
    const estimatedPrice = base.basePrice + (features.length * extraPerFeature)
    const estimatedDays = base.baseDays + (features.length * 3)

    /* Guardar la estimación en la base de datos */
    const service = await prisma.service.findUnique({ where: { serviceKey: serviceId } })

    if (service) {
      await prisma.estimate.create({
        data: {
          serviceId: service.id,
          clientName,
          clientEmail,
          clientPhone,
          featuresRequested: features,
          notes,
          estimatedDays,
          estimatedPrice,
        },
      })
    }

    return res.json({ estimatedPrice, estimatedDays, currency: 'DOP' })
  } catch (err) {
    console.error('Error en POST /services/estimate:', err.message)
    return res.status(500).json({ error: 'Error calculando estimado' })
  }
})

export default router
