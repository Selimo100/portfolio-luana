import { lazy, useRef, type PointerEvent } from 'react'
import { SceneView } from '../three/SceneView'
import { useGL } from '../three/GLContext'
import { ResponsiveImage } from './ResponsiveImage'
import type { ProjectImage } from '../../data/projects'
import type { PlaneInteraction } from '../../scenes/GalleryPlane'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const GalleryPlane = lazy(() => import('../../scenes/GalleryPlane'))

interface Props {
  image: ProjectImage
  alt: string
  sizes: string
  /** Aspect ratio of the frame; defaults to the image's own */
  ratio?: string
  className?: string
  /** WebGL hover distortion on top of the image */
  interactive?: boolean
  /** Lets a parent link drive the hover state (keyboard focus) */
  interactionRef?: { current: PlaneInteraction }
}

/**
 * A project image. With WebGL it gains a restrained shader layer reacting to
 * pointer and scroll; without it, a gentle CSS zoom. The <img> is always there.
 */
export function ProjectFigure({ image, alt, sizes, ratio, className = '', interactive = true, interactionRef }: Props) {
  const { enabled } = useGL()
  const reduced = useReducedMotion()
  const ownInteraction = useRef<PlaneInteraction>({ hover: 0, x: 0.5, y: 0.5 })
  const interaction = interactionRef ?? ownInteraction

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    interaction.current.x = (e.clientX - r.left) / r.width
    interaction.current.y = 1 - (e.clientY - r.top) / r.height
  }

  const gl = enabled && interactive
  return (
    <div
      data-transition-image
      className={`relative overflow-hidden bg-accent-soft ${className}`}
      style={{ aspectRatio: ratio ?? `${image.width} / ${image.height}` }}
      onPointerMove={gl ? onMove : undefined}
      onPointerEnter={gl ? () => (interaction.current.hover = 1) : undefined}
      onPointerLeave={gl ? () => (interaction.current.hover = 0) : undefined}
    >
      <ResponsiveImage
        image={image}
        alt={alt}
        sizes={sizes}
        className={`absolute inset-0 size-full object-cover ${
          gl ? '' : 'transition-transform duration-[1.2s] ease-[var(--ease-editorial)] group-hover:scale-[1.035]'
        }`}
      />
      {gl && (
        <SceneView className="absolute inset-0">
          <GalleryPlane src={image.src} interaction={interaction.current} reducedMotion={reduced} />
        </SceneView>
      )}
    </div>
  )
}
