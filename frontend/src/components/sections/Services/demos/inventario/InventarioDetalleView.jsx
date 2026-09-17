import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Search,
  Barcode,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  TrendingDown,
  Users,
  CreditCard,
  Briefcase,
  PiggyBank,
  Printer,
  FileText,
  Settings,
  ShoppingCart,
  Receipt,
  Wallet,
  Menu,
  Download,
  CheckCircle,
  AlertCircle,
  Edit2,
  Save,
  X
} from 'lucide-react'
import InventarioFinancialModal from './InventarioFinancialModal'
import { CATALOGO_PRODUCTOS_DEMO } from './inventarioData'

export default function InventarioDetalleView({
  sesion,
  onActualizarSesion,
  onFinalizarSesion,
  onVolver
}) {
  const searchInputRef = useRef(null)

  // Estados de búsqueda y agregado de producto
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducto, setSelectedProducto] = useState(null)
  const [cantidad, setCantidad] = useState('')
  const [costoCustom, setCostoCustom] = useState('')
  const [unidadCustom, setUnidadCustom] = useState('Unidad')

  // Temporizador en vivo
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(sesion?.tiempoSegundos || 0)

  // Modales financieros
  const [activeFinancialModal, setActiveFinancialModal] = useState(null)
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)

  // Edición rápida de item en tabla
  const [editingItemId, setEditingItemId] = useState(null)
  const [editCantidad, setEditCantidad] = useState('')

  // Reloj de tiempo transcurrido
  useEffect(() => {
    if (sesion?.estado === 'completada') return

    const timer = setInterval(() => {
      setTiempoTranscurrido(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [sesion?.estado])

  const formatearTiempo = (segundos) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`
  }

  // Filtrado de productos del catálogo según búsqueda
  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (q.length < 2) return []
    return CATALOGO_PRODUCTOS_DEMO.filter(
      p => p.nombre.toLowerCase().includes(q) || p.codigo.includes(q)
    )
  }, [searchTerm])

  const handleSelectProduct = (prod) => {
    setSelectedProducto(prod)
    setSearchTerm(prod.nombre)
    setCostoCustom(prod.costo)
    setUnidadCustom(prod.unidad)
    setCantidad('1')
    setTimeout(() => {
      document.getElementById('cantidad-input')?.focus()
    }, 100)
  }

  // Agregar al conteo
  const handleAddProduct = (e) => {
    e.preventDefault()
    const cantNum = parseFloat(cantidad)
    if (!cantNum || cantNum <= 0) return

    let nuevoItem
    if (selectedProducto) {
      nuevoItem = {
        id: `cnt-${Date.now()}`,
        producto: selectedProducto.id,
        nombreProducto: selectedProducto.nombre,
        skuProducto: selectedProducto.codigo,
        unidadProducto: selectedProducto.unidad,
        cantidadContada: cantNum,
        costoProducto: selectedProducto.costo,
        valorTotal: cantNum * selectedProducto.costo
      }
    } else {
      // Permitir producto manual si no estaba en catálogo
      if (!searchTerm.trim()) return
      const costo = parseFloat(costoCustom) || 100
      nuevoItem = {
        id: `cnt-${Date.now()}`,
        producto: Date.now(),
        nombreProducto: searchTerm.trim(),
        skuProducto: 'MAN-' + Math.floor(100000 + Math.random() * 900000),
        unidadProducto: unidadCustom || 'Unidad',
        cantidadContada: cantNum,
        costoProducto: costo,
        valorTotal: cantNum * costo
      }
    }

    const nuevosContados = [nuevoItem, ...(sesion.productosContados || [])]
    const totalProds = nuevosContados.reduce((acc, p) => acc + (parseFloat(p.cantidadContada) || 0), 0)
    const totalVal = nuevosContados.reduce((acc, p) => acc + (parseFloat(p.valorTotal) || 0), 0)

    onActualizarSesion({
      ...sesion,
      tiempoSegundos: tiempoTranscurrido,
      productosContados: nuevosContados,
      totales: {
        totalProductosContados: totalProds,
        valorTotalInventario: totalVal
      }
    })

    // Reset campos
    setSelectedProducto(null)
    setSearchTerm('')
    setCantidad('')
    setCostoCustom('')
    searchInputRef.current?.focus()
  }

  // Eliminar producto contado
  const handleRemoveProduct = (itemId) => {
    const nuevosContados = (sesion.productosContados || []).filter(p => p.id !== itemId)
    const totalProds = nuevosContados.reduce((acc, p) => acc + (parseFloat(p.cantidadContada) || 0), 0)
    const totalVal = nuevosContados.reduce((acc, p) => acc + (parseFloat(p.valorTotal) || 0), 0)

    onActualizarSesion({
      ...sesion,
      productosContados: nuevosContados,
      totales: {
        totalProductosContados: totalProds,
        valorTotalInventario: totalVal
      }
    })
  }

  // Guardar edición rápida de cantidad
  const handleSaveEditCantidad = (itemId) => {
    const nuevaCant = parseFloat(editCantidad)
    if (!nuevaCant || nuevaCant <= 0) {
      setEditingItemId(null)
      return
    }

    const nuevosContados = (sesion.productosContados || []).map(p => {
      if (p.id === itemId) {
        return {
          ...p,
          cantidadContada: nuevaCant,
          valorTotal: nuevaCant * p.costoProducto
        }
      }
      return p
    })

    const totalProds = nuevosContados.reduce((acc, p) => acc + (parseFloat(p.cantidadContada) || 0), 0)
    const totalVal = nuevosContados.reduce((acc, p) => acc + (parseFloat(p.valorTotal) || 0), 0)

    onActualizarSesion({
      ...sesion,
      productosContados: nuevosContados,
      totales: {
        totalProductosContados: totalProds,
        valorTotalInventario: totalVal
      }
    })
    setEditingItemId(null)
  }

  // Actualizar datos financieros del modal
  const handleGuardarFinanciero = (key, valor) => {
    const nuevosDatosFinancieros = {
      ...(sesion.datosFinancieros || {}),
      [key]: valor
    }

    onActualizarSesion({
      ...sesion,
      datosFinancieros: nuevosDatosFinancieros
    })
  }

  // Descargar CSV
  const handleDownloadCSV = () => {
    const header = ['ID', 'Producto', 'Código de Barras', 'Unidad', 'Cantidad Contada', 'Costo RD$', 'Total RD$']
    const rows = (sesion.productosContados || []).map((p, idx) => [
      idx + 1,
      `"${p.nombreProducto}"`,
      `"${p.skuProducto}"`,
      `"${p.unidadProducto}"`,
      p.cantidadContada,
      p.costoProducto,
      p.valorTotal
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Inventario_${sesion.numeroSesion}_${sesion.clienteNegocio?.nombre || 'Cliente'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowDownloadModal(false)
  }

  // Imprimir Listado
  const handlePrint = () => {
    window.print()
    setShowDownloadModal(false)
  }

  const productosContados = sesion?.productosContados || []
  const valorTotal = sesion?.totales?.valorTotalInventario || 0
  const totalProductos = sesion?.totales?.totalProductosContados || 0

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* ── Desktop Header ── */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg border-b border-blue-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Izquierda: Volver y Título de Sesión */}
            <div className="flex items-center gap-3">
              <button
                onClick={onVolver}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
                title="Volver a lista de sesiones"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Sesión {sesion?.numeroSesion}
                  </h1>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      sesion?.estado === 'completada'
                        ? 'bg-emerald-400/30 text-emerald-200 border border-emerald-400/40'
                        : 'bg-amber-400/30 text-amber-200 border border-amber-400/40 animate-pulse'
                    }`}
                  >
                    {sesion?.estado === 'completada' ? 'Completada' : 'En Progreso'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                  {new Date(sesion?.fecha).toLocaleDateString()} • {sesion?.clienteNegocio?.nombre}
                </p>
              </div>
            </div>

            {/* Centro / Derecha: Timer y Totales */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Cronómetro en tiempo real */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 shadow-inner">
                <Clock className="w-4 h-4 text-emerald-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="font-mono text-sm sm:text-base font-bold tracking-wider">
                  {formatearTiempo(tiempoTranscurrido)}
                </span>
              </div>

              {/* Botón Menú de opciones */}
              <div className="relative">
                <button
                  onClick={() => setShowMenuModal(true)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
                  title="Menú y Descargas"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

              {/* Métricas del conteo */}
              <div className="text-right pl-3 border-l border-white/20">
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  RD$ {valorTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-blue-100/80 font-medium">
                  {totalProductos} {totalProductos === 1 ? 'unidad contada' : 'unidades contadas'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenido Principal de Conteo ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Info Card del Cliente Auditado */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border-l-4 border-l-blue-600 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {sesion?.clienteNegocio?.nombre}
              </h2>
              {sesion?.clienteNegocio?.rnc && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono font-medium">
                  RNC: {sesion.clienteNegocio.rnc}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              📍 {sesion?.clienteNegocio?.direccion || 'Sin dirección registrada'} • 📞 {sesion?.clienteNegocio?.telefono || 'Sin teléfono'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Download className="w-4 h-4 text-blue-500" />
              Descargar Listado
            </button>
            {sesion?.estado !== 'completada' && (
              <button
                onClick={() => onFinalizarSesion(sesion.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Finalizar Inventario
              </button>
            )}
          </div>
        </div>

        {/* Buscador y Lector de Código de Barras */}
        <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Toma y Conteo Físico de Productos
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Simulador con lector de códigos de barra integrado
            </span>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="relative">
              <div className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    if (selectedProducto && e.target.value !== selectedProducto.nombre) {
                      setSelectedProducto(null)
                    }
                  }}
                  placeholder="Escriba el nombre o escanee el código de barras (ej. 7460123...)"
                  className="w-full px-4 py-3 pl-11 pr-10 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm sm:text-base font-medium"
                />
                <Barcode className="absolute left-3.5 w-5 h-5 text-slate-400" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedProducto(null)
                    }}
                    className="absolute right-3.5 p-1 rounded-md text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Resultados Autocompletado del Catálogo */}
              {searchResults.length > 0 && !selectedProducto && (
                <div className="absolute z-20 w-full mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                  {searchResults.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectProduct(prod)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {prod.nombre}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Código: {prod.codigo} • {prod.categoria}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          RD$ {prod.costo.toFixed(2)}
                        </span>
                        <p className="text-xs text-slate-400">/{prod.unidad}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fila de Cantidad y Botón Agregar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Cantidad Contada
                </label>
                <input
                  id="cantidad-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="Ej: 15"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Unidad
                </label>
                <input
                  type="text"
                  value={selectedProducto?.unidad || unidadCustom}
                  onChange={(e) => setUnidadCustom(e.target.value)}
                  readOnly={!!selectedProducto}
                  className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 ${
                    selectedProducto ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400' : 'bg-white dark:bg-slate-800'
                  } font-medium`}
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Costo Unitario (RD$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedProducto?.costo || costoCustom}
                  onChange={(e) => setCostoCustom(e.target.value)}
                  readOnly={!!selectedProducto}
                  placeholder="0.00"
                  className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 ${
                    selectedProducto ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400' : 'bg-white dark:bg-slate-800'
                  } font-bold`}
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={!searchTerm.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 active:scale-98 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ── Gestión Financiera e Indicadores de Auditoría (8 Botones idénticos a Desktop) ── */}
        <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Gestión Financiera de Auditoría (Conciliación Contable)
            </h3>
            <span className="text-xs text-slate-400">Arqueos complementarios al inventario</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {/* 1. Ventas */}
            <button
              onClick={() => setActiveFinancialModal('ventas')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 transition-all hover:scale-102 group"
            >
              <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">Ventas</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                RD$ {(sesion?.datosFinancieros?.ventasDelMes || 0).toLocaleString()}
              </span>
            </button>

            {/* 2. Gastos */}
            <button
              onClick={() => setActiveFinancialModal('gastos')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800/60 transition-all hover:scale-102 group"
            >
              <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-rose-900 dark:text-rose-300">Gastos</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                RD$ {(sesion?.datosFinancieros?.gastosGenerales || 0).toLocaleString()}
              </span>
            </button>

            {/* 3. Cuentas por Cobrar */}
            <button
              onClick={() => setActiveFinancialModal('cuentasPorCobrar')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60 transition-all hover:scale-102 group"
            >
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 text-center leading-tight">Por Cobrar</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                RD$ {(sesion?.datosFinancieros?.cuentasPorCobrar || 0).toLocaleString()}
              </span>
            </button>

            {/* 4. Cuentas por Pagar */}
            <button
              onClick={() => setActiveFinancialModal('cuentasPorPagar')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 transition-all hover:scale-102 group"
            >
              <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 text-center leading-tight">Por Pagar</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                RD$ {(sesion?.datosFinancieros?.cuentasPorPagar || 0).toLocaleString()}
              </span>
            </button>

            {/* 5. Efectivo */}
            <button
              onClick={() => setActiveFinancialModal('efectivo')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/60 transition-all hover:scale-102 group"
            >
              <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-purple-900 dark:text-purple-300">Efectivo</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                RD$ {(sesion?.datosFinancieros?.efectivoEnCajaYBanco || 0).toLocaleString()}
              </span>
            </button>

            {/* 6. Activos Fijos */}
            <button
              onClick={() => setActiveFinancialModal('activosFijos')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800/60 transition-all hover:scale-102 group"
            >
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">Activos Fijos</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                RD$ {(sesion?.datosFinancieros?.activosFijos || 0).toLocaleString()}
              </span>
            </button>

            {/* 7. Capital */}
            <button
              onClick={() => setActiveFinancialModal('capital')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800/60 transition-all hover:scale-102 group"
            >
              <PiggyBank className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-yellow-900 dark:text-yellow-300">Capital</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                RD$ {(sesion?.datosFinancieros?.capital || 0).toLocaleString()}
              </span>
            </button>

            {/* 8. Ver Reporte */}
            <button
              onClick={() => setActiveFinancialModal('reporte')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-800/60 transition-all hover:scale-102 group"
            >
              <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-teal-900 dark:text-teal-300">Balance</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-0.5">
                Ver Todo
              </span>
            </button>
          </div>
        </div>

        {/* ── Tabla de Productos Contados ── */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              Detalle de Productos Contados en la Sesión ({productosContados.length})
            </h3>
            <span className="text-xs text-slate-500">
              Total Físico: <strong className="text-slate-800 dark:text-slate-200 font-mono">{totalProductos} unidades</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-100/60 dark:bg-slate-800/40 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Producto / Descripción</th>
                  <th className="px-4 py-3">Código de Barras</th>
                  <th className="px-4 py-3 text-right">Cantidad Contada</th>
                  <th className="px-4 py-3 text-right">Costo Unitario</th>
                  <th className="px-5 py-3 text-right">Total RD$</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {productosContados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <Barcode className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-medium text-slate-600 dark:text-slate-400">No hay productos en este conteo aún</p>
                      <p className="text-xs text-slate-400">Utilice el buscador superior para agregar productos contados.</p>
                    </td>
                  </tr>
                ) : (
                  productosContados.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.nombreProducto}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.unidadProducto}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {item.skuProducto}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-800 dark:text-slate-200">
                        {editingItemId === item.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              step="0.01"
                              value={editCantidad}
                              onChange={(e) => setEditCantidad(e.target.value)}
                              className="w-20 px-2 py-1 text-right text-xs rounded border border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEditCantidad(item.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span>{item.cantidadContada.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-600 dark:text-slate-300 font-mono">
                        RD$ {item.costoProducto.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5 text-right font-black text-blue-600 dark:text-blue-400 font-mono">
                        RD$ {item.valorTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItemId(item.id)
                              setEditCantidad(String(item.cantidadContada))
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            title="Editar cantidad"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveProduct(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                            title="Eliminar del conteo"
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
      </div>

      {/* ── Modal de Menú Rápido ── */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Menú de la Sesión</h4>
              <button onClick={() => setShowMenuModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => {
                setShowMenuModal(false)
                setShowDownloadModal(true)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              <Download className="w-5 h-5" />
              Exportar e Imprimir Listado
            </button>
            <button
              onClick={() => {
                setShowMenuModal(false)
                setActiveFinancialModal('reporte')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Ver Arqueo Contable Consolidado
            </button>
            <button
              onClick={() => {
                setShowMenuModal(false)
                onVolver()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a Sesiones
            </button>
          </motion.div>
        </div>
      )}

      {/* ── Modal de Descarga e Impresión ── */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Exportar Listado de Inventario</h4>
              <button onClick={() => setShowDownloadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={handleDownloadCSV}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md"
              >
                <FileText className="w-4 h-4" />
                Descargar Archivo CSV / Excel
              </button>
              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md"
              >
                <Printer className="w-4 h-4" />
                Imprimir Documento Físico
              </button>
            </div>
            <button
              onClick={() => setShowDownloadModal(false)}
              className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </button>
          </motion.div>
        </div>
      )}

      {/* ── Modal Financiero de Conciliación ── */}
      <InventarioFinancialModal
        isOpen={!!activeFinancialModal}
        tipo={activeFinancialModal}
        datosFinancieros={sesion?.datosFinancieros}
        onClose={() => setActiveFinancialModal(null)}
        onGuardar={handleGuardarFinanciero}
      />
    </div>
  )
}
