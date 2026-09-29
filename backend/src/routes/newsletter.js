/* Ruta de suscripción al newsletter con protección integral Anti-Bot / Anti-Spam */
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { newsletterLimiter } from '../middleware/rateLimit.js'

const router = Router()
const prisma = new PrismaClient()

/* Lista de dominios temporales y descartables comúnmente usados por bots */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'throwawaymail.com',
  'burnermail.io',
  'trashmail.com',
  'fakeinbox.com',
  'generator.email',
  'mohmal.com',
])

/* POST /api/newsletter — Registrar suscriptor con filtros de seguridad */
router.post('/', newsletterLimiter, async (req, res) => {
  try {
    const { email, website_hp, securityToken } = req.body

    /* 1. FILTRO HONEYPOT (Trampa para bots automáticos)
       Si el campo trampa 'website_hp' tiene algún valor, significa que un bot automatizado
       lo completó sin ver que estaba oculto. Respondemos 200 ficticio para engañar al bot
       sin ensuciar la base de datos ni enviar correos. */
    if (website_hp && website_hp.trim() !== '') {
      console.warn('Bot bloqueado por trampa Honeypot en Newsletter')
      return res.json({ message: '¡Suscripción exitosa!' })
    }

    /* 2. VALIDACIÓN BÁSICA DE FORMATO DE CORREO */
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Por favor proporciona un correo electrónico válido.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const domain = normalizedEmail.split('@')[1]

    /* 3. FILTRO DE CORREOS TEMPORALES / DESECHABLES */
    if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      return res.status(400).json({
        error: 'No se permiten correos electrónicos temporales o desechables. Por favor usa un correo real.',
      })
    }

    /* 4. VALIDACIÓN DE TIEMPO HUMANO (Opcional si viene token de frontend) */
    if (securityToken) {
      try {
        const decoded = Buffer.from(securityToken, 'base64').toString('ascii')
        const [timestampStr] = decoded.split(':')
        const timestamp = parseInt(timestampStr, 10)
        if (!isNaN(timestamp)) {
          const elapsed = (Date.now() - timestamp) / 1000
          // Si el formulario fue enviado en menos de 0.8 segundos tras cargarse, es un bot de alta velocidad
          if (elapsed < 0.8) {
            console.warn(`Envío descartado por velocidad no humana: ${elapsed}s`)
            return res.json({ message: '¡Suscripción exitosa!' })
          }
        }
      } catch (err) {
        // En caso de error de parseo del token, continuar con la validación estándar
      }
    }

    /* 5. CREAR O ACTUALIZAR SUSCRIPTOR */
    const subscriber = await prisma.subscriber.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: { email: normalizedEmail, confirmedAt: new Date() },
    })

    /* 6. ENVIAR CORREO DE CONFIRMACIÓN SI SMTP ESTÁ CONFIGURADO */
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
          to: normalizedEmail,
          subject: '¡Bienvenido al newsletter de J4TechnologyIsNow!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f1f5f9; border-radius: 12px;">
              <h2 style="color: #00D4FF; margin-bottom: 12px;">¡Gracias por suscribirte a J4TechnologyIsNow!</h2>
              <p style="color: #cbd5e1; line-height: 1.6;">
                Te damos la bienvenida a nuestra comunidad. Recibirás periódicamente las mejores actualizaciones sobre transformación digital, soluciones de software empresarial, desarrollo web e innovaciones con Inteligencia Artificial.
              </p>
              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />
              <p style="font-size: 11px; color: #64748b;">
                Has recibido este mensaje porque te registraste en <a href="${process.env.FRONTEND_URL || 'https://j4technologyisnow.com'}" style="color: #00D4FF; text-decoration: none;">J4TechnologyIsNow</a>.
                Si no realizaste esta solicitud o deseas darte de baja, puedes responder a este correo solicitando tu exclusión.
              </p>
            </div>
          `,
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
