import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { site } from './src/config/site.ts'
import { projects } from './src/data/projects.ts'

/** Generates sitemap.xml (with hreflang alternates) and robots.txt at build time. */
function seoFiles(): Plugin {
  const url = (path: string) => new URL(path, site.siteUrl).toString()
  const pages: { de: string; en: string }[] = [
    { de: '/de', en: '/en' },
    ...projects.map((p) => ({ de: `/de/projekte/${p.slug}`, en: `/en/projects/${p.slug}` })),
  ]
  const entry = (loc: string, alt: { de: string; en: string }) => `  <url>
    <loc>${url(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="de-CH" href="${url(alt.de)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${url(alt.en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(alt.de)}"/>
  </url>`

  return {
    name: 'seo-files',
    generateBundle() {
      const urls = pages.flatMap((alt) => [entry(alt.de, alt), entry(alt.en, alt)]).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url('/sitemap.xml')}\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles()],
  build: {
    target: 'es2022',
    // three.js is only loaded lazily together with the first WebGL scene
    chunkSizeWarningLimit: 1100,
  },
})
