/** @type {import('tailwindcss').Config} */
/* Configuración de TailwindCSS con paleta de colores personalizada para J4TechnologyIsNow */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* Colores personalizados de la marca J4 */
      colors: {
        /* Fondos principales */
        'bg-primary': '#0a0a0f',
        'bg-card': '#111827',
        /* Dorados de la marca */
        'gold': '#D4AF37',
        'gold-bright': '#F5C842',
        /* Cian tecnológico */
        'cyan-tech': '#00D4FF',
        'cyan-deep': '#0099CC',
        /* Textos */
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
      },
      /* Fuentes tipográficas */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      /* Escala tipográfica */
      fontSize: {
        'label': '12px',
        'body-sm': '14px',
        'body': '16px',
        'subtitle': '20px',
        'h3': '32px',
        'h2': '48px',
        'h1': '64px',
      },
      /* Animaciones personalizadas */
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00D4FF, 0 0 10px #00D4FF' },
          '100%': { boxShadow: '0 0 20px #00D4FF, 0 0 40px #00D4FF' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      /* Sombras con glow */
      boxShadow: {
        'cyan-sm': '0 0 10px rgba(0, 212, 255, 0.3)',
        'cyan-md': '0 0 20px rgba(0, 212, 255, 0.4)',
        'cyan-lg': '0 0 40px rgba(0, 212, 255, 0.5)',
        'gold-sm': '0 0 10px rgba(212, 175, 55, 0.3)',
        'gold-md': '0 0 20px rgba(212, 175, 55, 0.4)',
      },
      /* Backdrop blur extendido */
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
