/* Hook para variantes de animación de entrada con Framer Motion */

/* Variante fadeInUp: entra desde abajo al hacer scroll */
export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

/* Variante para contenedores con stagger entre hijos */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

/* Variante fadeInLeft: entra desde la izquierda */
export const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

/* Variante fadeInRight: entra desde la derecha */
export const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

/* Variante scaleIn: zoom desde el centro */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

/* Props comunes para whileInView */
export const viewportProps = {
  once: true,
  margin: '-100px',
}
