/* Demo interactivo del Sistema de Préstamos J4Pro — Clientes, Préstamos, Amortización y Cobros con Recibos */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, DollarSign, Receipt, Plus, Search, FileSpreadsheet,
  Printer, ArrowUpRight, CheckCircle2, AlertCircle, Clock,
  Calendar, Phone, MapPin, Briefcase, Eye, ChevronRight
} from 'lucide-react'
import {
  CLIENTES_INICIALES,
  PRESTAMOS_INICIALES,
  PAGOS_INICIALES,
  formatearMoneda,
} from './prestamoData'
import NuevoClienteModal from './NuevoClienteModal'
import NuevoPrestamoModal from './NuevoPrestamoModal'
import NuevoCobroModal from './NuevoCobroModal'
import ReciboModal from './ReciboModal'
import AmortizacionModal from './AmortizacionModal'

export default function PrestamoDemo({ language = 'es', onContact }) {
  // Estados de datos
  const [clientes, setClientes] = useState(CLIENTES_INICIALES)
  const [prestamos, setPrestamos] = useState(PRESTAMOS_INICIALES)
  const [pagos, setPagos] = useState(PAGOS_INICIALES)

  // Pestaña activa
  const [tabActiva, setTabActiva] = useState('prestamos') // 'prestamos' | 'clientes' | 'cobros'

  // Búsqueda
  const [busqueda, setBusqueda] = useState('')

  // Modales
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false)
  const [modalPrestamoAbierto, setModalPrestamoAbierto] = useState(false)
  const [modalCobroAbierto, setModalCobroAbierto] = useState(false)
  const [prestamoSeleccionadoParaCobro, setPrestamoSeleccionadoParaCobro] = useState(null)
  const [reciboVisualizar, setReciboVisualizar] = useState(null)
  const [prestamoVisualizarAmortizacion, setPrestamoVisualizarAmortizacion] = useState(null)

  // KPIs
  const totalCartera = useMemo(() => prestamos.reduce((acc, p) => acc + (p.monto || 0), 0), [prestamos])
  const totalCobrado = useMemo(() => pagos.reduce((acc, p) => acc + (p.monto || 0), 0), [pagos])
  const saldoPendiente = useMemo(() => prestamos.reduce((acc, p) => acc + (p.saldoRestante || 0), 0), [prestamos])
  const totalClientes = clientes.length

  // Handlers para agregar datos
  const handleGuardarCliente = (nuevoCliente) => {
    setClientes((prev) => [nuevoCliente, ...prev])
  }

  const handleGuardarPrestamo = (nuevoPrestamo) => {
    setPrestamos((prev) => [nuevoPrestamo, ...prev])
    setClientes((prev) =>
      prev.map((c) =>
        c.id === nuevoPrestamo.clienteId
          ? { ...c, prestamosActivos: (c.prestamosActivos || 0) + 1 }
          : c
      )
    )
  }

  const handleRegistrarCobro = (nuevoRecibo, prestamoId, montoCobrado) => {
    // Agregar a la lista de pagos
    setPagos((prev) => [nuevoRecibo, ...prev])

    // Actualizar saldo del préstamo y cuotas pagadas
    setPrestamos((prev) =>
      prev.map((p) => {
        if (p.id === prestamoId) {
          const nuevoSaldo = Math.max(0, (p.saldoRestante || 0) - montoCobrado)
          const nuevasCuotas = (p.cuotasPagadas || 0) + 1
          const estaSaldado = nuevoSaldo <= 0
          return {
            ...p,
            saldoRestante: nuevoSaldo,
            cuotasPagadas: nuevasCuotas,
            estado: estaSaldado ? 'Saldado' : 'Al Día',
          }
        }
        return p
      })
    )

    // Mostrar el recibo inmediatamente
    setReciboVisualizar(nuevoRecibo)
  }

  // Filtrar préstamos
  const prestamosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return prestamos
    const q = busqueda.toLowerCase()
    return prestamos.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.clienteNombre.toLowerCase().includes(q) ||
        p.clienteCedula.includes(q)
    )
  }, [prestamos, busqueda])

  // Filtrar clientes
  const clientesFiltrados = useMemo(() => {
    if (!busqueda.trim()) return clientes
    const q = busqueda.toLowerCase()
    return clientes.filter(
      (c) =>
        c.nombreCompleto.toLowerCase().includes(q) ||
        c.cedula.includes(q) ||
        c.telefono.includes(q)
    )
  }, [clientes, busqueda])

  // Filtrar pagos
  const pagosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return pagos
    const q = busqueda.toLowerCase()
    return pagos.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.clienteNombre.toLowerCase().includes(q) ||
        p.prestamoId.toLowerCase().includes(q)
    )
  }, [pagos, busqueda])

  return (
    <div className="w-full text-white font-sans space-y-5">
      {/* 1. Barra de Métricas y KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div
          className="p-3.5 sm:p-4 rounded-xl border"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,0,0,0.3))',
            borderColor: 'rgba(212,175,55,0.25)',
          }}
        >
          <div className="flex items-center justify-between text-xs text-amber-300 mb-1">
            <span>Cartera Total</span>
            <DollarSign size={15} />
          </div>
          <div className="text-base sm:text-xl font-bold font-mono text-white">
            {formatearMoneda(totalCartera)}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {prestamos.length} préstamos emitidos
          </span>
        </div>

        <div
          className="p-3.5 sm:p-4 rounded-xl border"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(0,0,0,0.3))',
            borderColor: 'rgba(16,185,129,0.25)',
          }}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
            <span>Total Recaudado</span>
            <Receipt size={15} />
          </div>
          <div className="text-base sm:text-xl font-bold font-mono text-emerald-400">
            {formatearMoneda(totalCobrado)}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {pagos.length} cobros registrados
          </span>
        </div>

        <div
          className="p-3.5 sm:p-4 rounded-xl border"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,0,0,0.3))',
            borderColor: 'rgba(0,212,255,0.25)',
          }}
        >
          <div className="flex items-center justify-between text-xs text-cyan-400 mb-1">
            <span>Saldo en Calle</span>
            <Clock size={15} />
          </div>
          <div className="text-base sm:text-xl font-bold font-mono text-cyan-400">
            {formatearMoneda(saldoPendiente)}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">Capital pendiente</span>
        </div>

        <div
          className="p-3.5 sm:p-4 rounded-xl border"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,0,0,0.3))',
            borderColor: 'rgba(139,92,246,0.25)',
          }}
        >
          <div className="flex items-center justify-between text-xs text-purple-400 mb-1">
            <span>Clientes</span>
            <Users size={15} />
          </div>
          <div className="text-base sm:text-xl font-bold font-mono text-purple-300">
            {totalClientes}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">Cartera activa</span>
        </div>
      </div>

      {/* 2. Barra de Control: Pestañas + Búsqueda + Botones de Acción */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
        {/* Pestañas */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setTabActiva('prestamos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              tabActiva === 'prestamos'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign size={14} />
            <span>Préstamos Activos</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/60 text-current ml-0.5">
              {prestamos.length}
            </span>
          </button>

          <button
            onClick={() => setTabActiva('clientes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              tabActiva === 'clientes'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={14} />
            <span>Clientes</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/60 text-current ml-0.5">
              {clientes.length}
            </span>
          </button>

          <button
            onClick={() => setTabActiva('cobros')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              tabActiva === 'cobros'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Receipt size={14} />
            <span>Cobros & Recibos</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/60 text-current ml-0.5">
              {pagos.length}
            </span>
          </button>
        </div>

        {/* Acciones principales rápidas */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Buscador */}
          <div className="relative flex-1 sm:w-48">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Botones de creación según contexto */}
          {tabActiva === 'prestamos' && (
            <button
              onClick={() => setModalPrestamoAbierto(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all shadow shadow-amber-500/20 whitespace-nowrap"
            >
              <Plus size={14} />
              <span>Nuevo Préstamo</span>
            </button>
          )}

          {tabActiva === 'clientes' && (
            <button
              onClick={() => setModalClienteAbierto(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-all shadow shadow-cyan-500/20 whitespace-nowrap"
            >
              <Plus size={14} />
              <span>Nuevo Cliente</span>
            </button>
          )}

          <button
            onClick={() => {
              setPrestamoSeleccionadoParaCobro(null)
              setModalCobroAbierto(true)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all shadow shadow-emerald-600/20 whitespace-nowrap"
          >
            <Receipt size={14} />
            <span>Cobrar Cuota</span>
          </button>
        </div>
      </div>

      {/* 3. Contenido de las pestañas */}

      {/* TAB 1: PRÉSTAMOS ACTIVOS */}
      {tabActiva === 'prestamos' && (
        <div className="space-y-3">
          {/* Vista Desktop (Tabla) */}
          <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Código / Cliente</th>
                  <th className="py-3 px-3">Monto & Tasa</th>
                  <th className="py-3 px-3">Cuota Regular</th>
                  <th className="py-3 px-3">Saldo Restante</th>
                  <th className="py-3 px-3">Progreso</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {prestamosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-500">
                      No se encontraron préstamos con ese criterio.
                    </td>
                  </tr>
                ) : (
                  prestamosFiltrados.map((p) => {
                    const progreso = Math.round(
                      ((p.cuotasPagadas || 0) / (p.cuotasTotales || p.plazo || 1)) * 100
                    )
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="text-amber-400 font-mono text-[11px]">{p.id}</span>
                          </div>
                          <div className="font-medium text-slate-300">{p.clienteNombre}</div>
                          <div className="text-[11px] text-slate-500">{p.clienteCedula}</div>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <div className="font-bold text-white">{formatearMoneda(p.monto)}</div>
                          <div className="text-[11px] text-cyan-400">
                            {p.tasa}% • {p.plazo} cuotas
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <div className="font-bold text-amber-300">{formatearMoneda(p.cuota)}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{p.frecuenciaPago}</div>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <div className="font-bold text-emerald-400">{formatearMoneda(p.saldoRestante)}</div>
                        </td>
                        <td className="py-3 px-3 w-36">
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>{p.cuotasPagadas || 0}/{p.cuotasTotales || p.plazo}</span>
                            <span>{progreso}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, progreso)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              p.estado === 'Saldado'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {p.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPrestamoVisualizarAmortizacion(p)}
                              title="Ver Tabla de Amortización"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                            >
                              <FileSpreadsheet size={15} />
                            </button>
                            {p.saldoRestante > 0 && (
                              <button
                                onClick={() => {
                                  setPrestamoSeleccionadoParaCobro(p.id)
                                  setModalCobroAbierto(true)
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Receipt size={12} />
                                <span>Cobrar</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Vista Mobile (Tarjetas) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {prestamosFiltrados.map((p) => {
              const progreso = Math.round(
                ((p.cuotasPagadas || 0) / (p.cuotasTotales || p.plazo || 1)) * 100
              )
              return (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-amber-400 font-mono text-xs font-bold block">{p.id}</span>
                      <h4 className="font-bold text-sm text-white">{p.clienteNombre}</h4>
                      <p className="text-[11px] text-slate-400">Céd: {p.clienteCedula}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.estado}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Monto Prestado</span>
                      <span className="font-bold text-white">{formatearMoneda(p.monto)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Cuota {p.frecuenciaPago}</span>
                      <span className="font-bold text-amber-300">{formatearMoneda(p.cuota)}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-sans">Saldo Restante:</span>
                      <span className="font-bold text-emerald-400">{formatearMoneda(p.saldoRestante)}</span>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Cuotas: {p.cuotasPagadas || 0} de {p.cuotasTotales || p.plazo}</span>
                      <span>{progreso}% pagado</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${progreso}%` }} />
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setPrestamoVisualizarAmortizacion(p)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <FileSpreadsheet size={14} />
                      <span>Amortización</span>
                    </button>
                    {p.saldoRestante > 0 && (
                      <button
                        onClick={() => {
                          setPrestamoSeleccionadoParaCobro(p.id)
                          setModalCobroAbierto(true)
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                      >
                        <Receipt size={14} />
                        <span>Cobrar Cuota</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CLIENTES */}
      {tabActiva === 'clientes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {clientesFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-10 text-slate-500 bg-slate-900/60 rounded-xl border border-slate-800">
              No se encontraron clientes registrados con ese criterio.
            </div>
          ) : (
            clientesFiltrados.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-cyan-500/30 transition-all space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-white">{c.nombreCompleto}</h4>
                    <span className="text-[11px] text-cyan-400 font-mono">Céd: {c.cedula}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {c.estado}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone size={13} className="text-slate-500 flex-shrink-0" />
                    <span>{c.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={13} className="text-slate-500 flex-shrink-0" />
                    <span className="truncate">{c.direccion}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Briefcase size={13} className="text-slate-500 flex-shrink-0" />
                    <span className="truncate">{c.ocupacion}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Préstamos activos: <strong className="text-amber-400">{c.prestamosActivos || 0}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setModalPrestamoAbierto(true)
                    }}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
                  >
                    <span>Emitir Préstamo</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: COBROS & RECIBOS */}
      {tabActiva === 'cobros' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="py-3 px-4">No. Recibo</th>
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Préstamo</th>
                  <th className="py-3 px-3 font-mono">Monto Pagado</th>
                  <th className="py-3 px-3">Método</th>
                  <th className="py-3 px-3">Fecha y Hora</th>
                  <th className="py-3 px-4 text-right">Recibo Oficial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pagosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-500">
                      No hay cobros registrados con ese criterio.
                    </td>
                  </tr>
                ) : (
                  pagosFiltrados.map((pago) => (
                    <tr key={pago.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {pago.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{pago.clienteNombre}</div>
                        <div className="text-[10px] text-slate-500">{pago.clienteCedula}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-400">
                        {pago.prestamoId}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {formatearMoneda(pago.monto)}
                      </td>
                      <td className="py-3 px-3 uppercase text-[11px] text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {pago.metodoPago}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] font-mono">
                        {pago.fechaPago}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setReciboVisualizar(pago)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                        >
                          <Printer size={13} />
                          <span>Ver / Imprimir Ticket</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Banner CTA hacia contratación o personalización */}
      <div
        className="p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,212,255,0.05))',
          borderColor: 'rgba(212, 175, 55, 0.25)',
        }}
      >
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-sm text-white">
            ¿Manejas una financiera, casa de empeño o prestamista independiente?
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Podemos personalizar este sistema con cálculo de mora, cobradores en ruta, contratos legales en PDF y soporte de impresoras térmicas Bluetooth/USB.
          </p>
        </div>
        <button
          onClick={onContact}
          className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/20"
        >
          Cotizar Sistema de Préstamos
        </button>
      </div>

      {/* 5. Modales Funcionales */}
      <NuevoClienteModal
        isOpen={modalClienteAbierto}
        onClose={() => setModalClienteAbierto(false)}
        onGuardarCliente={handleGuardarCliente}
      />

      <NuevoPrestamoModal
        isOpen={modalPrestamoAbierto}
        onClose={() => setModalPrestamoAbierto(false)}
        clientes={clientes}
        onGuardarPrestamo={handleGuardarPrestamo}
      />

      <NuevoCobroModal
        isOpen={modalCobroAbierto}
        onClose={() => setModalCobroAbierto(false)}
        prestamos={prestamos.filter((p) => p.saldoRestante > 0)}
        prestamoSeleccionadoId={prestamoSeleccionadoParaCobro}
        onRegistrarCobro={handleRegistrarCobro}
      />

      <ReciboModal
        isOpen={!!reciboVisualizar}
        onClose={() => setReciboVisualizar(null)}
        recibo={reciboVisualizar}
      />

      <AmortizacionModal
        isOpen={!!prestamoVisualizarAmortizacion}
        onClose={() => setPrestamoVisualizarAmortizacion(null)}
        prestamo={prestamoVisualizarAmortizacion}
      />
    </div>
  )
}
