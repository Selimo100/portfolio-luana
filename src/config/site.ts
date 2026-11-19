/**
 * Global site settings.
 * Change `siteUrl` to the final production domain before deploying —
 * it is used for canonical URLs, hreflang links, Open Graph tags and the sitemap.
 */
export const site = {
  siteUrl: 'https://luanacosta.ch', // TODO: replace with the real domain
  defaultLanguage: 'de',
  languages: ['de', 'en'],
  ogImage: '/og-image.png?v=2',
  storageKey: 'lc-language',
} as const

export type Language = (typeof site.languages)[number]

export const isLanguage = (value: unknown): value is Language =>
  typeof value === 'string' && (site.languages as readonly string[]).includes(value)
