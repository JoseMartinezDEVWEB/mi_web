/* Panel de administración protegido con JWT */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogIn, LogOut, Calendar, Users, MessageSquare, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../services/api.js'
import ButtonPrimary from '../components/ui/ButtonPrimary.jsx'
import InputField from '../components/ui/InputField.jsx'

/* Esquema de validación del formulario de login */
const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

/* Panel de estadísticas del admin */
function AdminDashboard({ onLogout }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/appointments')
      .then(({ data }) => setAppointments(data.appointments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado del panel */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>
              Panel de Administración
            </h1>
            <p className="text-sm" style={{ color: '#94A3B8' }}>J4TechnologyIsNow</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-colors hover:bg-white/5"
            style={{ color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Calendar, label: 'Citas pendientes', value: appointments.filter(a => a.status === 'pending').length, color: '#00D4FF' },
            { icon: Users, label: 'Total citas', value: appointments.length, color: '#D4AF37' },
            { icon: MessageSquare, label: 'Sesiones hoy', value: 0, color: '#10b981' },
            { icon: Mail, label: 'Suscriptores', value: 0, color: '#6366f1' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl p-5"
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Icon size={20} color={color} className="mb-3" />
              <div className="text-2xl font-bold mb-1" style={{ color: '#F1F5F9' }}>{value}</div>
              <div className="text-xs" style={{ color: '#94A3B8' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabla de citas */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold" style={{ color: '#F1F5F9' }}>Citas agendadas</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 rounded-full border-2 border-[#00D4FF] border-t-transparent animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm" style={{ color: '#94A3B8' }}>
              No hay citas registradas aún
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    {['Cliente', 'Empresa', 'Teléfono', 'Proyecto', 'Fecha preferida', 'Estado'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr
                      key={apt.id}
                      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4" style={{ color: '#F1F5F9' }}>{apt.clientName}</td>
                      <td className="px-6 py-4" style={{ color: '#94A3B8' }}>{apt.company}</td>
                      <td className="px-6 py-4" style={{ color: '#94A3B8' }}>{apt.phone}</td>
                      <td className="px-6 py-4" style={{ color: '#94A3B8' }}>{apt.projectNeed}</td>
                      <td className="px-6 py-4" style={{ color: '#94A3B8' }}>{apt.preferredDate}</td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: apt.status === 'confirmed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                            color: apt.status === 'confirmed' ? '#10b981' : '#f59e0b',
                          }}
                        >
                          {apt.status === 'confirmed' ? 'Confirmada' : apt.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('j4_token'))
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onLogin = async (data) => {
    setLoading(true)
    try {
      const { data: res } = await api.post('/auth/login', data)
      localStorage.setItem('j4_token', res.token)
      setAuthenticated(true)
      toast.success('Bienvenido al panel de administración')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const onLogout = () => {
    localStorage.removeItem('j4_token')
    setAuthenticated(false)
    toast.success('Sesión cerrada')
  }

  /* Mostrar el panel si está autenticado */
  if (authenticated) {
    return (
      <div className="relative z-10">
        <AdminDashboard onLogout={onLogout} />
      </div>
    )
  }

  /* Formulario de login */
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-2">
            <span style={{ color: '#D4AF37' }}>J4</span>
            <span style={{ color: '#F1F5F9' }}>Tech</span>
          </div>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Panel de Administración</p>
        </div>

        {/* Card del formulario */}
        <div
          className="rounded-2xl p-8"
          style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
            <InputField
              label="Correo electrónico"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <InputField
              label="Contraseña"
              name="password"
              type="password"
              register={register}
              error={errors.password}
            />
            <ButtonPrimary
              type="submit"
              loading={loading}
              className="w-full justify-center !py-3"
              iconLeft={<LogIn size={16} />}
            >
              Ingresar
            </ButtonPrimary>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
