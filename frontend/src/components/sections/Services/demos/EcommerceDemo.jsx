/* Demo interactivo de tienda en línea (e-commerce) con carrito y modal de confirmación */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, CheckCircle, Plus, Minus } from 'lucide-react'

/* Catálogo de productos de ejemplo para el demo */
const PRODUCTOS = [
  { id: 1, name: 'MacBook Pro 14"', price: 185000, image: '💻', category: 'Tech'       },
  { id: 2, name: 'iPhone 15 Pro',   price: 125000, image: '📱', category: 'Tech'       },
  { id: 3, name: 'AirPods Pro',     price: 32000,  image: '🎧', category: 'Audio'      },
  { id: 4, name: 'iPad Air',        price: 78000,  image: '📲', category: 'Tech'       },
  { id: 5, name: 'Apple Watch',     price: 55000,  image: '⌚', category: 'Wearables'  },
  { id: 6, name: 'Magic Keyboard',  price: 18000,  image: '⌨️', category: 'Accesorios' },
]

/* Métricas de ventas del mes para el encabezado del demo */
const METRICAS = [
  { label: 'Ventas mes',  valor: 'DOP 2.4M', color: '#10b981' },
  { label: 'Pedidos',     valor: '156',       color: '#00D4FF' },
  { label: 'Conversión',  valor: '3.2%',      color: '#D4AF37' },
]

/* Formatea un número como moneda DOP sin decimales */
const formatearDOP = (valor) =>
  new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(valor)

/* Componente principal del demo de e-commerce */
export default function EcommerceDemo() {
  /* Items del carrito: { id, name, price, image, qty } */
  const [carrito, setCarrito]       = useState([])
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

  /* Cantidad total de unidades en el carrito */
  const totalItems = carrito.reduce((acc, i) => acc + i.qty, 0)

  /* Subtotal del carrito sin impuestos */
  const subtotal = carrito.reduce((acc, i) => acc + i.price * i.qty, 0)

  /* Simula la finalización de la compra y muestra el modal de éxito */
  const finalizarCompra = () => {
    setModalExito(true)
    setCarrito([])
  }

  return (
    <div className="space-y-4">

      {/* ── Métricas del mes ── */}
      <div className="grid grid-cols-3 gap-3">
        {METRICAS.map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[11px] mb-1" style={{ color: '#94A3B8' }}>{m.label}</p>
            <p className="text-sm font-bold" style={{ color: m.color }}>{m.valor}</p>
          </div>
        ))}
      </div>

      {/* ── Layout principal: productos + carrito ── */}
      <div className="flex gap-4">

        {/* ── Grid de productos 3x2 ── */}
        <div className="flex-1 grid grid-cols-3 gap-3">
          {PRODUCTOS.map((producto, idx) => {
            const enCarrito = carrito.find(i => i.id === producto.id)
            return (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl p-3 flex flex-col"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Imagen emoji del producto */}
                <div className="text-3xl text-center mb-2">{producto.image}</div>

                {/* Nombre del producto */}
                <p className="text-xs font-medium mb-1 leading-tight" style={{ color: '#F1F5F9' }}>
                  {producto.name}
                </p>

                {/* Categoría */}
                <p className="text-[10px] mb-2" style={{ color: '#94A3B8' }}>{producto.category}</p>

                {/* Precio en DOP */}
                <p className="text-xs font-bold mb-2" style={{ color: '#00D4FF' }}>
                  {formatearDOP(producto.price)}
                </p>

                {/* Botón agregar al carrito / badge de cantidad si ya está */}
                {enCarrito ? (
                  /* Indicador de item ya en el carrito */
                  <div className="mt-auto flex items-center justify-center gap-1 py-1 rounded-lg" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
                    <ShoppingCart size={11} style={{ color: '#00D4FF' }} />
                    <span className="text-[10px] font-medium" style={{ color: '#00D4FF' }}>{enCarrito.qty} en carrito</span>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => agregarAlCarrito(producto)}
                    className="mt-auto py-1.5 rounded-lg text-[11px] font-medium"
                    style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)', color: '#00D4FF' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Agregar
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* ── Sidebar de carrito ── */}
        <div
          className="w-48 shrink-0 rounded-xl p-3 flex flex-col"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Encabezado del carrito con cantidad de items */}
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart size={14} style={{ color: '#00D4FF' }} />
            <span className="text-xs font-semibold" style={{ color: '#F1F5F9' }}>Carrito</span>
            {totalItems > 0 && (
              <span
                className="ml-auto text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: '#00D4FF', color: '#0a0a0f' }}
              >
                {totalItems}
              </span>
            )}
          </div>

          {/* Lista de items del carrito o mensaje de vacío */}
          <div className="flex-1 space-y-2 overflow-y-auto max-h-52">
            {carrito.length === 0 ? (
              <p className="text-[11px] text-center py-4" style={{ color: '#94A3B8' }}>
                El carrito está vacío
              </p>
            ) : (
              carrito.map(item => (
                <div key={item.id} className="flex flex-col gap-1 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between items-start">
                    {/* Nombre del item */}
                    <span className="text-[10px] leading-tight flex-1" style={{ color: '#F1F5F9' }}>
                      {item.image} {item.name}
                    </span>
                    {/* Botón eliminar item */}
                    <button onClick={() => eliminarItem(item.id)}>
                      <X size={10} style={{ color: '#ef4444' }} />
                    </button>
                  </div>

                  {/* Controles de cantidad y subtotal por item */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => cambiarCantidad(item.id, -1)}
                      className="w-4 h-4 rounded flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      <Minus size={8} style={{ color: '#94A3B8' }} />
                    </button>
                    <span className="text-[10px] font-mono w-4 text-center" style={{ color: '#F1F5F9' }}>{item.qty}</span>
                    <button
                      onClick={() => cambiarCantidad(item.id, 1)}
                      className="w-4 h-4 rounded flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      <Plus size={8} style={{ color: '#94A3B8' }} />
                    </button>
                    <span className="ml-auto text-[10px] font-bold" style={{ color: '#10b981' }}>
                      {formatearDOP(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Subtotal del carrito */}
          {carrito.length > 0 && (
            <div className="pt-2 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold mb-2" style={{ color: '#F1F5F9' }}>
                Total: <span style={{ color: '#10b981' }}>{formatearDOP(subtotal)}</span>
              </p>

              {/* Botón para finalizar la compra */}
              <motion.button
                onClick={finalizarCompra}
                className="w-full py-2 rounded-lg text-xs font-bold"
                style={{ background: '#10b981', color: '#fff' }}
                whileTap={{ scale: 0.97 }}
              >
                Finalizar compra
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal de compra exitosa ── */}
      <AnimatePresence>
        {modalExito && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalExito(false)}
          >
            <motion.div
              className="rounded-2xl p-8 text-center max-w-xs mx-4"
              style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.3)' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Ícono de éxito */}
              <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#10b981' }} />
              <p className="text-lg font-bold mb-2" style={{ color: '#F1F5F9' }}>¡Compra exitosa!</p>
              <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>
                Tu pedido fue procesado correctamente. Recibirás confirmación por correo.
              </p>
              <motion.button
                onClick={() => setModalExito(false)}
                className="px-6 py-2 rounded-xl text-sm font-medium"
                style={{ background: '#10b981', color: '#fff' }}
                whileTap={{ scale: 0.97 }}
              >
                Continuar comprando
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
