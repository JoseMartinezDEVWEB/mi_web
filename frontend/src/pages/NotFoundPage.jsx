/* Página de error 404 personalizada */
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import ButtonPrimary from '../components/ui/ButtonPrimary.jsx'
import ButtonSecondary from '../components/ui/ButtonSecondary.jsx'

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Número 404 decorativo */}
          <motion.div
            className="text-[120px] font-black leading-none mb-4 select-none"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(212,175,55,0.3))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            404
          </motion.div>

          <h1 className="text-2xl font-bold mb-3" style={{ color: '#F1F5F9' }}>
            Página no encontrada
          </h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: '#94A3B8' }}>
            La página que buscas no existe o fue movida. Regresa al inicio y continúa explorando nuestras soluciones.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <ButtonPrimary iconLeft={<Home size={16} />}>
                Ir al inicio
              </ButtonPrimary>
            </Link>
            <button onClick={() => window.history.back()}>
              <ButtonSecondary iconLeft={<ArrowLeft size={16} />}>
                Regresar
              </ButtonSecondary>
            </button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
