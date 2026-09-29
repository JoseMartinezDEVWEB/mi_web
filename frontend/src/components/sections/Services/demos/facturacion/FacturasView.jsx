import { useState, useMemo } from 'react'
import {
  FileText,
  Search,
  Printer,
  PlusCircle,
  CheckCircle,
  Filter,
  ArrowDownToLine
} from 'lucide-react'
import { formatearDOP, TIPOS_NCF } from './facturacionData'

export default function FacturasView({ facturas, onSelectFactura, onNavigate }) {
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('TODOS')

  const facturasFiltradas = useMemo(() => {
    return facturas.filter((f) => {
      const matchSearch =
        f.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        f.ncf.toLowerCase().includes(busqueda.toLowerCase()) ||
        f.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (f.cliente.rncCedula && f.cliente.rncCedula.includes(busqueda.trim()))

      const matchTipo =
        filtroTipo === 'TODOS' || f.ncf.startsWith(filtroTipo)

      return matchSearch && matchTipo
    })
  }, [facturas, busqueda, filtroTipo])

  return (
    <div className="space-y-4">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Comprobantes Fiscales y Facturas
          </h2>
          <p className="text-xs text-gray-500">
            Registro cronológico de facturas con validez fiscal DGII
          </p>
        </div>

        <button
          onClick={() => onNavigate('crear-factura')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Nueva Factura (POS)
        </button>
      </div>

      {/* ── Barra de Búsqueda y Filtros NCF ── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por NCF (ej: B01000...), No. Factura o Cliente..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-semibold whitespace-nowrap">
            Tipo NCF:
          </span>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODOS">Todos los NCF</option>
            {TIPOS_NCF.map((t) => (
              <option key={t.value} value={t.value}>
                {t.value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Tabla / Listado de Facturas ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Vista Móvil (< sm): Tarjetas claras */}
        <div className="block sm:hidden p-3 space-y-3">
          {facturasFiltradas.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              No hay comprobantes fiscales que coincidan con la búsqueda
            </div>
          ) : (
            facturasFiltradas.map((f) => (
              <div
                key={f.id}
                className="p-3.5 bg-gray-50/90 rounded-xl border border-gray-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px]">
                    {f.id}
                  </span>
                  <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 text-xs">
                    {f.ncf}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-gray-900 block truncate">{f.cliente.nombre}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{f.cliente.rncCedula}</span>
                  </div>
                  <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700 flex-shrink-0">
                    {f.pago.metodo}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 rounded-lg border border-gray-100 font-mono">
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-sans">Subtotal</span>
                    <span className="text-gray-700">{formatearDOP(f.resumen.subtotal)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[9px] uppercase font-sans">ITBIS 18%</span>
                    <span className="text-amber-600 font-semibold">{formatearDOP(f.resumen.itbis)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Total DOP:</span>
                    <span className="font-black text-sm text-emerald-700 font-mono">
                      {formatearDOP(f.resumen.total)}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectFactura(f)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Ticket
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Vista Desktop / Tablet (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[760px]">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">No. Factura</th>
                <th className="py-3 px-4 whitespace-nowrap">NCF Fiscal</th>
                <th className="py-3 px-4 whitespace-nowrap">Cliente / RNC</th>
                <th className="py-3 px-4 whitespace-nowrap">Fecha y Hora</th>
                <th className="py-3 px-4 whitespace-nowrap">Método</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Subtotal</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">ITBIS 18%</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Total Factura</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facturasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    No hay comprobantes fiscales que coincidan con la búsqueda
                  </td>
                </tr>
              ) : (
                facturasFiltradas.map((f) => (
                  <tr key={f.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">{f.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {f.ncf}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800 whitespace-nowrap">{f.cliente.nombre}</div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {f.cliente.rncCedula}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{f.fecha}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {f.pago.metodo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-600 whitespace-nowrap">
                      {formatearDOP(f.resumen.subtotal)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600 font-medium whitespace-nowrap">
                      {formatearDOP(f.resumen.itbis)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-700 whitespace-nowrap">
                      {formatearDOP(f.resumen.total)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectFactura(f)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-semibold transition-all inline-flex items-center gap-1 shadow-sm"
                        title="Ver ticket de factura"
                      >
                        <Printer className="w-3 h-3" />
                        Ticket
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
