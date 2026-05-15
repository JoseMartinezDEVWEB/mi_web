/* Demo interactivo del sistema de facturación con wizard de 3 pasos */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Printer, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'

/* Tasa de ITBIS aplicada en República Dominicana */
const TASA_ITBIS = 0.18

/* Tipos de NCF disponibles según la DGII */
const TIPOS_NCF = [
  { value: 'B01', label: 'B01 – Crédito Fiscal'      },
  { value: 'B02', label: 'B02 – Consumidor Final'     },
  { value: 'B14', label: 'B14 – Gubernamental'        },
]

/* Genera un número de NCF simulado basado en el tipo seleccionado */
const generarNCF = (tipo) => {
  const seq = String(Math.floor(Math.random() * 90000000) + 10000000)
  return `${tipo}${seq}`
}

/* Formatea un número como moneda DOP */
const formatearDOP = (valor) =>
  new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 2 }).format(valor)

/* Métricas fijas del mes para el encabezado del demo */
const METRICAS_MES = [
  { label: 'Facturas emitidas',   valor: '47',                  color: '#00D4FF' },
  { label: 'Ventas del mes',      valor: 'DOP 1,240,500',       color: '#10b981' },
  { label: 'ITBIS recaudado',     valor: 'DOP 223,290',         color: '#D4AF37' },
]

/* Componente principal del wizard de facturación */
export default function InvoiceDemo() {
  /* Paso actual del wizard (0 = cliente, 1 = conceptos, 2 = preview) */
  const [paso, setPaso] = useState(0)

  /* Datos del cliente del paso 1 */
  const [cliente, setCliente] = useState({ nombre: '', documento: '', tipoNCF: 'B02' })

  /* Líneas de concepto del paso 2 */
  const [lineas, setLineas] = useState([
    { id: 1, descripcion: 'Servicio de desarrollo web', cantidad: 1, precioUnitario: 85000 },
  ])

  /* Campo temporal para nueva línea de concepto */
  const [nuevaLinea, setNuevaLinea] = useState({ descripcion: '', cantidad: 1, precioUnitario: 0 })

  /* Cálculos del resumen financiero actualizados en tiempo real */
  const resumen = useMemo(() => {
    const subtotal = lineas.reduce((acc, l) => acc + l.cantidad * l.precioUnitario, 0)
    const itbis    = subtotal * TASA_ITBIS
    const total    = subtotal + itbis
    return { subtotal, itbis, total }
  }, [lineas])

  /* NCF generado al llegar al paso de preview */
  const [ncfGenerado] = useState(() => generarNCF('B02'))
  const ncfFinal = generarNCF(cliente.tipoNCF || 'B02')

  /* Agrega una línea de concepto a la factura */
  const agregarLinea = () => {
    if (!nuevaLinea.descripcion || nuevaLinea.precioUnitario <= 0) return
    setLineas(prev => [...prev, { ...nuevaLinea, id: Date.now() }])
    setNuevaLinea({ descripcion: '', cantidad: 1, precioUnitario: 0 })
  }

  /* Elimina una línea de concepto por id */
  const eliminarLinea = (id) => setLineas(prev => prev.filter(l => l.id !== id))

  /* Actualiza el precio o cantidad de una línea existente */
  const actualizarLinea = (id, campo, valor) => {
    setLineas(prev => prev.map(l => l.id === id ? { ...l, [campo]: Number(valor) } : l))
  }

  /* Título de cada paso del wizard */
  const pasos = ['Datos del cliente', 'Conceptos', 'Vista previa']

  return (
    <div className="space-y-4">

      {/* ── Métricas del mes ── */}
      <div className="grid grid-cols-3 gap-3">
        {METRICAS_MES.map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[11px] mb-1" style={{ color: '#94A3B8' }}>{m.label}</p>
            <p className="text-sm font-bold" style={{ color: m.color }}>{m.valor}</p>
          </div>
        ))}
      </div>

      {/* ── Barra de progreso de pasos ── */}
      <div className="flex items-center gap-2">
        {pasos.map((nombre, idx) => (
          <div key={idx} className="flex items-center gap-2 flex-1">
            {/* Indicador circular del paso */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: idx <= paso ? '#00D4FF' : 'rgba(255,255,255,0.08)',
                color:      idx <= paso ? '#0a0a0f' : '#94A3B8',
              }}
            >
              {idx < paso ? <CheckCircle size={14} /> : idx + 1}
            </div>
            {/* Etiqueta del paso */}
            <span className="text-xs hidden sm:block" style={{ color: idx <= paso ? '#F1F5F9' : '#94A3B8' }}>
              {nombre}
            </span>
            {/* Conector entre pasos */}
            {idx < pasos.length - 1 && (
              <div className="flex-1 h-px" style={{ background: idx < paso ? '#00D4FF' : 'rgba(255,255,255,0.1)' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Contenido del paso actual ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={paso}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl p-4 space-y-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* ─ Paso 1: Datos del cliente ─ */}
          {paso === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Información del cliente</p>

              {/* Nombre completo */}
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Nombre / Razón social</label>
                <input
                  value={cliente.nombre}
                  onChange={e => setCliente(c => ({ ...c, nombre: e.target.value }))}
                  placeholder="Ej: Juan Pérez / Tech Corp SRL"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
                />
              </div>

              {/* Documento de identidad */}
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>RNC / Cédula</label>
                <input
                  value={cliente.documento}
                  onChange={e => setCliente(c => ({ ...c, documento: e.target.value }))}
                  placeholder="000-0000000-0"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
                />
              </div>

              {/* Tipo de NCF según DGII */}
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Tipo de NCF</label>
                <select
                  value={cliente.tipoNCF}
                  onChange={e => setCliente(c => ({ ...c, tipoNCF: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
                >
                  {TIPOS_NCF.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ─ Paso 2: Líneas de concepto ─ */}
          {paso === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Conceptos facturados</p>

              {/* Lista de líneas existentes */}
              {lineas.map(linea => (
                <div key={linea.id} className="flex gap-2 items-center">
                  {/* Descripción de la línea */}
                  <input
                    value={linea.descripcion}
                    onChange={e => setLineas(prev => prev.map(l => l.id === linea.id ? { ...l, descripcion: e.target.value } : l))}
                    className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9' }}
                  />
                  {/* Cantidad */}
                  <input
                    type="number"
                    value={linea.cantidad}
                    onChange={e => actualizarLinea(linea.id, 'cantidad', e.target.value)}
                    className="w-14 px-2 py-1.5 rounded-lg text-xs text-center outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9' }}
                  />
                  {/* Precio unitario */}
                  <input
                    type="number"
                    value={linea.precioUnitario}
                    onChange={e => actualizarLinea(linea.id, 'precioUnitario', e.target.value)}
                    className="w-24 px-2 py-1.5 rounded-lg text-xs text-right outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9' }}
                  />
                  {/* Subtotal de la línea */}
                  <span className="text-xs w-20 text-right shrink-0" style={{ color: '#10b981' }}>
                    {formatearDOP(linea.cantidad * linea.precioUnitario)}
                  </span>
                  {/* Eliminar línea */}
                  <motion.button onClick={() => eliminarLinea(linea.id)} whileTap={{ scale: 0.9 }}>
                    <Trash2 size={13} style={{ color: '#ef4444' }} />
                  </motion.button>
                </div>
              ))}

              {/* Formulario para agregar nueva línea */}
              <div className="flex gap-2 items-center pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <input
                  value={nuevaLinea.descripcion}
                  onChange={e => setNuevaLinea(n => ({ ...n, descripcion: e.target.value }))}
                  placeholder="Nueva descripción"
                  className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: '#F1F5F9' }}
                />
                <input
                  type="number"
                  value={nuevaLinea.cantidad}
                  onChange={e => setNuevaLinea(n => ({ ...n, cantidad: Number(e.target.value) }))}
                  className="w-14 px-2 py-1.5 rounded-lg text-xs text-center outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: '#F1F5F9' }}
                />
                <input
                  type="number"
                  value={nuevaLinea.precioUnitario}
                  onChange={e => setNuevaLinea(n => ({ ...n, precioUnitario: Number(e.target.value) }))}
                  placeholder="Precio"
                  className="w-24 px-2 py-1.5 rounded-lg text-xs text-right outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: '#F1F5F9' }}
                />
                <motion.button
                  onClick={agregarLinea}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }}
                >
                  <Plus size={12} /> Agregar
                </motion.button>
              </div>

              {/* Resumen de totales en tiempo real */}
              <div className="space-y-1 pt-2 text-right" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs" style={{ color: '#94A3B8' }}>Subtotal: <span style={{ color: '#F1F5F9' }}>{formatearDOP(resumen.subtotal)}</span></p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>ITBIS 18%: <span style={{ color: '#fbbf24' }}>{formatearDOP(resumen.itbis)}</span></p>
                <p className="text-sm font-bold" style={{ color: '#10b981' }}>Total: {formatearDOP(resumen.total)}</p>
              </div>
            </div>
          )}

          {/* ─ Paso 3: Preview de la factura ─ */}
          {paso === 2 && (
            <div className="space-y-4">
              {/* Encabezado de la factura con logo */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-base" style={{ color: '#00D4FF' }}>J4Technology</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>RNC: 1-31-12345-6</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>Santo Domingo, RD</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold" style={{ color: '#D4AF37' }}>NCF</p>
                  <p className="text-sm font-mono font-bold" style={{ color: '#F1F5F9' }}>{ncfFinal}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{new Date().toLocaleDateString('es-DO')}</p>
                </div>
              </div>

              {/* Datos del receptor */}
              <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#94A3B8' }}>Facturado a:</p>
                <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{cliente.nombre || 'Cliente Demo'}</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>Doc: {cliente.documento || '000-0000000-0'}</p>
              </div>

              {/* Tabla de conceptos de la factura */}
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th className="text-left py-2" style={{ color: '#94A3B8' }}>Descripción</th>
                    <th className="text-center py-2" style={{ color: '#94A3B8' }}>Cant.</th>
                    <th className="text-right py-2" style={{ color: '#94A3B8' }}>P/U</th>
                    <th className="text-right py-2" style={{ color: '#94A3B8' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineas.map(linea => (
                    <tr key={linea.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="py-1.5" style={{ color: '#F1F5F9' }}>{linea.descripcion}</td>
                      <td className="py-1.5 text-center" style={{ color: '#94A3B8' }}>{linea.cantidad}</td>
                      <td className="py-1.5 text-right font-mono" style={{ color: '#94A3B8' }}>{formatearDOP(linea.precioUnitario)}</td>
                      <td className="py-1.5 text-right font-mono" style={{ color: '#F1F5F9' }}>{formatearDOP(linea.cantidad * linea.precioUnitario)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Resumen financiero final */}
              <div className="space-y-1 text-right">
                <p className="text-xs" style={{ color: '#94A3B8' }}>Subtotal: <span style={{ color: '#F1F5F9' }}>{formatearDOP(resumen.subtotal)}</span></p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>ITBIS 18%: <span style={{ color: '#fbbf24' }}>{formatearDOP(resumen.itbis)}</span></p>
                <p className="text-base font-bold" style={{ color: '#10b981' }}>Total: {formatearDOP(resumen.total)}</p>
              </div>

              {/* Botón de impresión — llama a window.print() del navegador */}
              <motion.button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF' }}
                whileTap={{ scale: 0.97 }}
              >
                <Printer size={15} />
                Imprimir factura
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Botones de navegación entre pasos ── */}
      <div className="flex justify-between">
        <motion.button
          onClick={() => setPaso(p => Math.max(0, p - 1))}
          disabled={paso === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}
          whileTap={{ scale: 0.97 }}
        >
          <ChevronLeft size={15} /> Anterior
        </motion.button>

        {paso < 2 && (
          <motion.button
            onClick={() => setPaso(p => Math.min(2, p + 1))}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: '#00D4FF', color: '#0a0a0f' }}
            whileTap={{ scale: 0.97 }}
          >
            Siguiente <ChevronRight size={15} />
          </motion.button>
        )}
      </div>
    </div>
  )
}
