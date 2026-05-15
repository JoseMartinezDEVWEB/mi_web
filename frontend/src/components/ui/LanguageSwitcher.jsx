/* Selector de idioma con dropdown glassmorphism */
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/* Configuración de idiomas disponibles */
const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇩🇴' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
]

/* Versión desktop: dropdown glassmorphism */
export function LanguageSwitcherDesktop() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

  /* Cerrar dropdown al hacer clic fuera */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (code) => {
    /* Guardar selección en localStorage y actualizar el atributo lang del documento */
    localStorage.setItem('j4_lang', code)
    i18n.changeLanguage(code)
    document.documentElement.lang = code
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      {/* Botón disparador */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
        style={{
          color: '#F1F5F9',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <span>{currentLang.flag}</span>
        <span className="uppercase tracking-wide text-xs">{currentLang.code}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      {/* Dropdown con opciones de idioma */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full mt-2 py-1 rounded-xl min-w-[160px] z-50"
            style={{
              background: 'rgba(17, 24, 39, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === i18n.language
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 hover:bg-white/5"
                  style={{
                    /* Borde dorado a la izquierda para el idioma activo */
                    borderLeft: isActive ? '3px solid #D4AF37' : '3px solid transparent',
                    color: isActive ? '#D4AF37' : '#F1F5F9',
                  }}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Versión mobile: fila de 4 botones cuadrados para el drawer del menú */
export function LanguageSwitcherMobile() {
  const { i18n } = useTranslation()

  const changeLanguage = (code) => {
    localStorage.setItem('j4_lang', code)
    i18n.changeLanguage(code)
    document.documentElement.lang = code
  }

  return (
    <div className="flex gap-2">
      {LANGUAGES.map((lang) => {
        const isActive = lang.code === i18n.language
        return (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-all duration-150"
            style={{
              border: isActive ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.15)',
              color: isActive ? '#D4AF37' : '#94A3B8',
              background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            }}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="uppercase tracking-wider">{lang.code}</span>
          </button>
        )
      })}
    </div>
  )
}

/* Exportar versión desktop por defecto */
export default LanguageSwitcherDesktop
