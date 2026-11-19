import { useRef } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowUp } from 'lucide-react'
import { Monogram } from '../ui/Monogram'
import { navItems } from '../navigation/navItems'
import { sectionIds, sectionPath } from '../../lib/routes'
import { scrollToTarget } from '../../lib/scroll'
import { cameraState } from '../../lib/sceneState'
import { useLanguage } from '../../hooks/useLanguage'
import { profile } from '../../data/profile'

/** The colophon — the last page of the magazine. Lives on dark sections. */
export function SiteFooter() {
  const { t } = useTranslation()
  const lang = useLanguage()
  const timer = useRef(0)

  // Secret interaction: "Action!" — the film camera in the finale starts rolling
  const action = () => {
    // Bring the film camera into view first, then roll
    const contact = document.getElementById(sectionIds.contact)
    if (contact) scrollToTarget(contact)
    cameraState.action = 1
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => (cameraState.action = 0), 4500)
  }

  return (
    <footer className="shell relative pb-8 pt-14">
      <div className="rule mb-10" />
      <div className="grid grid-cols-2 gap-y-10 md:grid-cols-12 md:gap-x-6">
        <div className="col-span-2 md:col-span-4">
          <button
            type="button"
            onClick={action}
            aria-label={t('contact.egg')}
            title={t('contact.egg')}
            className="group -m-2 inline-flex items-center gap-3 rounded-full p-2"
          >
            <Monogram className="size-12 transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:rotate-[-18deg] group-active:scale-90" />
          </button>
          <p className="meta mt-4 max-w-[24ch] text-mist">{t('contact.location')}</p>
        </div>

        <nav aria-label={t('a11y.footerNav')} className="md:col-span-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link to={sectionPath(lang, item.section)} className="link-underline">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="space-y-2 md:col-span-3">
          <li>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline">
              {t('contact.linkedin')} <span className="sr-only">{t('a11y.newTab')}</span>
            </a>
          </li>
          {profile.cvUrl && (
            <li>
              <a href={profile.cvUrl} download className="link-underline">
                {t('contact.cv')}
              </a>
            </li>
          )}
        </ul>

        <div className="col-span-2 flex items-start md:col-span-2 md:justify-end">
          <button
            type="button"
            onClick={() => {
              scrollToTarget(0)
              document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true })
            }}
            className="group inline-flex min-h-11 items-center gap-2 font-medium"
          >
            {t('contact.top')}
            <ArrowUp className="size-4 transition-transform duration-500 group-hover:-translate-y-1" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="display mt-20 select-none whitespace-nowrap text-[24.5vw] leading-[0.78] text-canvas/[0.07] md:mt-24"
      >
        Luana Costa
      </p>
      <p className="meta mt-6 text-mist">{t('contact.rights', { year: new Date().getFullYear() })}</p>
    </footer>
  )
}
