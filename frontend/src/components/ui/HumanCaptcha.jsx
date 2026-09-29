/* Componente interactivo de verificación humana tipo Cloudflare / reCAPTCHA ligero */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Check, Loader2 } from 'lucide-react'

export default function HumanCaptcha({ onVerify, verified, error }) {
  const [loading, setLoading] = useState(false)

  const handleCheck = () => {
    if (verified || loading) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (onVerify) onVerify(true)
    }, 700)
  }

  return (
    <div
      onClick={handleCheck}
      className={`select-none cursor-pointer flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${
        verified
          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
          : error
          ? 'bg-red-950/20 border-red-500/40 text-red-300'
          : 'bg-white/[0.03] border-white/10 hover:border-cyan-500/40 text-slate-300'
      }`}
      style={{ minWidth: '220px' }}
      role="checkbox"
      aria-checked={verified}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          handleCheck()
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
            verified
              ? 'bg-emerald-500 border-emerald-400 text-black'
              : 'border-white/30 bg-black/40'
          }`}
        >
          {loading ? (
            <Loader2 size={12} className="animate-spin text-cyan-400" />
          ) : verified ? (
            <Check size={13} strokeWidth={3} />
          ) : null}
        </div>
        <span className="text-xs font-medium">
          {verified ? 'Verificación completada' : 'Soy humano (Protección Anti-Bot)'}
        </span>
      </div>

      <div className="flex items-center gap-1 text-cyan-400/80 text-[10px] uppercase font-mono pl-2 border-l border-white/10">
        <ShieldCheck size={14} />
        <span className="hidden sm:inline">J4-Shield</span>
      </div>
    </div>
  )
}
