/* Fondo animado global con soporte dinámico para Tema Claro y Oscuro */
import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

/* Datos de hexágonos flotantes decorativos */
const HEXAGONS = [
  { x: '10%', y: '15%', size: 60, duration: 8, delay: 0 },
  { x: '85%', y: '20%', size: 40, duration: 10, delay: 2 },
  { x: '5%', y: '70%', size: 50, duration: 12, delay: 1 },
  { x: '90%', y: '65%', size: 35, duration: 9, delay: 3 },
  { x: '50%', y: '85%', size: 45, duration: 11, delay: 0.5 },
]

/* Hexágono SVG individual con animación de rotación y flotado */
function HexagonShape({ x, y, size, duration, delay, isLight }) {
  const points = [
    [size / 2, 0],
    [size, size * 0.25],
    [size, size * 0.75],
    [size / 2, size],
    [0, size * 0.75],
    [0, size * 0.25],
  ].map(([px, py]) => `${px},${py}`).join(' ')

  const strokeColor = isLight ? '#0284C7' : '#00D4FF'
  const strokeOpacity = isLight ? '0.3' : '0.15'

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 360],
      }}
      transition={{
        y: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        rotate: { duration: duration * 3, repeat: Infinity, ease: 'linear', delay },
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth={isLight ? '1.5' : '1'}
          opacity={strokeOpacity}
        />
      </svg>
    </motion.div>
  )
}

/* Paths SVG de circuito animados con stroke-dashoffset */
function CircuitLines({ isLight }) {
  const strokePrimary = isLight ? '#0284C7' : '#00D4FF'
  const strokeGold = isLight ? '#D97706' : '#D4AF37'
  const opacity = isLight ? '0.35' : '0.2'

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Línea de circuito esquina superior izquierda */}
      <motion.path
        d="M 0 100 L 80 100 L 80 50 L 200 50"
        fill="none"
        stroke={strokePrimary}
        strokeWidth={isLight ? '1.5' : '1'}
        opacity={opacity}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
      />
      {/* Línea de circuito esquina inferior derecha */}
      <motion.path
        d="M 100% 80% L calc(100% - 80px) 80% L calc(100% - 80px) 90% L calc(100% - 200px) 90%"
        fill="none"
        stroke={strokeGold}
        strokeWidth={isLight ? '1.5' : '1'}
        opacity={opacity}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'linear', delay: 1.5 }}
      />
    </svg>
  )
}

/* Esferas de luz difusa (blur orbs) con paleta reactiva al tema */
function BlurOrbs({ isLight }) {
  const orbsDark = [
    { x: '-10%', y: '10%', color: '#0099CC', size: 400, opacity: 0.08 },
    { x: '70%', y: '-5%', color: '#D4AF37', size: 300, opacity: 0.08 },
    { x: '85%', y: '60%', color: '#003366', size: 500, opacity: 0.08 },
    { x: '-5%', y: '80%', color: '#00D4FF', size: 250, opacity: 0.06 },
  ]

  const orbsLight = [
    { x: '-5%', y: '5%', color: '#BAE6FD', size: 450, opacity: 0.45 },
    { x: '65%', y: '-10%', color: '#FEF08A', size: 380, opacity: 0.35 },
    { x: '80%', y: '55%', color: '#A7F3D0', size: 520, opacity: 0.4 },
    { x: '-8%', y: '75%', color: '#E0E7FF', size: 320, opacity: 0.35 },
  ]

  const orbs = isLight ? orbsLight : orbsDark

  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={`${isLight ? 'light' : 'dark'}-${i}`}
          className="absolute rounded-full blur-3xl pointer-events-none transition-colors duration-500"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            opacity: orb.opacity,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [orb.opacity, orb.opacity * 1.4, orb.opacity],
          }}
          transition={{
            duration: 4 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        />
      ))}
    </>
  )
}

export default function AnimatedBackground() {
  const { isLight } = useTheme()
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const particlesRef = useRef([])

  /* Inicializar partículas flotantes con colores acordes al tema */
  const initParticles = useCallback((canvas) => {
    const count = 60
    particlesRef.current = Array.from({ length: count }, () => {
      let color
      if (isLight) {
        const rand = Math.random()
        color = rand > 0.6 ? '#0284C7' : rand > 0.3 ? '#D97706' : '#0D9488'
      } else {
        color = Math.random() > 0.5 ? '#00D4FF' : '#D4AF37'
      }

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 2 + Math.random() * 2.5,
        color,
        opacity: isLight ? 0.35 + Math.random() * 0.35 : 0.3 + Math.random() * 0.4,
      }
    })
  }, [isLight])

  /* Bucle de animación de partículas con canvas */
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particlesRef.current.forEach((p) => {
      /* Mover partícula */
      p.x += p.vx
      p.y += p.vy

      /* Rebotar en los bordes del canvas */
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      /* Dibujar partícula */
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.opacity
      ctx.fill()
      ctx.globalAlpha = 1
    })

    animFrameRef.current = requestAnimationFrame(animateParticles)
  }, [])

  /* Configurar canvas al montar el componente o cambiar de tema */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas)
    }

    resize()
    window.addEventListener('resize', resize)
    animateParticles()

    return () => {
      window.removeEventListener('resize', resize)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [initParticles, animateParticles])

  /* Actualizar gradiente radial del cursor al mover el mouse */
  const handleMouseMove = useCallback((e) => {
    document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`)
    document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`)
  }, [])

  const bgBase = isLight
    ? 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 50%, #F1F5F9 100%)'
    : '#0a0a0f'

  const gridLineColor = isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(0, 212, 255, 0.07)'
  const cursorGlowColor = isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(0, 212, 255, 0.05)'

  return (
    /* Contenedor fijo que cubre toda la pantalla en z-index 0 */
    <div
      className="fixed inset-0 z-0 overflow-hidden transition-colors duration-500"
      onMouseMove={handleMouseMove}
      style={{ background: bgBase }}
    >
      {/* CAPA 1: Cuadrícula tecnológica con pulso suave */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${gridLineColor} 1px, transparent 1px),
            linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridPulse 4s ease-in-out infinite',
        }}
      />

      {/* CAPA 2: Partículas flotantes animadas con canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* CAPA 3: Gradiente radial que sigue el cursor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--cursor-x) var(--cursor-y), ${cursorGlowColor}, transparent 60%)`,
          transition: 'background 0.1s ease',
        }}
      />

      {/* CAPA 4: Líneas de circuito SVG animadas */}
      <CircuitLines isLight={isLight} />

      {/* CAPA 5: Hexágonos flotantes decorativos */}
      {HEXAGONS.map((hex, i) => (
        <HexagonShape key={i} {...hex} isLight={isLight} />
      ))}

      {/* CAPA 6: Esferas de luz difusa acordes al tema */}
      <BlurOrbs isLight={isLight} />
    </div>
  )
}
