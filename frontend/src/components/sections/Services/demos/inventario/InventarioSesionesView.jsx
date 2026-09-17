import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Play,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Layers,
  Trash2,
  Calendar,
  X,
  FileSpreadsheet
} from 'lucide-react'

export default function InventarioSesionesView({
  sesiones,
  clientes,
  onAbrirSesion,
  onCrearSesion,
  onFinalizarSesion,
  onEliminarSesion
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [modalNuevaSesion, setModalNuevaSesion] = useState(false)
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState('')
  const [notasSesion, setNotasSesion] = useState('')

  // Métricas de sesiones
  const metricas = useMemo(() => {
    const total = sesiones.length
    const enProgreso = sesiones.filter(s => s.estado === 'en_progreso').length
    const completadas = sesiones.filter(s => s.estado === 'completada').length
    const valorTotal = sesiones.reduce((sum, s) => sum + (s.totales?.valorTotalInventario || 0), 0)
    return { total, enProgreso, completadas, valorTotal }
  }, [sesiones])

  // Filtrado de sesiones
  const sesionesFiltradas = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return sesiones
    return sesiones.filter(s =>
      (s.numeroSesion || '').toLowerCase().includes(q) ||
      (s.clienteNegocio?.nombre || '').toLowerCase().includes(q) ||
      (s.notas || '').toLowerCase().includes(q)
    )
  }, [sesiones, searchTerm])

  const handleCrearSubmit = (e) => {
    e.preventDefault()
    if (!clienteSeleccionadoId) return

    const cliente = clientes.find(c => String(c.id) === String(clienteSeleccionadoId))
    if (!cliente) return

    onCrearSesion({
      clienteNegocioId: cliente.id,
      clienteNegocio: cliente,
      notas: notasSesion
    })

    setClienteSeleccionadoId('')
    setNotasSesion('')
    setModalNuevaSesion(false)
  }

  return (
    <div className="space-y-6">
      {/* ── Métricas Superiores de Auditoría ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Sesiones</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{metricas.total}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">En Progreso</p>
            <p className="text-xl font-bold text-amber-600">{metricas.enProgreso}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completadas</p>
            <p className="text-xl font-bold text-emerald-600">{metricas.completadas}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Valor Auditado</p>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
              RD$ {metricas.valorTotal.toLocaleString('es-DO', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Barra de Acciones y Botón Nueva Sesión ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar sesión por número (#SES), cliente o notas..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        <button
          onClick={() => {
            if (clientes.length > 0) {
              setClienteSeleccionadoId(String(clientes[0].id))
            }
            setModalNuevaSesion(true)
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nueva Sesión de Inventario
        </button>
      </div>

      {/* ── Tabla / Listado de Sesiones ── */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Vista Móvil (< sm): Tarjetas de Sesiones */}
        <div className="block sm:hidden p-3 space-y-3">
          {sesionesFiltradas.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-slate-600 dark:text-slate-300 text-xs">No hay sesiones registradas</p>
              <p className="text-[10px] text-slate-400">Inicie una nueva sesión de inventario para comenzar el conteo.</p>
            </div>
          ) : (
            sesionesFiltradas.map((s) => {
              const enProgreso = s.estado === 'en_progreso'
              return (
                <div
                  key={s.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-[11px]">
                      {s.numeroSesion}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        enProgreso
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${enProgreso ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      {enProgreso ? 'En Progreso' : 'Completada'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {s.clienteNegocio?.nombre}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{s.clienteNegocio?.rnc ? `RNC: ${s.clienteNegocio.rnc}` : 'Sin RNC'}</span>
                      <span>•</span>
                      <span>{new Date(s.fecha).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Items Contados</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                        {s.totales?.totalProductosContados || 0} unds
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block uppercase">Valor Total</span>
                      <span className="font-black text-blue-600 dark:text-blue-400 font-mono text-xs">
                        RD$ {(s.totales?.valorTotalInventario || 0).toLocaleString('es-DO', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {enProgreso && (
                        <button
                          onClick={() => onFinalizarSesion(s.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                          title="Finalizar sesión"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onEliminarSesion(s.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                        title="Eliminar sesión"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onAbrirSesion(s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        enProgreso
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      {enProgreso ? 'Conteo en Vivo' : 'Ver Conteo'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Vista Desktop / Tablet (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[700px]">
            <thead className="bg-slate-100/70 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5 whitespace-nowrap"># Sesión & Fecha</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Cliente Auditado</th>
                <th className="px-4 py-3.5 text-right whitespace-nowrap">Items Contados</th>
                <th className="px-5 py-3.5 text-right whitespace-nowrap">Valor Total RD$</th>
                <th className="px-4 py-3.5 text-center whitespace-nowrap">Estado</th>
                <th className="px-5 py-3.5 text-right whitespace-nowrap">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {sesionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No hay sesiones registradas</p>
                    <p className="text-xs text-slate-400">Inicie una nueva sesión de inventario para comenzar el conteo.</p>
                  </td>
                </tr>
              ) : (
                sesionesFiltradas.map((s) => {
                  const enProgreso = s.estado === 'en_progreso'
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {s.numeroSesion}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(s.fecha).toLocaleDateString()}
                        </div>
                        {s.notas && (
                          <p className="text-[11px] text-slate-400 italic mt-0.5 max-w-xs truncate">
                            "{s.notas}"
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {s.clienteNegocio?.nombre}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {s.clienteNegocio?.rnc || 'Sin RNC'}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {s.totales?.totalProductosContados || 0} unidades
                      </td>

                      <td className="px-5 py-4 text-right font-black text-blue-600 dark:text-blue-400 font-mono whitespace-nowrap">
                        RD$ {(s.totales?.valorTotalInventario || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            enProgreso
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              enProgreso ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                            }`}
                          />
                          {enProgreso ? 'En Progreso' : 'Completada'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onAbrirSesion(s)}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                              enProgreso
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {enProgreso ? 'Conteo en Vivo' : 'Ver Conteo'}
                          </button>

                          {enProgreso && (
                            <button
                              onClick={() => onFinalizarSesion(s.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                              title="Marcar sesión como completada"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => onEliminarSesion(s.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                            title="Eliminar sesión"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Iniciar Nueva Sesión ── */}
      <AnimatePresence>
        {modalNuevaSesion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <Play className="w-5 h-5 text-blue-600 fill-current" />
                  <h3 className="font-bold text-base">Iniciar Nueva Sesión de Inventario</h3>
                </div>
                <button
                  onClick={() => setModalNuevaSesion(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCrearSubmit} className="p-6 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Seleccionar Cliente / Empresa Auditada *
                  </label>
                  <select
                    required
                    value={clienteSeleccionadoId}
                    onChange={(e) => setClienteSeleccionadoId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Elija un cliente --</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.rnc ? `(RNC: ${c.rnc})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Notas o Motivo del Inventario
                  </label>
                  <textarea
                    rows="3"
                    value={notasSesion}
                    onChange={(e) => setNotasSesion(e.target.value)}
                    placeholder="Ej. Auditoría de cierre fiscal, conteo físico sorpresivo..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
                  ℹ️ Al iniciar la sesión, se activará el temporizador en vivo, el escáner de códigos de barra y la consola de arqueo financiero.
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalNuevaSesion(false)}
                    className="px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Iniciar Sesión Ahora
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
