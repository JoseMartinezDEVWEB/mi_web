/* Datos de demostración y utilidades para el sistema de facturación POS de app-total */

export const TIPOS_NCF = [
  { value: 'B01', label: 'B01 - Factura de Crédito Fiscal', desc: 'Para sustentar costos y gastos' },
  { value: 'B02', label: 'B02 - Factura de Consumo Final', desc: 'Consumidor final / Personas físicas' },
  { value: 'B14', label: 'B14 - Comprobante Gubernamental', desc: 'Instituciones del Estado dominicano' },
  { value: 'B15', label: 'B15 - Regímenes Especiales', desc: 'Zonas francas y exportadores' },
]

export const CLIENTES_DEMO = [
  {
    id: 1,
    nombre: 'Cliente General (Contado)',
    rncCedula: '000-0000000-0',
    telefono: '(809) 555-0100',
    email: 'ventas@j4technology.com',
    direccion: 'Santo Domingo, R.D.',
    tipoNCF: 'B02',
    saldoPendiente: 0,
  },
  {
    id: 2,
    nombre: 'Inversiones y Servicios del Caribe SRL',
    rncCedula: '1-31-89452-3',
    telefono: '(809) 567-8901',
    email: 'administracion@inversionescaribe.do',
    direccion: 'Av. Winston Churchill #105, Santo Domingo',
    tipoNCF: 'B01',
    saldoPendiente: 0,
  },
  {
    id: 3,
    nombre: 'Constructora Dominicana & Asociados',
    rncCedula: '1-02-45891-7',
    telefono: '(809) 472-3322',
    email: 'compras@constructorado.com',
    direccion: 'Av. 27 de Febrero #240, Santiago',
    tipoNCF: 'B01',
    saldoPendiente: 45000,
  },
  {
    id: 4,
    nombre: 'Lic. María Elena Peralta',
    rncCedula: '001-1849204-5',
    telefono: '(829) 334-1188',
    email: 'maria.peralta@gmail.com',
    direccion: 'Bella Vista, D.N.',
    tipoNCF: 'B02',
    saldoPendiente: 0,
  },
  {
    id: 5,
    nombre: 'Ministerio de Industria y Comercio',
    rncCedula: '4-01-00234-1',
    telefono: '(809) 685-5171',
    email: 'facturacion@micm.gob.do',
    direccion: 'Torre MICM, Av. 27 de Febrero, D.N.',
    tipoNCF: 'B14',
    saldoPendiente: 0,
  },
]

export const PRODUCTOS_DEMO = [
  {
    id: 'prod-001',
    code: '746123456001',
    name: 'Laptop Dell Latitude 5420 i7 16GB 512GB SSD',
    category: 'Equipos',
    costPrice: 52000,
    price: 68500,
    stock: 14,
    taxable: true,
    badge: 'Más Vendido',
  },
  {
    id: 'prod-002',
    code: '746123456002',
    name: 'Monitor LG UltraFine 27" 4K IPS HDR',
    category: 'Monitores',
    costPrice: 19000,
    price: 24900,
    stock: 8,
    taxable: true,
  },
  {
    id: 'prod-003',
    code: '746123456003',
    name: 'Impresora Térmica POS EPSON TM-T20III 80mm',
    category: 'Puntos de Venta',
    costPrice: 9800,
    price: 13500,
    stock: 19,
    taxable: true,
    badge: 'Hardware POS',
  },
  {
    id: 'prod-004',
    code: '746123456004',
    name: 'Lector Código de Barras 1D/2D Omnidireccional USB',
    category: 'Puntos de Venta',
    costPrice: 3200,
    price: 4950,
    stock: 26,
    taxable: true,
  },
  {
    id: 'prod-005',
    code: '746123456005',
    name: 'Cajón de Dinero Automático Metálico RJ11',
    category: 'Puntos de Venta',
    costPrice: 2900,
    price: 4200,
    stock: 12,
    taxable: true,
  },
  {
    id: 'prod-006',
    code: '746123456006',
    name: 'Papel Térmico 80x70mm para Facturación (Caja 50 unds)',
    category: 'Insumos',
    costPrice: 1900,
    price: 2850,
    stock: 45,
    taxable: true,
  },
  {
    id: 'prod-007',
    code: '746123456007',
    name: 'Licencia Software Facturación Electrónica Anual Cloud',
    category: 'Software & Servicios',
    costPrice: 8000,
    price: 18000,
    stock: 999,
    taxable: true,
    badge: 'Suscripción',
  },
  {
    id: 'prod-008',
    code: '746123456008',
    name: 'Servicio de Configuración NCF y Capacitación DGII',
    category: 'Software & Servicios',
    costPrice: 1500,
    price: 6500,
    stock: 999,
    taxable: true,
  },
  {
    id: 'prod-009',
    code: '746123456009',
    name: 'Teclado y Mouse Inalámbrico Logitech MK270',
    category: 'Accesorios',
    costPrice: 1200,
    price: 1950,
    stock: 35,
    taxable: true,
  },
  {
    id: 'prod-010',
    code: '746123456010',
    name: 'UPS Forza 1000VA / 600W Respaldo Eléctrico',
    category: 'Equipos',
    costPrice: 4100,
    price: 5900,
    stock: 11,
    taxable: true,
  },
]

export const CATEGORIAS_DEMO = [
  'Todos',
  'Puntos de Venta',
  'Equipos',
  'Monitores',
  'Software & Servicios',
  'Insumos',
  'Accesorios',
]

export const TASA_ITBIS = 0.18

export const formatearDOP = (valor) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(valor) || 0)
}

export const generarNCF = (tipo = 'B02') => {
  const correlativo = String(Math.floor(Math.random() * 90000000) + 10000000)
  return `${tipo}${correlativo}`
}

export const DATOS_EMPRESA = {
  nombre: 'J4 TECHNOLOGY SRL',
  rnc: '1-31-98765-4',
  telefono: '(809) 555-8324',
  direccion: 'Av. Winston Churchill, Torre Ejecutiva #402, Santo Domingo',
  email: 'contacto@j4technologyisnow.com',
  web: 'www.j4technologyisnow.com',
  sucursal: 'Sucursal Central 01',
  puntoEmision: 'Caja POS-01',
}

export const FACTURAS_INICIALES = [
  {
    id: 'FAC-0102',
    ncf: 'B0100048392',
    tipoNCFLabel: 'B01 - Crédito Fiscal',
    fecha: '15/09/2026, 11:20 AM',
    cajero: 'Cajero POS 01',
    cliente: CLIENTES_DEMO[1],
    items: [
      { name: 'Laptop Dell Latitude 5420 i7', cantidad: 1, price: 68500 },
      { name: 'Monitor LG UltraFine 27" 4K', cantidad: 1, price: 24900 },
    ],
    resumen: {
      subtotal: 93400,
      itbis: 16812,
      total: 110212,
    },
    pago: {
      metodo: 'transferencia',
      montoRecibido: 110212,
      devuelta: 0,
    },
    estado: 'Pagada',
  },
  {
    id: 'FAC-0101',
    ncf: 'B0200059218',
    tipoNCFLabel: 'B02 - Consumidor Final',
    fecha: '15/09/2026, 10:45 AM',
    cajero: 'Cajero POS 01',
    cliente: CLIENTES_DEMO[3],
    items: [
      { name: 'Teclado y Mouse Inalámbrico Logitech MK270', cantidad: 2, price: 1950 },
      { name: 'Papel Térmico 80x70mm (Caja 50 unds)', cantidad: 1, price: 2850 },
    ],
    resumen: {
      subtotal: 6750,
      itbis: 1215,
      total: 7965,
    },
    pago: {
      metodo: 'efectivo',
      montoRecibido: 8000,
      devuelta: 35,
    },
    estado: 'Pagada',
  },
  {
    id: 'FAC-0100',
    ncf: 'B0100039201',
    tipoNCFLabel: 'B01 - Crédito Fiscal',
    fecha: '14/09/2026, 04:15 PM',
    cajero: 'Cajero POS 01',
    cliente: CLIENTES_DEMO[2],
    items: [
      { name: 'Impresora Térmica POS EPSON TM-T20III 80mm', cantidad: 2, price: 13500 },
      { name: 'Lector Código de Barras 1D/2D USB', cantidad: 2, price: 4950 },
      { name: 'Cajón de Dinero Automático Metálico', cantidad: 2, price: 4200 },
    ],
    resumen: {
      subtotal: 45300,
      itbis: 8154,
      total: 53454,
    },
    pago: {
      metodo: 'tarjeta',
      montoRecibido: 53454,
      devuelta: 0,
    },
    estado: 'Pagada',
  },
]

export const VENTAS_DIARIAS_SEMANA = [
  { dia: 'Lun', ventas: 84500, facturas: 12 },
  { dia: 'Mar', ventas: 112300, facturas: 18 },
  { dia: 'Mié', ventas: 96800, facturas: 14 },
  { dia: 'Jue', ventas: 145200, facturas: 22 },
  { dia: 'Vie', ventas: 198400, facturas: 29 },
  { dia: 'Sáb', ventas: 215000, facturas: 34 },
  { dia: 'Hoy', ventas: 171631, facturas: 24 },
]
