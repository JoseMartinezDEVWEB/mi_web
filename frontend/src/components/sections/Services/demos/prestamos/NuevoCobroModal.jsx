/* Modal interactivo para registrar un cobro o abono a un préstamo con emisión de recibo */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, DollarSign, CreditCard, FileText, CheckCircle2,
  AlertCircle, Receipt, ArrowRight
} from 'lucide-react'
import { formatearMoneda } from './prestamoData'

export default function NuevoCobroModal({
  isOpen,
  onClose,
  prestamos,
  prestamoSeleccionadoId,
  onRegistrarCobro,
}) {
  const [prestamoId, setPrestamoId] = useState(
    prestamoSeleccionadoId || prestamos[0]?.id || ''
  )
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [comentario, setComentario] = useState('')
  const [montoAbono, setMontoAbono] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  // Préstamo actualmente seleccionado
  const prestamoActual = prestamos.find((p) => p.id === prestamoId) || prestamos[0]

  // Monto predeterminado sugerido
  const montoPorDefecto = prestamoActual ? prestamoActual.cuota : 0
  const valorMonto = montoAbono === '' ? montoPorDefecto : parseFloat(montoAbono) || 0

  if (!isOpen || !prestamoActual) return null

  const nuevoSaldo = Math.max(0, (prestamoActual.saldoRestante || 0) - valorMonto)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!valorMonto || valorMonto <= 0) {
      setError('El monto de cobro debe ser mayor a 0')
      return
    }

    const nuevoRecibo = {
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      prestamoId: prestamoActual.id,
      clienteNombre: prestamoActual.clienteNombre,
      clienteCedula: prestamoActual.clienteCedula,
      monto: valorMonto,
      fechaPago: new Date().toLocaleDateString('es-DO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      metodoPago,
      numeroCuota: (prestamoActual.cuotasPagadas || 0) + 1,
      nuevoSaldo,
      comentario: comentario.trim() || 'Abono a cuota del préstamo',
    }

    setExito(true)
    setTimeout(() => {
      onRegistrarCobro(nuevoRecibo, prestamoActual.id, valorMonto)
      setExito(false)
      onClose()
    }, 700)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 text-white font-sans my-4"
        >
          {/* Header */}
          <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Receipt size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Registrar Cobro de Cuota</h3>
                <p className="text-xs text-slate-400">Genera recibo y actualiza el balance de la deuda</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {exito && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-sm"
              >
                <CheckCircle2 size={18} />
                <span>¡Cobro aplicado! Generando recibo oficial...</span>
              </motion.div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-1.5">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* Selección de Préstamo */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Seleccionar Préstamo a Cobrar *
              </label>
              <select
                value={prestamoId}
                onChange={(e) => {
                  setPrestamoId(e.target.value)
                  setMontoAbono('')
                  setError('')
                }}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              >
                {prestamos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.clienteNombre} (Saldo: {formatearMoneda(p.saldoRestante)})
                  </option>
                ))}
              </select>
            </div>

            {/* Ficha rápida del préstamo */}
            {prestamoActual && (
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Cliente Deudor:</span>
                  <span className="font-semibold text-white">{prestamoActual.clienteNombre}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Saldo Pendiente Actual:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {formatearMoneda(prestamoActual.saldoRestante)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cuota Fija Regular:</span>
                  <span className="text-cyan-400 font-mono font-medium">
                    {formatearMoneda(prestamoActual.cuota)} ({prestamoActual.frecuenciaPago})
                  </span>
                </div>
              </div>
            )}

            {/* Monto del abono */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Monto a Cobrar (RD$) *
                </label>
                {prestamoActual && (
                  <button
                    type="button"
                    onClick={() => setMontoAbono(prestamoActual.cuota)}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Usar Cuota Completa ({formatearMoneda(prestamoActual.cuota)})
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <DollarSign size={16} />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={montoAbono === '' ? montoPorDefecto : montoAbono}
                  onChange={(e) => {
                    setMontoAbono(e.target.value)
                    setError('')
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-base font-bold focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Método de Pago *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'efectivo', label: 'Efectivo' },
                  { id: 'transferencia', label: 'Transferencia' },
                  { id: 'cheque', label: 'Cheque / Otro' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMetodoPago(m.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      metodoPago === m.id
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comentario / Referencia */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Comentario o No. de Referencia (Opcional)
              </label>
              <input
                type="text"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Ej: Pago de cuota #5 en oficina / Ref: BHD-9831"
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Impacto en el balance */}
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
              <span className="text-slate-300">Nuevo Saldo Restante:</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400 line-through">
                  {formatearMoneda(prestamoActual.saldoRestante)}
                </span>
                <ArrowRight size={13} className="text-emerald-400" />
                <span className="font-bold text-emerald-400 text-sm">
                  {formatearMoneda(nuevoSaldo)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Receipt size={15} />
                <span>Cobrar y Ver Recibo</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
