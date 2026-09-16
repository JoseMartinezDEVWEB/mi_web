/* Script de seed para poblar la base de datos con los 8 servicios del catálogo */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SERVICES = [
  {
    serviceKey: 'inventory',
    name: 'Sistema de Inventario',
    category: 'management',
    description: 'Gestiona productos, almacenes y alertas de stock en tiempo real con reportes automatizados.',
    features: ['Control de stock en tiempo real', 'Alertas automáticas de reposición', 'Reportes y análisis', 'Múltiples almacenes', 'Exportación CSV/Excel', 'Dashboard interactivo'],
    status: 'active',
    demoAvailable: true,
    startingPrice: 45000,
  },
  {
    serviceKey: 'billing',
    name: 'Facturación Electrónica',
    category: 'management',
    description: 'Sistema de facturación con NCF, ITBIS automático y cumplimiento con la DGII de República Dominicana.',
    features: ['Generación de NCF', 'Cálculo ITBIS 18%', 'Multi-cliente', 'Wizard de 3 pasos', 'Impresión de facturas', 'Historial completo'],
    status: 'active',
    demoAvailable: true,
    startingPrice: 35000,
  },
  {
    serviceKey: 'ecommerce',
    name: 'E-commerce',
    category: 'digital',
    description: 'Tienda en línea completa con carrito de compras, pagos integrados y panel de administración.',
    features: ['Catálogo de productos', 'Carrito de compras', 'Pasarela de pagos', 'Panel de admin', 'Gestión de pedidos', 'SEO optimizado'],
    status: 'active',
    demoAvailable: true,
    startingPrice: 80000,
  },
  {
    serviceKey: 'chatbot',
    name: 'Agente IA / Chatbot',
    category: 'ai',
    description: 'Chatbot inteligente powered by Claude AI que atiende clientes, agenda citas y califica prospectos 24/7.',
    features: ['Respuestas en tiempo real', 'Multiidioma', 'Agenda citas automáticamente', 'Integración WhatsApp', 'Historial de conversaciones', 'Panel de control'],
    status: 'beta',
    demoAvailable: true,
    startingPrice: 60000,
  },
  {
    serviceKey: 'webdev',
    name: 'Desarrollo Web',
    category: 'digital',
    description: 'Sitios web y aplicaciones web personalizadas con diseño moderno, responsive y orientadas a conversión.',
    features: ['Diseño responsive', 'SEO on-page', 'Optimización de velocidad', 'CMS integrado', 'Formularios de contacto', 'Analytics integrado'],
    status: 'active',
    demoAvailable: true,
    startingPrice: 25000,
  },
  {
    serviceKey: 'mobileapp',
    name: 'App Móvil',
    category: 'digital',
    description: 'Aplicaciones móviles nativas y multiplataforma para iOS y Android con experiencia de usuario excepcional.',
    features: ['iOS y Android', 'UI/UX personalizado', 'Notificaciones push', 'Modo offline', 'Integración de APIs', 'Publicación en tiendas'],
    status: 'active',
    demoAvailable: true,
    startingPrice: 120000,
  },
  {
    serviceKey: 'reservations',
    name: 'Sistema de Reservas',
    category: 'management',
    description: 'Plataforma de reservas y citas online con calendario sincronizado y confirmaciones automáticas.',
    features: ['Calendario interactivo', 'Confirmaciones automáticas', 'Integración de pagos', 'Panel de gestión', 'Recordatorios SMS/Email', 'Multiusuario'],
    status: 'coming_soon',
    demoAvailable: false,
    startingPrice: 50000,
  },
  {
    serviceKey: 'analytics',
    name: 'Analytics & BI',
    category: 'ai',
    description: 'Dashboard de Business Intelligence con datos en tiempo real para tomar mejores decisiones de negocio.',
    features: ['Dashboards interactivos', 'KPIs en tiempo real', 'Reportes automatizados', 'Integración multi-fuente', 'Exportación de datos', 'Alertas inteligentes'],
    status: 'coming_soon',
    demoAvailable: false,
    startingPrice: 90000,
  },
]

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  /* Crear servicios del catálogo */
  for (const svc of SERVICES) {
    await prisma.service.upsert({
      where: { serviceKey: svc.serviceKey },
      update: svc,
      create: svc,
    })
    console.log(`✅ Servicio creado/actualizado: ${svc.name}`)
  }

  /* Crear usuario administrador por defecto */
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.adminUser.upsert({
    where: { email: 'admin@j4technologyisnow.com' },
    update: {},
    create: {
      email: 'admin@j4technologyisnow.com',
      password: adminPassword,
      name: 'Administrador J4',
    },
  })
  console.log('✅ Usuario administrador creado: admin@j4technologyisnow.com / admin123')
  console.log('⚠️  Cambia la contraseña del admin en producción')
  console.log('🎉 Seed completado exitosamente')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
