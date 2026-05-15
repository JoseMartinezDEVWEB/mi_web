/* Hook para acceder al idioma activo y utilitarios de localización */
import { useTranslation } from 'react-i18next'

export default function useLanguage() {
  const { i18n } = useTranslation()
  const language = i18n.language ?? 'es'

  /* Formatear número según el locale activo */
  const formatNumber = (num, options = {}) =>
    new Intl.NumberFormat(language, options).format(num)

  /* Formatear fecha según el locale activo */
  const formatDate = (date, options = {}) =>
    new Intl.DateTimeFormat(language, { dateStyle: 'medium', ...options }).format(
      typeof date === 'string' ? new Date(date) : date
    )

  /* Formatear precio con símbolo de moneda */
  const formatPrice = (amount, currency = 'DOP') =>
    new Intl.NumberFormat(language, { style: 'currency', currency }).format(amount)

  return { language, formatNumber, formatDate, formatPrice }
}
