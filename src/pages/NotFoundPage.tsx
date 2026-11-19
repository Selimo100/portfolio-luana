import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import { useLanguage } from '../hooks/useLanguage'
import { homePath } from '../lib/routes'

const alternates = { de: homePath('de'), en: homePath('en') }

export function NotFoundPage() {
  const { t } = useTranslation()
  const lang = useLanguage()
  useSeo({ title: t('meta.notFoundTitle'), description: t('notFound.text'), lang, alternates, noindex: true })

  return (
    <section className="shell grid min-h-[100svh] content-center gap-8 py-32">
      <p aria-hidden="true" className="display text-[clamp(7rem,30vw,22rem)] text-accent">404</p>
      <h1 className="heading-l max-w-[18ch]">{t('notFound.title')}</h1>
      <p className="max-w-[44ch] text-muted-strong">{t('notFound.text')}</p>
      <div>
        <Link to={homePath(lang)} className="pill bg-ink text-canvas hover:bg-accent hover:text-white">
          {t('notFound.cta')}
        </Link>
      </div>
    </section>
  )
}
