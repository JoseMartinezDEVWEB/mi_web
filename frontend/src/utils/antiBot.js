/* Utilidades anti-bot y protección contra spam para formularios */

/**
 * Genera un token de verificación temporal con timestamp para validar
 * que la interacción proviene de un usuario humano y no de un script instantáneo.
 */
export function generateSecurityToken() {
  const timestamp = Date.now()
  const salt = Math.random().toString(36).substring(2, 8)
  return btoa(`${timestamp}:${salt}`)
}

/**
 * Verifica si el tiempo transcurrido desde la carga/enfoque es razonable para un humano (> 1.2s)
 */
export function isHumanTiming(token, minSeconds = 1.2) {
  try {
    if (!token) return false
    const decoded = atob(token)
    const [timestampStr] = decoded.split(':')
    const timestamp = parseInt(timestampStr, 10)
    if (isNaN(timestamp)) return false
    const elapsedSeconds = (Date.now() - timestamp) / 1000
    return elapsedSeconds >= minSeconds
  } catch {
    return false
  }
}
