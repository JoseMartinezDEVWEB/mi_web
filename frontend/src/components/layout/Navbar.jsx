/* Navbar responsivo con glassmorphism al scroll y menú mobile drawer */
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcherDesktop, LanguageSwitcherMobile } from '../ui/LanguageSwitcher.jsx'
import ButtonPrimary from '../ui/ButtonPrimary.jsx'

/* Anclas de las secciones para navegación suave */
const NAV_LINKS = [
  { key: 'nav.home', href: '#hero' },
  { key: 'nav.services', href: '#servicios' },
  { key: 'nav.about', href: '#nosotros' },
  { key: 'nav.portfolio', href: '#portafolio' },
  { key: 'nav.blog', href: '#blog' },
  { key: 'nav.contact', href: '#contacto' },
]

export default function Navbar() {
  const { t } = useTranslation('common')
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const location = useLocation()

  /* Detectar scroll para aplicar glassmorphism */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Detectar sección activa con IntersectionObserver */
  useEffect(() => {
    const sectionIds = ['hero', 'servicios', 'nosotros', 'portafolio', 'blog', 'contacto']
    const observers = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.3 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [location.pathname])

  const scrollToSection = (href) => {
    setDrawerOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Barra de navegación principal */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10, 10, 15, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo J4 */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl select-none"
            onClick={() => scrollToSection('#hero')}
          >
            <span style={{ color: '#D4AF37' }}>J4</span>
            <span style={{ color: '#F1F5F9' }}>TechnologyIsNow</span>
          </Link>

          {/* Links de navegación — solo en desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ key, href }) => {
              const sectionId = href.replace('#', '')
              const isActive = activeSection === sectionId
              return (
                <motion.button
                  key={key}
                  onClick={() => scrollToSection(href)}
                  className="relative text-sm font-medium transition-colors duration-200"
                  style={{ color: isActive ? '#D4AF37' : '#94A3B8' }}
                  whileHover={{ color: '#D4AF37' }}
                >
                  {t(key)}
                  {/* Subrayado activo */}
                  {isActive && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: '#D4AF37' }}
                      layoutId="activeNav"
                    />
                  )}
                </motion.button>
              )
            })}
          </nav>

          {/* Acciones derechas */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcherDesktop />
            <ButtonPrimary
              onClick={() => scrollToSection('#contacto')}
              className="text-sm !py-2 !px-4"
            >
              {t('nav.cta')}
            </ButtonPrimary>
          </div>

          {/* Botón hamburguesa mobile */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: '#F1F5F9' }}
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.header>

      {/* Drawer mobile */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay oscuro */}
            <motion.div
              className="fixed inset-0 z-[150] bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Panel del drawer desde la derecha */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[200] w-72 flex flex-col p-6"
              style={{
                background: 'rgba(10, 10, 15, 0.97)',
                backdropFilter: 'blur(16px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Encabezado del drawer */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-lg">
                  <span style={{ color: '#D4AF37' }}>J4</span>
                  <span style={{ color: '#F1F5F9' }}>Tech</span>
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg"
                  style={{ color: '#94A3B8' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links del menú en vertical */}
              <nav className="flex flex-col gap-1 flex-1">
                {NAV_LINKS.map(({ key, href }) => (
                  <button
                    key={key}
                    onClick={() => scrollToSection(href)}
                    className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 hover:bg-white/5"
                    style={{ color: '#94A3B8' }}
                  >
                    {t(key)}
                  </button>
                ))}
              </nav>

              {/* Selector de idioma en mobile */}
              <div className="mt-6">
                <p className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                  Idioma
                </p>
                <LanguageSwitcherMobile />
              </div>

              {/* CTA al fondo del drawer */}
              <div className="mt-6">
                <ButtonPrimary
                  onClick={() => scrollToSection('#contacto')}
                  className="w-full justify-center"
                >
                  {t('nav.cta')}
                </ButtonPrimary>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
