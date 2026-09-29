/* Componente de badge/etiqueta con variantes adaptadas a Tema Claro y Oscuro */
import { useTheme } from '../../context/ThemeContext'

const VARIANT_STYLES_DARK = {
  green: {
    background: 'rgba(34, 197, 94, 0.15)',
    border: '1px solid rgba(34, 197, 94, 0.4)',
    color: '#4ade80',
  },
  yellow: {
    background: 'rgba(234, 179, 8, 0.15)',
    border: '1px solid rgba(234, 179, 8, 0.4)',
    color: '#fbbf24',
  },
  blue: {
    background: 'rgba(0, 212, 255, 0.15)',
    border: '1px solid rgba(0, 212, 255, 0.4)',
    color: '#00D4FF',
  },
  gray: {
    background: 'rgba(148, 163, 184, 0.15)',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    color: '#94A3B8',
  },
}

const VARIANT_STYLES_LIGHT = {
  green: {
    background: 'rgba(22, 163, 74, 0.12)',
    border: '1px solid rgba(22, 163, 74, 0.35)',
    color: '#15803d', // Verde oscuro de alto contraste
  },
  yellow: {
    background: 'rgba(217, 119, 6, 0.12)',
    border: '1px solid rgba(217, 119, 6, 0.35)',
    color: '#b45309', // Ámbar oscuro legible
  },
  blue: {
    background: 'rgba(2, 132, 199, 0.12)',
    border: '1px solid rgba(2, 132, 199, 0.35)',
    color: '#0369a1', // Azul profundo
  },
  gray: {
    background: 'rgba(100, 116, 139, 0.12)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    color: '#334155', // Slate oscuro
  },
}

const STATUS_VARIANT = {
  demoAvailable: 'green',
  beta: 'yellow',
  new: 'blue',
  comingSoon: 'gray',
}

export default function Badge({ children, variant = 'blue', status = null }) {
  const { isLight } = useTheme()
  const resolvedVariant = status ? (STATUS_VARIANT[status] ?? 'gray') : variant
  const stylesMap = isLight ? VARIANT_STYLES_LIGHT : VARIANT_STYLES_DARK
  const styles = stylesMap[resolvedVariant] ?? stylesMap.blue

  return (
    <span
      className="inline-block text-[11px] font-bold uppercase tracking-wider rounded-full"
      style={{ padding: '2px 10px', ...styles }}
    >
      {children}
    </span>
  )
}
