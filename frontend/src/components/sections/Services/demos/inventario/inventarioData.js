// Catálogo inicial de productos para el conteo de inventario (con códigos de barra dominicanos reales)
export const CATALOGO_PRODUCTOS_DEMO = [
  { id: 1, codigo: '7460123456789', nombre: 'Arroz Selecto Campos 10 lb', categoria: 'Granos y Cereales', costo: 420.00, unidad: 'Fardo' },
  { id: 2, codigo: '7460987654321', nombre: 'Aceite Vegetal Crisol 64 oz', categoria: 'Aceites y Grasas', costo: 310.00, unidad: 'Unidad' },
  { id: 3, codigo: '7461122334455', nombre: 'Leche Rica Entera UHT 1 Litro', categoria: 'Lácteos', costo: 95.00, unidad: 'Caja 12u' },
  { id: 4, codigo: '7462233445566', nombre: 'Café Santo Domingo Molido 1 lb', categoria: 'Bebidas Calientes', costo: 340.00, unidad: 'Paquete' },
  { id: 5, codigo: '7463344556677', nombre: 'Habichuelas Rojas Goya 15 oz', categoria: 'Enlatados', costo: 68.00, unidad: 'Lata' },
  { id: 6, codigo: '7464455667788', nombre: 'Harina de Trigo Blanquita 5 lb', categoria: 'Harinas y Masas', costo: 195.00, unidad: 'Fardo' },
  { id: 7, codigo: '7465566778899', nombre: 'Espaguetis Milano 400g', categoria: 'Pastas', costo: 45.00, unidad: 'Fardo 20u' },
  { id: 8, codigo: '7466677889900', nombre: 'Salami Induveca Especial 2 lb', categoria: 'Embutidos', costo: 275.00, unidad: 'Unidad' },
  { id: 9, codigo: '7467788990011', nombre: 'Queso Gouda Geo Holandés lb', categoria: 'Lácteos y Quesos', costo: 390.00, unidad: 'Libra' },
  { id: 10, codigo: '7468899001122', nombre: 'Refresco Coca-Cola 2 Litros', categoria: 'Bebidas Frías', costo: 110.00, unidad: 'Fardo 8u' },
  { id: 11, codigo: '7469900112233', nombre: 'Agua Planeta Azul Botellón 5 Gal', categoria: 'Bebidas', costo: 90.00, unidad: 'Botellón' },
  { id: 12, codigo: '7461011121314', nombre: 'Detergente en Polvo OMO 1.5 kg', categoria: 'Limpieza del Hogar', costo: 215.00, unidad: 'Funda' },
  { id: 13, codigo: '7461516171819', nombre: 'Papel Higiénico Scott Rinde Más (4 rollos)', categoria: 'Higiene Personal', costo: 165.00, unidad: 'Paquete' },
  { id: 14, codigo: '7462021222324', nombre: 'Jabón de Cuaba Hispano Barra 300g', categoria: 'Lavandería', costo: 55.00, unidad: 'Barra' },
  { id: 15, codigo: '7462526272829', nombre: 'Azúcar Crema Central Romana 5 lb', categoria: 'Endulzantes', costo: 185.00, unidad: 'Fardo' },
]

// Clientes iniciales para auditoría de inventario contable
export const CLIENTES_INICIALES = [
  {
    id: 1,
    nombre: 'Supermercado El Sol C. por A.',
    rnc: '1-01-85942-3',
    telefono: '809-555-0142',
    direccion: 'Av. 27 de Febrero #204, Santo Domingo',
    notas: 'Auditoría mensual de cierre fiscal.',
    activo: true,
    estadisticas: {
      totalInventarios: 4,
      ultimoInventario: '2026-03-01'
    }
  },
  {
    id: 2,
    nombre: 'Distribuidora Los Hermanos SRL',
    rnc: '1-31-45678-9',
    telefono: '809-582-7788',
    direccion: 'Calle del Sol #88, Santiago de los Caballeros',
    notas: 'Conteo físico anual de almacén central.',
    activo: true,
    estadisticas: {
      totalInventarios: 2,
      ultimoInventario: '2026-02-15'
    }
  },
  {
    id: 3,
    nombre: 'Farmacia & Surtidora San Rafael',
    rnc: '1-02-99881-1',
    telefono: '809-528-3344',
    direccion: 'Av. Constitución #45, San Cristóbal',
    notas: 'Revisión trimestral de inventario y activos.',
    activo: true,
    estadisticas: {
      totalInventarios: 1,
      ultimoInventario: '2026-01-20'
    }
  }
]

// Sesiones de inventario iniciales simuladas
export const SESIONES_INICIALES = [
  {
    id: 101,
    numeroSesion: 'SES-2026-001',
    clienteNegocioId: 1,
    clienteNegocio: {
      id: 1,
      nombre: 'Supermercado El Sol C. por A.',
      rnc: '1-01-85942-3',
      telefono: '809-555-0142',
      direccion: 'Av. 27 de Febrero #204, Santo Domingo'
    },
    fecha: '2026-03-01T09:00:00.000Z',
    estado: 'completada',
    notas: 'Inventario de cierre fiscal de marzo 2026',
    tiempoSegundos: 4320, // 1h 12m
    datosFinancieros: {
      ventasDelMes: 1450000,
      gastosGenerales: 380000,
      cuentasPorCobrar: 210000,
      cuentasPorPagar: 340000,
      efectivoEnCajaYBanco: 520000,
      activosFijos: 1250000,
      capital: 2800000
    },
    productosContados: [
      {
        id: 'cnt-1',
        producto: 1,
        nombreProducto: 'Arroz Selecto Campos 10 lb',
        skuProducto: '7460123456789',
        unidadProducto: 'Fardo',
        cantidadContada: 120,
        costoProducto: 420.00,
        valorTotal: 50400.00
      },
      {
        id: 'cnt-2',
        producto: 2,
        nombreProducto: 'Aceite Vegetal Crisol 64 oz',
        skuProducto: '7460987654321',
        unidadProducto: 'Unidad',
        cantidadContada: 85,
        costoProducto: 310.00,
        valorTotal: 26350.00
      },
      {
        id: 'cnt-3',
        producto: 4,
        nombreProducto: 'Café Santo Domingo Molido 1 lb',
        skuProducto: '7462233445566',
        unidadProducto: 'Paquete',
        cantidadContada: 60,
        costoProducto: 340.00,
        valorTotal: 20400.00
      },
      {
        id: 'cnt-4',
        producto: 8,
        nombreProducto: 'Salami Induveca Especial 2 lb',
        skuProducto: '7466677889900',
        unidadProducto: 'Unidad',
        cantidadContada: 40,
        costoProducto: 275.00,
        valorTotal: 11000.00
      }
    ],
    totales: {
      totalProductosContados: 305,
      valorTotalInventario: 108150.00
    }
  },
  {
    id: 102,
    numeroSesion: 'SES-2026-002',
    clienteNegocioId: 2,
    clienteNegocio: {
      id: 2,
      nombre: 'Distribuidora Los Hermanos SRL',
      rnc: '1-31-45678-9',
      telefono: '809-582-7788',
      direccion: 'Calle del Sol #88, Santiago de los Caballeros'
    },
    fecha: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // Comenzó hace 35 minutos
    estado: 'en_progreso',
    notas: 'Toma física y arqueo para balance de comprobación',
    tiempoSegundos: 2100,
    datosFinancieros: {
      ventasDelMes: 980000,
      gastosGenerales: 210000,
      cuentasPorCobrar: 185000,
      cuentasPorPagar: 240000,
      efectivoEnCajaYBanco: 315000,
      activosFijos: 890000,
      capital: 1800000
    },
    productosContados: [
      {
        id: 'cnt-10',
        producto: 3,
        nombreProducto: 'Leche Rica Entera UHT 1 Litro',
        skuProducto: '7461122334455',
        unidadProducto: 'Caja 12u',
        cantidadContada: 45,
        costoProducto: 95.00,
        valorTotal: 4275.00
      },
      {
        id: 'cnt-11',
        producto: 9,
        nombreProducto: 'Queso Gouda Geo Holandés lb',
        skuProducto: '7467788990011',
        unidadProducto: 'Libra',
        cantidadContada: 30,
        costoProducto: 390.00,
        valorTotal: 11700.00
      },
      {
        id: 'cnt-12',
        producto: 10,
        nombreProducto: 'Refresco Coca-Cola 2 Litros',
        skuProducto: '7468899001122',
        unidadProducto: 'Fardo 8u',
        cantidadContada: 50,
        costoProducto: 110.00,
        valorTotal: 5500.00
      }
    ],
    totales: {
      totalProductosContados: 125,
      valorTotalInventario: 21475.00
    }
  }
]
