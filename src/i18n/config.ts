import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from './locales/de.json'
import en from './locales/en.json'
import { isLanguage, site, type Language } from '../config/site'

/** Language from the URL first, then the stored preference, then German. */
export function detectInitialLanguage(): Language {
  const segment = window.location.pathname.split('/')[1]
  if (isLanguage(segment)) return segment
  return readStoredLanguage() ?? site.defaultLanguage
}

export function readStoredLanguage(): Language | null {
  try {
    const stored = localStorage.getItem(site.storageKey)
    return isLanguage(stored) ? stored : null
  } catch {
    return null
  }
}

export function storeLanguage(lang: Language) {
  try {
    localStorage.setItem(site.storageKey, lang)
  } catch {
    /* storage unavailable (private mode) – the URL still carries the language */
  }
}

void i18n.use(initReactI18next).init({
  resources: { de: { translation: de }, en: { translation: en } },
  lng: detectInitialLanguage(),
  fallbackLng: site.defaultLanguage,
  supportedLngs: [...site.languages],
  interpolation: { escapeValue: false },
})

export default i18n
