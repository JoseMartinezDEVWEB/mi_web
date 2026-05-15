/* Página dedicada al catálogo de servicios */
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import ServicesSection from '../components/sections/Services/ServicesSection.jsx'
import ContactSection from '../components/sections/Contact/ContactSection.jsx'

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Servicios — J4TechnologyIsNow</title>
        <meta name="description" content="Explora nuestro catálogo de servicios con demos en vivo. Sistemas empresariales, e-commerce, apps móviles y más." />
      </Helmet>

      <Navbar />

      <main className="relative z-10 pt-16">
        <ServicesSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  )
}
