/**
 * Project collection — structure and media only.
 * All visitor-facing text (title, summary, role …) lives in
 * src/i18n/locales/{de,en}.json under "projects.items.<id>".
 *
 * ⚠️ The entries marked `demo: true` are FICTIONAL example projects used to
 * demonstrate the layout. They are labelled as demos on the website.
 * Replace or delete them before publishing — see README.md.
 */

export type ProjectCategory = 'graphic' | 'photography' | 'video' | 'branding' | 'digital' | 'campaigns'

/** Order in which categories appear in filters. */
export const categoryOrder: ProjectCategory[] = ['graphic', 'photography', 'video', 'branding', 'digital', 'campaigns']

export type MediaFormat = 'landscape' | 'portrait' | 'wide' | 'square'

export interface ProjectImage {
  src: string
  /** Optional modern formats for the same image: { avif: '…', webp: '…' } */
  sources?: { avif?: string; webp?: string }
  width: number
  height: number
  format: MediaFormat
  /** Key of the alt text inside projects.items.<id>.alt */
  altKey: string
}

export type ProjectVideo =
  | { type: 'file'; src: string; poster?: string; width: number; height: number }
  | { type: 'embed'; provider: 'youtube' | 'vimeo'; id: string }

export interface Project {
  /** Stable, language-independent identifier. Also used as URL slug. */
  id: string
  slug: string
  category: ProjectCategory
  year?: number
  /** Marks example content. Shown with a visible "Demo" label. */
  demo?: boolean
  featured?: boolean
  cover: ProjectImage
  gallery?: ProjectImage[]
  video?: ProjectVideo
  beforeAfter?: { before: ProjectImage; after: ProjectImage }
  /** Tool names are product names and are not translated. */
  tools?: string[]
}

/**
 * Bump this whenever you replace an image but keep its file name —
 * it changes the URL so browsers (and the WebGL texture cache) load the new file.
 */
const MEDIA_VERSION = '2'

const img = (
  src: string,
  format: MediaFormat,
  altKey: string,
): ProjectImage => {
  const sizes: Record<MediaFormat, [number, number]> = {
    landscape: [1600, 1067],
    portrait: [1200, 1500],
    wide: [1920, 900],
    square: [1400, 1400],
  }
  const [width, height] = sizes[format]
  return { src: `${src}?v=${MEDIA_VERSION}`, width, height, format, altKey }
}

export const projects: Project[] = [
  {
    id: 'poster-series',
    slug: 'poster-series',
    category: 'graphic',
    demo: true,
    featured: true,
    cover: img('/media/projects/poster-series/cover.svg', 'landscape', 'cover'),
    gallery: [
      img('/media/projects/poster-series/detail-1.svg', 'portrait', 'detail1'),
      img('/media/projects/poster-series/detail-2.svg', 'portrait', 'detail2'),
      img('/media/projects/poster-series/detail-3.svg', 'wide', 'detail3'),
    ],
    tools: ['Adobe InDesign', 'Adobe Illustrator'],
  },
  {
    id: 'city-light',
    slug: 'city-light',
    category: 'photography',
    demo: true,
    featured: true,
    cover: img('/media/projects/city-light/cover.svg', 'portrait', 'cover'),
    gallery: [
      img('/media/projects/city-light/detail-1.svg', 'landscape', 'detail1'),
      img('/media/projects/city-light/detail-2.svg', 'portrait', 'detail2'),
    ],
    beforeAfter: {
      before: img('/media/projects/city-light/before.svg', 'landscape', 'before'),
      after: img('/media/projects/city-light/detail-1.svg', 'landscape', 'after'),
    },
    tools: ['Adobe Lightroom', 'Adobe Photoshop'],
  },
  {
    id: 'short-film',
    slug: 'short-film',
    category: 'video',
    demo: true,
    cover: img('/media/projects/short-film/cover.svg', 'wide', 'cover'),
    gallery: [
      img('/media/projects/short-film/detail-1.svg', 'landscape', 'detail1'),
      img('/media/projects/short-film/detail-2.svg', 'landscape', 'detail2'),
    ],
    // Example: video: { type: 'file', src: '/media/projects/short-film/film.mp4', poster: '…', width: 1920, height: 1080 }
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
  },
  {
    id: 'brand-identity',
    slug: 'brand-identity',
    category: 'branding',
    demo: true,
    cover: img('/media/projects/brand-identity/cover.svg', 'landscape', 'cover'),
    gallery: [
      img('/media/projects/brand-identity/detail-1.svg', 'square', 'detail1'),
      img('/media/projects/brand-identity/detail-2.svg', 'portrait', 'detail2'),
    ],
    tools: ['Adobe Illustrator', 'Figma'],
  },
  {
    id: 'web-concept',
    slug: 'web-concept',
    category: 'digital',
    demo: true,
    cover: img('/media/projects/web-concept/cover.svg', 'portrait', 'cover'),
    gallery: [
      img('/media/projects/web-concept/detail-1.svg', 'wide', 'detail1'),
      img('/media/projects/web-concept/detail-2.svg', 'landscape', 'detail2'),
    ],
    tools: ['Figma', 'HTML', 'CSS'],
  },
]

export const getProject = (slug: string | undefined) => projects.find((p) => p.slug === slug)

export const getNextProject = (slug: string) => {
  const index = projects.findIndex((p) => p.slug === slug)
  return projects[(index + 1) % projects.length]
}

/** Categories that actually have published projects, in display order. */
export const usedCategories = () =>
  categoryOrder.filter((category) => projects.some((p) => p.category === category))
