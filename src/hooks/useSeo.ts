import { useEffect } from 'react'
import { site, type Language } from '../config/site'

interface SeoOptions {
  title: string
  description: string
  lang: Language
  /** Path of this page per language, e.g. { de: '/de', en: '/en' } */
  alternates: Record<Language, string>
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

const absolute = (path: string) => new URL(path, site.siteUrl).toString()

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

/** Page-level metadata: title, description, canonical, hreflang and Open Graph. */
export function useSeo({ title, description, lang, alternates, image = site.ogImage, type = 'website', noindex }: SeoOptions) {
  useEffect(() => {
    document.title = title
    document.documentElement.lang = lang === 'de' ? 'de-CH' : 'en'
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex' : 'index, follow')
    upsertLink('canonical', absolute(alternates[lang]))
    upsertLink('alternate', absolute(alternates.de), 'de-CH')
    upsertLink('alternate', absolute(alternates.en), 'en')
    upsertLink('alternate', absolute(alternates[site.defaultLanguage]), 'x-default')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', absolute(alternates[lang]))
    upsertMeta('property', 'og:image', absolute(image))
    upsertMeta('property', 'og:locale', lang === 'de' ? 'de_CH' : 'en_GB')
    upsertMeta('property', 'og:locale:alternate', lang === 'de' ? 'en_GB' : 'de_CH')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
  }, [title, description, lang, alternates.de, alternates.en, image, type, noindex])
}
