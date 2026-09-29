import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Package,
  AlertTriangle,
  CheckCircle,
  Tag,
  Barcode,
  X
} from 'lucide-react'
import { formatearDOP, CATEGORIAS_DEMO } from './facturacionData'

export default function ProductosView({ productos, setProductos }) {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos')
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false)

  // Formulario para nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    name: '',
    code: '',
    category: 'Puntos de Venta',
    costPrice: '',
    price: '',
    stock: '',
  })

  // Filtrado de productos
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchCat =
        categoriaSeleccionada === 'Todos' || p.category === categoriaSeleccionada
      const matchSearch =
        p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.code.includes(busqueda.trim())
      return matchCat && matchSearch
    })
  }, [productos, categoriaSeleccionada, busqueda])

  const handleCrearProducto = (e) => {
    e.preventDefault()
    if (!nuevoProducto.name || !nuevoProducto.price) return

    const idNuevo = `prod-${String(productos.length + 1).padStart(3, '0')}`
    const nuevo = {
      id: idNuevo,
      code: nuevoProducto.code || String(Math.floor(Math.random() * 900000000000) + 100000000000),
      name: nuevoProducto.name,
      category: nuevoProducto.category,
      costPrice: Number(nuevoProducto.costPrice) || Number(nuevoProducto.price) * 0.7,
      price: Number(nuevoProducto.price),
      stock: Number(nuevoProducto.stock) || 10,
      taxable: true,
      badge: 'Nuevo',
    }

    setProductos([nuevo, ...productos])
    setModalNuevoAbierto(false)
    setNuevoProducto({
      name: '',
      code: '',
      category: 'Puntos de Venta',
      costPrice: '',
      price: '',
      stock: '',
    })
  }

  const handleEliminarProducto = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* ── Encabezado de Productos ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Catálogo e Inventario de Productos
          </h2>
          <p className="text-xs text-gray-500">
            Administra precios, existencias y códigos de barras de tus artículos
          </p>
        </div>

        <button
          onClick={() => setModalNuevoAbierto(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      {/* ── Barra de Búsqueda y Filtros ── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto por nombre o código de barra..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-gray-500 font-semibold whitespace-nowrap">
              Categoría:
            </span>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIAS_DEMO.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Tabla / Catálogo de Productos ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Vista Móvil (< sm): Tarjetas de Productos */}
        <div className="block sm:hidden p-3 space-y-3">
          {productosFiltrados.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              No se encontraron productos coincidentes
            </div>
          ) : (
            productosFiltrados.map((prod) => {
              const stockBajo = prod.stock <= 5 && prod.stock > 0
              const sinStock = prod.stock <= 0

              return (
                <div
                  key={prod.id}
                  className="p-3.5 bg-gray-50/90 rounded-xl border border-gray-200 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{prod.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                          {prod.code}
                        </span>
                        <span className="text-[10px] text-gray-500">{prod.category}</span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                        sinStock
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : stockBajo
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}
                    >
                      {sinStock ? 'Agotado' : `${prod.stock} unds`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/70">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[9px] text-gray-400 block uppercase">Costo</span>
                        <span className="font-mono text-gray-600 text-xs">{formatearDOP(prod.costPrice)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block uppercase">Precio</span>
                        <span className="font-mono font-black text-gray-900 text-xs">{formatearDOP(prod.price)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleEliminarProducto(prod.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Vista Desktop / Tablet (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Código / Barcode</th>
                <th className="py-3 px-4 whitespace-nowrap">Nombre del Producto</th>
                <th className="py-3 px-4 whitespace-nowrap">Categoría</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Costo</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Precio Venta</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Stock</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No se encontraron productos coincidentes
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((prod) => {
                  const stockBajo = prod.stock <= 5 && prod.stock > 0
                  const sinStock = prod.stock <= 0

                  return (
                    <tr key={prod.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-gray-600 whitespace-nowrap">
                        {prod.code}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 whitespace-nowrap">{prod.name}</div>
                        {prod.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                            {prod.badge}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{prod.category}</td>
                      <td className="py-3 px-4 text-right text-gray-500 font-mono whitespace-nowrap">
                        {formatearDOP(prod.costPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900 font-mono whitespace-nowrap">
                        {formatearDOP(prod.price)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sinStock
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : stockBajo
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          }`}
                        >
                          {sinStock ? 'Agotado' : `${prod.stock} unds`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEliminarProducto(prod.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* ── Modal de Nuevo Producto ── */}
      <AnimatePresence>
        {modalNuevoAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 font-sans"
            >
              <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-400" />
                  Agregar Nuevo Producto
                </h3>
                <button
                  onClick={() => setModalNuevoAbierto(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCrearProducto} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nombre del Producto</label>
                  <input
                    type="text"
                    required
                    value={nuevoProducto.name}
                    onChange={(e) =>
                      setNuevoProducto({ ...nuevoProducto, name: e.target.value })
                    }
                    placeholder="Ej: Scanner Láser Omnidireccional"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Código de Barras</label>
                    <input
                      type="text"
                      value={nuevoProducto.code}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, code: e.target.value })
                      }
                      placeholder="Ej: 746123456789"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Categoría</label>
                    <select
                      value={nuevoProducto.category}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, category: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CATEGORIAS_DEMO.filter((c) => c !== 'Todos').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Costo (RD$)</label>
                    <input
                      type="number"
                      value={nuevoProducto.costPrice}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, costPrice: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Venta (RD$)</label>
                    <input
                      type="number"
                      required
                      value={nuevoProducto.price}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, price: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Stock Inicial</label>
                    <input
                      type="number"
                      value={nuevoProducto.stock}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
                      }
                      placeholder="10"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalNuevoAbierto(false)}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
                  >
                    Guardar Producto
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
