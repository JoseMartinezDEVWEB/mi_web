import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Check,
  ShoppingCart,
  TrendingDown,
  Users,
  CreditCard,
  Wallet,
  Briefcase,
  PiggyBank,
  FileText,
  DollarSign
} from 'lucide-react'

export default function InventarioFinancialModal({
  isOpen,
  onClose,
  tipo,
  datosFinancieros,
  onGuardar
}) {
  if (!isOpen || !tipo) return null

  const configMap = {
    ventas: {
      title: 'Ventas del Mes',
      desc: 'Registro de facturación acumulada del periodo contable auditado.',
      icon: <ShoppingCart className="w-6 h-6 text-blue-500" />,
      color: 'border-blue-500/30 text-blue-500 bg-blue-500/10',
      key: 'ventasDelMes',
      defaultValue: datosFinancieros?.ventasDelMes || 0
    },
    gastos: {
      title: 'Gastos Generales',
      desc: 'Gastos operacionales, administrativos y de nómina del ejercicio.',
      icon: <TrendingDown className="w-6 h-6 text-rose-500" />,
      color: 'border-rose-500/30 text-rose-500 bg-rose-500/10',
      key: 'gastosGenerales',
      defaultValue: datosFinancieros?.gastosGenerales || 0
    },
    cuentasPorCobrar: {
      title: 'Cuentas por Cobrar (Clientes)',
      desc: 'Cartera de crédito pendiente de cobro para arqueo y balance.',
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      color: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10',
      key: 'cuentasPorCobrar',
      defaultValue: datosFinancieros?.cuentasPorCobrar || 0
    },
    cuentasPorPagar: {
      title: 'Cuentas por Pagar (Proveedores)',
      desc: 'Obligaciones comerciales pendientes con suplidores a la fecha.',
      icon: <CreditCard className="w-6 h-6 text-amber-500" />,
      color: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
      key: 'cuentasPorPagar',
      defaultValue: datosFinancieros?.cuentasPorPagar || 0
    },
    efectivo: {
      title: 'Efectivo en Caja y Bancos',
      desc: 'Saldo disponible verificado en bóveda, cajas registradoras y cuentas.',
      icon: <Wallet className="w-6 h-6 text-purple-500" />,
      color: 'border-purple-500/30 text-purple-500 bg-purple-500/10',
      key: 'efectivoEnCajaYBanco',
      defaultValue: datosFinancieros?.efectivoEnCajaYBanco || 0
    },
    activosFijos: {
      title: 'Activos Fijos Registrados',
      desc: 'Valor en libros de maquinarias, mobiliario, vehículos y equipos.',
      icon: <Briefcase className="w-6 h-6 text-indigo-500" />,
      color: 'border-indigo-500/30 text-indigo-500 bg-indigo-500/10',
      key: 'activosFijos',
      defaultValue: datosFinancieros?.activosFijos || 0
    },
    capital: {
      title: 'Capital y Patrimonio',
      desc: 'Capital suscrito, pagado y reservas para comprobación de balance.',
      icon: <PiggyBank className="w-6 h-6 text-yellow-500" />,
      color: 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10',
      key: 'capital',
      defaultValue: datosFinancieros?.capital || 0
    },
    reporte: {
      title: 'Resumen Financiero del Cierre',
      desc: 'Balance consolidado de auditoría preliminar con inventario físico.',
      icon: <FileText className="w-6 h-6 text-teal-500" />,
      color: 'border-teal-500/30 text-teal-500 bg-teal-500/10',
      isSummary: true
    }
  }

  const current = configMap[tipo] || configMap.ventas
  const [monto, setMonto] = useState(current.defaultValue ?? '')
  const [notas, setNotas] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    if (current.isSummary) {
      onClose()
      return
    }
    onGuardar(current.key, parseFloat(monto) || 0)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${current.color}`}>
                {current.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">{current.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{current.desc}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          {current.isSummary ? (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Ventas Registradas</span>
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                    RD$ {(datosFinancieros?.ventasDelMes || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Gastos Generales</span>
                  <p className="text-base font-bold text-rose-600 dark:text-rose-400">
                    RD$ {(datosFinancieros?.gastosGenerales || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Cuentas por Cobrar</span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    RD$ {(datosFinancieros?.cuentasPorCobrar || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Cuentas por Pagar</span>
                  <p className="text-base font-bold text-amber-600 dark:text-amber-400">
                    RD$ {(datosFinancieros?.cuentasPorPagar || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Efectivo en Caja/Banco</span>
                  <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                    RD$ {(datosFinancieros?.efectivoEnCajaYBanco || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Activos Fijos</span>
                  <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                    RD$ {(datosFinancieros?.activosFijos || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                    Total Activos Circulantes + Fijos:
                  </span>
                  <span className="text-lg font-black text-blue-700 dark:text-blue-300">
                    RD$ {(
                      (datosFinancieros?.efectivoEnCajaYBanco || 0) +
                      (datosFinancieros?.cuentasPorCobrar || 0) +
                      (datosFinancieros?.activosFijos || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
                >
                  Entendido
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Monto Auditado (RD$)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Notas / Observación de Auditoría
                </label>
                <textarea
                  rows="2"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Detalles sobre comprobantes, conciliación o soporte..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  Guardar Dato
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
