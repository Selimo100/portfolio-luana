import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { isLanguage, site, type Language } from '../config/site'

/**
 * Current language. The URL is the source of truth (/de/…, /en/…);
 * i18next follows it one layout effect later, so never derive routes from i18n.
 */
export function useLanguage(): Language {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()
  const segment = pathname.split('/')[1]
  if (isLanguage(segment)) return segment
  return isLanguage(i18n.language) ? i18n.language : site.defaultLanguage
}
