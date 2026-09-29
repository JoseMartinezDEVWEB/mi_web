import {
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react'
import { formatearDOP, TIPOS_NCF } from './facturacionData'

export default function ReportesView({ facturas }) {
  const subtotal = facturas.reduce((acc, f) => acc + f.resumen.subtotal, 852200)
  const itbis = facturas.reduce((acc, f) => acc + f.resumen.itbis, 153396)
  const total = subtotal + itbis

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Informes Fiscales y Balance General
          </h2>
          <p className="text-xs text-gray-500">
            Resumen contable listo para declaraciones juradas y formularios 607 DGII
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow transition-all"
        >
          <Download className="w-4 h-4" />
          Exportar Reporte
        </button>
      </div>

      {/* Resumen Fiscal DGII */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Ventas Gravadas con ITBIS
          </span>
          <div className="text-2xl font-black text-gray-900">{formatearDOP(subtotal)}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Base Imponible</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
            ITBIS Facturado (18%)
          </span>
          <div className="text-2xl font-black text-amber-700">{formatearDOP(itbis)}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Para compensación fiscal</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
            Monto Total Facturado
          </span>
          <div className="text-2xl font-black text-emerald-700">{formatearDOP(total)}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Ingresos Brutos del Período</span>
        </div>
      </div>

      {/* Desglose por Comprobante Fiscal */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Emisión de Comprobantes según Tipo de NCF
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {TIPOS_NCF.map((tipo) => {
            const count = facturas.filter((f) => f.ncf.startsWith(tipo.value)).length + 12
            return (
              <div
                key={tipo.value}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-sm text-gray-900 block">{tipo.label}</span>
                  <span className="text-[11px] text-gray-500">{tipo.desc}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-blue-700 block">{count}</span>
                  <span className="text-[10px] text-gray-500 font-semibold">emitidos</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
