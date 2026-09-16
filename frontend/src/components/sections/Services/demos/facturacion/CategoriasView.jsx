import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Plus, Trash2, Package, X } from 'lucide-react'
import { CATEGORIAS_DEMO } from './facturacionData'

export default function CategoriasView({ productos }) {
  const [categorias, setCategorias] = useState(
    CATEGORIAS_DEMO.filter((c) => c !== 'Todos')
  )
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nuevaCat, setNuevaCat] = useState('')

  const handleCrear = (e) => {
    e.preventDefault()
    if (!nuevaCat.trim() || categorias.includes(nuevaCat.trim())) return
    setCategorias([...categorias, nuevaCat.trim()])
    setNuevaCat('')
    setModalAbierto(false)
  }

  const handleEliminar = (nombre) => {
    setCategorias(categorias.filter((c) => c !== nombre))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            Categorías de Productos
          </h2>
          <p className="text-xs text-gray-500">
            Organiza tu inventario por departamentos o familias de productos
          </p>
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map((cat) => {
          const cantidad = productos.filter((p) => p.category === cat).length

          return (
            <motion.div
              key={cat}
              whileHover={{ y: -2 }}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{cat}</h4>
                  <span className="text-xs text-gray-500">{cantidad} productos registrados</span>
                </div>
              </div>

              <button
                onClick={() => handleEliminar(cat)}
                className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                title="Eliminar categoría"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {modalAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-gray-200 text-xs font-sans"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-gray-900">Nueva Categoría</h3>
                <button onClick={() => setModalAbierto(false)} className="text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCrear} className="space-y-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nombre de la Categoría</label>
                  <input
                    type="text"
                    required
                    value={nuevaCat}
                    onChange={(e) => setNuevaCat(e.target.value)}
                    placeholder="Ej: Impresoras Fiscales"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalAbierto(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-xl font-semibold text-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow"
                  >
                    Guardar
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
