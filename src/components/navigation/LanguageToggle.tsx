import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { site } from '../../config/site'
import { equivalentPath } from '../../lib/routes'
import { useLanguage } from '../../hooks/useLanguage'
import { storeLanguage } from '../../i18n/config'

/** DE / EN switch that keeps the visitor on the equivalent page. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const current = useLanguage()
  const location = useLocation()

  return (
    <div role="group" aria-label={t('a11y.languageSwitch')} className={`meta flex items-center gap-1 ${className}`}>
      {site.languages.map((lang, i) => {
        const active = lang === current
        return (
          <span key={lang} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className="opacity-40">/</span>}
            <Link
              to={equivalentPath(location.pathname, location.hash, lang)}
              state={{ preserveScroll: true }}
              replace
              lang={lang}
              hrefLang={lang}
              aria-label={t(`languages.${lang}`)}
              aria-current={active ? 'true' : undefined}
              onClick={() => storeLanguage(lang)}
              className={`grid min-h-11 min-w-9 place-items-center rounded-full px-1.5 transition-opacity ${
                active ? 'font-bold opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              {lang.toUpperCase()}
            </Link>
          </span>
        )
      })}
    </div>
  )
}
