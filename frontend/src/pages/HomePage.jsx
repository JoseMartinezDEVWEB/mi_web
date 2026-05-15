/* Página principal — landing page completa con todas las secciones */
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Hero from '../components/sections/Hero.jsx'
import ServicesSection from '../components/sections/Services/ServicesSection.jsx'
import About from '../components/sections/About.jsx'
import Portfolio from '../components/sections/Portfolio.jsx'
import TechTicker from '../components/sections/TechTicker.jsx'
import Testimonials from '../components/sections/Testimonials.jsx'
import Blog from '../components/sections/Blog.jsx'
import ContactSection from '../components/sections/Contact/ContactSection.jsx'

export default function HomePage() {
  const { t } = useTranslation('common')

  return (
    <>
      <Helmet>
        <title>J4TechnologyIsNow — Transformación Digital en República Dominicana</title>
        <meta name="description" content="Desarrollamos sistemas empresariales, apps móviles, e-commerce y soluciones de IA para empresas dominicanas y latinoamericanas." />
      </Helmet>

      {/* Navbar fijo en la parte superior */}
      <Navbar />

      {/* Contenido principal — todo sobre el fondo animado */}
      <main className="relative z-10">
        <Hero />
        <ServicesSection />
        <About />
        <Portfolio />
        <TechTicker />
        <Testimonials />
        <Blog />
        <ContactSection />
      </main>

      <Footer />
    </>
  )
}
