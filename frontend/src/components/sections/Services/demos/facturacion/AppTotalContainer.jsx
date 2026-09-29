import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers,
  ShoppingBag,
  ExternalLink
} from 'lucide-react'

import {
  PRODUCTOS_DEMO,
  CLIENTES_DEMO,
  FACTURAS_INICIALES,
  DATOS_EMPRESA,
} from './facturacionData'

import DashboardView from './DashboardView'
import ProductosView from './ProductosView'
import FacturasView from './FacturasView'
import FacturacionPOS from './FacturacionPOS'
import CategoriasView from './CategoriasView'
import ClientesView from './ClientesView'
import ReportesView from './ReportesView'
import ConfiguracionView from './ConfiguracionView'
import FacturaTicketModal from './FacturaTicketModal'

// Elementos del menú del Drawer idénticos a Drawer.jsx de app-total
const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'productos', label: 'Productos', icon: '📦' },
  { id: 'facturas', label: 'Facturas', icon: '📄' },
  { id: 'crear-factura', label: 'Crear Factura (POS)', icon: '➕', highlight: true },
  { id: 'categorias', label: 'Categorías', icon: '🏷️' },
  { id: 'clientes', label: 'Usuarios y Clientes', icon: '👥' },
  { id: 'reportes', label: 'Reportes y Balance', icon: '📈' },
  { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
]

export default function AppTotalContainer() {
  const [vistaActual, setVistaActual] = useState('dashboard')
  const [drawerAbierto, setDrawerAbierto] = useState(false)

  // Estados globales de la sesión para que todas las vistas compartan datos
  const [productos, setProductos] = useState(PRODUCTOS_DEMO)
  const [clientes, setClientes] = useState(CLIENTES_DEMO)
  const [facturas, setFacturas] = useState(FACTURAS_INICIALES)

  // Factura seleccionada para ver/imprimir ticket
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null)
  const [modalTicketAbierto, setModalTicketAbierto] = useState(false)

  const handleVerTicket = (factura) => {
    setFacturaSeleccionada(factura)
    setModalTicketAbierto(true)
  }

  const handleReiniciarDemo = () => {
    setProductos(PRODUCTOS_DEMO)
    setClientes(CLIENTES_DEMO)
    setFacturas(FACTURAS_INICIALES)
    setVistaActual('dashboard')
  }

  return (
    <div className="w-full max-w-full bg-gray-100 rounded-2xl overflow-hidden font-sans text-gray-800 shadow-2xl border border-gray-300/80 select-none flex flex-col min-h-[520px] sm:min-h-[680px]">
      {/* ── HEADER PRINCIPAL (Diseño idéntico a Dashboard.jsx de app-total) ── */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 flex items-center justify-between z-20 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Botón menú responsive */}
          <button
            onClick={() => setDrawerAbierto(!drawerAbierto)}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Abrir menú"
          >
            {drawerAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo y Nombre de la App */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-blue-500/20">
              J4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-gray-900 tracking-tight">
                  App Facturación
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  v2.5 Web
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-none hidden sm:block">
                Sistema Integral de Gestión & Facturación Electrónica DGII
              </p>
            </div>
          </div>
        </div>

        {/* Indicadores de Licencia y Perfil de Usuario */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Badge de Licencia Activa */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Licencia Activa</span> (365 días)
          </div>

          {/* Usuario Demo / Superadmin */}
          <div className="hidden md:flex items-center gap-2 border-l border-gray-200 pl-3">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              AD
            </div>
            <div className="text-left leading-tight">
              <span className="text-xs font-bold text-gray-800 block">Admin</span>
              <span className="text-[9px] text-gray-400 font-semibold uppercase">Superadmin</span>
            </div>
          </div>

          {/* Botón Reiniciar Demo */}
          <button
            onClick={handleReiniciarDemo}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reiniciar datos de demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL: SIDEBAR + VISTA ACTIVA ── */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* ══════════ DRAWER / SIDEBAR (Idéntico a Drawer.jsx de app-total) ══════════ */}
        <aside
          className={`absolute lg:static top-0 left-0 bottom-0 z-30 w-60 bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
            drawerAbierto ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Módulos del Sistema
            </div>

            {MENU_ITEMS.map((item) => {
              const esActivo = vistaActual === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setVistaActual(item.id)
                    setDrawerAbierto(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    esActivo
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : item.highlight
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200 font-bold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !esActivo && (
                    <span className="text-[9px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.5 rounded uppercase">
                      POS
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Pie del Drawer con datos de la empresa y estado DGII */}
          <div className="p-3 border-t border-gray-200 bg-gray-50/50 space-y-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-white border border-gray-200/90 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                DGII Dominicano
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">
                Emisión de NCF B01, B02, B14 autorizados según norma general.
              </p>
            </div>
            <div className="text-center text-[10px] text-gray-400">
              {DATOS_EMPRESA.nombre}
            </div>
          </div>
        </aside>

        {/* Overlay para cerrar drawer en móvil */}
        {drawerAbierto && (
          <div
            onClick={() => setDrawerAbierto(false)}
            className="lg:hidden fixed inset-0 bg-black/40 z-20"
          />
        )}

        {/* ══════════ ÁREA DE VISTA ACTIVA ══════════ */}
        <main className="flex-1 p-3 sm:p-5 overflow-y-auto max-h-[750px] bg-gray-50/80">
          <AnimatePresence mode="wait">
            <motion.div
              key={vistaActual}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {vistaActual === 'dashboard' && (
                <DashboardView
                  facturas={facturas}
                  productos={productos}
                  clientes={clientes}
                  onNavigate={setVistaActual}
                  onSelectFactura={handleVerTicket}
                />
              )}

              {vistaActual === 'productos' && (
                <ProductosView
                  productos={productos}
                  setProductos={setProductos}
                />
              )}

              {vistaActual === 'facturas' && (
                <FacturasView
                  facturas={facturas}
                  onSelectFactura={handleVerTicket}
                  onNavigate={setVistaActual}
                />
              )}

              {vistaActual === 'crear-factura' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      Módulo POS de Facturación Rápida
                    </span>
                    <button
                      onClick={() => setVistaActual('dashboard')}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-900"
                    >
                      ← Volver al Dashboard
                    </button>
                  </div>
                  <FacturacionPOS />
                </div>
              )}

              {vistaActual === 'categorias' && (
                <CategoriasView productos={productos} />
              )}

              {vistaActual === 'clientes' && (
                <ClientesView
                  clientes={clientes}
                  setClientes={setClientes}
                />
              )}

              {vistaActual === 'reportes' && (
                <ReportesView facturas={facturas} />
              )}

              {vistaActual === 'configuracion' && (
                <ConfiguracionView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Modal de Ticket Fiscal Global ── */}
      <FacturaTicketModal
        isOpen={modalTicketAbierto}
        onClose={() => setModalTicketAbierto(false)}
        factura={facturaSeleccionada}
        onNuevaVenta={() => {
          setModalTicketAbierto(false)
          setVistaActual('crear-factura')
        }}
      />
    </div>
  )
}
