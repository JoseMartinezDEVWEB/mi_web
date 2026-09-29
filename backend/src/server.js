/* Servidor principal de J4TechnologyIsNow — Express + Socket.io */
import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'

/* Importar rutas */
import chatRouter from './routes/chat.js'
import chatDemoRouter from './routes/chatDemo.js'
import appointmentsRouter from './routes/appointments.js'
import servicesRouter from './routes/services.js'
import estimatesRouter from './routes/estimates.js'
import newsletterRouter from './routes/newsletter.js'
import authRouter from './routes/auth.js'

/* Importar middleware */
import { apiLimiter } from './middleware/rateLimit.js'

/* Importar Socket.io handler */
import { setupChatSocket } from './socket/chatSocket.js'

const app = express()
const httpServer = createServer(app)
const PORT = parseInt(process.env.PORT ?? '4000')

/* Configurar Socket.io con CORS */
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  },
})

/* Middleware de seguridad */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}))

/* CORS — permitir solo el origen del frontend */
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

/* Parseo de JSON con límite de 10MB */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/* Rate limit global para todas las rutas /api */
app.use('/api', apiLimiter)

/* Montar rutas de la API */
app.use('/api/chat', chatRouter)
app.use('/api/chat', chatDemoRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/services', estimatesRouter)
app.use('/api/newsletter', newsletterRouter)
app.use('/api/auth', authRouter)

/* Ruta de salud para verificar que el servidor está activo */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'J4TechnologyIsNow API',
    timestamp: new Date().toISOString(),
  })
})

/* Manejo de rutas no encontradas en la API */
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `Ruta ${req.path} no encontrada` })
})

/* Manejo global de errores no capturados */
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

/* Configurar eventos de Socket.io */
setupChatSocket(io)

/* Iniciar el servidor */
httpServer.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   J4TechnologyIsNow — API Server      ║
  ║   Puerto: ${PORT}                         ║
  ║   Entorno: ${process.env.NODE_ENV ?? 'development'}              ║
  ╚═══════════════════════════════════════╝
  `)
})

export { app, io }
