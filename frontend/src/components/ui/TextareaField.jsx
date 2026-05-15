/* Textarea con label flotante y auto-resize según el contenido */
import { useState, useRef, useEffect } from 'react'

export default function TextareaField({
  label,
  name,
  placeholder = '',
  register,
  error,
  rows = 4,
  className = '',
}) {
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)

  /* Auto-resize del textarea según el contenido */
  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  return (
    <div className={`relative ${className}`}>
      {/* Label flotante */}
      <label
        htmlFor={name}
        className="absolute left-4 transition-all duration-200 pointer-events-none text-sm"
        style={{
          top: focused ? '10px' : '20px',
          fontSize: focused ? '11px' : '14px',
          color: error ? '#f87171' : focused ? '#00D4FF' : '#94A3B8',
          zIndex: 1,
        }}
      >
        {label}
      </label>

      <textarea
        id={name}
        ref={textareaRef}
        rows={rows}
        placeholder={focused ? placeholder : ''}
        {...(register ? register(name) : {})}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== '')}
        onInput={handleInput}
        className="w-full pt-8 pb-3 px-4 rounded-[10px] text-[14px] outline-none transition-all duration-200 resize-none"
        style={{
          background: '#0a0a0f',
          border: error
            ? '1px solid rgba(248, 113, 113, 0.6)'
            : focused
            ? '1px solid rgba(0, 212, 255, 0.6)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: focused && !error ? '0 0 0 3px rgba(0, 212, 255, 0.1)' : 'none',
          color: '#F1F5F9',
          minHeight: `${rows * 1.6}rem`,
        }}
      />

      {error && (
        <p className="mt-1 text-xs" style={{ color: '#f87171' }}>
          {error.message}
        </p>
      )}
    </div>
  )
}
