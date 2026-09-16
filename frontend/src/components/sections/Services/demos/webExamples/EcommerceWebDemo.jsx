import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Star,
  Check,
  X,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Truck
} from 'lucide-react'

export default function EcommerceWebDemo({ onBack }) {
  const [categoria, setCategoria] = useState('Todos')
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [compraCompletada, setCompraCompletada] = useState(false)

  const productos = [
    {
      id: 'p1',
      name: 'Auriculares Sony WH-1000XM5 ANC',
      category: 'Audio',
      price: 19500,
      rating: 4.9,
      reviews: 124,
      image: '🎧',
      tag: 'Bestseller',
    },
    {
      id: 'p2',
      name: 'Smartwatch Apple Watch Series 9 GPS',
      category: 'Wearables',
      price: 26900,
      rating: 4.8,
      reviews: 89,
      image: '⌚',
      tag: 'Nuevo',
    },
    {
      id: 'p3',
      name: 'Teclado Mecánico Inalámbrico RGB Keychron',
      category: 'Periféricos',
      price: 6800,
      rating: 4.7,
      reviews: 54,
      image: '⌨️',
    },
    {
      id: 'p4',
      name: 'Mouse Ergonómico Logitech MX Master 3S',
      category: 'Periféricos',
      price: 5900,
      rating: 4.9,
      reviews: 210,
      image: '🖱️',
      tag: 'Top Ventas',
    },
    {
      id: 'p5',
      name: 'Bocina Portátil Bluetooth JBL Charge 5',
      category: 'Audio',
      price: 9400,
      rating: 4.8,
      reviews: 76,
      image: '🔊',
    },
    {
      id: 'p6',
      name: 'Cargador Rápido GaN 100W USB-C 4 Puertos',
      category: 'Accesorios',
      price: 3200,
      rating: 4.6,
      reviews: 42,
      image: '🔌',
    },
  ]

  const [carrito, setCarrito] = useState([
    { ...productos[0], cantidad: 1 },
    { ...productos[3], cantidad: 1 },
  ])

  const categorias = ['Todos', 'Audio', 'Wearables', 'Periféricos', 'Accesorios']

  const productosFiltrados = categoria === 'Todos'
    ? productos
    : productos.filter((p) => p.category === categoria)

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id)
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
    setCarritoAbierto(true)
  }

  const modificarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nueva = item.cantidad + delta
            return nueva > 0 ? { ...item, cantidad: nueva } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id))
  }

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0)
  const totalPrecio = carrito.reduce((acc, i) => acc + i.price * i.cantidad, 0)

  const formatearDOP = (v) =>
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(v)

  const handleCheckout = () => {
    setCompraCompletada(true)
    setTimeout(() => {
      setCompraCompletada(false)
      setCarrito([])
      setCarritoAbierto(false)
    }, 3500)
  }

  return (
    <div className="w-full bg-slate-900 text-slate-100 rounded-xl overflow-hidden font-sans border border-slate-800 shadow-2xl relative">
      {/* ── Header de la Tienda ── */}
      <header className="px-4 sm:px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-emerald-500/20">
            U
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-white block leading-tight">
              Urban<span className="text-emerald-400">Tech</span>
            </span>
            <span className="text-[9px] text-slate-400">Tienda de Tecnología Online</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-xs px-2.5 py-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ← Volver
          </button>

          {/* Botón Carrito */}
          <button
            onClick={() => setCarritoAbierto(true)}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Banner Promocional ── */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-teal-900/40 to-slate-900 px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Envío Gratis a todo el país
          </span>
          <h2 className="text-sm sm:text-base font-extrabold text-white">
            Equipos y accesorios de última tecnología con garantía local
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-emerald-400" /> 24-48h</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Garantía 1 Año</span>
        </div>
      </div>

      {/* ── Filtro de Categorías ── */}
      <div className="px-4 sm:px-6 py-3 flex items-center gap-1.5 overflow-x-auto text-xs border-b border-slate-800/80 bg-slate-950/40">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              categoria === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Catálogo de Productos ── */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productosFiltrados.map((prod) => (
          <div
            key={prod.id}
            className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
          >
            <div>
              {/* Imagen / Icono y Badge */}
              <div className="h-32 rounded-xl bg-slate-900/80 flex items-center justify-center text-5xl mb-3 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                {prod.image}
                {prod.tag && (
                  <span className="absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    {prod.tag}
                  </span>
                )}
              </div>

              {/* Info de Producto */}
              <div className="flex items-center gap-1 text-[11px] text-amber-400 mb-1">
                <Star className="w-3 h-3 fill-amber-400" />
                <span className="font-bold">{prod.rating}</span>
                <span className="text-slate-500">({prod.reviews})</span>
                <span className="text-slate-500 ml-auto text-[10px]">{prod.category}</span>
              </div>

              <h3 className="font-bold text-xs sm:text-sm text-white leading-snug line-clamp-2">
                {prod.name}
              </h3>
            </div>

            {/* Precio y Botón Agregar */}
            <div className="flex items-end justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">Precio Online</span>
                <span className="text-sm sm:text-base font-black text-emerald-400">
                  {formatearDOP(prod.price)}
                </span>
              </div>

              <button
                onClick={() => agregarAlCarrito(prod)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Carrito Desplegable (Slide-over) ── */}
      <AnimatePresence>
        {carritoAbierto && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl p-5"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    Bolsa de Compras ({totalItems})
                  </div>
                  <button onClick={() => setCarritoAbierto(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Lista de Items */}
                <div className="overflow-y-auto max-h-[60vh] divide-y divide-slate-800 mt-2">
                  {carrito.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      Tu carrito está vacío. ¡Explora el catálogo y añade productos!
                    </div>
                  ) : (
                    carrito.map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="text-2xl w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                          {item.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-[11px] text-emerald-400 font-semibold">
                            {formatearDOP(item.price)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => modificarCantidad(item.id, -1)}
                            className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-slate-300"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center text-white">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => modificarCantidad(item.id, 1)}
                            className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-slate-300"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Resumen y Checkout */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Envío:</span>
                  <span className="text-emerald-400 font-bold">GRATIS</span>
                </div>
                <div className="flex justify-between text-base font-black text-white">
                  <span>Total a Pagar:</span>
                  <span className="text-emerald-400">{formatearDOP(totalPrecio)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={carrito.length === 0}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Finalizar Pedido Online
                </button>

                {compraCompletada && (
                  <p className="text-center text-xs text-emerald-400 font-bold">
                    ✓ ¡Pedido procesado exitosamente en el demo!
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="px-6 py-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-500">
        © 2026 UrbanTech Store • Tienda E-commerce Interactiva con Carrito Dinámico
      </footer>
    </div>
  )
}
