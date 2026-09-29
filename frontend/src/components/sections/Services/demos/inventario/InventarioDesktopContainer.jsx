import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building2,
  Package,
  FileSpreadsheet,
  Clock,
  Laptop
} from 'lucide-react'
import { toast, Toaster } from 'sonner'

import {
  CLIENTES_INICIALES,
  SESIONES_INICIALES,
  CATALOGO_PRODUCTOS_DEMO
} from './inventarioData'

import InventarioClientesView from './InventarioClientesView'
import InventarioSesionesView from './InventarioSesionesView'
import InventarioDetalleView from './InventarioDetalleView'

export default function InventarioDesktopContainer() {
  // Estado de navegación: 'clientes' | 'sesiones' | 'detalle'
  const [vistaActual, setVistaActual] = useState('sesiones')

  // Datos principales reactivos
  const [clientes, setClientes] = useState(CLIENTES_INICIALES)
  const [sesiones, setSesiones] = useState(SESIONES_INICIALES)
  const [sesionActiva, setSesionActiva] = useState(SESIONES_INICIALES[1]) // Inicialmente la en_progreso (SES-2026-002)

  // 1. Crear nuevo cliente
  const handleCrearCliente = (nuevoCliente) => {
    const id = Date.now()
    const clienteCompleto = {
      ...nuevoCliente,
      id,
      activo: true,
      estadisticas: {
        totalInventarios: 0,
        ultimoInventario: null
      }
    }
    setClientes(prev => [clienteCompleto, ...prev])
    toast.success(`Cliente "${nuevoCliente.nombre}" registrado exitosamente`)
  }

  // 2. Editar cliente
  const handleEditarCliente = (id, data) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    // Actualizar también en sesiones si corresponde
    setSesiones(prev => prev.map(s => {
      if (s.clienteNegocioId === id || s.clienteNegocio?.id === id) {
        return {
          ...s,
          clienteNegocio: { ...s.clienteNegocio, ...data }
        }
      }
      return s
    }))
    toast.success('Cliente actualizado exitosamente')
  }

  // 3. Eliminar cliente
  const handleEliminarCliente = (id) => {
    setClientes(prev => prev.filter(c => c.id !== id))
    toast.info('Cliente removido')
  }

  // 4. Iniciar inventario directo desde el cliente
  const handleIniciarInventarioCliente = (cliente) => {
    // Buscar si ya tiene una en progreso
    const sesionExistente = sesiones.find(
      s => (s.clienteNegocioId === cliente.id || s.clienteNegocio?.id === cliente.id) && s.estado === 'en_progreso'
    )

    if (sesionExistente) {
      setSesionActiva(sesionExistente)
      setVistaActual('detalle')
      toast.info(`Abriendo sesión activa existente ${sesionExistente.numeroSesion}`)
      return
    }

    // Crear nueva sesión para este cliente
    const nuevoNumero = `SES-2026-00${sesiones.length + 1}`
    const nuevaSesion = {
      id: Date.now(),
      numeroSesion: nuevoNumero,
      clienteNegocioId: cliente.id,
      clienteNegocio: cliente,
      fecha: new Date().toISOString(),
      estado: 'en_progreso',
      notas: `Inventario iniciado para ${cliente.nombre}`,
      tiempoSegundos: 0,
      datosFinancieros: {
        ventasDelMes: 0,
        gastosGenerales: 0,
        cuentasPorCobrar: 0,
        cuentasPorPagar: 0,
        efectivoEnCajaYBanco: 0,
        activosFijos: 0,
        capital: 0
      },
      productosContados: [],
      totales: {
        totalProductosContados: 0,
        valorTotalInventario: 0
      }
    }

    setSesiones(prev => [nuevaSesion, ...prev])
    setSesionActiva(nuevaSesion)
    setVistaActual('detalle')
    toast.success(`Sesión ${nuevoNumero} iniciada para ${cliente.nombre}`)
  }

  // 5. Crear sesión desde modal de sesiones
  const handleCrearSesion = ({ clienteNegocioId, clienteNegocio, notas }) => {
    const nuevoNumero = `SES-2026-00${sesiones.length + 1}`
    const nuevaSesion = {
      id: Date.now(),
      numeroSesion: nuevoNumero,
      clienteNegocioId,
      clienteNegocio,
      fecha: new Date().toISOString(),
      estado: 'en_progreso',
      notas: notas || 'Auditoría y conteo físico',
      tiempoSegundos: 0,
      datosFinancieros: {
        ventasDelMes: 0,
        gastosGenerales: 0,
        cuentasPorCobrar: 0,
        cuentasPorPagar: 0,
        efectivoEnCajaYBanco: 0,
        activosFijos: 0,
        capital: 0
      },
      productosContados: [],
      totales: {
        totalProductosContados: 0,
        valorTotalInventario: 0
      }
    }

    setSesiones(prev => [nuevaSesion, ...prev])
    setSesionActiva(nuevaSesion)
    setVistaActual('detalle')
    toast.success(`Sesión ${nuevoNumero} creada exitosamente`)
  }

  // 6. Abrir sesión para conteo
  const handleAbrirSesion = (sesion) => {
    setSesionActiva(sesion)
    setVistaActual('detalle')
  }

  // 7. Actualizar sesión activa (productos agregados, eliminados o datos financieros)
  const handleActualizarSesion = (sesionActualizada) => {
    setSesionActiva(sesionActualizada)
    setSesiones(prev => prev.map(s => s.id === sesionActualizada.id ? sesionActualizada : s))
  }

  // 8. Finalizar sesión de inventario
  const handleFinalizarSesion = (sesionId) => {
    setSesiones(prev => prev.map(s => {
      if (s.id === sesionId) {
        return {
          ...s,
          estado: 'completada'
        }
      }
      return s
    }))

    if (sesionActiva?.id === sesionId) {
      setSesionActiva(prev => prev ? { ...prev, estado: 'completada' } : null)
    }

    // Actualizar estadísticas del cliente
    const sesion = sesiones.find(s => s.id === sesionId) || sesionActiva
    if (sesion?.clienteNegocioId) {
      setClientes(prev => prev.map(c => {
        if (c.id === sesion.clienteNegocioId) {
          return {
            ...c,
            estadisticas: {
              totalInventarios: (c.estadisticas?.totalInventarios || 0) + 1,
              ultimoInventario: new Date().toISOString().split('T')[0]
            }
          }
        }
        return c
      }))
    }

    toast.success('¡Sesión de inventario finalizada y balance registrado con éxito!')
  }

  // 9. Eliminar sesión
  const handleEliminarSesion = (sesionId) => {
    setSesiones(prev => prev.filter(s => s.id !== sesionId))
    if (sesionActiva?.id === sesionId) {
      setSesionActiva(null)
      setVistaActual('sesiones')
    }
    toast.info('Sesión eliminada')
  }

  // 10. Restaurar datos demo
  const handleRestaurarDatos = () => {
    setClientes(CLIENTES_INICIALES)
    setSesiones(SESIONES_INICIALES)
    setSesionActiva(SESIONES_INICIALES[1])
    setVistaActual('sesiones')
    toast.success('Datos de prueba reiniciados al estado original')
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <Toaster richColors position="top-right" />

      {/* ── Barra Superior de la Aplicación Desktop ── */}
      <div className="px-4 py-3 bg-slate-900 text-slate-200 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Mac / Windows Window Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white">
              J4 Inventario Contable Desktop
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30 hidden md:inline">
              Inv-postgreSQL v2.4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modo Auditoría Contable</span>
          </div>

          <button
            onClick={handleRestaurarDatos}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            title="Reiniciar datos de prueba"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar Demo</span>
          </button>
        </div>
      </div>

      {/* ── Navegación por Pestañas Desktop ── */}
      <div className="px-4 sm:px-6 pt-3 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2">
          {/* Pestaña Clientes */}
          <button
            onClick={() => setVistaActual('clientes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all ${
              vistaActual === 'clientes'
                ? 'bg-white dark:bg-slate-900 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Clientes ({clientes.length})
          </button>

          {/* Pestaña Sesiones */}
          <button
            onClick={() => setVistaActual('sesiones')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all ${
              vistaActual === 'sesiones'
                ? 'bg-white dark:bg-slate-900 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Sesiones de Inventario ({sesiones.length})
          </button>

          {/* Pestaña Conteo en Vivo (Sesión Activa) */}
          {sesionActiva && (
            <button
              onClick={() => setVistaActual('detalle')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all ${
                vistaActual === 'detalle'
                  ? 'bg-white dark:bg-slate-900 border-emerald-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Conteo en Vivo ({sesionActiva.numeroSesion})</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </button>
          )}
        </div>
      </div>

      {/* ── Contenido de la Vista Seleccionada ── */}
      <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/60 min-h-[560px]">
        {vistaActual === 'clientes' && (
          <InventarioClientesView
            clientes={clientes}
            onCrearCliente={handleCrearCliente}
            onEditarCliente={handleEditarCliente}
            onEliminarCliente={handleEliminarCliente}
            onIniciarInventarioCliente={handleIniciarInventarioCliente}
          />
        )}

        {vistaActual === 'sesiones' && (
          <InventarioSesionesView
            sesiones={sesiones}
            clientes={clientes}
            onAbrirSesion={handleAbrirSesion}
            onCrearSesion={handleCrearSesion}
            onFinalizarSesion={handleFinalizarSesion}
            onEliminarSesion={handleEliminarSesion}
          />
        )}

        {vistaActual === 'detalle' && sesionActiva && (
          <InventarioDetalleView
            sesion={sesionActiva}
            onActualizarSesion={handleActualizarSesion}
            onFinalizarSesion={handleFinalizarSesion}
            onVolver={() => setVistaActual('sesiones')}
          />
        )}
      </div>
    </div>
  )
}
