import { useTranslation } from 'react-i18next'
import { PortraitComposition } from './PortraitComposition'
import { sectionIds } from '../../lib/routes'
import { profile } from '../../data/profile'

/**
 * Biography text lives in the translation files: "about.bio" (one string per paragraph).
 * Replace it there with Luana's own words.
 */
export function About() {
  const { t } = useTranslation()
  const bio = t('about.bio', { returnObjects: true }) as string[]

  const facts = [
    [t('about.facts.profession'), t('about.facts.professionValue')],
    [t('about.facts.degree'), t('about.facts.degreeValue', { year: profile.graduationYear })],
    [t('about.facts.current'), t('about.facts.currentValue')],
    [t('about.facts.base'), t('about.facts.baseValue')],
  ]

  return (
    <section id={sectionIds.about} aria-labelledby="about-title" className="shell relative py-28 md:py-40">
      <div className="grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 md:col-span-6 lg:col-span-6">
          <div className="md:sticky md:top-[calc(var(--nav-height)+3rem)]">
            <h2 id="about-title" className="heading-xl mb-14 max-w-[9ch] outline-none">
              {t('about.title')}
            </h2>
            <dl aria-label={t('about.factsLabel')} className="max-w-md">
              {facts.map(([term, value]) => (
                <div key={term} className="grid grid-cols-[8rem_1fr] gap-4 border-t border-ink/15 py-4">
                  <dt className="meta pt-0.5 text-muted-strong">{term}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-8">
          <PortraitComposition />
          <div className="mt-14 space-y-5 md:mt-20">
            {bio.map((paragraph, i) => (
              <p key={i} className={i === 0 ? 'text-[clamp(1.2rem,1.7vw,1.45rem)] leading-[1.5] font-medium' : 'max-w-[52ch] text-muted-strong'}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
