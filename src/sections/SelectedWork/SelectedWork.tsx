import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProjectEntry } from '../../components/projects/ProjectEntry'
import { projects, usedCategories, type ProjectCategory } from '../../data/projects'
import { sectionIds } from '../../lib/routes'
import { workListState } from '../../lib/sceneState'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Filter = ProjectCategory | 'all'

/** Fades the DOM list and the WebGL image planes together (WebGL ignores CSS opacity). */
function fadeList(list: HTMLElement, vars: gsap.TweenVars) {
  gsap.killTweensOf([list, workListState])
  gsap.to(workListState, { ...vars, onComplete: undefined })
  gsap.to(list, vars)
}

/** Filters only appear when there is enough work for them to be useful. */
const categories = usedCategories()
const showFilters = projects.length >= 4 && categories.length >= 2

export function SelectedWork() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>('all')
  const list = useRef<HTMLOListElement>(null)
  const pending = useRef<Filter | null>(null)
  const changed = useRef(false)
  // The filter whose buttons show as active — switches immediately on click
  const [selected, setSelected] = useState<Filter>('all')

  const visible = projects.filter((p) => filter === 'all' || p.category === filter)
  const hasDemo = projects.some((p) => p.demo)

  /**
   * Cross-fade: the list fades out, the filter swaps while it's invisible, then
   * the new selection fades in. (A FLIP layout animation made the large
   * images fly across the page and over the filter buttons.)
   */
  const changeFilter = (next: Filter) => {
    if (next === selected) return
    setSelected(next)
    const el = list.current
    if (!el || prefersReducedMotion()) {
      setFilter(next)
      return
    }
    pending.current = next
    fadeList(el, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        const target = pending.current
        pending.current = null
        if (target === null) return
        changed.current = true
        setFilter(target)
      },
    })
  }

  // After React has swapped the projects: re-measure scroll positions, fade back in
  useLayoutEffect(() => {
    if (!changed.current) return
    changed.current = false
    ScrollTrigger.refresh()
    const el = list.current
    if (!el) return
    fadeList(el, { opacity: 1, duration: 0.6, ease: 'power3.out' })
    gsap.fromTo(el, { y: 24 }, { y: 0, duration: 0.6, ease: 'power3.out' })
  }, [filter])

  // Never leave the image planes faded out (e.g. when navigating away mid-fade)
  useEffect(
    () => () => {
      gsap.killTweensOf(workListState)
      workListState.opacity = 1
    },
    [],
  )

  return (
    <section id={sectionIds.work} aria-labelledby="work-title" className="shell relative pb-32 pt-28 md:pt-40">
      <header className="mb-16 grid grid-cols-12 gap-x-6 gap-y-6 md:mb-24">
        <h2 id="work-title" className="heading-xl col-span-12 md:col-span-8 outline-none">
          {t('work.title')}
        </h2>
        <div className="col-span-12 md:col-span-4 md:self-end">
          <p className="lede">{t('work.intro')}</p>
          <p className="meta mt-4 text-muted-strong">{t('work.count', { count: projects.length })}</p>
        </div>
        {hasDemo && (
          <p className="meta col-span-12 flex max-w-[60ch] items-start gap-2 text-muted-strong md:col-span-6 md:col-start-7">
            <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
            {t('work.demoNotice')}
          </p>
        )}
      </header>

      {showFilters && (
        <div className="mb-16 flex flex-wrap items-center gap-2 md:mb-24" role="group" aria-label={t('work.filterLabel')}>
          {(['all', ...categories] as Filter[]).map((c) => {
            const active = selected === c
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => changeFilter(c)}
                className={`min-h-11 rounded-full border px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-300 ${
                  active ? 'border-ink bg-ink text-canvas' : 'border-ink/20 hover:border-ink'
                }`}
              >
                {c === 'all' ? t('work.all') : t(`categories.${c}`)}
              </button>
            )
          })}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {t('work.resultsAnnouncement', { count: visible.length })}
      </p>

      <ol ref={list} className="space-y-28 md:space-y-44">
        {projects.map((project, index) => (
          <ProjectEntry
            key={project.id}
            project={project}
            index={index}
            hidden={!visible.includes(project)}
          />
        ))}
      </ol>

      {visible.length === 0 && (
        <div className="py-24 text-center">
          <p className="heading-m mb-6">{t('work.empty')}</p>
          <button type="button" onClick={() => changeFilter('all')} className="pill border border-ink">
            {t('work.reset')}
          </button>
        </div>
      )}
    </section>
  )
}
