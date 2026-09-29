/* Campo de entrada de texto con label flotante y estados de error */
import { useState } from 'react'

export default function InputField({
  label,
  name,
  type = 'text',
  placeholder = '',
  register,
  error,
  className = '',
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {/* Label flotante que sube al hacer focus */}
      <label
        htmlFor={name}
        className="absolute left-4 transition-all duration-200 pointer-events-none text-sm"
        style={{
          top: focused ? '6px' : '50%',
          transform: focused ? 'translateY(0)' : 'translateY(-50%)',
          fontSize: focused ? '11px' : '14px',
          color: error ? '#f87171' : focused ? '#00D4FF' : '#94A3B8',
          zIndex: 1,
        }}
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={focused ? placeholder : ''}
        {...(register ? register(name) : {})}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== '')}
        className="w-full pt-6 pb-2 px-4 rounded-[10px] text-[14px] outline-none transition-all duration-200"
        style={{
          background: '#0a0a0f',
          border: error
            ? '1px solid rgba(248, 113, 113, 0.6)'
            : focused
            ? '1px solid rgba(0, 212, 255, 0.6)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: focused && !error ? '0 0 0 3px rgba(0, 212, 255, 0.1)' : 'none',
          color: '#F1F5F9',
        }}
      />

      {/* Mensaje de error */}
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#f87171' }}>
          {error.message}
        </p>
      )}
    </div>
  )
}
