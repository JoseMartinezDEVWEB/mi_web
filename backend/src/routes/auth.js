/* Rutas de autenticación del panel admin */
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()
const prisma = new PrismaClient()

/* POST /api/auth/login — Autenticar administrador */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' })
    }

    /* Buscar el usuario admin en la base de datos */
    const user = await prisma.adminUser.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    /* Verificar la contraseña con bcrypt */
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    /* Generar token JWT con expiración de 24 horas */
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error('Error en POST /auth/login:', err.message)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
})

export default router
