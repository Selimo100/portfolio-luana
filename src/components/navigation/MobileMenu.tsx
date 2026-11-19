import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { navItems } from './navItems'
import { sectionPath } from '../../lib/routes'
import { useLanguage } from '../../hooks/useLanguage'
import { getLenis } from '../../lib/scroll'
import { profile } from '../../data/profile'

interface Props {
  open: boolean
  onClose: () => void
  id: string
}

/** Full-screen menu for small screens with focus management and Escape to close. */
export function MobileMenu({ open, onClose, id }: Props) {
  const { t } = useTranslation()
  const lang = useLanguage()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const lenis = getLenis()
    lenis?.stop()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('a')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panel.current) return
      // Keep focus inside the menu and its toggle button
      const focusables = [
        ...document.querySelectorAll<HTMLElement>('[data-menu-toggle]'),
        ...panel.current.querySelectorAll<HTMLElement>('a, button'),
      ]
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      lenis?.start()
    }
  }, [open, onClose])

  return (
    <div
      ref={panel}
      id={id}
      hidden={!open}
      className="fixed inset-0 z-[45] bg-accent-deep pt-[var(--nav-height)] text-canvas md:hidden"
      data-tone="dark"
    >
      <nav aria-label={t('a11y.primaryNav')} className="shell flex h-full flex-col justify-between pb-10 pt-10">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                to={sectionPath(lang, item.section)}
                onClick={onClose}
                className="heading-xl block py-1 text-[clamp(3rem,16vw,5rem)]"
              >
                {t(`nav.${item.key}`)}
              </Link>
            </li>
          ))}
        </ul>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="meta link-underline self-start text-mist">
          LinkedIn <span className="sr-only">{t('a11y.newTab')}</span>
        </a>
      </nav>
    </div>
  )
}
