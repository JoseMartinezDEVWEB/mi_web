/* Marquee horizontal infinito con conceptos de Tecnología, Marketing Digital, Negocios y Motivación Emprendedora */
import React from 'react'
import { motion } from 'framer-motion'

/* Fila 1: Tecnología, Negocios y Visión Emprendedora */
const FILA_1 = [
  '🚀 Transformación Digital',
  '💡 Mentalidad Emprendedora',
  '🤖 Inteligencia Artificial',
  '📈 Escala tu Negocio',
  '⚡ Automatización Inteligente',
  '🎯 Enfoque & Resultados',
  '🌐 Plataformas Web de Alto Rendimiento',
  '💼 Visión Empresarial',
  '☁️ Cloud & Ciberseguridad',
  '🏆 Éxito & Rentabilidad',
  '📱 Soluciones Móviles',
  '🔥 De la Idea a la Acción',
  '📄 Facturación Electrónica & POS',
  '💎 Creación de Valor',
  '🚀 Liderazgo Estratégico',
  '⚙️ Eficiencia Operacional',
]

/* Fila 2: Marketing Digital, Crecimiento y Motivación para Emprendedores */
const FILA_2 = [
  '🎯 Marketing Digital 360°',
  '🌟 Pasión por Crecer',
  '🔍 Posicionamiento SEO',
  '📊 Conversión & Alto ROI',
  '💡 Disrupción e Innovación',
  '🛒 E-commerce & Ventas 24/7',
  '🤝 Generación de Clientes Potenciales',
  '🚀 Growth Marketing',
  '💪 Resiliencia & Disciplina',
  '📈 Analítica de Negocio',
  '👑 Marcas que Inspiran',
  '🌟 Excelencia & Calidad',
  '📲 Redes Sociales de Alto Impacto',
  '💰 Crecimiento Sostenible',
  '🧭 Estrategia Comercial',
  '✨ Nunca Dejes de Emprender',
]

/* Duplicar arrays para lograr efecto seamless infinito */
const FILA_1_DOUBLED = [...FILA_1, ...FILA_1]
const FILA_2_DOUBLED = [...FILA_2, ...FILA_2]

/* Componente de badge con estilo temático adaptable para modo claro y oscuro */
function ConceptBadge({ texto, colorPunto = '#D4AF37' }) {
  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      {/* Badge pill del concepto */}
      <span className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap bg-cyan-500/10 dark:bg-cyan-500/10 border border-cyan-500/30 dark:border-cyan-500/20 text-slate-800 dark:text-slate-200 shadow-sm transition-all hover:scale-105 hover:border-cyan-400">
        {texto}
      </span>

      {/* Punto decorativo separador dorado */}
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm"
        style={{ background: colorPunto }}
      />
    </div>
  )
}

export default function TechTicker() {
  return (
    <section className="relative z-10 py-14 sm:py-16 overflow-hidden border-t border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-50/40 dark:bg-transparent transition-colors">
      {/* Degradados laterales adaptables para efecto suave en bordes (tema claro y oscuro) */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 z-10 pointer-events-none bg-gradient-to-r from-slate-50 dark:from-[#0a0a0f] to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 z-10 pointer-events-none bg-gradient-to-l from-slate-50 dark:from-[#0a0a0f] to-transparent" />

      {/* Fila 1: movimiento hacia la izquierda (dirección continua) */}
      <div className="mb-4 sm:mb-5 overflow-hidden">
        <motion.div
          className="flex gap-4"
          style={{ width: 'max-content' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {FILA_1_DOUBLED.map((concepto, index) => (
            <ConceptBadge key={`fila1-${index}`} texto={concepto} colorPunto="#D4AF37" />
          ))}
        </motion.div>
      </div>

      {/* Fila 2: movimiento en reversa hacia la derecha (dirección opuesta) */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-4"
          style={{ width: 'max-content' }}
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            duration: 36,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {FILA_2_DOUBLED.map((concepto, index) => (
            <ConceptBadge key={`fila2-${index}`} texto={concepto} colorPunto="#00D4FF" />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
