import { lazy, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Download, Mail } from 'lucide-react'
import { Magnetic } from '../../components/ui/Magnetic'
import { SceneView } from '../../components/three/SceneView'
import { SiteFooter } from '../../components/layout/SiteFooter'
import { CameraFallback } from '../Hero/CameraFallback'
import { sectionIds } from '../../lib/routes'
import { profile } from '../../data/profile'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const ContactScene = lazy(() => import('../../scenes/ContactScene'))

export function Contact() {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced) return
      // The page darkens into the finale: a cream layer fades out over the dark
      // background (opacity is composited — animating background-color repainted the whole section)
      gsap.fromTo(
        '[data-contact-fade]',
        { opacity: 1 },
        { opacity: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top 45%', scrub: true } },
      )
      gsap.from('[data-contact-line]', {
        yPercent: 105,
        duration: 1.3,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 55%', once: true },
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  const words = t('contact.title').split(' ')
  // Two editorial lines, balanced by word count
  const split = Math.ceil(words.length / 2)
  const lines = [words.slice(0, split).join(' '), words.slice(split).join(' ')]

  const primary = profile.email
    ? { href: `mailto:${profile.email}`, label: t('contact.email'), icon: <Mail className="size-5" aria-hidden="true" />, external: false }
    : { href: profile.linkedin, label: t('contact.linkedinPrimary'), icon: <ArrowUpRight className="size-5" aria-hidden="true" />, external: true }

  return (
    <section
      ref={root}
      id={sectionIds.contact}
      aria-labelledby="contact-title"
      data-tone="dark"
      className="grain grain-light relative isolate overflow-hidden bg-accent-deep text-canvas"
    >
      <div data-contact-fade aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-canvas opacity-0 will-change-[opacity]" />
      <div className="shell relative grid grid-cols-12 gap-x-6 pb-16 pt-32 md:pt-48">
        <SceneView
          className="relative col-span-12 -mb-8 h-[min(80vw,26rem)] md:absolute md:right-[2vw] md:top-[6rem] md:mb-0 md:h-[min(46vw,40rem)] md:w-[44vw]"
          fallback={<CameraFallback />}
        >
          <ContactScene reducedMotion={reduced} />
        </SceneView>

        <h2 id="contact-title" className="heading-xl relative col-span-12 mb-10 text-[clamp(3.2rem,10.5vw,10rem)] outline-none md:col-span-9">
          {lines.map((line, i) => (
            <span key={i} className="line-mask">
              <span data-contact-line>{line}</span>
            </span>
          ))}
        </h2>

        <p className="lede relative col-span-12 mb-12 text-mist md:col-span-5">{t('contact.text')}</p>

        <div className="relative col-span-12 flex flex-wrap items-center gap-x-8 gap-y-6">
          <Magnetic>
            <a
              href={primary.href}
              {...(primary.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="pill min-h-16 bg-canvas px-8 text-lg text-ink hover:bg-accent hover:text-white"
            >
              <span>{primary.label}</span>
              {primary.icon}
              {primary.external && <span className="sr-only">{t('a11y.newTab')}</span>}
            </a>
          </Magnetic>
          {profile.email && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex min-h-11 items-center gap-2 font-semibold">
              {t('contact.linkedin')}
              <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="sr-only">{t('a11y.newTab')}</span>
            </a>
          )}
          {profile.cvUrl && (
            <a href={profile.cvUrl} download className="link-underline inline-flex min-h-11 items-center gap-2 font-semibold">
              {t('contact.cv')}
              <Download className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      <SiteFooter />
    </section>
  )
}
