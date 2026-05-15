/* Rutas para gestión de citas agendadas — requiere autenticación JWT */
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

/* GET /api/appointments — Listar todas las citas (solo admin) */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const where = status ? { status } : {}

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.appointment.count({ where }),
    ])

    return res.json({ appointments, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) {
    console.error('Error en GET /appointments:', err.message)
    return res.status(500).json({ error: 'Error obteniendo citas' })
  }
})

/* POST /api/appointments — Crear cita manualmente (solo admin) */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { clientName, company, phone, preferredDate, preferredTime, projectNeed } = req.body

    if (!clientName || !phone || !preferredDate) {
      return res.status(400).json({ error: 'Nombre, teléfono y fecha son requeridos' })
    }

    const appointment = await prisma.appointment.create({
      data: { clientName, company, phone, preferredDate, preferredTime, projectNeed: projectNeed ?? 'Sin especificar' },
    })

    return res.status(201).json({ appointment })
  } catch (err) {
    console.error('Error en POST /appointments:', err.message)
    return res.status(500).json({ error: 'Error creando cita' })
  }
})

/* PATCH /api/appointments/:id — Actualizar estado de una cita */
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status },
    })

    return res.json({ appointment })
  } catch (err) {
    console.error('Error en PATCH /appointments/:id:', err.message)
    return res.status(500).json({ error: 'Error actualizando cita' })
  }
})

export default router
