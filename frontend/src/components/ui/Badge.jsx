/* Componente de badge/etiqueta con variantes de color */
const VARIANT_STYLES = {
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

/* Mapeo de estado de servicio a variante de color */
const STATUS_VARIANT = {
  'demoAvailable': 'green',
  'beta': 'yellow',
  'new': 'blue',
  'comingSoon': 'gray',
}

export default function Badge({ children, variant = 'blue', status = null }) {
  const resolvedVariant = status ? (STATUS_VARIANT[status] ?? 'gray') : variant
  const styles = VARIANT_STYLES[resolvedVariant] ?? VARIANT_STYLES.blue

  return (
    <span
      className="inline-block text-[11px] font-semibold uppercase tracking-wider rounded-full"
      style={{ padding: '2px 10px', ...styles }}
    >
      {children}
    </span>
  )
}
