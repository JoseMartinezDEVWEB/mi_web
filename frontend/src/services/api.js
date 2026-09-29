/* Servicio centralizado de comunicación con el backend */
import axios from 'axios'

/* Instancia base de Axios con configuración predeterminada */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

/* Interceptor de solicitudes: añadir token JWT si existe */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('j4_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

/* Interceptor de respuestas: manejar errores globales */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      /* Token expirado: limpiar y redirigir al login */
      localStorage.removeItem('j4_token')
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin'
      }
    }
    return Promise.reject(error)
  }
)

export default api
