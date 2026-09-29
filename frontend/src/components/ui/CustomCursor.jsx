/* Cursor circular personalizado para dispositivos de escritorio */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { isLight } = useTheme()

  useEffect(() => {
    /* Solo activar en dispositivos con puntero fino (desktop/laptop) */
    if (window.matchMedia('(pointer: coarse)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
      if (!isVisible) setIsVisible(true)
    }

    /* Detectar hover sobre elementos interactivos */
    const handleHoverStart = (e) => {
      const target = e.target
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, label')
      setIsHovering(!!isInteractive)
    }

    document.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseover', handleHoverStart)
    document.addEventListener('mouseleave', () => setIsVisible(false))
    document.addEventListener('mouseenter', () => setIsVisible(true))

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', handleHoverStart)
    }
  }, [isVisible])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  const cursorColor = isLight ? '#0284C7' : '#00D4FF'
  const hoverBg = isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(0, 212, 255, 0.2)'

  return (
    <motion.div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{ transform: 'translate(-50%, -50%)' }}
      animate={{
        width: isHovering ? 36 : 12,
        height: isHovering ? 36 : 12,
        opacity: isVisible ? 1 : 0,
        mixBlendMode: isLight ? 'normal' : (isHovering ? 'difference' : 'normal'),
      }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <div
        className="w-full h-full rounded-full border-2 transition-colors duration-200"
        style={{
          borderColor: cursorColor,
          background: isHovering ? hoverBg : 'transparent',
        }}
      />
    </motion.div>
  )
}
