/* Sección de portafolio con grid 3x2 y animación por stagger */
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../../hooks/useScrollAnimation.js'
import PortfolioCard from '../ui/PortfolioCard.jsx'

export default function Portfolio() {
  const { t } = useTranslation(['portfolio', 'common'])

  /* Obtener proyectos desde las traducciones */
  const projects = t('portfolio:projects', { returnObjects: true }) || []

  return (
    <section id="portafolio" className="relative z-10 py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Encabezado centrado */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Etiqueta de sección */}
          <motion.span
            variants={fadeInUp}
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{
              background: 'rgba(0, 212, 255, 0.1)',
              color: '#00D4FF',
              border: '1px solid rgba(0, 212, 255, 0.2)',
            }}
          >
            {t('portfolio:label')}
          </motion.span>

          {/* Título principal */}
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: '#F1F5F9' }}
          >
            {t('portfolio:title')}
          </motion.h2>

          {/* Subtítulo */}
          <motion.p
            variants={fadeInUp}
            className="text-base max-w-2xl mx-auto"
            style={{ color: '#94A3B8' }}
          >
            {t('portfolio:subtitle')}
          </motion.p>
        </motion.div>

        {/* Grid de proyectos con stagger */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {Array.isArray(projects) && projects.map((project, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
            >
              <PortfolioCard project={project} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
