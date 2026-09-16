import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Printer, CheckCircle, X, RotateCcw, Building, FileText, QrCode } from 'lucide-react'
import { formatearDOP, DATOS_EMPRESA } from './facturacionData'

export default function FacturaTicketModal({ isOpen, onClose, factura, onNuevaVenta }) {
  const printContentRef = useRef(null)

  if (!isOpen || !factura) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-800 font-sans border border-gray-200 my-4"
        >
          {/* Barra superior de acciones */}
          <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-sm">Factura Emitida con Éxito</h3>
                <p className="text-[11px] text-gray-400">Comprobante Fiscal Oficial DGII</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contenedor del Ticket Imprimible (Diseño POS 80mm de app-total) */}
          <div className="p-6 bg-gray-100 flex justify-center">
            <div
              ref={printContentRef}
              className="w-full max-w-[370px] bg-white rounded-lg shadow-sm border border-gray-300 p-5 font-mono text-[12px] text-gray-800 space-y-3"
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
            >
              {/* Encabezado del negocio */}
              <div className="text-center pb-3 border-b border-dashed border-gray-300">
                <h2 className="font-bold text-base text-gray-900 tracking-tight font-sans">
                  {DATOS_EMPRESA.nombre}
                </h2>
                <p className="text-[11px] text-gray-600">{DATOS_EMPRESA.direccion}</p>
                <p className="text-[11px] text-gray-600">Tel: {DATOS_EMPRESA.telefono}</p>
                <p className="text-[11px] font-bold text-gray-800">RNC: {DATOS_EMPRESA.rnc}</p>
                <div className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] rounded font-bold">
                  {DATOS_EMPRESA.sucursal} • {DATOS_EMPRESA.puntoEmision}
                </div>
              </div>

              {/* Datos de Comprobante Fiscal */}
              <div className="py-2 border-b border-dashed border-gray-300 space-y-1">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>NCF:</span>
                  <span className="text-blue-900 font-black">{factura.ncf}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tipo:</span>
                  <span className="font-medium text-right">{factura.tipoNCFLabel}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Fecha/Hora:</span>
                  <span>{factura.fecha}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Cajero:</span>
                  <span>{factura.cajero || 'Cajero 01'}</span>
                </div>
              </div>

              {/* Datos del Cliente */}
              <div className="py-2 border-b border-dashed border-gray-300 space-y-0.5">
                <div className="text-gray-500 font-sans font-bold text-[10px] uppercase">Datos del Cliente</div>
                <p className="font-bold text-gray-900 truncate">{factura.cliente.nombre}</p>
                <p className="text-gray-600">RNC/Cédula: {factura.cliente.rncCedula || '000-0000000-0'}</p>
                {factura.cliente.telefono && <p className="text-gray-600">Tel: {factura.cliente.telefono}</p>}
              </div>

              {/* Detalle de Artículos */}
              <div className="py-2 border-b border-dashed border-gray-300">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-[10px]">
                      <th className="pb-1">Cant/Desc</th>
                      <th className="pb-1 text-right">Precio</th>
                      <th className="pb-1 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {factura.items.map((item, idx) => (
                      <tr key={idx} className="align-top">
                        <td className="py-1.5 pr-2">
                          <div className="font-bold text-gray-900 line-clamp-2">{item.name}</div>
                          <div className="text-[10px] text-gray-500">Cant: {item.cantidad}</div>
                        </td>
                        <td className="py-1.5 text-right whitespace-nowrap text-gray-700">
                          {formatearDOP(item.price)}
                        </td>
                        <td className="py-1.5 text-right font-bold text-gray-900 whitespace-nowrap">
                          {formatearDOP(item.cantidad * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div className="py-2 border-b border-dashed border-gray-300 space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatearDOP(factura.resumen.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ITBIS (18%):</span>
                  <span>{formatearDOP(factura.resumen.itbis)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-950 pt-1 border-t border-gray-200 font-sans">
                  <span>TOTAL DOP:</span>
                  <span className="text-emerald-700">{formatearDOP(factura.resumen.total)}</span>
                </div>
              </div>

              {/* Datos de Pago */}
              <div className="py-2 border-b border-dashed border-gray-300 space-y-0.5 text-[11px] text-gray-600">
                <div className="flex justify-between">
                  <span>Método de pago:</span>
                  <span className="font-bold uppercase text-gray-800">{factura.pago.metodo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monto recibido:</span>
                  <span>{formatearDOP(factura.pago.montoRecibido)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cambio / Devuelta:</span>
                  <span className="font-bold text-emerald-700">{formatearDOP(factura.pago.devuelta)}</span>
                </div>
              </div>

              {/* Código de barras / QR y pie fiscal */}
              <div className="text-center pt-2 space-y-2">
                <div className="flex flex-col items-center justify-center py-1">
                  {/* Simulación visual de código de barras */}
                  <div className="flex items-center gap-[2px] h-8 mb-1">
                    {[3,1,2,4,1,3,2,1,4,2,3,1,2,4,1,3,1,2,3,4,2,1,3,1,2].map((w, i) => (
                      <div
                        key={i}
                        className="bg-gray-800 h-full"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500 tracking-widest">{factura.ncf}</span>
                </div>

                <p className="text-[10px] text-gray-500 font-sans leading-tight">
                  Documento emitido electrónicamente con validez fiscal conforme a la Norma General DGII.
                </p>
                <p className="text-[11px] font-bold text-gray-700 font-sans">
                  ¡Gracias por su preferencia!
                </p>
              </div>
            </div>
          </div>

          {/* Pie de modal con botón de Nueva Venta */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cerrar Vista
            </button>
            <button
              onClick={onNuevaVenta}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Iniciar Nueva Factura (F9)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
