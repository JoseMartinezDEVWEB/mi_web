/* Punto de entrada principal de la aplicación J4TechnologyIsNow */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'
/* Inicializar sistema de internacionalización antes de renderizar */
import './i18n/index.js'
/* Desactivar restauración automática de scroll del navegador para iniciar siempre arriba */
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
}

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* HelmetProvider para manejo de meta tags dinámicos por sección */}
    <HelmetProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
