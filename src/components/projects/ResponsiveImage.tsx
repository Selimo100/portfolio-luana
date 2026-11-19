import type { ProjectImage } from '../../data/projects'

interface Props {
  image: ProjectImage
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}

/** <picture> with optional AVIF/WebP sources, intrinsic size and lazy loading. */
export function ResponsiveImage({ image, alt, sizes, priority, className = '' }: Props) {
  return (
    <picture>
      {image.sources?.avif && <source type="image/avif" srcSet={image.sources.avif} sizes={sizes} />}
      {image.sources?.webp && <source type="image/webp" srcSet={image.sources.webp} sizes={sizes} />}
      <img
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
      />
    </picture>
  )
}
