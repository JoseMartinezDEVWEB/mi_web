import { useState } from 'react'
import { Settings, Building, Save, CheckCircle, Printer, Key, Shield } from 'lucide-react'
import { DATOS_EMPRESA } from './facturacionData'

export default function ConfiguracionView() {
  const [empresa, setEmpresa] = useState(DATOS_EMPRESA)
  const [guardado, setGuardado] = useState(false)

  const handleGuardar = (e) => {
    e.preventDefault()
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
  }

  return (
    <div className="space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Configuración General del Negocio & NCF
          </h2>
          <p className="text-xs text-gray-500">
            Ajustes fiscales, datos de impresión para tickets y parámetros DGII
          </p>
        </div>

        {guardado && (
          <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle className="w-4 h-4" /> Configuración Guardada
          </span>
        )}
      </div>

      <form onSubmit={handleGuardar} className="space-y-4">
        {/* Datos Fiscales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Building className="w-4 h-4 text-blue-600" />
            Información de la Empresa (Encabezado de Factura)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Nombre Comercial / Razón Social</label>
              <input
                type="text"
                value={empresa.nombre}
                onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">RNC (Registro Nacional de Contribuyente)</label>
              <input
                type="text"
                value={empresa.rnc}
                onChange={(e) => setEmpresa({ ...empresa, rnc: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Teléfono Principal</label>
              <input
                type="text"
                value={empresa.telefono}
                onChange={(e) => setEmpresa({ ...empresa, telefono: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Email de Facturación</label>
              <input
                type="email"
                value={empresa.email}
                onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-gray-700 block mb-1">Dirección Física</label>
              <input
                type="text"
                value={empresa.direccion}
                onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Parámetros de Impresión y DGII */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Printer className="w-4 h-4 text-indigo-600" />
            Parámetros de Impresión Térmica (80mm) y Tasa de ITBIS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Tasa de ITBIS</label>
              <div className="p-2.5 bg-gray-100 rounded-xl border border-gray-200 font-bold text-gray-800">
                18% (Tasa Estándar DGII)
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Formato de Ticket</label>
              <div className="p-2.5 bg-gray-100 rounded-xl border border-gray-200 font-bold text-gray-800">
                Térmico 80mm ESC/POS
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Caja / Punto de Emisión</label>
              <input
                type="text"
                value={empresa.puntoEmision}
                onChange={(e) => setEmpresa({ ...empresa, puntoEmision: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  )
}
