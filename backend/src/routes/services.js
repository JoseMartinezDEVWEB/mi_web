/* Rutas del catálogo de servicios */
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

/* GET /api/services/catalog — Obtener catálogo de servicios con caché de 1 hora */
router.get('/catalog', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
    })

    /* Configurar caché de 1 hora en el navegador */
    res.set('Cache-Control', 'public, max-age=3600')
    return res.json({ services })
  } catch (err) {
    console.error('Error en GET /services/catalog:', err.message)
    return res.status(500).json({ error: 'Error obteniendo catálogo de servicios' })
  }
})

export default router
