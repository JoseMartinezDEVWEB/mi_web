/* Select/Dropdown con icono chevron animado y estilo consistente */
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function SelectField({
  label,
  name,
  options = [],
  register,
  error,
  className = '',
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor={name}
        className="block mb-1 text-xs font-medium"
        style={{ color: '#94A3B8' }}
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={name}
          {...(register ? register(name) : {})}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className="w-full px-4 py-3 pr-10 rounded-[10px] text-[14px] outline-none transition-all duration-200 appearance-none"
          style={{
            background: '#0a0a0f',
            border: error
              ? '1px solid rgba(248, 113, 113, 0.6)'
              : open
              ? '1px solid rgba(0, 212, 255, 0.6)'
              : '1px solid rgba(255, 255, 255, 0.2)',
            color: '#F1F5F9',
          }}
        >
          <option value="" style={{ background: '#111827' }}>Seleccionar...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: '#111827' }}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Ícono chevron con rotación animada al abrir */}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200"
          style={{
            transform: `translateY(-50%) rotate(${open ? '180deg' : '0deg'})`,
            color: '#94A3B8',
          }}
        >
          <ChevronDown size={16} />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-xs" style={{ color: '#f87171' }}>
          {error.message}
        </p>
      )}
    </div>
  )
}
