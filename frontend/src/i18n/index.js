/* Configuración principal del sistema de internacionalización i18next */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

/* Importar traducciones en español */
import esCommon from './locales/es/common.json';
import esHero from './locales/es/hero.json';
import esServices from './locales/es/services.json';
import esAbout from './locales/es/about.json';
import esPortfolio from './locales/es/portfolio.json';
import esTestimonials from './locales/es/testimonials.json';
import esBlog from './locales/es/blog.json';
import esContact from './locales/es/contact.json';

/* Importar traducciones en inglés */
import enCommon from './locales/en/common.json';
import enHero from './locales/en/hero.json';
import enServices from './locales/en/services.json';
import enAbout from './locales/en/about.json';
import enPortfolio from './locales/en/portfolio.json';
import enTestimonials from './locales/en/testimonials.json';
import enBlog from './locales/en/blog.json';
import enContact from './locales/en/contact.json';

/* Importar traducciones en francés */
import frCommon from './locales/fr/common.json';
import frHero from './locales/fr/hero.json';
import frServices from './locales/fr/services.json';
import frAbout from './locales/fr/about.json';
import frPortfolio from './locales/fr/portfolio.json';
import frTestimonials from './locales/fr/testimonials.json';
import frBlog from './locales/fr/blog.json';
import frContact from './locales/fr/contact.json';

/* Importar traducciones en portugués */
import ptCommon from './locales/pt/common.json';
import ptHero from './locales/pt/hero.json';
import ptServices from './locales/pt/services.json';
import ptAbout from './locales/pt/about.json';
import ptPortfolio from './locales/pt/portfolio.json';
import ptTestimonials from './locales/pt/testimonials.json';
import ptBlog from './locales/pt/blog.json';
import ptContact from './locales/pt/contact.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { common: esCommon, hero: esHero, services: esServices, about: esAbout, portfolio: esPortfolio, testimonials: esTestimonials, blog: esBlog, contact: esContact },
      en: { common: enCommon, hero: enHero, services: enServices, about: enAbout, portfolio: enPortfolio, testimonials: enTestimonials, blog: enBlog, contact: enContact },
      fr: { common: frCommon, hero: frHero, services: frServices, about: frAbout, portfolio: frPortfolio, testimonials: frTestimonials, blog: frBlog, contact: frContact },
      pt: { common: ptCommon, hero: ptHero, services: ptServices, about: ptAbout, portfolio: ptPortfolio, testimonials: ptTestimonials, blog: ptBlog, contact: ptContact },
    },
    /* Detección de idioma: localStorage primero, luego navegador */
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'j4_lang',
      caches: ['localStorage'],
    },
    fallbackLng: 'es',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
