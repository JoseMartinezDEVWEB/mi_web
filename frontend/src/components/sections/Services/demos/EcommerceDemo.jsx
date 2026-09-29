/* Demo interactivo de tienda en línea (e-commerce) con catálogo responsive, carrito dinámico y checkout */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, CheckCircle, Plus, Minus, Trash2, ArrowRight, Sparkles, Tag } from 'lucide-react'

/* Catálogo de productos de ejemplo para el demo */
const PRODUCTOS = [
  { id: 1, name: 'MacBook Pro 14"', price: 185000, image: '💻', category: 'Laptops'    },
  { id: 2, name: 'iPhone 15 Pro',   price: 125000, image: '📱', category: 'Smartphones'},
  { id: 3, name: 'AirPods Pro',     price: 32000,  image: '🎧', category: 'Audio'      },
  { id: 4, name: 'iPad Air',        price: 78000,  image: '📲', category: 'Tablets'    },
  { id: 5, name: 'Apple Watch',     price: 55000,  image: '⌚', category: 'Wearables'  },
  { id: 6, name: 'Magic Keyboard',  price: 18000,  image: '⌨️', category: 'Accesorios' },
]

/* Métricas de ventas del mes para el encabezado del demo */
const METRICAS = [
  { label: 'Ventas del mes', valor: 'DOP 2.4M', color: '#10b981' },
  { label: 'Pedidos totales', valor: '156',      color: '#00D4FF' },
  { label: 'Tasa conversión', valor: '3.2%',     color: '#D4AF37' },
]

/* Formatea un número como moneda DOP sin decimales */
const formatearDOP = (valor) =>
  new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(valor)

export default function EcommerceDemo() {
  /* Items del carrito: { id, name, price, image, qty } */
  const [carrito, setCarrito] = useState([
    { id: 2, name: 'iPhone 15 Pro', price: 125000, image: '📱', category: 'Smartphones', qty: 1 }
  ])
  /* Controla la visibilidad del modal de confirmación de compra */
  const [modalExito, setModalExito] = useState(false)

  /* Agrega un producto al carrito; incrementa la cantidad si ya existe */
  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existente = prev.find(i => i.id === producto.id)
      if (existente) return prev.map(i => i.id === producto.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...producto, qty: 1 }]
    })
  }

  /* Cambia la cantidad de un item del carrito; lo elimina si llega a cero */
  const cambiarCantidad = (id, delta) => {
    setCarrito(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    )
  }

  /* Elimina un item del carrito por su id */
  const eliminarItem = (id) => setCarrito(prev => prev.filter(i => i.id !== id))

  /* Vaciar el carrito completo */
  const vaciarCarrito = () => setCarrito([])

  /* Cantidad total de unidades en el carrito */
  const totalItems = carrito.reduce((acc, i) => acc + i.qty, 0)

  /* Subtotal del carrito sin impuestos */
  const subtotal = carrito.reduce((acc, i) => acc + i.price * i.qty, 0)
  const itbis = Math.round(subtotal * 0.18)
  const totalFinal = subtotal + itbis

  /* Simula la finalización de la compra y muestra el modal de éxito */
  const finalizarCompra = () => {
    setModalExito(true)
    setCarrito([])
  }

  return (
    <div className="space-y-4 text-slate-100">

      {/* ── Métricas del mes (Responsive) ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {METRICAS.map(m => (
          <div
            key={m.label}
            className="rounded-xl p-2.5 sm:p-3 text-center transition-all hover:bg-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-[10px] sm:text-xs mb-0.5 truncate text-slate-400">{m.label}</p>
            <p className="text-xs sm:text-base font-extrabold truncate" style={{ color: m.color }}>{m.valor}</p>
          </div>
        ))}
      </div>

      {/* ── Barra de aviso interactivo para el demo ── */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00D4FF] shrink-0" />
          <span className="text-slate-300 text-[11px] sm:text-xs">
            <strong>Catálogo E-commerce Interactivo:</strong> Agrega productos y prueba el flujo de compra.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[10px] font-bold text-[#00D4FF] uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded-full">
          Demo en vivo
        </span>
      </div>

      {/* ── Layout principal: Grid de productos + Sidebar del carrito (Responsive) ── */}
      <div className="flex flex-col lg:flex-row items-start gap-4">

        {/* ── Catálogo de productos ── */}
        <div className="w-full flex-1 grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {PRODUCTOS.map((producto, idx) => {
            const enCarrito = carrito.find(i => i.id === producto.id)
            return (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="rounded-2xl p-3.5 flex flex-col justify-between transition-all hover:border-cyan-500/40 bg-white/[0.04] border border-white/[0.08] group relative overflow-hidden"
              >
                {/* Glow decorativo sutil */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

                <div>
                  {/* Encabezado de la tarjeta: Categoría y Disponibilidad */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                      {producto.category}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      En stock
                    </span>
                  </div>

                  {/* Icono / Emoji del producto */}
                  <div className="text-3xl sm:text-4xl text-center py-2 group-hover:scale-110 transition-transform">
                    {producto.image}
                  </div>

                  {/* Nombre del producto */}
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 mb-1 leading-snug line-clamp-1" title={producto.name}>
                    {producto.name}
                  </h4>

                  {/* Precio en DOP */}
                  <p className="text-sm sm:text-base font-black text-[#00D4FF] mb-3 font-mono">
                    {formatearDOP(producto.price)}
                  </p>
                </div>

                {/* Acciones de compra */}
                {enCarrito ? (
                  <div className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-1 text-xs">
                    <div className="flex items-center gap-1.5 px-2">
                      <ShoppingCart size={13} className="text-[#00D4FF]" />
                      <span className="text-[11px] font-bold text-[#00D4FF]">{enCarrito.qty} en carrito</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => cambiarCantidad(producto.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition-colors font-bold"
                        title="Disminuir"
                      >
                        <Minus size={11} />
                      </button>
                      <button
                        onClick={() => agregarAlCarrito(producto)}
                        className="w-6 h-6 rounded-lg bg-[#00D4FF] text-slate-950 flex items-center justify-center transition-colors font-bold hover:brightness-110"
                        title="Aumentar"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => agregarAlCarrito(producto)}
                    className="w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.18) 0%, rgba(0,212,255,0.08) 100%)',
                      border: '1px solid rgba(0,212,255,0.3)',
                      color: '#00D4FF'
                    }}
                    whileHover={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.28) 0%, rgba(0,212,255,0.15) 100%)' }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Plus size={13} />
                    <span>Agregar al carrito</span>
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* ── Sidebar / Panel de Carrito (Responsive) ── */}
        <div
          id="carrito-seccion"
          className="w-full lg:w-72 xl:w-80 shrink-0 rounded-2xl p-4 flex flex-col bg-white/[0.03] border border-white/[0.08] transition-all shadow-xl"
        >
          {/* Encabezado del carrito */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-[#00D4FF]">
                <ShoppingCart size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-100">Tu Carrito</h4>
                <p className="text-[10px] text-slate-400">{totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}</p>
              </div>
            </div>

            {carrito.length > 0 && (
              <button
                onClick={vaciarCarrito}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors"
                title="Vaciar todo el carrito"
              >
                <Trash2 size={12} />
                <span>Vaciar</span>
              </button>
            )}
          </div>

          {/* Lista de items del carrito */}
          <div className="space-y-2.5 overflow-y-auto max-h-64 pr-1">
            {carrito.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <ShoppingCart size={28} className="mx-auto stroke-1 text-slate-500" />
                <p className="text-xs font-medium text-slate-300">El carrito está vacío</p>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                  Selecciona productos del catálogo superior para simular tu orden de compra.
                </p>
              </div>
            ) : (
              carrito.map(item => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2 text-xs transition-colors hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">{item.image}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-100 text-xs truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{formatearDOP(item.price)} c/u</p>
                      </div>
                    </div>

                    <button
                      onClick={() => eliminarItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Quitar producto"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  {/* Controles de cantidad y precio total por línea */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                    <div className="flex items-center gap-1.5 bg-black/30 rounded-lg p-0.5 border border-white/[0.05]">
                      <button
                        onClick={() => cambiarCantidad(item.id, -1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus size={9} />
                      </button>
                      <span className="text-[11px] font-mono font-bold w-5 text-center text-slate-100">{item.qty}</span>
                      <button
                        onClick={() => cambiarCantidad(item.id, 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus size={9} />
                      </button>
                    </div>

                    <span className="text-xs font-black text-emerald-400 font-mono">
                      {formatearDOP(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resumen de totales y checkout */}
          {carrito.length > 0 && (
            <div className="pt-3 mt-3 border-t border-white/[0.08] space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200">{formatearDOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>ITBIS (18%)</span>
                <span className="font-mono text-slate-200">{formatearDOP(itbis)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-100 pt-1 border-t border-white/[0.06]">
                <span>Total a Pagar</span>
                <span className="font-black text-emerald-400 font-mono text-base">{formatearDOP(totalFinal)}</span>
              </div>

              {/* Botón de Checkout */}
              <motion.button
                onClick={finalizarCompra}
                className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                whileHover={{ brightness: 1.1 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Finalizar Pedido Demo</span>
                <ArrowRight size={14} />
              </motion.button>

              <p className="text-[10px] text-center text-slate-500 pt-1">
                🔒 Simulación de pasarela de pago segura (Stripe / Azul / Cardnet)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Barra Flotante de Acceso Rápido al Carrito en Móviles (< lg) ── */}
      {totalItems > 0 && (
        <div className="lg:hidden sticky bottom-3 z-30 mt-3">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={() => {
              const el = document.getElementById('carrito-seccion')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-between text-slate-950 shadow-2xl active:scale-98 transition-all"
            style={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #00A3FF 100%)',
              boxShadow: '0 10px 25px -5px rgba(0, 212, 255, 0.4)'
            }}
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-black/20 text-slate-950">
                <ShoppingCart size={15} />
              </div>
              <span>Ver Carrito ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})</span>
            </div>
            <div className="flex items-center gap-1.5 font-black text-xs font-mono">
              <span>{formatearDOP(totalFinal)}</span>
              <span>↓</span>
            </div>
          </motion.button>
        </div>
      )}

      {/* ── Modal de Compra Exitosa (Responsive) ── */}
      <AnimatePresence>
        {modalExito && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setModalExito(false)}
          >
            <motion.div
              className="rounded-3xl p-6 sm:p-8 text-center max-w-sm w-full mx-auto relative overflow-hidden shadow-2xl"
              style={{ background: '#0f172a', border: '1px solid rgba(16,185,129,0.4)' }}
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} />
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-100 mb-2">¡Pedido Demo Confirmado!</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
                Así es como tus clientes completan compras 24/7 en tu tienda virtual con catálogo interactivo y cobro inmediato.
              </p>

              <button
                onClick={() => setModalExito(false)}
                className="w-full py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                Continuar Explorando
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
