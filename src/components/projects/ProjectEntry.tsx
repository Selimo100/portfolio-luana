import { forwardRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ProjectFigure } from './ProjectFigure'
import { ProjectLink } from './ProjectLink'
import { DemoBadge } from '../ui/DemoBadge'
import type { Project } from '../../data/projects'
import type { PlaneInteraction } from '../../scenes/GalleryPlane'

type Variant = 'landscape-left' | 'landscape-right' | 'portrait-right' | 'portrait-left' | 'wide'

/** Editorial rhythm: the layout follows each cover's format and alternates sides. */
export function variantFor(project: Project, index: number): Variant {
  const flip = index % 2 === 1
  switch (project.cover.format) {
    case 'wide':
      return 'wide'
    case 'portrait':
      return flip ? 'portrait-left' : 'portrait-right'
    default:
      return flip ? 'landscape-right' : 'landscape-left'
  }
}

const layout: Record<Variant, { figure: string; meta: string; sizes: string }> = {
  'landscape-left': {
    figure: 'md:col-span-8 md:col-start-1',
    meta: 'md:col-span-4 md:col-start-9 md:self-end',
    sizes: '(min-width: 768px) 66vw, 100vw',
  },
  'landscape-right': {
    figure: 'md:col-span-8 md:col-start-5 md:row-start-1',
    meta: 'md:col-span-3 md:col-start-1 md:row-start-1 md:self-start md:pt-24',
    sizes: '(min-width: 768px) 66vw, 100vw',
  },
  'portrait-right': {
    figure: 'md:col-span-5 md:col-start-7 md:row-start-1',
    meta: 'md:col-span-5 md:col-start-1 md:row-start-1 md:self-center',
    sizes: '(min-width: 768px) 42vw, 100vw',
  },
  'portrait-left': {
    figure: 'md:col-span-5 md:col-start-2',
    meta: 'md:col-span-4 md:col-start-8 md:self-end md:pb-16',
    sizes: '(min-width: 768px) 42vw, 100vw',
  },
  wide: {
    figure: 'md:col-span-12 -mx-[var(--gutter)]',
    meta: 'md:col-span-12 md:grid md:grid-cols-12 md:gap-x-6',
    sizes: '100vw',
  },
}

interface Props {
  project: Project
  index: number
  hidden?: boolean
}

export const ProjectEntry = forwardRef<HTMLLIElement, Props>(function ProjectEntry({ project, index, hidden }, ref) {
  const { t } = useTranslation()
  const item = useRef<HTMLLIElement | null>(null)
  const interaction = useRef<PlaneInteraction>({ hover: 0, x: 0.5, y: 0.5 })
  const variant = variantFor(project, index)
  const l = layout[variant]
  const base = `projects.items.${project.id}`
  const title = t(`${base}.title`)
  const number = String(index + 1).padStart(2, '0')
  const titleId = `project-${project.id}-title`

  const focus = { onFocus: () => (interaction.current.hover = 1), onBlur: () => (interaction.current.hover = 0) }

  return (
    <li
      ref={(el) => {
        item.current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
      }}
      hidden={hidden}
      data-flip-id={project.id}
      aria-labelledby={titleId}
      className="group grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12"
    >
      <ProjectLink
        slug={project.slug}
        transitionFrom={() => item.current}
        tabIndex={-1}
        aria-hidden
        data-cursor={t('work.cursor')}
        className={`block ${l.figure}`}
      >
        <ProjectFigure
          image={project.cover}
          alt={t(`${base}.alt.${project.cover.altKey}`)}
          sizes={l.sizes}
          ratio={variant === 'wide' ? '21 / 9' : undefined}
          interactionRef={interaction}
        />
      </ProjectLink>

      <div className={l.meta}>
        <p aria-hidden="true" className="display mb-4 text-[clamp(4rem,9vw,8.5rem)] text-accent md:col-span-3">
          {number}
        </p>
        <div className={variant === 'wide' ? 'md:col-span-5 md:col-start-5' : ''}>
          <p className="meta mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-strong">
            <span>{t(`categories.${project.category}`)}</span>
            {project.year && <span>{project.year}</span>}
            {project.demo && <DemoBadge />}
          </p>
          <h3 id={titleId} className="heading-l mb-4">
            <ProjectLink slug={project.slug} transitionFrom={() => item.current} className="outline-offset-8" {...focus}>
              {title}
            </ProjectLink>
          </h3>
          <p className="mb-6 max-w-[42ch] text-muted-strong">{t(`${base}.summary`)}</p>
          <ProjectLink
            slug={project.slug}
            transitionFrom={() => item.current}
            className="link-underline inline-flex min-h-11 items-center font-semibold"
            {...focus}
          >
            {t('work.view')}
            <span className="sr-only">: {title}</span>
          </ProjectLink>
        </div>
      </div>
    </li>
  )
})
