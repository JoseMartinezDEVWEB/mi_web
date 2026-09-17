import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Barcode,
  CheckCircle,
  FileText,
  User,
  CreditCard,
  Printer,
  RotateCcw,
  Sparkles,
  Layers,
  History,
  Tag,
  Clock,
  AlertCircle
} from 'lucide-react'

import {
  PRODUCTOS_DEMO,
  CLIENTES_DEMO,
  CATEGORIAS_DEMO,
  TIPOS_NCF,
  TASA_ITBIS,
  formatearDOP,
  generarNCF,
  DATOS_EMPRESA,
} from './facturacionData'
import CobroModal from './CobroModal'
import FacturaTicketModal from './FacturaTicketModal'

export default function FacturacionPOS() {
  // Pestaña activa: 'pos' (Punto de Venta) o 'historial' (Facturas emitidas)
  const [vistaActiva, setVistaActiva] = useState('pos')

  // Catálogo de productos con stock mutable en la sesión
  const [catalogo, setCatalogo] = useState(PRODUCTOS_DEMO)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')

  // Selección de cliente y NCF
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState(CLIENTES_DEMO[0].id)
  const clienteActual = useMemo(
    () => CLIENTES_DEMO.find((c) => c.id === Number(clienteSeleccionadoId)) || CLIENTES_DEMO[0],
    [clienteSeleccionadoId]
  )
  const [tipoNCF, setTipoNCF] = useState(clienteActual.tipoNCF || 'B02')

  // Sincronizar tipo de NCF cuando cambia el cliente predeterminado
  useEffect(() => {
    if (clienteActual.tipoNCF) {
      setTipoNCF(clienteActual.tipoNCF)
    }
  }, [clienteActual])

  // Carrito de compras
  const [carrito, setCarrito] = useState([
    {
      ...PRODUCTOS_DEMO[2], // Impresora Térmica POS
      cantidad: 1,
    },
    {
      ...PRODUCTOS_DEMO[5], // Papel Térmico
      cantidad: 2,
    },
  ])

  // Modales
  const [modalCobroAbierto, setModalCobroAbierto] = useState(false)
  const [modalTicketAbierto, setModalTicketAbierto] = useState(false)
  const [facturaGenerada, setFacturaGenerada] = useState(null)

  // Historial de facturas emitidas en esta sesión
  const [historialFacturas, setHistorialFacturas] = useState([
    {
      id: 'FAC-0098',
      ncf: 'B0200049210',
      tipoNCFLabel: 'B02 - Consumidor Final',
      fecha: '15/09/2026, 10:45 AM',
      cajero: 'Cajero POS 01',
      cliente: CLIENTES_DEMO[3],
      items: [
        { name: 'Teclado y Mouse Inalámbrico Logitech MK270', cantidad: 1, price: 1950 },
        { name: 'Papel Térmico 80x70mm (Caja 50 unds)', cantidad: 1, price: 2850 },
      ],
      resumen: {
        subtotal: 4800,
        itbis: 864,
        total: 5664,
      },
      pago: {
        metodo: 'efectivo',
        montoRecibido: 6000,
        devuelta: 336,
      },
    },
  ])

  // Filtrado de productos
  const productosFiltrados = useMemo(() => {
    return catalogo.filter((p) => {
      const coincideCategoria =
        categoriaSeleccionada === 'Todos' || p.category === categoriaSeleccionada
      const coincideBusqueda =
        p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.code.includes(busqueda.trim())
      return coincideCategoria && coincideBusqueda
    })
  }, [catalogo, categoriaSeleccionada, busqueda])

  // Cálculos de totales del carrito
  const resumen = useMemo(() => {
    const subtotal = carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0)
    const itbis = subtotal * TASA_ITBIS
    const total = subtotal + itbis
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)
    return { subtotal, itbis, total, totalItems }
  }, [carrito])

  // Acciones sobre el carrito
  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) return
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id)
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) }
            : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const modificarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nuevaCantidad = item.cantidad + delta
            const productoStock = catalogo.find((p) => p.id === id)?.stock || 999
            if (nuevaCantidad > productoStock) return item
            return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id))
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  // Confirmar cobro y emitir factura fiscal con NCF
  const handleConfirmarPago = (datosPago) => {
    const ncf = generarNCF(tipoNCF)
    const tipoLabel = TIPOS_NCF.find((t) => t.value === tipoNCF)?.label || tipoNCF
    const fechaHora = new Date().toLocaleString('es-DO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const nuevaFactura = {
      id: `FAC-${String(historialFacturas.length + 99).padStart(4, '0')}`,
      ncf,
      tipoNCFLabel: tipoLabel,
      fecha: fechaHora,
      cajero: 'Cajero POS 01',
      cliente: clienteActual,
      items: [...carrito],
      resumen: { ...resumen },
      pago: datosPago,
    }

    // Actualizar stock del catálogo
    setCatalogo((prev) =>
      prev.map((prod) => {
        const enCarrito = carrito.find((c) => c.id === prod.id)
        if (enCarrito) {
          return { ...prod, stock: Math.max(0, prod.stock - enCarrito.cantidad) }
        }
        return prod
      })
    )

    // Guardar en historial
    setHistorialFacturas((prev) => [nuevaFactura, ...prev])
    setFacturaGenerada(nuevaFactura)
    setModalCobroAbierto(false)
    setModalTicketAbierto(true)
    setCarrito([])
  }

  const handleIniciarNuevaVenta = () => {
    setModalTicketAbierto(false)
    setFacturaGenerada(null)
    setCarrito([])
  }

  return (
    <div className="w-full bg-slate-100 rounded-xl overflow-hidden font-sans text-gray-800 shadow-xl border border-gray-200 select-none">
      {/* ── BARRA SUPERIOR DE LA APLICACIÓN POS (Diseño app-total) ── */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/30">
            J4
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base tracking-wide text-white">
                Facturación Electrónica POS
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DGII ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {DATOS_EMPRESA.nombre} • RNC: {DATOS_EMPRESA.rnc}
            </p>
          </div>
        </div>

        {/* Selector de Vistas / Pestañas */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-700/50 text-xs">
          <button
            onClick={() => setVistaActiva('pos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              vistaActiva === 'pos'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Punto de Venta
          </button>
          <button
            onClick={() => setVistaActiva('historial')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              vistaActiva === 'historial'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Historial ({historialFacturas.length})
          </button>
        </div>

        {/* Indicadores del Cajero */}
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-300 border-l border-slate-700/60 pl-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block leading-tight">Cajero Activo</span>
            <span className="font-semibold text-white">Administrador</span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-500/20" />
        </div>
      </header>

      {/* ── CUERPO PRINCIPAL DEL POS ── */}
      {vistaActiva === 'pos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] bg-slate-50">
          {/* ══════════ COLUMNA IZQUIERDA: CATÁLOGO Y BÚSQUEDA (7 cols) ══════════ */}
          <div className="lg:col-span-7 p-3 sm:p-4 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200">
            {/* Buscador inteligente */}
            <div className="mb-3 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre de producto o código de barras (ej: 746123456...)"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filtros de Categorías */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {CATEGORIAS_DEMO.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaSeleccionada(cat)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                      categoriaSeleccionada === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="flex-1 overflow-y-auto max-h-[460px] pr-1">
              {productosFiltrados.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
                  <AlertCircle className="w-10 h-10 mb-2 stroke-1" />
                  <p className="text-sm font-semibold">No se encontraron productos</p>
                  <p className="text-xs">Intenta con otro término o categoría</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {productosFiltrados.map((prod) => {
                    const enCarrito = carrito.find((c) => c.id === prod.id)
                    const stockDisponible = prod.stock - (enCarrito ? enCarrito.cantidad : 0)
                    const agotado = stockDisponible <= 0

                    return (
                      <div
                        key={prod.id}
                        className={`bg-white rounded-xl p-3 border transition-all flex flex-col justify-between ${
                          agotado
                            ? 'opacity-60 border-gray-200 bg-gray-50'
                            : 'border-gray-200/90 hover:border-blue-400 hover:shadow-md'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {prod.code.slice(-6)}
                            </span>
                            {prod.badge && (
                              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-xs sm:text-[13px] text-gray-900 leading-snug line-clamp-2">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-gray-500">{prod.category}</span>
                        </div>

                        <div className="flex items-end justify-between gap-2 mt-3 pt-2 border-t border-gray-100">
                          <div>
                            <span className="text-[10px] text-gray-500 block">Precio ITBIS incl.</span>
                            <span className="font-extrabold text-sm sm:text-base text-gray-900">
                              {formatearDOP(prod.price)}
                            </span>
                            <div className="text-[10px]">
                              {agotado ? (
                                <span className="text-red-500 font-bold">Sin Stock</span>
                              ) : (
                                <span className="text-emerald-600 font-medium">
                                  Stock: {stockDisponible}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => agregarAlCarrito(prod)}
                            disabled={agotado}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              agotado
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Agregar
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ══════════ COLUMNA DERECHA: CARRITO Y FACTURACIÓN (5 cols) ══════════ */}
          <div className="lg:col-span-5 p-3 sm:p-4 bg-white flex flex-col justify-between">
            <div>
              {/* Sección de Cliente y NCF */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Cliente y NCF Fiscal
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold uppercase">DGII Rep. Dom.</span>
                </div>

                {/* Selector de Cliente */}
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">
                    Seleccionar Cliente
                  </label>
                  <select
                    value={clienteSeleccionadoId}
                    onChange={(e) => setClienteSeleccionadoId(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {CLIENTES_DEMO.map((cli) => (
                      <option key={cli.id} value={cli.id}>
                        {cli.nombre} - ({cli.rncCedula})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Comprobante NCF */}
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">
                    Tipo de Comprobante (NCF)
                  </label>
                  <select
                    value={tipoNCF}
                    onChange={(e) => setTipoNCF(e.target.value)}
                    className="w-full text-xs font-bold bg-white border border-blue-300 rounded-lg px-2.5 py-1.5 text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {TIPOS_NCF.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Encabezado del Carrito */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs sm:text-sm text-gray-900">
                    Artículos ({resumen.totalItems})
                  </span>
                </div>
                {carrito.length > 0 && (
                  <button
                    onClick={vaciarCarrito}
                    className="text-[11px] text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Vaciar
                  </button>
                )}
              </div>

              {/* Lista de productos en el carrito */}
              <div className="overflow-y-auto max-h-[220px] divide-y divide-gray-100 pr-1">
                {carrito.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center text-center text-gray-400">
                    <ShoppingCart className="w-8 h-8 mb-1 stroke-1 text-gray-300" />
                    <p className="text-xs font-medium">El carrito está vacío</p>
                    <p className="text-[11px] text-gray-400">Selecciona productos de la izquierda</p>
                  </div>
                ) : (
                  carrito.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-xs text-gray-800 truncate">{item.name}</h5>
                        <span className="text-[11px] text-gray-500">
                          {formatearDOP(item.price)} c/u
                        </span>
                      </div>

                      {/* Controles de Cantidad */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => modificarCantidad(item.id, -1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-gray-900">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => modificarCantidad(item.id, 1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total de línea */}
                      <div className="text-right w-20">
                        <span className="font-bold text-xs text-gray-900 block">
                          {formatearDOP(item.price * item.cantidad)}
                        </span>
                      </div>

                      {/* Eliminar ítem */}
                      <button
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Resumen Financiero y Botón de Cobro */}
            <div className="pt-3 border-t border-gray-200 space-y-2 mt-2">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal Factura:</span>
                  <span className="font-medium text-gray-800">{formatearDOP(resumen.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>ITBIS (18%):</span>
                  <span className="font-medium text-amber-600">{formatearDOP(resumen.itbis)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 pt-1 border-t border-gray-200">
                  <span>TOTAL A PAGAR:</span>
                  <span className="text-emerald-600">{formatearDOP(resumen.total)}</span>
                </div>
              </div>

              {/* Botón Principal de Cobro */}
              <button
                onClick={() => setModalCobroAbierto(true)}
                disabled={carrito.length === 0}
                className={`w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 text-white shadow-lg transition-all ${
                  carrito.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 active:scale-[0.99] cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                COBRAR Y EMITIR FACTURA (F10)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ══════════ PESTAÑA DE HISTORIAL DE FACTURAS EMITIDAS ══════════ */
        <div className="p-4 min-h-[580px] bg-slate-50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-base text-gray-900">Historial de Facturas Emitidas</h3>
                <p className="text-xs text-gray-500">Registro de comprobantes fiscales de esta sesión</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {historialFacturas.length} Facturas registradas
              </span>
            </div>

            {/* Vista Móvil (< sm): Tarjetas de Historial */}
            <div className="block sm:hidden space-y-3">
              {historialFacturas.map((fac) => (
                <div
                  key={fac.id}
                  className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px]">
                        {fac.id}
                      </span>
                      <span className="font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 text-xs">
                        {fac.ncf}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500">{fac.fecha}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold text-xs text-gray-800 block truncate">
                        {fac.cliente.nombre}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {fac.cliente.rncCedula}
                      </span>
                    </div>
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 flex-shrink-0">
                      {fac.pago.metodo}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="font-black text-sm text-emerald-700 font-mono">
                      {formatearDOP(fac.resumen.total)}
                    </span>
                    <button
                      onClick={() => {
                        setFacturaGenerada(fac)
                        setModalTicketAbierto(true)
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Ver Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista Desktop / Tablet (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs text-left bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-[650px]">
                <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 whitespace-nowrap">No. Factura</th>
                    <th className="py-3 px-4 whitespace-nowrap">NCF</th>
                    <th className="py-3 px-4 whitespace-nowrap">Cliente</th>
                    <th className="py-3 px-4 whitespace-nowrap">Fecha/Hora</th>
                    <th className="py-3 px-4 whitespace-nowrap">Método</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Total DOP</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historialFacturas.map((fac) => (
                    <tr key={fac.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">{fac.id}</td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-800 whitespace-nowrap">{fac.ncf}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-800">{fac.cliente.nombre}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{fac.cliente.rncCedula}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{fac.fecha}</td>
                      <td className="py-3 px-4 uppercase font-semibold text-gray-700 whitespace-nowrap">
                        {fac.pago.metodo}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-emerald-700 whitespace-nowrap">
                        {formatearDOP(fac.resumen.total)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => {
                            setFacturaGenerada(fac)
                            setModalTicketAbierto(true)
                          }}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto"
                        >
                          <Printer className="w-3 h-3" />
                          Ver Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center pt-4 text-xs text-gray-500">
            Los comprobantes emitidos en este demo simulan secuencias oficiales de la DGII de República Dominicana.
          </div>
        </div>
      )}

      {/* ── MODALES DEL SISTEMA ── */}
      <CobroModal
        isOpen={modalCobroAbierto}
        onClose={() => setModalCobroAbierto(false)}
        total={resumen.total}
        onConfirmPayment={handleConfirmarPago}
      />

      <FacturaTicketModal
        isOpen={modalTicketAbierto}
        onClose={() => setModalTicketAbierto(false)}
        factura={facturaGenerada}
        onNuevaVenta={handleIniciarNuevaVenta}
      />
    </div>
  )
}
