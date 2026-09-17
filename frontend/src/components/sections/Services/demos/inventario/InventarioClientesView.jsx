import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Users,
  Play,
  Phone,
  MapPin,
  FileText,
  Trash2,
  Edit2,
  CheckCircle,
  X,
  Building2,
  Calendar
} from 'lucide-react'

export default function InventarioClientesView({
  clientes,
  onCrearCliente,
  onEditarCliente,
  onEliminarCliente,
  onIniciarInventarioCliente
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [clienteEnEdicion, setClienteEnEdicion] = useState(null)

  const [formData, setFormData] = useState({
    nombre: '',
    rnc: '',
    telefono: '',
    direccion: '',
    notas: ''
  })

  // Filtrado de clientes
  const clientesFiltrados = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return clientes
    return clientes.filter(c =>
      (c.nombre || '').toLowerCase().includes(q) ||
      (c.rnc || '').toLowerCase().includes(q) ||
      (c.telefono || '').toLowerCase().includes(q) ||
      (c.direccion || '').toLowerCase().includes(q)
    )
  }, [clientes, searchTerm])

  const abrirModalCrear = () => {
    setClienteEnEdicion(null)
    setFormData({
      nombre: '',
      rnc: '',
      telefono: '',
      direccion: '',
      notas: ''
    })
    setModalAbierto(true)
  }

  const abrirModalEditar = (cliente) => {
    setClienteEnEdicion(cliente)
    setFormData({
      nombre: cliente.nombre || '',
      rnc: cliente.rnc || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      notas: cliente.notas || ''
    })
    setModalAbierto(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.nombre.trim()) return

    if (clienteEnEdicion) {
      onEditarCliente(clienteEnEdicion.id, formData)
    } else {
      onCrearCliente(formData)
    }
    setModalAbierto(false)
  }

  return (
    <div className="space-y-6">
      {/* ── Barra Superior de Acciones ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            Clientes y Negocios Auditados
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Gestione empresas para auditorías contables e inicie sesiones de inventario físico.
          </p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* ── Buscador ── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente por razón social, RNC, teléfono o ubicación..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* ── Tabla de Clientes ── */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-100/70 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Cliente / Razón Social</th>
                <th className="px-4 py-3.5">Contacto & Ubicación</th>
                <th className="px-4 py-3.5">Historial Inventarios</th>
                <th className="px-4 py-3.5 text-center">Estado</th>
                <th className="px-5 py-3.5 text-right">Acción Principal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No se encontraron clientes</p>
                    <p className="text-xs text-slate-400">Haga clic en "Nuevo Cliente" para registrar el primero.</p>
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {c.nombre}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {c.rnc ? `RNC: ${c.rnc}` : 'Sin RNC'}
                      </div>
                      {c.notas && (
                        <p className="text-[11px] text-slate-400 italic mt-0.5 max-w-xs truncate">
                          "{c.notas}"
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {c.telefono || 'Sin teléfono'}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 mt-1 max-w-xs truncate">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {c.direccion || 'Sin dirección'}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {c.estadisticas?.totalInventarios || 0} sesiones
                      </div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        Último: {c.estadisticas?.ultimoInventario || 'Pendiente'}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Activo
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onIniciarInventarioCliente(c)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                          title="Iniciar sesión de inventario para este cliente"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Iniciar Inventario
                        </button>

                        <button
                          onClick={() => abrirModalEditar(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                          title="Editar información"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEliminarCliente(c.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                          title="Eliminar cliente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal de Crear / Editar Cliente ── */}
      <AnimatePresence>
        {modalAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base">
                    {clienteEnEdicion ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
                  </h3>
                </div>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Nombre o Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Comercializadora San Juan SRL"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      RNC / Cédula
                    </label>
                    <input
                      type="text"
                      value={formData.rnc}
                      onChange={(e) => setFormData({ ...formData, rnc: e.target.value })}
                      placeholder="1-01-00000-0"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="809-000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Calle, Sector, Ciudad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Notas de Auditoría
                  </label>
                  <textarea
                    rows="2"
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    placeholder="Detalles sobre tipo de negocio, periodicidad de inventario..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalAbierto(false)}
                    className="px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
                  >
                    {clienteEnEdicion ? 'Guardar Cambios' : 'Registrar Cliente'}
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
