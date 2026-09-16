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

      {/* ── Tabla de Facturas ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">No. Factura</th>
                <th className="py-3 px-4">NCF Fiscal</th>
                <th className="py-3 px-4">Cliente / RNC</th>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">ITBIS 18%</th>
                <th className="py-3 px-4 text-right">Total Factura</th>
                <th className="py-3 px-4 text-center">Acciones</th>
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
                    <td className="py-3 px-4 font-bold text-gray-900">{f.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {f.ncf}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">{f.cliente.nombre}</div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {f.cliente.rncCedula}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{f.fecha}</td>
                    <td className="py-3 px-4">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {f.pago.metodo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-600">
                      {formatearDOP(f.resumen.subtotal)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600 font-medium">
                      {formatearDOP(f.resumen.itbis)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-700">
                      {formatearDOP(f.resumen.total)}
                    </td>
                    <td className="py-3 px-4 text-center">
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
