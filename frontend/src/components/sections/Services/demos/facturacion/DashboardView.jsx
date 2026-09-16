import { motion } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  FileText,
  Users,
  Package,
  PlusCircle,
  ArrowUpRight,
  ShieldCheck,
  Printer,
  Calendar,
  Layers
} from 'lucide-react'
import { formatearDOP, VENTAS_DIARIAS_SEMANA } from './facturacionData'

export default function DashboardView({
  facturas,
  productos,
  clientes,
  onNavigate,
  onSelectFactura,
}) {
  const totalVentas = facturas.reduce((acc, f) => acc + f.resumen.total, 852200)
  const totalITBIS = facturas.reduce((acc, f) => acc + f.resumen.itbis, 153396)
  const totalFacturas = 150 + facturas.length
  const totalProductos = productos.length

  const maxVenta = Math.max(...VENTAS_DIARIAS_SEMANA.map((v) => v.ventas))

  return (
    <div className="space-y-6">
      {/* ── Tarjetas de Métricas Principales (Diseño app-total) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Ventas */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Ventas Totales
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {formatearDOP(totalVentas)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+18.4% vs mes anterior</span>
            </div>
          </div>
        </motion.div>

        {/* Facturas Creadas */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Comprobantes NCF
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {totalFacturas}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <span className="font-semibold text-emerald-600">100% validados</span> ante la DGII
            </div>
          </div>
        </motion.div>

        {/* Total Clientes */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Clientes Registrados
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {clientes.length + 52}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <span>Empresas RNC y personas físicas</span>
            </div>
          </div>
        </motion.div>

        {/* ITBIS Recaudado */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              ITBIS 18% Recaudado
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-700 tracking-tight">
              {formatearDOP(totalITBIS)}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <span>Reporte 606 / 607 listo</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Gráfico de Ventas de la Semana y Acciones Rápidas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Gráfico de Ventas Diarias */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-gray-900">Ventas de la Semana</h3>
              <p className="text-xs text-gray-500">Rendimiento en DOP de facturación diaria</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Últimos 7 Días
            </span>
          </div>

          {/* Gráfico de Barras CSS Interactivas */}
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
            {VENTAS_DIARIAS_SEMANA.map((dia) => {
              const alturaPorcentaje = Math.round((dia.ventas / maxVenta) * 100)
              const esHoy = dia.dia === 'Hoy'

              return (
                <div key={dia.dia} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Tooltip de valor en hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                    {formatearDOP(dia.ventas)}
                  </div>
                  {/* Barra */}
                  <div className="w-full bg-gray-100 rounded-t-lg h-36 flex items-end p-0.5">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${alturaPorcentaje}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`w-full rounded-t-md transition-all ${
                        esHoy
                          ? 'bg-gradient-to-t from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20'
                          : 'bg-blue-300 hover:bg-blue-400'
                      }`}
                    />
                  </div>
                  {/* Etiqueta del día */}
                  <span
                    className={`text-xs font-semibold ${
                      esHoy ? 'text-blue-600 font-bold' : 'text-gray-500'
                    }`}
                  >
                    {dia.dia}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Acceso Rápido y Cumplimiento DGII */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
            <h4 className="font-bold text-base mb-1">Punto de Venta Directo</h4>
            <p className="text-xs text-blue-100 mb-4">
              Emite facturas al instante con comprobantes B01, B02 o B14 autorizados.
            </p>
            <button
              onClick={() => onNavigate('crear-factura')}
              className="w-full py-2.5 px-4 bg-white hover:bg-blue-50 text-blue-800 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Abrir POS / Nueva Factura
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
            <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
              Estado de la Licencia & DGII
            </h4>
            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
              <span className="text-gray-600">Servidor DGII</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Conectado
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
              <span className="text-gray-600">Modo de Emisión</span>
              <span className="font-bold text-blue-600">e-CF Online</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-gray-600">Catálogo Activo</span>
              <span className="font-bold text-gray-800">{totalProductos} productos</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Últimas Facturas Emitidas ── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-gray-900">Últimos Comprobantes Emitidos</h3>
            <p className="text-xs text-gray-500">Facturas generadas recientemente en el sistema</p>
          </div>
          <button
            onClick={() => onNavigate('facturas')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Ver Todas ({facturas.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-3">No. Factura</th>
                <th className="py-2.5 px-3">NCF</th>
                <th className="py-2.5 px-3">Cliente</th>
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3">Método</th>
                <th className="py-2.5 px-3 text-right">Total DOP</th>
                <th className="py-2.5 px-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facturas.slice(0, 5).map((f) => (
                <tr key={f.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-gray-900">{f.id}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{f.ncf}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-gray-800 block">{f.cliente.nombre}</span>
                    <span className="text-[10px] text-gray-500">{f.cliente.rncCedula}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{f.fecha}</td>
                  <td className="py-3 px-3 font-semibold uppercase text-gray-700">{f.pago.metodo}</td>
                  <td className="py-3 px-3 text-right font-black text-emerald-700">
                    {formatearDOP(f.resumen.total)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onSelectFactura(f)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-slate-900 hover:text-white text-gray-700 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      Ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
