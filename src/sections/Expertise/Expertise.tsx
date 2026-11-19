import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DisciplinePreview } from './DisciplinePreview'
import { disciplines, type DisciplineId } from '../../data/expertise'
import { sectionIds } from '../../lib/routes'

/**
 * Desktop: an index of disciplines with a shared preview stage.
 * Mobile: each discipline carries its own preview inline.
 */
export function Expertise() {
  const { t } = useTranslation()
  const [active, setActive] = useState<DisciplineId>(disciplines[0])

  return (
    <section id={sectionIds.expertise} aria-labelledby="expertise-title" className="relative bg-accent-soft/70 py-28 md:py-40">
      <div className="shell">
        <header className="mb-16 grid grid-cols-12 gap-x-6 gap-y-6 md:mb-24">
          <h2 id="expertise-title" className="heading-xl col-span-12 outline-none md:col-span-7">
            {t('expertise.title')}
          </h2>
          <p className="lede col-span-12 md:col-span-4 md:col-start-9 md:self-end">{t('expertise.intro')}</p>
        </header>

        <div className="grid grid-cols-12 gap-x-6">
          <ul className="col-span-12 lg:col-span-6">
            {disciplines.map((id) => {
              const isActive = id === active
              return (
                <li key={id} className="border-t border-ink/20 last:border-b">
                  <h3>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActive(id)}
                      onPointerEnter={() => setActive(id)}
                      onFocus={() => setActive(id)}
                      className="group flex w-full items-baseline justify-between gap-6 py-6 text-left md:py-8"
                    >
                      <span
                        className={`heading-l transition-[color,transform] duration-500 ease-[var(--ease-editorial)] ${
                          isActive ? 'translate-x-2 text-ink' : 'text-ink/55 group-hover:text-ink'
                        }`}
                      >
                        {t(`expertise.items.${id}.name`)}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`size-3 shrink-0 rounded-full transition-colors duration-500 ${isActive ? 'bg-accent' : 'bg-ink/15'}`}
                      />
                    </button>
                  </h3>
                  <p className="-mt-2 max-w-[46ch] pb-7 text-muted-strong">{t(`expertise.items.${id}.text`)}</p>
                  <div className="pb-8 lg:hidden">
                    <DisciplinePreview id={id} active={isActive} />
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
            <div className="sticky top-[calc(var(--nav-height)+3rem)]">
              <div className="relative">
                {disciplines.map((id) => (
                  <div
                    key={id}
                    className={`transition-opacity duration-500 ${id === active ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'}`}
                  >
                    <DisciplinePreview id={id} active={id === active} />
                  </div>
                ))}
              </div>
              <p className="meta mt-4 text-muted-strong" aria-hidden="true">
                {t(`expertise.items.${active}.name`)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
