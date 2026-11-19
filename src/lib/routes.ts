import type { Language } from '../config/site'

/** Language-specific path segment for project detail pages. */
const projectSegment: Record<Language, string> = { de: 'projekte', en: 'projects' }

/** Stable, language-independent ids of the home page sections. */
export const sectionIds = {
  work: 'work',
  about: 'about',
  expertise: 'expertise',
  journey: 'journey',
  contact: 'contact',
} as const

export const homePath = (lang: Language) => `/${lang}`

export const projectPath = (lang: Language, slug: string) => `/${lang}/${projectSegment[lang]}/${slug}`

export const sectionPath = (lang: Language, id: string) => `/${lang}#${id}`

/** The equivalent of the current page in another language (keeps the hash). */
export function equivalentPath(pathname: string, hash: string, target: Language): string {
  const [, , segment, slug] = pathname.split('/')
  if (slug && (segment === projectSegment.de || segment === projectSegment.en)) {
    return projectPath(target, slug) + hash
  }
  return homePath(target) + hash
}
