/* Marquee horizontal infinito de tecnologías con dos filas en direcciones opuestas */
import { motion } from 'framer-motion'

/* Lista de tecnologías a mostrar en el ticker */
const TECHNOLOGIES = [
  'React',
  'Node.js',
  'PostgreSQL',
  'MongoDB',
  'React Native',
  'Next.js',
  'TypeScript',
  'Docker',
  'AWS',
  'TailwindCSS',
  'Prisma',
  'GraphQL',
  'Redis',
  'Stripe',
  'Twilio',
  'Firebase',
  'Python',
  'Django',
]

/* Duplicar el array para lograr efecto seamless infinito */
const TECH_DOUBLED = [...TECHNOLOGIES, ...TECHNOLOGIES]

/* Componente de badge para cada tecnología */
function TechBadge({ tech }) {
  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      {/* Badge pill de la tecnología */}
      <span
        className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
        style={{
          background: 'rgba(0, 212, 255, 0.05)',
          border: '1px solid rgba(0, 212, 255, 0.15)',
          color: '#94A3B8',
        }}
      >
        {tech}
      </span>

      {/* Punto decorativo separador en dorado */}
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: '#D4AF37' }}
      />
    </div>
  )
}

export default function TechTicker() {
  return (
    <section
      className="relative z-10 py-16 overflow-hidden"
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Degradados laterales para efecto de desvanecimiento en los bordes */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #0a0a0f, transparent)',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, #0a0a0f, transparent)',
        }}
      />

      {/* Fila 1: movimiento hacia la izquierda (dirección normal) */}
      <div className="mb-6 overflow-hidden">
        <motion.div
          className="flex gap-4"
          style={{ width: 'max-content' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {TECH_DOUBLED.map((tech, index) => (
            <TechBadge key={`fila1-${index}`} tech={tech} />
          ))}
        </motion.div>
      </div>

      {/* Fila 2: movimiento en reversa (dirección opuesta) */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-4"
          style={{ width: 'max-content' }}
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {TECH_DOUBLED.map((tech, index) => (
            <TechBadge key={`fila2-${index}`} tech={tech} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
