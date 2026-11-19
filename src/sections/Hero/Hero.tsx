import { lazy, useRef } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SceneView } from '../../components/three/SceneView'
import { CameraFallback } from './CameraFallback'
import { heroState } from '../../lib/sceneState'
import { sectionPath, sectionIds } from '../../lib/routes'
import { useLanguage } from '../../hooks/useLanguage'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { profile } from '../../data/profile'

gsap.registerPlugin(ScrollTrigger)

const HeroScene = lazy(() => import('../../scenes/HeroScene'))

export function Hero() {
  const { t } = useTranslation()
  const lang = useLanguage()
  const reduced = useReducedMotion()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced) {
        heroState.intro = 1
        heroState.progress = 0
        return
      }

      // Staged introduction — content is in the DOM from the first frame
      heroState.intro = 0
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-hero-bg]', { opacity: 0, duration: 1.2, ease: 'power1.out' }, 0)
        .from('[data-hero-line]', { yPercent: 105, duration: 1.4, stagger: 0.14 }, 0.15)
        .to(heroState, { intro: 1, duration: 2.4 }, 0.35)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 16, duration: 1, stagger: 0.08, ease: 'power3.out' }, 0.95)

      // Hero → work: the name parts drift apart while the camera dollies
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
            onUpdate: (self) => {
              heroState.progress = self.progress
            },
          },
        })
        .to('[data-hero-name="first"]', { xPercent: -10, ease: 'none' }, 0)
        .to('[data-hero-name="last"]', { xPercent: 8, ease: 'none' }, 0)
        .to('[data-hero-out]', { autoAlpha: 0, y: -60, ease: 'none' }, 0)

      return () => {
        heroState.progress = 0
      }
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative min-h-[100svh] overflow-hidden">
      {/* Soft colour fields behind the camera */}
      <div
        data-hero-bg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
        style={{
          background:
            'radial-gradient(42% 46% at 64% 46%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 70%), radial-gradient(30% 34% at 78% 70%, color-mix(in srgb, var(--color-accent-deep) 10%, transparent), transparent 70%), radial-gradient(24% 26% at 50% 30%, color-mix(in srgb, var(--color-white) 70%, transparent), transparent 70%)',
        }}
      />

      <SceneView className="absolute inset-0" fallback={<CameraFallback />}>
        <HeroScene reducedMotion={reduced} />
      </SceneView>

      <div className="shell relative z-30 flex min-h-[100svh] flex-col justify-between pb-8 pt-[calc(var(--nav-height)+3vh)]">
        <h1 id="hero-title" className="display uppercase text-[clamp(4.4rem,23vw,8rem)] md:text-[clamp(7rem,15.2vw,12.75rem)]">
          <span data-hero-name="first" className="line-mask">
            <span data-hero-line>{profile.firstName}</span>
          </span>
          <span data-hero-name="last" className="line-mask text-right md:pr-[6vw] md:text-left md:pl-[27vw]">
            <span data-hero-line>{profile.lastName}.</span>
          </span>
        </h1>

        <div data-hero-out className="mt-[38vh] grid grid-cols-12 items-end gap-x-6 gap-y-8 md:mt-10">
          <p data-hero-fade className="col-span-12 md:col-span-4">
            <span className="block font-display text-xl font-semibold tracking-tight">{t('hero.role')}</span>
            <span className="meta text-muted-strong">{t('hero.location')}</span>
          </p>

          <div className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <p data-hero-fade className="lede mb-6 font-medium">
              {t('hero.tagline')}
            </p>
            <div data-hero-fade>
              <Link
                to={sectionPath(lang, sectionIds.work)}
                className="pill group bg-ink text-canvas hover:bg-accent hover:text-white"
              >
                {t('hero.cta')}
                <span
                  aria-hidden="true"
                  className="grid size-6 place-items-center rounded-full bg-canvas/15 transition-transform duration-500 group-hover:translate-y-0.5"
                >
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M6 1.5v9M2 6.5l4 4 4-4" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          <p data-hero-fade className="meta col-span-12 flex items-center gap-3 text-muted-strong" aria-hidden="true">
            <span className="relative block h-9 w-px overflow-hidden bg-ink/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_var(--ease-soft)_infinite] bg-ink" />
            </span>
            {t('hero.scroll')}
          </p>
        </div>
      </div>
    </section>
  )
}
