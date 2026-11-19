import type { Language } from '../config/site'

/** '2022-08' → 'Aug. 2022' (de-CH) / 'Aug 2022' (en-GB). */
export function formatMonth(yearMonth: string, lang: Language) {
  const [year, month] = yearMonth.split('-').map(Number)
  return new Intl.DateTimeFormat(lang === 'de' ? 'de-CH' : 'en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  )
}
