/* Modal de Visualización de Tabla de Amortización completa */
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, DollarSign, Percent, Clock, FileSpreadsheet, ShieldCheck } from 'lucide-react'
import { formatearMoneda, calcularAmortizacion } from './prestamoData'

export default function AmortizacionModal({ isOpen, onClose, prestamo }) {
  if (!isOpen || !prestamo) return null

  // Calcular la amortización para este préstamo
  const { cuota, totalInteres, totalPagar, tabla } = calcularAmortizacion(
    prestamo.monto,
    prestamo.tasa,
    prestamo.plazo,
    prestamo.frecuenciaPago,
    prestamo.fechaInicio
  )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          className="w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 text-white font-sans my-4"
        >
          {/* Header */}
          <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <FileSpreadsheet size={22} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  Tabla de Amortización — {prestamo.id}
                </h3>
                <p className="text-xs text-slate-400">
                  Cliente: <span className="text-cyan-400 font-medium">{prestamo.clienteNombre}</span> ({prestamo.clienteCedula})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Resumen de parámetros */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-slate-800/40 border-b border-slate-700/70 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 block text-[11px] mb-1">Monto Original</span>
              <span className="font-bold text-white text-sm sm:text-base">
                {formatearMoneda(prestamo.monto)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 block text-[11px] mb-1">Tasa & Plazo</span>
              <span className="font-bold text-cyan-400 text-sm sm:text-base">
                {prestamo.tasa}% • {prestamo.plazo} {prestamo.frecuenciaPago === 'diario' ? 'días' : prestamo.frecuenciaPago === 'semanal' ? 'semanas' : prestamo.frecuenciaPago === 'quincenal' ? 'quincenas' : 'meses'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 block text-[11px] mb-1">Cuota Fija</span>
              <span className="font-bold text-amber-400 text-sm sm:text-base">
                {formatearMoneda(cuota)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 block text-[11px] mb-1">Total a Devolver</span>
              <span className="font-bold text-emerald-400 text-sm sm:text-base">
                {formatearMoneda(totalPagar)}
              </span>
            </div>
          </div>

          {/* Tabla de amortización con scroll */}
          <div className="p-4 sm:p-6 max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="sticky top-0 bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3"># Cuota</th>
                  <th className="py-2.5 px-3">Fecha Venc.</th>
                  <th className="py-2.5 px-3 text-right">Cuota</th>
                  <th className="py-2.5 px-3 text-right">Abono Capital</th>
                  <th className="py-2.5 px-3 text-right">Interés</th>
                  <th className="py-2.5 px-3 text-right">Saldo Restante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {tabla.map((fila) => {
                  const pagada = fila.numeroPago <= (prestamo.cuotasPagadas || 0)
                  return (
                    <tr
                      key={fila.numeroPago}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        pagada ? 'bg-emerald-950/20 text-slate-300' : 'text-slate-200'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          {pagada && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                          Cuota {fila.numeroPago}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-xs">
                        {fila.fechaPago}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-amber-300 font-mono">
                        {formatearMoneda(fila.cuota)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-400 font-mono">
                        {formatearMoneda(fila.capital)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-cyan-400 font-mono">
                        {formatearMoneda(fila.interes)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-white font-mono">
                        {formatearMoneda(fila.saldo)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-slate-800/80 px-6 py-3 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Cuotas pagadas: {prestamo.cuotasPagadas || 0} de {prestamo.plazo}</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl text-xs transition-colors"
            >
              Cerrar Vista
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
