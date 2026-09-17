import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  X
} from 'lucide-react'
import { TIPOS_NCF, formatearDOP } from './facturacionData'

export default function ClientesView({ clientes, setClientes }) {
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    rncCedula: '',
    telefono: '',
    email: '',
    direccion: '',
    tipoNCF: 'B02',
  })

  const clientesFiltrados = useMemo(() => {
    return clientes.filter((c) => {
      return (
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.rncCedula.includes(busqueda.trim()) ||
        (c.email && c.email.toLowerCase().includes(busqueda.toLowerCase()))
      )
    })
  }, [clientes, busqueda])

  const handleCrearCliente = (e) => {
    e.preventDefault()
    if (!nuevoCliente.nombre) return

    const nuevo = {
      id: Date.now(),
      nombre: nuevoCliente.nombre,
      rncCedula: nuevoCliente.rncCedula || '000-0000000-0',
      telefono: nuevoCliente.telefono || '(809) 000-0000',
      email: nuevoCliente.email || '',
      direccion: nuevoCliente.direccion || 'Santo Domingo, RD',
      tipoNCF: nuevoCliente.tipoNCF,
      saldoPendiente: 0,
    }

    setClientes([nuevo, ...clientes])
    setModalAbierto(false)
    setNuevoCliente({
      nombre: '',
      rncCedula: '',
      telefono: '',
      email: '',
      direccion: '',
      tipoNCF: 'B02',
    })
  }

  const handleEliminarCliente = (id) => {
    setClientes((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Directorio de Clientes y Empresas
          </h2>
          <p className="text-xs text-gray-500">
            Base de datos de contribuyentes, cédulas y comprobantes asignados
          </p>
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Registrar Cliente
        </button>
      </div>

      {/* ── Buscador ── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, RNC o Cédula..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ── Tabla / Directorio de Clientes ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Vista Móvil (< sm): Tarjetas de Clientes */}
        <div className="block sm:hidden p-3 space-y-3">
          {clientesFiltrados.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              No se encontraron clientes
            </div>
          ) : (
            clientesFiltrados.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-gray-50/90 rounded-xl border border-gray-200 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs truncate">{c.nombre}</h4>
                    {c.email && <p className="text-[11px] text-gray-500 truncate">{c.email}</p>}
                  </div>
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex-shrink-0">
                    {c.tipoNCF}
                  </span>
                </div>

                <div className="text-[11px] space-y-0.5 text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                  <p><span className="text-gray-400 font-sans">RNC/Céd:</span> <span className="font-mono font-semibold text-gray-800">{c.rncCedula}</span></p>
                  {c.telefono && <p><span className="text-gray-400 font-sans">Teléfono:</span> {c.telefono}</p>}
                  {c.direccion && <p className="truncate"><span className="text-gray-400 font-sans">Dirección:</span> {c.direccion}</p>}
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => handleEliminarCliente(c.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Vista Desktop / Tablet (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[650px]">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Razón Social / Nombre</th>
                <th className="py-3 px-4 whitespace-nowrap">RNC / Cédula</th>
                <th className="py-3 px-4 whitespace-nowrap">NCF Predeterminado</th>
                <th className="py-3 px-4 whitespace-nowrap">Teléfono</th>
                <th className="py-3 px-4 whitespace-nowrap">Dirección</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No se encontraron clientes
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900 whitespace-nowrap">{c.nombre}</div>
                      {c.email && <div className="text-[11px] text-gray-500 whitespace-nowrap">{c.email}</div>}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-800 whitespace-nowrap">
                      {c.rncCedula}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {c.tipoNCF}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{c.telefono}</td>
                    <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{c.direccion}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleEliminarCliente(c.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar cliente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal de Nuevo Cliente ── */}
      <AnimatePresence>
        {modalAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 font-sans"
            >
              <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Registrar Nuevo Cliente
                </h3>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCrearCliente} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nombre / Razón Social</label>
                  <input
                    type="text"
                    required
                    value={nuevoCliente.nombre}
                    onChange={(e) =>
                      setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
                    }
                    placeholder="Ej: Distribuidora del Este SRL"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">RNC o Cédula</label>
                    <input
                      type="text"
                      value={nuevoCliente.rncCedula}
                      onChange={(e) =>
                        setNuevoCliente({ ...nuevoCliente, rncCedula: e.target.value })
                      }
                      placeholder="1-31-00000-0"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Tipo de NCF</label>
                    <select
                      value={nuevoCliente.tipoNCF}
                      onChange={(e) =>
                        setNuevoCliente({ ...nuevoCliente, tipoNCF: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-900"
                    >
                      {TIPOS_NCF.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={nuevoCliente.telefono}
                      onChange={(e) =>
                        setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
                      }
                      placeholder="(809) 000-0000"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Email</label>
                    <input
                      type="email"
                      value={nuevoCliente.email}
                      onChange={(e) =>
                        setNuevoCliente({ ...nuevoCliente, email: e.target.value })
                      }
                      placeholder="contacto@cliente.com"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Dirección</label>
                  <input
                    type="text"
                    value={nuevoCliente.direccion}
                    onChange={(e) =>
                      setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })
                    }
                    placeholder="Calle, Sector, Ciudad"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalAbierto(false)}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
                  >
                    Guardar Cliente
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
