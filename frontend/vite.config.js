import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* Configuración de Vite para el frontend de J4TechnologyIsNow */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    /* Proxy para comunicación con el backend en desarrollo */
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:4000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    /* Optimización de chunks para mejor rendimiento */
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
})
