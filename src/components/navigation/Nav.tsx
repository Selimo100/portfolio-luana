import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { Monogram } from '../ui/Monogram'
import { LanguageToggle } from './LanguageToggle'
import { MobileMenu } from './MobileMenu'
import { navItems } from './navItems'
import { homePath, sectionPath } from '../../lib/routes'
import { useLanguage } from '../../hooks/useLanguage'

/** Fixed navigation. Adapts its colours when it floats over a dark section. */
export function Nav() {
  const { t } = useTranslation()
  const lang = useLanguage()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [overDark, setOverDark] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
      const probe = 32
      // Only page sections count — the header marks itself as dark too and must not see itself
      const dark = [...document.querySelectorAll<HTMLElement>('main [data-tone="dark"]')].some((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= probe && r.bottom >= probe
      })
      setOverDark(dark)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location.pathname])

  // Close the menu on navigation
  useEffect(() => setOpen(false), [location.key])

  const dark = overDark || open
  const surface = open
    ? 'bg-transparent'
    : scrolled
      ? dark
        ? 'bg-accent-deep/90 backdrop-blur-md'
        : 'bg-canvas/85 backdrop-blur-md'
      : 'bg-transparent'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${surface} ${dark ? 'text-canvas' : 'text-ink'}`}
        data-tone={dark ? 'dark' : undefined}
      >
        <div className="shell flex h-[var(--nav-height)] items-center justify-between gap-6">
          <Link to={homePath(lang)} aria-label={t('a11y.homeLink')} className="flex items-center gap-3">
            <Monogram className="size-9" />
            <span className="font-display text-[1.05rem] font-semibold tracking-tight">Luana Costa</span>
          </Link>

          <nav aria-label={t('a11y.primaryNav')} className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link to={sectionPath(lang, item.section)} className="link-underline py-2 font-medium">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
              <li className="border-l border-current/20 pl-6">
                <LanguageToggle />
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <button
              type="button"
              data-menu-toggle
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
              onClick={() => setOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-full border border-current/25"
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu id="mobile-menu" open={open} onClose={close} />
    </>
  )
}
