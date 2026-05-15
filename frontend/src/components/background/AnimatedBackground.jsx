/* Fondo animado global con múltiples capas visuales */
import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

/* Datos de hexágonos flotantes decorativos */
const HEXAGONS = [
  { x: '10%', y: '15%', size: 60, duration: 8, delay: 0 },
  { x: '85%', y: '20%', size: 40, duration: 10, delay: 2 },
  { x: '5%', y: '70%', size: 50, duration: 12, delay: 1 },
  { x: '90%', y: '65%', size: 35, duration: 9, delay: 3 },
  { x: '50%', y: '85%', size: 45, duration: 11, delay: 0.5 },
]

/* Hexágono SVG individual con animación de rotación y flotado */
function HexagonShape({ x, y, size, duration, delay }) {
  const points = [
    [size / 2, 0],
    [size, size * 0.25],
    [size, size * 0.75],
    [size / 2, size],
    [0, size * 0.75],
    [0, size * 0.25],
  ].map(([px, py]) => `${px},${py}`).join(' ')

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
          stroke="#00D4FF"
          strokeWidth="1"
          opacity="0.15"
        />
      </svg>
    </motion.div>
  )
}

/* Paths SVG de circuito animados con stroke-dashoffset */
function CircuitLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Línea de circuito esquina superior izquierda */}
      <motion.path
        d="M 0 100 L 80 100 L 80 50 L 200 50"
        fill="none"
        stroke="#00D4FF"
        strokeWidth="1"
        opacity="0.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
      />
      {/* Línea de circuito esquina inferior derecha */}
      <motion.path
        d="M 100% 80% L calc(100% - 80px) 80% L calc(100% - 80px) 90% L calc(100% - 200px) 90%"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1"
        opacity="0.15"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'linear', delay: 1.5 }}
      />
    </svg>
  )
}

/* Esferas de luz difusa (blur orbs) en posiciones fijas */
function BlurOrbs() {
  const orbs = [
    { x: '-10%', y: '10%', color: '#0099CC', size: 400 },
    { x: '70%', y: '-5%', color: '#D4AF37', size: 300, opacity: 0.08 },
    { x: '85%', y: '60%', color: '#003366', size: 500 },
    { x: '-5%', y: '80%', color: '#00D4FF', size: 250, opacity: 0.06 },
  ]

  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            opacity: orb.opacity ?? 0.08,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [(orb.opacity ?? 0.08), (orb.opacity ?? 0.08) * 1.5, (orb.opacity ?? 0.08)],
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
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const particlesRef = useRef([])

  /* Inicializar partículas flotantes */
  const initParticles = useCallback((canvas) => {
    const count = 60
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 2 + Math.random() * 2,
      /* Colores alternando entre cian y dorado */
      color: Math.random() > 0.5 ? '#00D4FF' : '#D4AF37',
      opacity: 0.3 + Math.random() * 0.4,
    }))
  }, [])

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

  /* Configurar canvas al montar el componente */
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

  return (
    /* Contenedor fijo que cubre toda la pantalla en z-index 0 */
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ background: '#0a0a0f' }}
    >
      {/* CAPA 1: Cuadrícula con pulso lento */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.07) 1px, transparent 1px)
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
          background: `radial-gradient(600px circle at var(--cursor-x) var(--cursor-y), rgba(0, 212, 255, 0.05), transparent 60%)`,
          transition: 'background 0.1s ease',
        }}
      />

      {/* CAPA 4: Líneas de circuito SVG animadas */}
      <CircuitLines />

      {/* CAPA 5: Hexágonos flotantes decorativos */}
      {HEXAGONS.map((hex, i) => (
        <HexagonShape key={i} {...hex} />
      ))}

      {/* CAPA 6: Esferas de luz difusa */}
      <BlurOrbs />
    </div>
  )
}
