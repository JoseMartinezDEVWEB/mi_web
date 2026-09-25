/* Datos iniciales y funciones matemáticas de amortización para la demo del Sistema de Préstamos */

export const CLIENTES_INICIALES = [
  {
    id: 1,
    nombreCompleto: 'Carlos Manuel Rosario',
    cedula: '402-2849182-3',
    telefono: '809-555-0142',
    direccion: 'Av. Winston Churchill #45, Piantini, Santo Domingo',
    ocupacion: 'Comerciante Independiente',
    prestamosActivos: 1,
    estado: 'Activo',
  },
  {
    id: 2,
    nombreCompleto: 'Ana Patricia Gómez Peña',
    cedula: '001-0982341-9',
    telefono: '829-555-9831',
    direccion: 'Calle El Sol #12, Santiago de los Caballeros',
    ocupacion: 'Docente Universitaria',
    prestamosActivos: 1,
    estado: 'Activo',
  },
  {
    id: 3,
    nombreCompleto: 'Luis Alberto Méndez Ortiz',
    cedula: '002-3948271-0',
    telefono: '849-555-4421',
    direccion: 'Av. España #88, Santo Domingo Este',
    ocupacion: 'Contratista Eléctrico',
    prestamosActivos: 1,
    estado: 'Activo',
  },
  {
    id: 4,
    nombreCompleto: 'Yomaira Altagracia Santos',
    cedula: '047-1928374-5',
    telefono: '809-555-7762',
    direccion: 'Calle Duarte #104, La Vega',
    ocupacion: 'Dueña de Salón & Spa',
    prestamosActivos: 0,
    estado: 'Activo',
  },
]

export const PRESTAMOS_INICIALES = [
  {
    id: 'PREST-1001',
    clienteId: 1,
    clienteNombre: 'Carlos Manuel Rosario',
    clienteCedula: '402-2849182-3',
    monto: 75000,
    tasa: 18, // 18% anual
    plazo: 12,
    frecuenciaPago: 'mensual',
    fechaInicio: '2026-01-15',
    cuota: 6878.50,
    saldoRestante: 48500.00,
    cuotasPagadas: 4,
    cuotasTotales: 12,
    estado: 'Al Día',
  },
  {
    id: 'PREST-1002',
    clienteId: 2,
    clienteNombre: 'Ana Patricia Gómez Peña',
    clienteCedula: '001-0982341-9',
    monto: 120000,
    tasa: 15,
    plazo: 24,
    frecuenciaPago: 'quincenal',
    fechaInicio: '2026-02-01',
    cuota: 2894.20,
    saldoRestante: 98400.00,
    cuotasPagadas: 8,
    cuotasTotales: 48,
    estado: 'Al Día',
  },
  {
    id: 'PREST-1003',
    clienteId: 3,
    clienteNombre: 'Luis Alberto Méndez Ortiz',
    clienteCedula: '002-3948271-0',
    monto: 35000,
    tasa: 20,
    plazo: 6,
    frecuenciaPago: 'mensual',
    fechaInicio: '2025-11-10',
    cuota: 6177.30,
    saldoRestante: 12350.00,
    cuotasPagadas: 4,
    cuotasTotales: 6,
    estado: 'Al Día',
  },
]

export const PAGOS_INICIALES = [
  {
    id: 'REC-0941',
    prestamoId: 'PREST-1001',
    clienteNombre: 'Carlos Manuel Rosario',
    clienteCedula: '402-2849182-3',
    monto: 6878.50,
    fechaPago: '2026-04-15 10:30',
    metodoPago: 'efectivo',
    numeroCuota: 4,
    nuevoSaldo: 48500.00,
    comentario: 'Pago de cuota correspondiente al mes en curso',
  },
  {
    id: 'REC-0940',
    prestamoId: 'PREST-1002',
    clienteNombre: 'Ana Patricia Gómez Peña',
    clienteCedula: '001-0982341-9',
    monto: 5788.40,
    fechaPago: '2026-04-14 14:15',
    metodoPago: 'transferencia',
    numeroCuota: 8,
    nuevoSaldo: 98400.00,
    comentario: 'Abono de 2 cuotas quincenales vía Banco BHD',
  },
  {
    id: 'REC-0939',
    prestamoId: 'PREST-1003',
    clienteNombre: 'Luis Alberto Méndez Ortiz',
    clienteCedula: '002-3948271-0',
    monto: 6177.30,
    fechaPago: '2026-04-10 09:45',
    metodoPago: 'efectivo',
    numeroCuota: 4,
    nuevoSaldo: 12350.00,
    comentario: 'Pago puntual en ventanilla',
  },
]

/* Formateador de moneda dominicana DOP */
export const formatearMoneda = (cantidad) => {
  const num = Number(cantidad) || 0
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num).replace('DOP', 'RD$')
}

/* Lógica matemática de amortización adaptada de prestamo-j4pro-master */
export const calcularAmortizacion = (monto, tasa, plazo, frecuenciaPago, fechaInicio = new Date()) => {
  const montoNum = parseFloat(monto) || 0
  const tasaNum = (parseFloat(tasa) || 0) / 100
  const plazoNum = parseInt(plazo, 10) || 1
  const fechaObj = new Date(fechaInicio)

  if (montoNum <= 0 || plazoNum <= 0) {
    return { cuota: 0, totalInteres: 0, totalPagar: 0, tabla: [] }
  }

  let tasaPeriodica = 0
  switch (frecuenciaPago) {
    case 'diario':
      tasaPeriodica = tasaNum / 365
      break
    case 'semanal':
      tasaPeriodica = tasaNum / 52
      break
    case 'quincenal':
      tasaPeriodica = tasaNum / 24
      break
    case 'mensual':
    default:
      tasaPeriodica = tasaNum / 12
      break
  }

  const cuota = tasaPeriodica > 0
    ? (montoNum * tasaPeriodica) / (1 - Math.pow(1 + tasaPeriodica, -plazoNum))
    : montoNum / plazoNum

  let saldoRestante = montoNum
  let fechaPago = new Date(fechaObj)
  const tabla = []
  let totalInteres = 0

  for (let i = 0; i < plazoNum; i++) {
    if (i > 0) {
      fechaPago = new Date(fechaPago)
      switch (frecuenciaPago) {
        case 'diario':
          fechaPago.setDate(fechaPago.getDate() + 1)
          break
        case 'semanal':
          fechaPago.setDate(fechaPago.getDate() + 7)
          break
        case 'quincenal':
          fechaPago.setDate(fechaPago.getDate() + 15)
          break
        case 'mensual':
        default:
          fechaPago.setMonth(fechaPago.getMonth() + 1)
          break
      }
    }

    const interes = saldoRestante * tasaPeriodica
    const capital = cuota - interes
    saldoRestante -= capital
    totalInteres += interes

    tabla.push({
      numeroPago: i + 1,
      fechaPago: fechaPago.toISOString().split('T')[0],
      cuota: cuota,
      capital: capital,
      interes: interes,
      saldo: Math.max(0, saldoRestante),
    })
  }

  return {
    cuota: Math.round(cuota * 100) / 100,
    totalInteres: Math.round(totalInteres * 100) / 100,
    totalPagar: Math.round((montoNum + totalInteres) * 100) / 100,
    tabla,
  }
}
