/* Demo interactivo del sistema de inventario de J4TechnologyIsNow */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Download, X, Package, AlertTriangle, CheckCircle } from 'lucide-react'

/* Productos de ejemplo con los que arranca el demo */
const PRODUCTOS_INICIALES = [
  { id: 1, name: 'Laptop Dell XPS',   stock: 45, minStock: 10, price: 85000, category: 'Tecnología'  },
  { id: 2, name: 'Monitor LG 27"',    stock: 8,  minStock: 5,  price: 32000, category: 'Tecnología'  },
  { id: 3, name: 'Teclado Mecánico',  stock: 0,  minStock: 3,  price: 4500,  category: 'Accesorios'  },
  { id: 4, name: 'Mouse Logitech',    stock: 23, minStock: 5,  price: 2800,  category: 'Accesorios'  },
  { id: 5, name: 'Auriculares Sony',  stock: 3,  minStock: 5,  price: 9500,  category: 'Audio'        },
]

/* Devuelve la configuración visual del badge según el nivel de stock */
function obtenerEstadoStock(stock, minStock) {
  if (stock === 0)           return { label: 'Agotado', bg: 'rgba(239,68,68,0.15)',   color: '#ef4444', border: 'rgba(239,68,68,0.4)'   }
  if (stock <= minStock)     return { label: 'Bajo',    bg: 'rgba(234,179,8,0.15)',   color: '#fbbf24', border: 'rgba(234,179,8,0.4)'   }
  return                            { label: 'OK',      bg: 'rgba(34,197,94,0.15)',   color: '#4ade80', border: 'rgba(34,197,94,0.4)'   }
}

/* Formatea un número como moneda DOP sin decimales */
const formatearDOP = (valor) =>
  new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(valor)

/* Componente principal del demo de inventario */
export default function InventoryDemo() {
  /* Lista de productos del inventario */
  const [productos, setProductos]             = useState(PRODUCTOS_INICIALES)
  /* Texto del buscador para filtrar productos */
  const [busqueda, setBusqueda]               = useState('')
  /* Controla la visibilidad del formulario para agregar producto */
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  /* Estado del formulario de nuevo producto */
  const [nuevoProducto, setNuevoProducto]     = useState({ name: '', stock: '', price: '', category: '', minStock: '' })
  /* Contador para IDs únicos de nuevos productos */
  const [nextId, setNextId]                   = useState(6)

  /* Productos filtrados según el texto de búsqueda */
  const productosFiltrados = useMemo(() =>
    productos.filter(p => p.name.toLowerCase().includes(busqueda.toLowerCase())),
    [productos, busqueda]
  )

  /* Métricas calculadas en tiempo real sobre la lista completa */
  const metricas = useMemo(() => {
    const total          = productos.length
    const valorTotal     = productos.reduce((acc, p) => acc + p.price * p.stock, 0)
    const alertas        = productos.filter(p => p.stock <= p.minStock && p.stock > 0).length
    const agotados       = productos.filter(p => p.stock === 0).length
    return { total, valorTotal, alertas, agotados }
  }, [productos])

  /* Agrega un nuevo producto al array validando los campos requeridos */
  const agregarProducto = () => {
    if (!nuevoProducto.name || nuevoProducto.stock === '' || nuevoProducto.price === '') return
    setProductos(prev => [
      ...prev,
      {
        id:       nextId,
        name:     nuevoProducto.name,
        stock:    Number(nuevoProducto.stock),
        minStock: Number(nuevoProducto.minStock) || 5,
        price:    Number(nuevoProducto.price),
        category: nuevoProducto.category || 'General',
      },
    ])
    setNextId(n => n + 1)
    setNuevoProducto({ name: '', stock: '', price: '', category: '', minStock: '' })
    setMostrarFormulario(false)
  }

  /* Elimina un producto del inventario por su id */
  const eliminarProducto = (id) => setProductos(prev => prev.filter(p => p.id !== id))

  /* Genera y descarga un archivo CSV con los datos del inventario actual */
  const exportarCSV = () => {
    const cabecera = 'ID,Nombre,Categoría,Stock,Stock Mínimo,Precio,Estado\n'
    const filas    = productos.map(p => {
      const estado = obtenerEstadoStock(p.stock, p.minStock).label
      return `${p.id},"${p.name}","${p.category}",${p.stock},${p.minStock},${p.price},"${estado}"`
    }).join('\n')
    const blob = new Blob([cabecera + filas], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'inventario.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">

      {/* ── Barra de métricas superior ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total de productos registrados */}
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>Total productos</p>
          <p className="text-xl font-bold" style={{ color: '#00D4FF' }}>{metricas.total}</p>
        </div>

        {/* Valor total del inventario (precio × stock) */}
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>Valor total</p>
          <p className="text-base font-bold" style={{ color: '#10b981' }}>{formatearDOP(metricas.valorTotal)}</p>
        </div>

        {/* Productos con stock bajo (por encima de cero pero por debajo del mínimo) */}
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>Alertas stock</p>
          <p className="text-xl font-bold" style={{ color: '#fbbf24' }}>{metricas.alertas}</p>
        </div>

        {/* Productos completamente agotados */}
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>Agotados</p>
          <p className="text-xl font-bold" style={{ color: '#ef4444' }}>{metricas.agotados}</p>
        </div>
      </div>

      {/* ── Controles: búsqueda, agregar y exportar ── */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Input de búsqueda en tiempo real */}
        <div className="relative flex-1 min-w-[160px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
          />
        </div>

        {/* Botón para mostrar / ocultar formulario de nuevo producto */}
        <motion.button
          onClick={() => setMostrarFormulario(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF' }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={14} />
          Agregar
        </motion.button>

        {/* Botón para exportar el inventario a un archivo CSV */}
        <motion.button
          onClick={exportarCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}
          whileTap={{ scale: 0.97 }}
        >
          <Download size={14} />
          Exportar CSV
        </motion.button>
      </div>

      {/* ── Formulario de nuevo producto (aparece/desaparece animado) ── */}
      <AnimatePresence>
        {mostrarFormulario && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Nuevo producto</p>

              {/* Fila de campos del formulario */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {/* Campo nombre */}
                <input
                  placeholder="Nombre"
                  value={nuevoProducto.name}
                  onChange={e => setNuevoProducto(p => ({ ...p, name: e.target.value }))}
                  className="col-span-2 sm:col-span-2 px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
                />
                {/* Campo categoría */}
                <input
                  placeholder="Categoría"
                  value={nuevoProducto.category}
                  onChange={e => setNuevoProducto(p => ({ ...p, category: e.target.value }))}
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
                />
                {/* Campo stock mínimo */}
                <input
                  type="number"
                  placeholder="Stock mín."
                  value={nuevoProducto.minStock}
                  onChange={e => setNuevoProducto(p => ({ ...p, minStock: e.target.value }))}
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
                />
                {/* Campo stock actual */}
                <input
                  type="number"
                  placeholder="Stock"
                  value={nuevoProducto.stock}
                  onChange={e => setNuevoProducto(p => ({ ...p, stock: e.target.value }))}
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
                />
                {/* Campo precio unitario */}
                <input
                  type="number"
                  placeholder="Precio (DOP)"
                  value={nuevoProducto.price}
                  onChange={e => setNuevoProducto(p => ({ ...p, price: e.target.value }))}
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
                />
              </div>

              {/* Acciones del formulario */}
              <div className="flex gap-2">
                <motion.button
                  onClick={agregarProducto}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium"
                  style={{ background: '#00D4FF', color: '#0a0a0f' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Guardar
                </motion.button>
                <motion.button
                  onClick={() => setMostrarFormulario(false)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancelar
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tabla de productos ── */}
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#94A3B8' }}>Producto</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#94A3B8' }}>Categoría</th>
              <th className="text-center px-4 py-3 font-medium" style={{ color: '#94A3B8' }}>Stock</th>
              <th className="text-center px-4 py-3 font-medium" style={{ color: '#94A3B8' }}>Estado</th>
              <th className="text-right px-4 py-3 font-medium" style={{ color: '#94A3B8' }}>Precio</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 ? (
              /* Mensaje cuando no hay resultados de búsqueda */
              <tr>
                <td colSpan={6} className="text-center py-8" style={{ color: '#94A3B8' }}>
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              productosFiltrados.map((producto, idx) => {
                const estado = obtenerEstadoStock(producto.stock, producto.minStock)
                return (
                  <motion.tr
                    key={producto.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    {/* Nombre del producto con ícono */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package size={14} style={{ color: '#00D4FF' }} />
                        <span style={{ color: '#F1F5F9' }}>{producto.name}</span>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="px-4 py-3" style={{ color: '#94A3B8' }}>{producto.category}</td>

                    {/* Cantidad en stock */}
                    <td className="px-4 py-3 text-center font-mono" style={{ color: '#F1F5F9' }}>{producto.stock}</td>

                    {/* Badge de estado calculado dinámicamente */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: estado.bg, color: estado.color, border: `1px solid ${estado.border}` }}
                      >
                        {estado.label}
                      </span>
                    </td>

                    {/* Precio formateado en DOP */}
                    <td className="px-4 py-3 text-right font-mono" style={{ color: '#F1F5F9' }}>
                      {formatearDOP(producto.price)}
                    </td>

                    {/* Botón para eliminar el producto de la lista */}
                    <td className="px-4 py-3 text-center">
                      <motion.button
                        onClick={() => eliminarProducto(producto.id)}
                        whileTap={{ scale: 0.9 }}
                        style={{ color: '#ef444480' }}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </motion.button>
                    </td>
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
