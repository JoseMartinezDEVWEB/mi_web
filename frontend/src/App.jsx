/* Componente raíz de la aplicación - define rutas y proveedores globales */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Suspense, lazy, useEffect } from 'react'

/* Componentes de UI global */
import CustomCursor from './components/ui/CustomCursor.jsx'
import ScrollProgress from './components/ui/ScrollProgress.jsx'
import SplashScreen from './components/ui/SplashScreen.jsx'
import AnimatedBackground from './components/background/AnimatedBackground.jsx'

/* Carga diferida de páginas para mejor performance inicial */
const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'))
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'))
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'))
const LegalPage = lazy(() => import('./pages/LegalPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

/* Componente de carga mientras se descargan las páginas lazy */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
  </div>
)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Fondo animado fijo que cubre toda la pantalla (z-index 0) */}
      <AnimatedBackground />

      {/* Cursor personalizado para dispositivos de escritorio */}
      <CustomCursor />

      {/* Barra de progreso de lectura en la parte superior */}
      <ScrollProgress />

      {/* Scroll al tope en cada cambio de ruta */}
      <ScrollToTop />

      {/* Pantalla de carga inicial con animación del logo J4 */}
      <SplashScreen />

      {/* Sistema de notificaciones toast con estilo oscuro */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111827',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            color: '#F1F5F9',
          },
        }}
      />

      {/* Definición de rutas de la aplicación */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/terminos" element={<LegalPage defaultTab="terms" />} />
          <Route path="/privacidad" element={<LegalPage defaultTab="privacy" />} />
          <Route path="/cookies" element={<LegalPage defaultTab="cookies" />} />
          <Route path="/legal" element={<LegalPage defaultTab="terms" />} />
          <Route path="/legal/:tab" element={<LegalPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
