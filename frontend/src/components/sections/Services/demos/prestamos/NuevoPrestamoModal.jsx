/* Modal interactivo para crear un nuevo préstamo con cálculo de amortización en vivo */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, DollarSign, Percent, Calendar, Clock, User,
  FileSpreadsheet, CheckCircle2, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react'
import { formatearMoneda, calcularAmortizacion } from './prestamoData'

export default function NuevoPrestamoModal({ isOpen, onClose, clientes, onGuardarPrestamo }) {
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '')
  const [monto, setMonto] = useState(50000)
  const [tasa, setTasa] = useState(18)
  const [plazo, setPlazo] = useState(12)
  const [frecuenciaPago, setFrecuenciaPago] = useState('mensual')
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0])
  const [mostrarAmortizacion, setMostrarAmortizacion] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState('')

  // Cálculo dinámico en tiempo real
  const amortizacion = useMemo(() => {
    return calcularAmortizacion(monto, tasa, plazo, frecuenciaPago, fechaInicio)
  }, [monto, tasa, plazo, frecuenciaPago, fechaInicio])

  if (!isOpen) return null

  const handleMontoRapido = (valor) => {
    setMonto(valor)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!clienteId) {
      setError('Debes seleccionar un cliente')
      return
    }
    if (!monto || monto <= 0) {
      setError('El monto debe ser mayor a 0')
      return
    }
    if (!plazo || plazo <= 0) {
      setError('El plazo debe ser mayor a 0')
      return
    }

    const clienteSel = clientes.find((c) => String(c.id) === String(clienteId)) || clientes[0]

    const nuevoPrestamo = {
      id: `PREST-${Math.floor(1000 + Math.random() * 9000)}`,
      clienteId: clienteSel.id,
      clienteNombre: clienteSel.nombreCompleto,
      clienteCedula: clienteSel.cedula,
      monto: parseFloat(monto),
      tasa: parseFloat(tasa),
      plazo: parseInt(plazo, 10),
      frecuenciaPago,
      fechaInicio,
      cuota: amortizacion.cuota,
      saldoRestante: parseFloat(monto),
      cuotasPagadas: 0,
      cuotasTotales: parseInt(plazo, 10),
      estado: 'Al Día',
    }

    setExito(true)
    setTimeout(() => {
      onGuardarPrestamo(nuevoPrestamo)
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
          className="w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 text-white font-sans my-4 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <DollarSign size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Nuevo Préstamo & Amortización</h3>
                <p className="text-xs text-slate-400">Calcula cuotas y emite contratos al instante</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Formulario con scroll si es necesario */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
            {exito && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-sm"
              >
                <CheckCircle2 size={18} />
                <span>¡Préstamo emitido y amortización guardada exitosamente!</span>
              </motion.div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* Selección de Cliente */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cliente Solicitante *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <select
                  value={clienteId}
                  onChange={(e) => {
                    setClienteId(e.target.value)
                    setError('')
                  }}
                  className="w-full pl-9 pr-8 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombreCompleto} — Céd: {c.cedula}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Monto del préstamo */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Monto a Prestar (RD$) *
                </label>
                <div className="flex gap-1">
                  {[25000, 50000, 100000, 150000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleMontoRapido(v)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                        monto === v
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {v >= 1000 ? `${v / 1000}k` : v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <span className="text-xs font-bold">RD$</span>
                </div>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={monto}
                  onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
                  className="w-full pl-12 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Tasa, Frecuencia y Plazo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tasa Anual (%) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Percent size={14} />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={tasa}
                    onChange={(e) => setTasa(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Frecuencia *
                </label>
                <select
                  value={frecuenciaPago}
                  onChange={(e) => setFrecuenciaPago(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors capitalize"
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="quincenal">Quincenal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Plazo ({frecuenciaPago === 'diario' ? 'días' : frecuenciaPago === 'semanal' ? 'semanas' : frecuenciaPago === 'quincenal' ? 'quincenas' : 'meses'}) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Clock size={14} />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={plazo}
                    onChange={(e) => setPlazo(parseInt(e.target.value, 10) || 1)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Fecha de inicio */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fecha de Desembolso / Primer Pago
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Calendar size={15} />
                </div>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Tarjeta de cálculo en vivo */}
            <div
              className="p-4 rounded-xl border space-y-3"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,212,255,0.05))',
                borderColor: 'rgba(212,175,55,0.25)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  Cálculo de Amortización Automático
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  Frecuencia: {frecuenciaPago}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase">Cuota Fija</span>
                  <span className="text-base sm:text-lg font-bold text-amber-400 font-mono">
                    {formatearMoneda(amortizacion.cuota)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase">Total Interés</span>
                  <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono">
                    {formatearMoneda(amortizacion.totalInteres)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase">Total a Pagar</span>
                  <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                    {formatearMoneda(amortizacion.totalPagar)}
                  </span>
                </div>
              </div>

              {/* Botón desplegar vista previa de tabla */}
              <button
                type="button"
                onClick={() => setMostrarAmortizacion(!mostrarAmortizacion)}
                className="w-full py-1.5 text-xs text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-1 transition-colors pt-1"
              >
                <FileSpreadsheet size={13} />
                <span>{mostrarAmortizacion ? 'Ocultar tabla de pagos' : `Previsualizar tabla (${amortizacion.tabla.length} cuotas)`}</span>
                {mostrarAmortizacion ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {/* Vista previa compacta de la tabla de amortización */}
              {mostrarAmortizacion && (
                <div className="max-h-48 overflow-y-auto border border-slate-700 rounded-lg text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] sticky top-0">
                      <tr>
                        <th className="p-1.5">#</th>
                        <th className="p-1.5">Fecha</th>
                        <th className="p-1.5 text-right">Cuota</th>
                        <th className="p-1.5 text-right">Capital</th>
                        <th className="p-1.5 text-right">Interés</th>
                        <th className="p-1.5 text-right">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                      {amortizacion.tabla.map((f) => (
                        <tr key={f.numeroPago} className="hover:bg-slate-800/40">
                          <td className="p-1.5">{f.numeroPago}</td>
                          <td className="p-1.5 text-slate-400">{f.fechaPago}</td>
                          <td className="p-1.5 text-right text-amber-300">{formatearMoneda(f.cuota)}</td>
                          <td className="p-1.5 text-right text-emerald-400">{formatearMoneda(f.capital)}</td>
                          <td className="p-1.5 text-right text-cyan-400">{formatearMoneda(f.interes)}</td>
                          <td className="p-1.5 text-right text-white font-bold">{formatearMoneda(f.saldo)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer acciones */}
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
              >
                Guardar y Emitir Préstamo
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
