import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Clock,
  Flame,
  Star,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Utensils,
  MapPin,
  Maximize2,
  Minimize2,
  RotateCcw,
  Smartphone,
  CreditCard,
  Banknote,
  Send,
  Heart
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { CATEGORIAS_MENU, PLATOS_MENU } from './restauranteData'

export default function RestauranteAppDemo() {
  // Estado de vista dentro del teléfono: 'menu' | 'detalle' | 'carrito' | 'pedido_confirmado'
  const [pantallaActual, setPantallaActual] = useState('menu')

  // Búsqueda y categoría activa
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [favoritos, setFavoritos] = useState([1, 2])

  // Plato seleccionado para ver en detalle / personalizar
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null)
  const [cantidadPlato, setCantidadPlato] = useState(1)
  const [terminoSeleccionado, setTerminoSeleccionado] = useState('')
  const [guarnicionSeleccionada, setGuarnicionSeleccionada] = useState('')
  const [extrasSeleccionados, setExtrasSeleccionados] = useState([])
  const [notasPlato, setNotasPlato] = useState('')

  // Carrito de compras
  const [carrito, setCarrito] = useState([
    {
      idUnico: 'item-demo-1',
      id: 2,
      nombre: 'J4 Truffle Bacon Burger',
      precioBase: 680,
      precioTotal: 770,
      cantidad: 1,
      imagen: '🍔',
      termino: 'Término Medio',
      guarnicion: 'Papas Rústicas',
      extras: [{ id: 'ex-4', nombre: 'Doble Tocineta Ahumada', precio: 90 }],
      notas: 'Bien crujiente la tocineta'
    },
    {
      idUnico: 'item-demo-2',
      id: 8,
      nombre: 'Mojito Artesanal Maracuyá',
      precioBase: 360,
      precioTotal: 360,
      cantidad: 2,
      imagen: '🍹',
      termino: 'Con Alcohol (Ron)',
      guarnicion: '',
      extras: [],
      notas: ''
    }
  ])

  // Modo de pedido: 'Mesa 4 (Salón)' | 'Delivery a Domicilio' | 'Para Llevar'
  const [modoServicio, setModoServicio] = useState('Mesa 4 (Salón)')
  const [metodoPago, setMetodoPago] = useState('Tarjeta / Apple Pay')

  // Estado del pedido confirmado (simulación de cocina)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null)

  // Modo de pantalla expandida (toggle teléfono vs pantalla ancha)
  const [modoExpandido, setModoExpandido] = useState(false)

  // Filtrado de platos
  const platosFiltrados = useMemo(() => {
    return PLATOS_MENU.filter(plato => {
      const coincideCategoria = categoriaActiva === 'todos' || plato.categoria === categoriaActiva
      const coincideBusqueda =
        plato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        plato.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      return coincideCategoria && coincideBusqueda
    })
  }, [categoriaActiva, busqueda])

  // Cálculo de totales del carrito
  const totales = useMemo(() => {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precioTotal * item.cantidad), 0)
    const itbis = subtotal * 0.18 // 18% ITBIS
    const propinaLegal = subtotal * 0.10 // 10% Ley
    const total = subtotal + itbis + propinaLegal
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)
    return { subtotal, itbis, propinaLegal, total, totalItems }
  }, [carrito])

  // Abrir modal de detalle para un plato
  const abrirDetallePlato = (plato) => {
    setPlatoSeleccionado(plato)
    setCantidadPlato(1)
    setTerminoSeleccionado(plato.opcionesTermino?.[0] || '')
    setGuarnicionSeleccionada(plato.guarniciones?.[0] || '')
    setExtrasSeleccionados([])
    setNotasPlato('')
    setPantallaActual('detalle')
  }

  // Toggle de extra en modal de plato
  const toggleExtra = (extra) => {
    setExtrasSeleccionados(prev => {
      const existe = prev.some(e => e.id === extra.id)
      if (existe) {
        return prev.filter(e => e.id !== extra.id)
      } else {
        return [...prev, extra]
      }
    })
  }

  // Toggle favorito
  const toggleFavorito = (e, platoId) => {
    e.stopPropagation()
    setFavoritos(prev =>
      prev.includes(platoId) ? prev.filter(id => id !== platoId) : [...prev, platoId]
    )
    toast.success(favoritos.includes(platoId) ? 'Removido de favoritos' : '¡Guardado en tus favoritos!')
  }

  // Agregar plato personalizado al carrito
  const agregarAlCarrito = () => {
    if (!platoSeleccionado) return

    const costoExtras = extrasSeleccionados.reduce((sum, e) => sum + e.precio, 0)
    const precioUnitario = platoSeleccionado.precio + costoExtras

    const nuevoItem = {
      idUnico: `item-${Date.now()}`,
      id: platoSeleccionado.id,
      nombre: platoSeleccionado.nombre,
      precioBase: platoSeleccionado.precio,
      precioTotal: precioUnitario,
      cantidad: cantidadPlato,
      imagen: platoSeleccionado.imagen,
      termino: terminoSeleccionado,
      guarnicion: guarnicionSeleccionada,
      extras: extrasSeleccionados,
      notas: notasPlato
    }

    setCarrito(prev => [nuevoItem, ...prev])
    toast.success(`Agregado al pedido: ${platoSeleccionado.nombre}`)
    setPantallaActual('menu')
    setPlatoSeleccionado(null)
  }

  // Modificar cantidad en carrito
  const modificarCantidadCarrito = (idUnico, delta) => {
    setCarrito(prev => {
      return prev
        .map(item => {
          if (item.idUnico === idUnico) {
            const nuevaCantidad = item.cantidad + delta
            return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null
          }
          return item
        })
        .filter(Boolean)
    })
  }

  // Confirmar y enviar pedido
  const confirmarPedido = () => {
    if (carrito.length === 0) return

    const nuevoPedido = {
      numero: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...carrito],
      totales: { ...totales },
      modoServicio,
      metodoPago,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estado: 'en_preparacion'
    }

    setPedidoConfirmado(nuevoPedido)
    setCarrito([])
    setPantallaActual('pedido_confirmado')
    toast.success('¡Pedido recibido y enviado a la cocina!', {
      description: 'El chef ha comenzado la preparación.'
    })
  }

  // Reiniciar demo
  const reiniciarDemo = () => {
    setCategoriaActiva('todos')
    setBusqueda('')
    setPantallaActual('menu')
    setPedidoConfirmado(null)
    toast.info('Demo reiniciada')
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 text-slate-900 dark:text-slate-100">
      <Toaster richColors position="top-center" />

      {/* ── Controles exteriores del Demo ── */}
      <div className="w-full max-w-4xl mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <span>Gourmet Bistro App</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 font-bold uppercase">
                Demo Móvil
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pruebe la experiencia completa: explore platos, personalice ingredientes y envíe pedidos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón toggle formato teléfono vs pantalla completa */}
          <button
            onClick={() => setModoExpandido(!modoExpandido)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            {modoExpandido ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Modo Teléfono</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Expandir Vista</span>
              </>
            )}
          </button>

          <button
            onClick={reiniciarDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* ── Marco del Smartphone / Contenedor de la App ── */}
      <div
        className={`relative transition-all duration-300 ${
          modoExpandido
            ? 'w-full max-w-2xl rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-2xl bg-white dark:bg-slate-900'
            : 'w-full max-w-full sm:max-w-[390px] h-[720px] sm:h-[780px] rounded-2xl sm:rounded-[48px] overflow-hidden border-4 sm:border-[8px] border-slate-800 dark:border-slate-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] bg-white dark:bg-slate-950 flex flex-col'
        }`}
      >
        {/* Dynamic Island / Notch del teléfono */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-2 px-6 pb-1 flex flex-col border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <span>12:45</span>
            {/* Dynamic Island Pill */}
            <div className="w-24 h-4 bg-slate-900 dark:bg-black rounded-full flex items-center justify-center gap-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
              <span className="text-[8px] font-mono text-slate-400">Gourmet</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Selector de servicio y carrito superior */}
          <div className="flex items-center justify-between mt-2.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🔥</span>
              <div>
                <h1 className="text-xs font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Sabor & Fuego
                </h1>
                {/* Botón cambiar de Mesa a Delivery */}
                <button
                  onClick={() => {
                    const opciones = ['Mesa 4 (Salón)', 'Delivery a Domicilio', 'Para Llevar (Pick-up)']
                    const idx = opciones.indexOf(modoServicio)
                    const siguiente = opciones[(idx + 1) % opciones.length]
                    setModoServicio(siguiente)
                    toast.info(`Modo cambiado a: ${siguiente}`)
                  }}
                  className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5 hover:underline"
                >
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{modoServicio}</span>
                  <span className="text-[8px] text-slate-400">(cambiar)</span>
                </button>
              </div>
            </div>

            {/* Icono del Carrito con Badge */}
            <button
              onClick={() => setPantallaActual(pantallaActual === 'carrito' ? 'menu' : 'carrito')}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {totales.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                  {totales.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── CUERPO PRINCIPAL INTERNO DE LA APP ── */}
        <div className="flex-1 overflow-y-auto relative scrollbar-none">
          <AnimatePresence mode="wait">
            {/* ── PANTALLA 1: MENÚ PRINCIPAL ── */}
            {pantallaActual === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 sm:p-4 space-y-4 pb-20"
              >
                {/* Banner de Bienvenida / Promo */}
                <div className="relative rounded-2xl p-4 overflow-hidden bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/20">
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm">
                      Especial del Día
                    </span>
                    <h2 className="text-base font-black mt-1 leading-tight">
                      Cortes Angus & Coctelería de Autor
                    </h2>
                    <p className="text-[11px] text-white/90 mt-0.5">
                      15% de descuento en platos recomendados por el chef.
                    </p>
                  </div>
                  <div className="absolute -right-2 -bottom-3 text-5xl opacity-30 select-none">
                    🥩
                  </div>
                </div>

                {/* Buscador de Platos */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar platos, pastas, bebidas..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                  {busqueda && (
                    <button
                      onClick={() => setBusqueda('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Carrusel Horizontal de Categorías */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {CATEGORIAS_MENU.map((cat) => {
                    const activa = categoriaActiva === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategoriaActiva(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          activa
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-102'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span>{cat.icono}</span>
                        <span>{cat.nombre}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Listado de Platos */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                    <span>Platos ({platosFiltrados.length})</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400">
                      Toca un plato para personalizarlo
                    </span>
                  </div>

                  {platosFiltrados.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <p className="text-2xl mb-1">🔍</p>
                      <p className="text-xs font-semibold">No se encontraron platos</p>
                      <p className="text-[10px]">Intenta buscar con otro término o categoría.</p>
                    </div>
                  ) : (
                    platosFiltrados.map((plato) => (
                      <motion.div
                        key={plato.id}
                        onClick={() => abrirDetallePlato(plato)}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/50 dark:hover:border-amber-500/50 shadow-sm cursor-pointer transition-all flex gap-3 group relative"
                      >
                        {/* Icono / Imagen del Plato */}
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-100 to-rose-100 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-4xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                          {plato.imagen}
                        </div>

                        {/* Info del Plato */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {plato.nombre}
                              </h4>
                              {/* Botón Favorito */}
                              <button
                                onClick={(e) => toggleFavorito(e, plato.id)}
                                className="p-1 rounded-full text-slate-400 hover:text-rose-500"
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 ${
                                    favoritos.includes(plato.id) ? 'fill-rose-500 text-rose-500' : ''
                                  }`}
                                />
                              </button>
                            </div>

                            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                              {plato.descripcion}
                            </p>
                          </div>

                          {/* Metadatos y Precio */}
                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="flex items-center gap-0.5 font-bold text-amber-500">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                {plato.calificacion}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {plato.tiempo}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900 dark:text-slate-100 font-mono">
                                RD$ {plato.precio.toLocaleString()}
                              </span>
                              <span className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm">
                                <Plus className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* ── PANTALLA 2: DETALLE Y PERSONALIZACIÓN DE PLATO ── */}
            {pantallaActual === 'detalle' && platoSeleccionado && (
              <motion.div
                key="detalle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 space-y-4 pb-24 text-xs"
              >
                {/* Botón Volver */}
                <button
                  onClick={() => setPantallaActual('menu')}
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-amber-500 font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al Menú</span>
                </button>

                {/* Hero del Plato */}
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-6xl mb-2 animate-bounce" style={{ animationDuration: '2.5s' }}>
                    {platoSeleccionado.imagen}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 uppercase">
                    {platoSeleccionado.etiqueta}
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                    {platoSeleccionado.nombre}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                    {platoSeleccionado.descripcion}
                  </p>
                  <div className="flex justify-center items-center gap-4 text-[10px] text-slate-500 mt-2 font-medium">
                    <span>⏳ {platoSeleccionado.tiempo}</span>
                    <span>🔥 {platoSeleccionado.calorias}</span>
                    <span>⭐ {platoSeleccionado.calificacion} ({platoSeleccionado.reviews})</span>
                  </div>
                </div>

                {/* Opciones de Término de Cocción (si aplica) */}
                {platoSeleccionado.opcionesTermino?.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      Término de Preparación
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {platoSeleccionado.opcionesTermino.map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          onClick={() => setTerminoSeleccionado(opcion)}
                          className={`w-full px-3 py-2 rounded-xl text-left font-medium border flex items-center justify-between transition-all ${
                            terminoSeleccionado === opcion
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-300'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{opcion}</span>
                          {terminoSeleccionado === opcion && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Opciones de Guarnición (si aplica) */}
                {platoSeleccionado.guarniciones?.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      Guarnición Incluida
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {platoSeleccionado.guarniciones.map((guar) => (
                        <button
                          key={guar}
                          type="button"
                          onClick={() => setGuarnicionSeleccionada(guar)}
                          className={`px-3 py-2 rounded-xl text-center font-medium border transition-all ${
                            guarnicionSeleccionada === guar
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-300'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {guar}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extras y Toppings */}
                {platoSeleccionado.extras?.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      Extras & Toppings Especiales
                    </label>
                    <div className="space-y-1.5">
                      {platoSeleccionado.extras.map((extra) => {
                        const seleccionado = extrasSeleccionados.some(e => e.id === extra.id)
                        return (
                          <button
                            key={extra.id}
                            type="button"
                            onClick={() => toggleExtra(extra)}
                            className={`w-full px-3 py-2 rounded-xl text-left border flex items-center justify-between transition-all ${
                              seleccionado
                                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-300 font-semibold'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{extra.nombre}</span>
                            <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400">
                              +RD$ {extra.precio}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Notas especiales al chef */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Instrucciones Especiales (Opcional)
                  </label>
                  <input
                    type="text"
                    value={notasPlato}
                    onChange={(e) => setNotasPlato(e.target.value)}
                    placeholder="Ej. Sin cebolla, aderezo aparte, salsa picante..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Selector de cantidad y botón agregar */}
                <div className="pt-2 flex items-center gap-3">
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setCantidadPlato(Math.max(1, cantidadPlato - 1))}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs">{cantidadPlato}</span>
                    <button
                      onClick={() => setCantidadPlato(cantidadPlato + 1)}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={agregarAlCarrito}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-lg shadow-amber-500/20 flex items-center justify-between transition-all"
                  >
                    <span>Agregar al Pedido</span>
                    <span className="font-mono">
                      RD$ {(
                        (platoSeleccionado.precio + extrasSeleccionados.reduce((s, e) => s + e.precio, 0)) * cantidadPlato
                      ).toLocaleString()}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── PANTALLA 3: CARRITO Y CHECKOUT ── */}
            {pantallaActual === 'carrito' && (
              <motion.div
                key="carrito"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-4 space-y-4 pb-24 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setPantallaActual('menu')}
                    className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300 hover:text-amber-500"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Seguir Pidiendo</span>
                  </button>
                  <h3 className="font-black text-sm">Tu Pedido Actual</h3>
                </div>

                {carrito.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-3">
                    <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="font-bold text-sm text-slate-600 dark:text-slate-300">Tu pedido está vacío</p>
                    <p className="text-xs">Selecciona tus platos favoritos del menú para ordenar.</p>
                    <button
                      onClick={() => setPantallaActual('menu')}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs"
                    >
                      Explorar Menú
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Lista de Platos en el Carrito */}
                    <div className="space-y-2.5">
                      {carrito.map((item) => (
                        <div
                          key={item.idUnico}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{item.imagen}</span>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100">{item.nombre}</p>
                              {item.termino && (
                                <p className="text-[10px] text-slate-400">{item.termino}</p>
                              )}
                              {item.guarnicion && (
                                <p className="text-[10px] text-slate-400">Guarnición: {item.guarnicion}</p>
                              )}
                              {item.extras?.length > 0 && (
                                <p className="text-[10px] text-amber-600 dark:text-amber-400">
                                  +{item.extras.map(e => e.nombre).join(', ')}
                                </p>
                              )}
                              <p className="text-xs font-black font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                                RD$ {(item.precioTotal * item.cantidad).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800">
                            <button
                              onClick={() => modificarCantidadCarrito(item.idUnico, -1)}
                              className="w-5 h-5 rounded bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200"
                            >
                              -
                            </button>
                            <span className="w-4 text-center font-bold text-xs">{item.cantidad}</span>
                            <button
                              onClick={() => modificarCantidadCarrito(item.idUnico, 1)}
                              className="w-5 h-5 rounded bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Método de Pago */}
                    <div className="space-y-1.5 pt-2">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Método de Pago
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setMetodoPago('Tarjeta / Apple Pay')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 font-medium transition-all ${
                            metodoPago === 'Tarjeta / Apple Pay'
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-blue-500" />
                          <span>Tarjeta / Apple Pay</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMetodoPago('Efectivo en Mano')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 font-medium transition-all ${
                            metodoPago === 'Efectivo en Mano'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
                          }`}
                        >
                          <Banknote className="w-4 h-4 text-emerald-500" />
                          <span>Efectivo</span>
                        </button>
                      </div>
                    </div>

                    {/* Resumen de Cuenta */}
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal de Platos</span>
                        <span className="font-mono font-medium">RD$ {totales.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>ITBIS (18%)</span>
                        <span className="font-mono font-medium">RD$ {totales.itbis.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Propina de Ley (10%)</span>
                        <span className="font-mono font-medium">RD$ {totales.propinaLegal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-black text-sm pt-1.5 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                        <span>Total a Pagar</span>
                        <span className="text-amber-600 dark:text-amber-400 font-mono">
                          RD$ {totales.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Botón Confirmar */}
                    <button
                      onClick={confirmarPedido}
                      className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Confirmar y Enviar a Cocina</span>
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {/* ── PANTALLA 4: ESTADO DEL PEDIDO EN COCINA (TRACKER) ── */}
            {pantallaActual === 'pedido_confirmado' && pedidoConfirmado && (
              <motion.div
                key="confirmado"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 text-center space-y-4 pb-20 text-xs"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto text-2xl shadow-lg">
                  👨‍🍳
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600">
                    En Preparación
                  </span>
                  <h3 className="text-base font-black mt-1.5 text-slate-900 dark:text-white">
                    ¡Pedido {pedidoConfirmado.numero} Recibido!
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Destino: <strong>{pedidoConfirmado.modoServicio}</strong> • Hora: {pedidoConfirmado.hora}
                  </p>
                </div>

                {/* Pasos del Tracker */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Orden Registrada</p>
                      <p className="text-[10px] text-slate-400">Comanda enviada a la estación del chef.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                      🔥
                    </span>
                    <div>
                      <p className="font-bold text-amber-600 dark:text-amber-400">Cocinando en Parrilla & Fogón</p>
                      <p className="text-[10px] text-slate-400">Tiempo estimado restante: 15-18 minutos.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-50">
                    <span className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-bold">Servicio a la Mesa / Entrega</p>
                      <p className="text-[10px] text-slate-400">Listo para degustar.</p>
                    </div>
                  </div>
                </div>

                {/* Detalle breve de lo pedido */}
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-left text-[11px]">
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Resumen del Pedido:</p>
                  {pedidoConfirmado.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-500 py-0.5">
                      <span>{it.cantidad}x {it.nombre}</span>
                      <span className="font-mono">RD$ {(it.precioTotal * it.cantidad).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 dark:border-slate-700 mt-1 pt-1 flex justify-between font-bold text-slate-800 dark:text-slate-100">
                    <span>Total Cancelado</span>
                    <span className="text-amber-500 font-mono">
                      RD$ {pedidoConfirmado.totales.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setPantallaActual('menu')}
                  className="w-full py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                >
                  Volver al Menú Principal
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── BARRA FLOTANTE DEL PEDIDO (STICKY BOTTOM) ── */}
        {pantallaActual === 'menu' && totales.totalItems > 0 && (
          <div className="absolute bottom-2 left-3 right-3 z-30">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={() => setPantallaActual('carrito')}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 text-white font-bold text-xs shadow-xl shadow-rose-500/30 flex items-center justify-between hover:brightness-110 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                  {totales.totalItems} {totales.totalItems === 1 ? 'plato' : 'platos'}
                </span>
                <span>Ver Mi Pedido</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-sm">
                <span>RD$ {totales.total.toLocaleString('es-DO', { maximumFractionDigits: 0 })}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
