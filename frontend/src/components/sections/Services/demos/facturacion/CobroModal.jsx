import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, CreditCard, ArrowRightLeft, CheckCircle, X, AlertCircle } from 'lucide-react'
import { formatearDOP } from './facturacionData'

export default function CobroModal({ isOpen, onClose, total, onConfirmPayment }) {
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [montoRecibido, setMontoRecibido] = useState('')
  const [nota, setNota] = useState('')

  if (!isOpen) return null

  const montoNum = Number(montoRecibido) || 0
  const devuelta = montoNum >= total ? montoNum - total : 0
  const faltante = total > montoNum ? total - montoNum : 0
  const esEfectivo = metodoPago === 'efectivo'
  const puedeCobrar = !esEfectivo || montoNum >= total

  const billetesSugeridos = [
    { label: 'Exacto', valor: total },
    { label: '+RD$ 500', valor: Math.ceil(total / 500) * 500 },
    { label: '+RD$ 1,000', valor: Math.ceil(total / 1000) * 1000 },
    { label: '+RD$ 2,000', valor: Math.ceil(total / 2000) * 2000 },
  ].filter((b, idx, self) => self.findIndex(s => s.valor === b.valor) === idx && b.valor >= total)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!puedeCobrar) return
    onConfirmPayment({
      metodo: metodoPago,
      montoRecibido: esEfectivo ? montoNum : total,
      devuelta: esEfectivo ? devuelta : 0,
      nota,
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-800 font-sans border border-gray-100"
        >
          {/* Encabezado del modal */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-300" />
                Registrar Pago y Facturar
              </h3>
              <p className="text-xs text-blue-100">Seleccione el método de pago del cliente</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Total a pagar */}
            <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Total a Pagar</span>
              <div className="text-3xl font-extrabold text-blue-900 mt-0.5">
                {formatearDOP(total)}
              </div>
            </div>

            {/* Métodos de Pago */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Método de Pago
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setMetodoPago('efectivo'); setMontoRecibido('') }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    metodoPago === 'efectivo'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <DollarSign className="w-5 h-5 mb-1 text-emerald-600" />
                  Efectivo
                </button>

                <button
                  type="button"
                  onClick={() => { setMetodoPago('tarjeta'); setMontoRecibido(total.toString()) }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    metodoPago === 'tarjeta'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1 text-indigo-600" />
                  Tarjeta
                </button>

                <button
                  type="button"
                  onClick={() => { setMetodoPago('transferencia'); setMontoRecibido(total.toString()) }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    metodoPago === 'transferencia'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ArrowRightLeft className="w-5 h-5 mb-1 text-purple-600" />
                  Transferencia
                </button>
              </div>
            </div>

            {/* Efectivo recibido y cálculo de cambio */}
            {esEfectivo ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Efectivo Recibido (RD$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                      RD$
                    </span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={montoRecibido}
                      onChange={(e) => setMontoRecibido(e.target.value)}
                      placeholder="0.00"
                      autoFocus
                      className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-lg font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Botones de montos sugeridos */}
                <div className="flex flex-wrap gap-1.5">
                  {billetesSugeridos.map((billete) => (
                    <button
                      key={billete.label}
                      type="button"
                      onClick={() => setMontoRecibido(billete.valor.toString())}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 transition-colors border border-gray-200"
                    >
                      {billete.label} ({formatearDOP(billete.valor)})
                    </button>
                  ))}
                </div>

                {/* Resumen del cambio / devuelta */}
                <div className="rounded-xl p-3 bg-gray-50 border border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Devuelta / Cambio</span>
                    <p className={`text-xl font-black ${devuelta > 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
                      {formatearDOP(devuelta)}
                    </p>
                  </div>
                  {faltante > 0 && montoNum > 0 && (
                    <div className="text-right">
                      <span className="text-xs text-amber-600 font-semibold flex items-center gap-1 justify-end">
                        <AlertCircle className="w-3.5 h-3.5" /> Faltante
                      </span>
                      <p className="text-sm font-bold text-amber-700">{formatearDOP(faltante)}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                Pago procesado por valor exacto de {formatearDOP(total)} mediante {metodoPago}.
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!puedeCobrar}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  puedeCobrar
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 active:scale-[0.98]'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Confirmar y Facturar
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
