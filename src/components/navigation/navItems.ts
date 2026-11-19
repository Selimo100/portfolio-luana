import { sectionIds } from '../../lib/routes'

/** Primary navigation — concise by design. */
export const navItems = [
  { key: 'work', section: sectionIds.work },
  { key: 'about', section: sectionIds.about },
  { key: 'contact', section: sectionIds.contact },
] as const
