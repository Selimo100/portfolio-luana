import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ResponsiveImage } from './ResponsiveImage'
import type { ProjectImage } from '../../data/projects'

interface Props {
  before: ProjectImage
  after: ProjectImage
  beforeAlt: string
  afterAlt: string
}

/** Comparison slider driven by a native range input — keyboard and touch friendly. */
export function BeforeAfter({ before, after, beforeAlt, afterAlt }: Props) {
  const { t } = useTranslation()
  const [value, setValue] = useState(50)

  return (
    <figure>
      <div className="relative overflow-hidden" style={{ aspectRatio: `${after.width} / ${after.height}` }}>
        <ResponsiveImage image={after} alt={afterAlt} sizes="100vw" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <ResponsiveImage image={before} alt={beforeAlt} sizes="100vw" className="absolute inset-0 size-full object-cover" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-canvas" style={{ left: `${value}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-canvas text-ink shadow-lg">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
        <span className="meta absolute left-4 top-4 rounded-full bg-ink/75 px-3 py-1 text-canvas">{t('project.before')}</span>
        <span className="meta absolute right-4 top-4 rounded-full bg-ink/75 px-3 py-1 text-canvas">{t('project.after')}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={t('project.compareLabel')}
          className="peer absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 outline-2 outline-offset-[-6px] outline-canvas peer-focus-visible:outline" />
      </div>
    </figure>
  )
}
