import { useEffect, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { NotFoundPage } from './NotFoundPage'
import { ResponsiveImage } from '../components/projects/ResponsiveImage'
import { ProjectFigure } from '../components/projects/ProjectFigure'
import { ProjectLink } from '../components/projects/ProjectLink'
import { ProjectVideo } from '../components/projects/ProjectVideo'
import { BeforeAfter } from '../components/projects/BeforeAfter'
import { DemoBadge } from '../components/ui/DemoBadge'
import { SiteFooter } from '../components/layout/SiteFooter'
import { getNextProject, getProject, projects, type ProjectImage } from '../data/projects'
import { projectPath, sectionIds, sectionPath } from '../lib/routes'
import { releaseTransition } from '../lib/transition'
import { useLanguage } from '../hooks/useLanguage'
import { useSeo } from '../hooks/useSeo'

const galleryClass: Record<ProjectImage['format'], string> = {
  wide: 'md:col-span-12 -mx-[var(--gutter)]',
  landscape: 'md:col-span-10',
  portrait: 'md:col-span-6',
  square: 'md:col-span-6',
}

export function ProjectPage() {
  const { segment, slug } = useParams()
  const lang = useLanguage()
  const project = getProject(slug)
  if (!project) return <NotFoundPage />
  // Wrong language segment, e.g. /de/projects/… → canonical URL
  const canonical = projectPath(lang, project.slug)
  if (`/${lang}/${segment}/${slug}` !== canonical) return <Navigate to={canonical} replace />
  return <ProjectContent key={project.id} slug={project.slug} />
}

function ProjectContent({ slug }: { slug: string }) {
  const { t } = useTranslation()
  const lang = useLanguage()
  const project = getProject(slug)!
  const next = getNextProject(slug)
  const base = `projects.items.${project.id}`
  const title = t(`${base}.title`)
  const alt = (key: string) => t(`${base}.alt.${key}`)
  const process = t(`${base}.process`, { returnObjects: true, defaultValue: [] }) as string[]
  const number = String(projects.indexOf(project) + 1).padStart(2, '0')
  const hero = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLDivElement>(null)

  useSeo({
    title: t('meta.projectTitle', { title }),
    description: t(`${base}.summary`),
    lang,
    alternates: { de: projectPath('de', slug), en: projectPath('en', slug) },
    image: /\.svg(\?|$)/.test(project.cover.src) ? undefined : project.cover.src,
    type: 'article',
  })

  // Hand over from the gallery's expanding image once the hero is decoded
  useEffect(() => {
    const img = hero.current?.querySelector('img')
    if (!img) return releaseTransition()
    img
      .decode()
      .catch(() => undefined)
      .then(() => releaseTransition())
  }, [])

  /** Text fields only render when they exist in the translation file. */
  const text = (key: string) => {
    const value = t(`${base}.${key}`, { defaultValue: '' })
    return value || null
  }
  const sections = [
    ['brief', text('brief')],
    ['challenge', text('challenge')],
  ].filter(([, v]) => v) as [string, string][]
  const role = text('role')
  const outcome = text('outcome')

  return (
    <article aria-labelledby="project-title">
      <header className="bg-[linear-gradient(var(--color-accent-soft),var(--color-canvas))]">
        <div ref={hero} className="relative h-[var(--project-hero-h)] w-full overflow-hidden">
          <ResponsiveImage image={project.cover} alt={alt(project.cover.altKey)} sizes="100vw" priority className="size-full object-cover" />
        </div>

        <div className="shell grid grid-cols-12 gap-x-6 gap-y-8 pb-20 pt-10 md:pb-28">
          <div className="col-span-12 flex flex-wrap items-center justify-between gap-4">
            <Link to={sectionPath(lang, sectionIds.work)} className="group inline-flex min-h-11 items-center gap-2 font-semibold">
              <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-1" aria-hidden="true" />
              {t('project.back')}
            </Link>
            <p className="meta flex flex-wrap items-center gap-3 text-muted-strong">
              <span aria-hidden="true" className="font-display text-base font-semibold text-ink">
                {number}
              </span>
              <span>{t(`categories.${project.category}`)}</span>
              {project.year && <span>{project.year}</span>}
              {project.demo && <DemoBadge />}
            </p>
          </div>
          <h1 id="project-title" className="heading-xl col-span-12 md:col-span-10">
            {title}
          </h1>
          <p className="lede col-span-12 max-w-[40ch] md:col-span-7">{t(`${base}.summary`)}</p>
          {project.demo && (
            <p className="meta col-span-12 flex max-w-[64ch] items-start gap-2 border-l-2 border-accent bg-paper px-4 py-3 text-muted-strong md:col-span-7">
              {t('project.demoNotice')}
            </p>
          )}
        </div>
      </header>

      <div className="shell grid grid-cols-12 gap-x-6 gap-y-16 pb-24">
        <aside className="col-span-12 md:col-span-4">
          <dl className="md:sticky md:top-[calc(var(--nav-height)+2rem)]">
            {[
              [t('project.category'), t(`categories.${project.category}`)],
              project.year ? [t('project.year'), String(project.year)] : null,
              role ? [t('project.role'), role] : null,
              project.tools?.length ? [t('project.tools'), project.tools.join(', ')] : null,
            ]
              .filter((row): row is string[] => row !== null)
              .map(([term, value]) => (
                <div key={term} className="border-t border-ink/15 py-4">
                  <dt className="meta mb-1 text-muted-strong">{term}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
          </dl>
        </aside>

        <div className="col-span-12 space-y-16 md:col-span-7 md:col-start-6">
          <section aria-labelledby="overview">
            <h2 id="overview" className="sr-only">
              {t('project.overview')}
            </h2>
            {sections.map(([key, value]) => (
              <div key={key} className="mb-12">
                <h3 className="heading-m mb-4">{t(`project.${key}`)}</h3>
                <p className="max-w-[56ch] text-lg">{value}</p>
              </div>
            ))}
          </section>

          {process.length > 0 && (
            <section aria-labelledby="process">
              <h2 id="process" className="heading-m mb-6">
                {t('project.process')}
              </h2>
              <ol className="space-y-5">
                {process.map((step, i) => (
                  <li key={i} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink/15 pt-5">
                    <span aria-hidden="true" className="font-display text-xl font-semibold text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="max-w-[52ch] text-lg">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>

      {(project.gallery?.length || project.video || project.beforeAfter) && (
        <section aria-labelledby="gallery" className="shell pb-28">
          <h2 id="gallery" className="sr-only">
            {t('project.gallery')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {project.gallery?.map((image, i) => (
              <figure key={image.src + i} className={`${galleryClass[image.format]} ${image.format === 'landscape' && i % 2 ? 'md:col-start-3' : ''}`}>
                <ProjectFigure image={image} alt={alt(image.altKey)} sizes="(min-width: 768px) 80vw, 100vw" />
              </figure>
            ))}
          </div>

          {project.video && (
            <div className="mt-16">
              <h3 className="heading-m mb-6">{t('project.video')}</h3>
              <ProjectVideo video={project.video} title={title} />
            </div>
          )}

          {project.beforeAfter && (
            <div className="mt-24">
              <h3 className="heading-m mb-6">{t('project.beforeAfter')}</h3>
              <BeforeAfter
                before={project.beforeAfter.before}
                after={project.beforeAfter.after}
                beforeAlt={alt(project.beforeAfter.before.altKey)}
                afterAlt={alt(project.beforeAfter.after.altKey)}
              />
            </div>
          )}
        </section>
      )}

      {outcome && (
        <section aria-labelledby="outcome" className="shell grid grid-cols-12 gap-x-6 pb-32">
          <h2 id="outcome" className="heading-l col-span-12 mb-6 md:col-span-4">
            {t('project.outcome')}
          </h2>
          <p className="lede col-span-12 max-w-[44ch] md:col-span-7 md:col-start-6">{outcome}</p>
        </section>
      )}

      <div data-tone="dark" className="bg-accent-deep text-canvas">
        <section aria-labelledby="next-project" className="shell grid grid-cols-12 gap-x-6 gap-y-10 py-24 md:py-32" ref={nextRef}>
          <div className="col-span-12 md:col-span-5 md:self-end">
            <h2 id="next-project" className="meta mb-4 text-mist">
              {t('project.next')}
            </h2>
            <p className="heading-xl mb-8">
              <ProjectLink slug={next.slug} transitionFrom={() => nextRef.current}>
                {t(`projects.items.${next.id}.title`)}
              </ProjectLink>
            </p>
            <p className="meta text-mist">{t(`categories.${next.category}`)}</p>
          </div>
          <ProjectLink
            slug={next.slug}
            transitionFrom={() => nextRef.current}
            tabIndex={-1}
            aria-hidden
            data-cursor={t('work.cursor')}
            className="group col-span-12 block md:col-span-6 md:col-start-7"
          >
            <ProjectFigure image={next.cover} alt="" sizes="(min-width: 768px) 50vw, 100vw" ratio="4 / 3" />
          </ProjectLink>
        </section>
        <SiteFooter />
      </div>
    </article>
  )
}
