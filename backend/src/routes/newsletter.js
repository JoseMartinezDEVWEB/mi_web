/* Ruta de suscripción al newsletter */
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

/* POST /api/newsletter — Registrar suscriptor al newsletter */
router.post('/', async (req, res) => {
  try {
    const { email } = req.body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Correo electrónico inválido' })
    }

    /* Crear suscriptor (ignorar si ya existe) */
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email, confirmedAt: new Date() },
    })

    /* Enviar correo de confirmación si Nodemailer está configurado */
    try {
      if (process.env.SMTP_HOST) {
        const nodemailer = await import('nodemailer')
        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT ?? '587'),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        await transporter.sendMail({
          from: `"J4TechnologyIsNow" <${process.env.SMTP_USER}>`,
          to: email,
          subject: '¡Bienvenido al newsletter de J4TechnologyIsNow!',
          html: `<h2>¡Gracias por suscribirte!</h2><p>Recibirás las últimas novedades sobre tecnología y transformación digital.</p>`,
        })
      }
    } catch (mailErr) {
      /* El correo de confirmación no es crítico */
      console.warn('No se pudo enviar correo de confirmación:', mailErr.message)
    }

    return res.json({ message: '¡Suscripción exitosa!', subscriber })
  } catch (err) {
    console.error('Error en POST /newsletter:', err.message)
    return res.status(500).json({ error: 'Error procesando la suscripción' })
  }
})

export default router
