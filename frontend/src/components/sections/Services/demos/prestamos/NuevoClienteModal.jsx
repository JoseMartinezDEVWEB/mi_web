/* Modal interactivo para crear o registrar un nuevo cliente en el sistema de préstamos */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, MapPin, Briefcase, FileText, CheckCircle2, UserPlus } from 'lucide-react'

export default function NuevoClienteModal({ isOpen, onClose, onGuardarCliente }) {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    cedula: '',
    telefono: '',
    direccion: '',
    ocupacion: '',
  })
  const [errors, setErrors] = useState({})
  const [exito, setExito] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validar = () => {
    const errs = {}
    if (!formData.nombreCompleto.trim()) errs.nombreCompleto = 'El nombre completo es obligatorio'
    if (!formData.cedula.trim()) errs.cedula = 'La cédula o documento es obligatorio'
    if (!formData.telefono.trim()) errs.telefono = 'El teléfono es obligatorio'
    if (!formData.direccion.trim()) errs.direccion = 'La dirección es obligatoria'
    if (!formData.ocupacion.trim()) errs.ocupacion = 'La ocupación es obligatoria'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validar()) return

    const nuevo = {
      id: Date.now(),
      nombreCompleto: formData.nombreCompleto.trim(),
      cedula: formData.cedula.trim(),
      telefono: formData.telefono.trim(),
      direccion: formData.direccion.trim(),
      ocupacion: formData.ocupacion.trim(),
      prestamosActivos: 0,
      estado: 'Activo',
    }

    setExito(true)
    setTimeout(() => {
      onGuardarCliente(nuevo)
      setExito(false)
      setFormData({
        nombreCompleto: '',
        cedula: '',
        telefono: '',
        direccion: '',
        ocupacion: '',
      })
      onClose()
    }, 700)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 text-white font-sans my-4"
        >
          {/* Header */}
          <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Registrar Nuevo Cliente</h3>
                <p className="text-xs text-slate-400">Ingresa los datos personales del solicitante</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {exito && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-sm"
              >
                <CheckCircle2 size={18} />
                <span>¡Cliente registrado exitosamente en el sistema!</span>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre Completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  placeholder="Ej: Ramón Valdez Martínez"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-800/80 border ${
                    errors.nombreCompleto ? 'border-red-500' : 'border-slate-700'
                  } rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors`}
                />
              </div>
              {errors.nombreCompleto && (
                <p className="text-red-400 text-[11px] mt-1">{errors.nombreCompleto}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cédula / Documento *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <FileText size={16} />
                  </div>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    placeholder="001-0000000-0"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-800/80 border ${
                      errors.cedula ? 'border-red-500' : 'border-slate-700'
                    } rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors`}
                  />
                </div>
                {errors.cedula && (
                  <p className="text-red-400 text-[11px] mt-1">{errors.cedula}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Teléfono / Celular *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="809-000-0000"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-800/80 border ${
                      errors.telefono ? 'border-red-500' : 'border-slate-700'
                    } rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors`}
                  />
                </div>
                {errors.telefono && (
                  <p className="text-red-400 text-[11px] mt-1">{errors.telefono}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Dirección Residencial *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <MapPin size={16} />
                </div>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle, Número, Sector, Ciudad"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-800/80 border ${
                    errors.direccion ? 'border-red-500' : 'border-slate-700'
                  } rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors`}
                />
              </div>
              {errors.direccion && (
                <p className="text-red-400 text-[11px] mt-1">{errors.direccion}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ocupación / Actividad Comercial *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Briefcase size={16} />
                </div>
                <input
                  type="text"
                  name="ocupacion"
                  value={formData.ocupacion}
                  onChange={handleChange}
                  placeholder="Ej: Empleado privado, Ingeniero, Negocio propio"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-800/80 border ${
                    errors.ocupacion ? 'border-red-500' : 'border-slate-700'
                  } rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors`}
                />
              </div>
              {errors.ocupacion && (
                <p className="text-red-400 text-[11px] mt-1">{errors.ocupacion}</p>
              )}
            </div>

            {/* Acciones */}
            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20"
              >
                Guardar Cliente
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
