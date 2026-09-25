/* Modal de Recibo Térmico de Pago (80mm) con soporte de impresión */
import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Printer, CheckCircle, X, Download, ShieldCheck } from 'lucide-react'
import { formatearMoneda } from './prestamoData'

export default function ReciboModal({ isOpen, onClose, recibo }) {
  const printRef = useRef(null)

  if (!isOpen || !recibo) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-800 font-sans border border-gray-200 my-4"
        >
          {/* Barra superior de acciones */}
          <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-sm">Cobro Registrado con Éxito</h3>
                <p className="text-[11px] text-gray-400">Comprobante Oficial de Pago</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                title="Imprimir Recibo"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Ticket térmico estilo 80mm */}
          <div className="p-4 sm:p-6 bg-gray-100 flex justify-center">
            <div
              ref={printRef}
              className="w-full max-w-[340px] bg-white rounded-lg shadow-sm border border-gray-300 p-5 font-mono text-[11px] sm:text-[12px] text-gray-800 space-y-2.5"
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
            >
              {/* Encabezado */}
              <div className="text-center space-y-0.5 border-b border-dashed border-gray-300 pb-3">
                <div className="font-bold text-sm text-gray-900 tracking-wide">
                  J4 TECHNOLOGY S.R.L
                </div>
                <div className="text-[10px] text-gray-500 font-sans uppercase font-bold tracking-wider">
                  Sistema de Préstamos J4Pro
                </div>
                <div className="text-[10px] text-gray-600">RNC: 1-32-84931-2</div>
                <div className="text-[10px] text-gray-600">Tel: (809) 613-3196</div>
                <div className="text-[10px] text-gray-500">Santo Domingo, Rep. Dominicana</div>
              </div>

              {/* Título de Recibo */}
              <div className="text-center py-1 border-b border-dashed border-gray-300">
                <div className="font-black text-xs text-gray-900 tracking-wider">
                  RECIBO DE PAGO
                </div>
                <div className="text-[10px] text-gray-500">Abono Oficial a Cuota</div>
              </div>

              {/* Metadatos */}
              <div className="space-y-1 py-1 text-[11px] border-b border-dashed border-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-500">Recibo No:</span>
                  <span className="font-bold text-gray-900">{recibo.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha / Hora:</span>
                  <span>{recibo.fechaPago}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Préstamo:</span>
                  <span className="font-semibold text-gray-800">{recibo.prestamoId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cuota No:</span>
                  <span className="font-semibold text-gray-800">#{recibo.numeroCuota}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Método de Pago:</span>
                  <span className="uppercase font-semibold text-gray-800">{recibo.metodoPago}</span>
                </div>
              </div>

              {/* Datos del Cliente */}
              <div className="space-y-1 py-1 text-[11px] border-b border-dashed border-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cliente:</span>
                  <span className="font-bold text-gray-900 text-right">{recibo.clienteNombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cédula:</span>
                  <span className="text-gray-700">{recibo.clienteCedula}</span>
                </div>
              </div>

              {/* Monto Cobrado */}
              <div className="py-2 border-b-2 border-dashed border-gray-400 text-center space-y-1 bg-gray-50 rounded">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Monto Pagado
                </div>
                <div className="text-xl font-black text-emerald-700">
                  {formatearMoneda(recibo.monto)}
                </div>
                <div className="text-[10px] text-gray-600 flex justify-between px-3 pt-1 border-t border-gray-200">
                  <span>Nuevo Saldo Restante:</span>
                  <span className="font-bold">{formatearMoneda(recibo.nuevoSaldo)}</span>
                </div>
              </div>

              {/* Comentarios si existen */}
              {recibo.comentario && (
                <div className="text-[10px] text-gray-600 italic border-b border-dashed border-gray-300 pb-2">
                  <span className="font-bold not-italic">Nota:</span> {recibo.comentario}
                </div>
              )}

              {/* Pie con Términos */}
              <div className="text-center pt-2 space-y-1">
                <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <ShieldCheck size={12} />
                  <span>TRANSACCIÓN CERTIFICADA</span>
                </div>
                <p className="text-[9px] text-gray-400 leading-tight">
                  Este recibo es válido como comprobante oficial de abono o liquidación. Consérvelo para cualquier aclaración contable.
                </p>
                <p className="text-[9px] font-bold text-gray-500 pt-1">
                  ¡Gracias por su puntualidad!
                </p>
              </div>
            </div>
          </div>

          {/* Pie del modal */}
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Recibo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
