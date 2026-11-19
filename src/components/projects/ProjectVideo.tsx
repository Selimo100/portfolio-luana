import { useTranslation } from 'react-i18next'
import type { ProjectVideo as Video } from '../../data/projects'

/**
 * Video is never autoplayed with sound: files show native controls and load
 * metadata only; embeds use privacy-friendly player URLs and lazy iframes.
 */
export function ProjectVideo({ video, title }: { video: Video; title: string }) {
  const { t } = useTranslation()

  if (video.type === 'file') {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        poster={video.poster}
        width={video.width}
        height={video.height}
        className="h-auto w-full bg-ink"
        aria-label={t('project.embedTitle', { title })}
      >
        <source src={video.src} type="video/mp4" />
        {t('project.videoUnsupported')}
      </video>
    )
  }

  const src =
    video.provider === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`
      : `https://player.vimeo.com/video/${video.id}?dnt=1`
  return (
    <div className="relative aspect-video w-full bg-ink">
      <iframe
        src={src}
        title={t('project.embedTitle', { title })}
        loading="lazy"
        allow="fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        className="absolute inset-0 size-full"
      />
    </div>
  )
}
