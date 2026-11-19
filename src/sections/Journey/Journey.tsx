import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { journey, type JourneyEntry } from '../../data/experience'
import { sectionIds } from '../../lib/routes'
import { formatMonth } from '../../lib/dates'
import { useLanguage } from '../../hooks/useLanguage'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/** "Aug. 2022 – Juli 2026", "Juli 2026 – heute" or "Ausgestellt Dez. 2025". */
function Period({ from, to, certificate }: { from: string; to?: string; certificate?: boolean }) {
  const { t } = useTranslation()
  const lang = useLanguage()
  if (certificate) return <>{t('journey.issued', { date: formatMonth(from, lang) })}</>
  return (
    <>
      <time dateTime={from}>{formatMonth(from, lang)}</time> –{' '}
      {to ? <time dateTime={to}>{formatMonth(to, lang)}</time> : t('journey.present')}
    </>
  )
}

function Entry({ entry }: { entry: JourneyEntry }) {
  const { t } = useTranslation()
  const base = `journey.items.${entry.id}`
  const note = t(`${base}.note`)
  const description = t(`${base}.description`)
  const skills = t(`${base}.skills`, { returnObjects: true }) as string[]
  const tag = entry.certificate ? t('journey.certificate') : entry.employment === 'full' ? t('journey.fullTime') : entry.employment === 'part' ? t('journey.partTime') : null

  return (
    <li data-journey-item className="relative grid gap-x-8 pl-10 sm:grid-cols-[9.5rem_1fr]">
      <span aria-hidden="true" className="absolute left-0 top-2 size-[0.65rem] rounded-full border-2 border-ink bg-canvas" />
      <p className="meta mb-2 pt-1 tabular-nums text-muted-strong">
        <Period from={entry.from} to={entry.to} certificate={entry.certificate} />
      </p>
      <div>
        <h4 className="heading-m mb-1">{t(`${base}.title`)}</h4>
        <p className="mb-2 font-medium">
          {entry.institution}
          {tag && <span className="meta ml-3 rounded-full bg-accent-soft px-2.5 py-1 align-middle">{tag}</span>}
        </p>
        {note && <p className="meta mb-2 text-muted-strong">{note}</p>}
        {description && <p className="max-w-[48ch] text-muted-strong">{description}</p>}
        {skills.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill} className="meta rounded-full border border-ink/20 px-2.5 py-1">
                {skill}
              </li>
            ))}
          </ul>
        )}
        {entry.steps && (
          <ol aria-label={t('journey.stations')} className="mt-6 space-y-4 border-l border-ink/15 pl-5">
            {entry.steps.map((step) => {
              const stepNote = t(`journey.steps.${step.id}`)
              return (
                <li key={step.id} className="relative">
                  <span aria-hidden="true" className="absolute -left-[1.53rem] top-2 size-1.5 rounded-full bg-accent" />
                  <p className="font-medium">{step.name}</p>
                  <p className="meta text-muted-strong">
                    <Period from={step.from} to={step.to} />
                    {stepNote && <span className="ml-3">{stepNote}</span>}
                  </p>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </li>
  )
}

export function Journey() {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced) return
      gsap.fromTo(
        '[data-journey-line]',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-journey-list]', start: 'top 75%', end: 'bottom 60%', scrub: true } },
      )
      ScrollTrigger.batch('[data-journey-item]', {
        start: 'top 85%',
        once: true,
        onEnter: (els) => gsap.from(els, { autoAlpha: 0, y: 32, duration: 0.9, stagger: 0.12, ease: 'power3.out' }),
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <section ref={root} id={sectionIds.journey} aria-labelledby="journey-title" className="shell relative py-28 md:py-40">
      <div className="grid grid-cols-12 gap-x-6 gap-y-14">
        <header className="col-span-12 md:col-span-4">
          <div className="md:sticky md:top-[calc(var(--nav-height)+3rem)]">
            <h2 id="journey-title" className="heading-xl mb-6 outline-none">
              {t('journey.title')}
            </h2>
            <p className="max-w-[32ch] text-muted-strong">{t('journey.intro')}</p>
          </div>
        </header>

        <div data-journey-list className="relative col-span-12 md:col-span-7 md:col-start-6">
          <span aria-hidden="true" className="absolute bottom-0 left-[0.3rem] top-2 w-px bg-ink/15" />
          <span data-journey-line aria-hidden="true" className="absolute bottom-0 left-[0.3rem] top-2 w-px origin-top bg-ink" />
          <div className="space-y-20">
            {journey.map((chapter, i) => (
              <section key={chapter.id} aria-labelledby={`journey-${chapter.id}`}>
                <h3 id={`journey-${chapter.id}`} className="relative mb-10 flex items-baseline gap-4 pl-10">
                  <span aria-hidden="true" className="absolute -left-[0.2rem] top-1 size-5 rounded-full bg-accent" />
                  <span aria-hidden="true" className="font-display text-lg font-semibold text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="heading-l">{t(`journey.chapters.${chapter.id}`)}</span>
                </h3>
                <ol className="space-y-12">
                  {chapter.entries.map((entry) => (
                    <Entry key={entry.id} entry={entry} />
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
