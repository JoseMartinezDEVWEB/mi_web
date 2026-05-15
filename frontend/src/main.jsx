/* Punto de entrada principal de la aplicación J4TechnologyIsNow */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
/* Inicializar sistema de internacionalización antes de renderizar */
import './i18n/index.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* HelmetProvider para manejo de meta tags dinámicos por sección */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
