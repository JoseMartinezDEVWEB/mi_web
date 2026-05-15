/* Carrusel de testimonios con autoplay, navegación por flechas y dots indicadores */
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fadeInUp, staggerContainer, viewportProps } from '../../hooks/useScrollAnimation.js'
import TestimonialCard from '../ui/TestimonialCard.jsx'

/* Intervalo de autoplay en milisegundos */
const AUTOPLAY_INTERVAL = 5000

/* Número de cards visibles por slide en desktop */
const CARDS_PER_SLIDE = 3

export default function Testimonials() {
  const { t } = useTranslation(['testimonials', 'common'])

  /* Obtener testimonios desde las traducciones */
  const testimonials = t('testimonials:testimonials', { returnObjects: true }) || []

  /* Índice del slide activo */
  const [activeIndex, setActiveIndex] = useState(0)

  /* Estado para pausar el autoplay al hacer hover */
  const [isPaused, setIsPaused] = useState(false)

  /* Dirección de la transición para determinar la animación de entrada/salida */
  const [direction, setDirection] = useState(1)

  /* Calcular total de slides según items disponibles */
  const totalSlides = Array.isArray(testimonials)
    ? Math.ceil(testimonials.length / CARDS_PER_SLIDE)
    : 0

  /* Ir al slide siguiente */
  const goNext = useCallback(() => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  /* Ir al slide anterior */
  const goPrev = useCallback(() => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  /* Ir a un slide específico desde los dots */
  const goTo = (index) => {
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  /* Autoplay: avanza automáticamente cada AUTOPLAY_INTERVAL ms si no está pausado */
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return
    const timer = setInterval(goNext, AUTOPLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [isPaused, goNext, totalSlides])

  /* Obtener los testimonios del slide activo */
  const currentTestimonials = Array.isArray(testimonials)
    ? testimonials.slice(
        activeIndex * CARDS_PER_SLIDE,
        activeIndex * CARDS_PER_SLIDE + CARDS_PER_SLIDE
      )
    : []

  /* Variantes de animación para la transición entre slides */
  const slideVariants = {
    initial: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  }

  return (
    <section className="relative z-10 py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Encabezado centrado con etiqueta y título */}
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportProps}
        >
          {/* Etiqueta de sección */}
          <motion.span
            variants={fadeInUp}
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              color: '#D4AF37',
              border: '1px solid rgba(212, 175, 55, 0.25)',
            }}
          >
            {t('testimonials:label')}
          </motion.span>

          {/* Título principal */}
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-extrabold"
            style={{ color: '#F1F5F9' }}
          >
            {t('testimonials:title')}
          </motion.h2>
        </motion.div>

        {/* Área del slider con control de pausa en hover */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Contenedor con overflow oculto para la transición */}
          <div className="overflow-hidden relative min-h-[220px]">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {currentTestimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={`${activeIndex}-${index}`}
                    testimonial={testimonial}
                    index={activeIndex * CARDS_PER_SLIDE + index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controles de navegación: flechas y dots */}
          <div className="flex items-center justify-center gap-6 mt-10">
            {/* Botón flecha izquierda */}
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)'
                e.currentTarget.style.color = '#D4AF37'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.color = '#94A3B8'
              }}
              aria-label={t('common:buttons.previous')}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots indicadores de slide */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: index === activeIndex ? '24px' : '8px',
                    height: '8px',
                    background:
                      index === activeIndex
                        ? '#D4AF37'
                        : 'rgba(255, 255, 255, 0.2)',
                  }}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Botón flecha derecha */}
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)'
                e.currentTarget.style.color = '#D4AF37'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.color = '#94A3B8'
              }}
              aria-label={t('common:buttons.next')}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
