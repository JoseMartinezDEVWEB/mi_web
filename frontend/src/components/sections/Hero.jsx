/* Sección hero principal con animaciones de texto y estadísticas */
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import ButtonPrimary from '../ui/ButtonPrimary.jsx'
import ButtonSecondary from '../ui/ButtonSecondary.jsx'
import StatCard from '../ui/StatCard.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { fadeInUp, staggerContainer, viewportProps } from '../../hooks/useScrollAnimation.js'

/* Hook de efecto máquina de escribir */
function useTypewriter(strings = [], speed = 50) {
  const [displayText, setDisplayText] = useState('')
  const [stringIndex, setStringIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!strings.length) return
    const current = strings[stringIndex]

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setDisplayText(current.slice(0, charIndex + 1))
          setCharIndex((c) => c + 1)
        } else {
          /* Pausa al completar la cadena antes de borrar */
          setTimeout(() => setDeleting(true), 2000)
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(current.slice(0, charIndex - 1))
          setCharIndex((c) => c - 1)
        } else {
          setDeleting(false)
          setStringIndex((i) => (i + 1) % strings.length)
        }
      }
    }, deleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, stringIndex, strings, speed])

  return displayText
}

/* Estadísticas del hero */
const STATS = [
  { value: 50, suffix: '+', key: 'hero:stats.projects' },
  { value: 30, suffix: '+', key: 'hero:stats.clients' },
  { value: 5, suffix: '', key: 'hero:stats.experience' },
  { value: 98, suffix: '%', key: 'hero:stats.satisfaction' },
]

export default function Hero() {
  const { t } = useTranslation(['hero', 'common'])
  const { isLight } = useTheme()
  const typewriterStrings = t('hero:typewriter', { returnObjects: true }) ?? []
  const typewriterText = useTypewriter(
    Array.isArray(typewriterStrings) ? typewriterStrings : [typewriterStrings]
  )

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  /* Headline letra por letra con stagger */
  const headline1 = t('hero:headline1')
  const headline2 = t('hero:headline2')

  const badgeColor = isLight ? '#0284C7' : '#00D4FF'
  const badgeBg = isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(0, 212, 255, 0.05)'
  const badgeBorder = isLight ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid rgba(0, 212, 255, 0.3)'
  const headlineColor = isLight ? '#0F172A' : '#F1F5F9'
  const goldGradient = isLight
    ? 'linear-gradient(135deg, #B45309, #D97706)'
    : 'linear-gradient(135deg, #D4AF37, #F5C842)'
  const typewriterColor = isLight ? '#0284C7' : '#00D4FF'
  const descColor = isLight ? '#334155' : '#94A3B8'

  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16"
    >
      <Helmet>
        <title>J4TechnologyIsNow - Transformación Digital</title>
      </Helmet>

      <motion.div
        className="max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Etiqueta superior decorativa */}
        <motion.div variants={fadeInUp} className="mb-6">
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full"
            style={{
              border: badgeBorder,
              color: badgeColor,
              background: badgeBg,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: badgeColor }} />
            República Dominicana 🇩🇴
          </span>
        </motion.div>

        {/* Headline principal con animación letra por letra */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl font-black leading-tight mb-4"
          style={{ color: headlineColor }}
        >
          {headline1}
          <br />
          {/* Segunda línea en dorado con gradiente */}
          <span
            className="inline-block"
            style={{
              backgroundImage: goldGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {headline2}
          </span>
        </motion.h1>

        {/* Subtítulo con efecto máquina de escribir */}
        <motion.div
          variants={fadeInUp}
          className="text-xl md:text-2xl font-bold mb-6 h-8 flex items-center justify-center gap-1"
          style={{ color: typewriterColor }}
        >
          <span>{typewriterText}</span>
          {/* Cursor parpadeante */}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-0.5 h-6 ml-0.5"
            style={{ background: typewriterColor }}
          />
        </motion.div>

        {/* Descripción de la empresa */}
        <motion.p
          variants={fadeInUp}
          className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto font-medium"
          style={{ color: descColor }}
        >
          {t('hero:description')}
        </motion.p>

        {/* Botones CTA */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          <ButtonPrimary onClick={() => scrollTo('contacto')} className="text-base px-8 py-3.5">
            {t('common:buttons.startNow')}
          </ButtonPrimary>
          <ButtonSecondary onClick={() => scrollTo('servicios')} className="text-base px-8 py-3.5">
            {t('common:buttons.viewServices')}
          </ButtonSecondary>
        </motion.div>

        {/* Logo central 3D interactivo con tilt */}
        <motion.div
          variants={fadeInUp}
          className="relative inline-block mb-16"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            className="w-40 h-40 sm:w-44 sm:h-44 rounded-3xl flex items-center justify-center mx-auto overflow-hidden p-1"
            style={{
              background: isLight
                ? 'linear-gradient(135deg, rgba(180, 83, 9, 0.15), rgba(2, 132, 199, 0.1))'
                : 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(0, 212, 255, 0.15))',
              border: isLight
                ? '2px solid rgba(180, 83, 9, 0.3)'
                : '2px solid rgba(212, 175, 55, 0.4)',
              boxShadow: isLight
                ? '0 10px 30px rgba(180, 83, 9, 0.15), 0 0 20px rgba(2, 132, 199, 0.1)'
                : '0 0 50px rgba(212, 175, 55, 0.35), 0 0 90px rgba(0, 212, 255, 0.2)',
            }}
            animate={{
              rotateY: [0, 6, 0, -6, 0],
              rotateX: [0, 4, 0, -4, 0],
              y: [0, -6, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src="/j4-gold-logo.png"
              alt="J4 Technology"
              className="w-full h-full object-cover rounded-2xl select-none pointer-events-none"
            />
          </motion.div>

          {/* Elementos decorativos orbitando */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full pointer-events-none"
              style={{
                background: i % 2 === 0 ? (isLight ? '#B45309' : '#D4AF37') : (isLight ? '#0284C7' : '#00D4FF'),
                top: `${[15, 75, 35][i]}%`,
                left: `${[5, 90, 95][i]}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            />
          ))}
        </motion.div>

        {/* Estadísticas en fila */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportProps}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map(({ value, suffix, key }) => {
            const [ns, tKey] = key.split(':')
            return (
              <motion.div key={key} variants={fadeInUp}>
                <StatCard
                  value={value}
                  suffix={suffix}
                  label={t(`${ns}:${tKey}`)}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Indicador de scroll hacia abajo */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <motion.div
            className="w-1 h-2 rounded-full"
            style={{ background: '#00D4FF' }}
            animate={{ opacity: [1, 0, 1], y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
