/* Hook que rastrea la sección activa en el viewport */
import { useState, useEffect } from 'react'

export default function useActiveSection(sectionIds = []) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    if (!sectionIds.length) return

    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
      )

      observer.observe(el)
      return observer
    }).filter(Boolean)

    return () => observers.forEach((obs) => obs.disconnect())
  }, [sectionIds.join(',')])

  return activeSection
}
