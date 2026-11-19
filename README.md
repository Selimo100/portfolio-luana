# Luana Costa — A Creative Universe

Bilingual (German / English) portfolio for Luana Costa, Mediamatikerin EFZ.
React + TypeScript + Vite, Three.js via React Three Fiber, GSAP, Lenis, Tailwind CSS and react-i18next.

```bash
npm install
npm run dev       # http://localhost:5173 → redirects to /de
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
```

---

## Before publishing: review checklist

Everything below is a **placeholder or unverified** and must be checked with Luana:

| What | Where |
| --- | --- |
| Production domain (canonical URLs, sitemap, Open Graph) | `src/config/site.ts` → `siteUrl` |
| Contact email (empty = no email button is shown) | `src/data/profile.ts` → `email` |
| CV download (empty = hidden) | `src/data/profile.ts` → `cvUrl` |
| Portrait (empty = designed placeholder) | `src/data/profile.ts` → `portrait` |
| Biography text | `src/i18n/locales/{de,en}.json` → `about.bio` |
| Timeline (taken from LinkedIn, Oct 2026) — keep it up to date | `src/data/experience.ts` + `journey` in the JSON files |
| Disciplines shown under "Was ich gestalte" | `src/data/expertise.ts` |
| **All five projects are fictional demos** | `src/data/projects.ts` (`demo: true`) + `projects.items` in the JSON files |

Demo projects are labelled "Demo" on the site. Replace or delete them before going live.

---

## Where things live

```
src/
  config/site.ts          domain, languages, default language
  data/                   content structure (no visitor-facing text)
    profile.ts            email, LinkedIn, CV, portrait
    projects.ts           projects: slug, category, images, video, tools
    experience.ts         timeline entries
    expertise.ts          disciplines
  i18n/locales/de.json    ALL German text (UI + content)
  i18n/locales/en.json    ALL English text (UI + content)
  styles/index.css        design tokens: colours, fonts, type scale
  sections/               home page sections (Hero, SelectedWork, About …)
  pages/                  HomePage, ProjectPage, NotFoundPage
  scenes/                 Three.js scenes: camera models, lighting, image shader
  components/             layout, navigation, UI, project components
public/media/             images, videos, CV — served as /media/…
```

Content editing never requires touching `src/scenes/`.

---

## Projects

### Add a new project

1. **Media** — create a folder `public/media/projects/<slug>/` and add the cover and gallery images
   (see [Images](#images)).
2. **Structure** — add an entry to the `projects` array in `src/data/projects.ts`:

   ```ts
   {
     id: 'campaign-2026',            // stable id, never translate it
     slug: 'campaign-2026',          // URL: /de/projekte/campaign-2026 and /en/projects/campaign-2026
     category: 'campaigns',          // graphic | photography | video | branding | digital | campaigns
     year: 2026,                     // optional
     accent: 'coral',                // lilac | coral | sage
     cover: img('/media/projects/campaign-2026/cover.jpg', 'landscape', 'cover'),
     gallery: [
       img('/media/projects/campaign-2026/01.jpg', 'portrait', 'detail1'),
       img('/media/projects/campaign-2026/02.jpg', 'wide', 'detail2'),
     ],
     tools: ['Adobe Photoshop', 'Figma'], // product names are not translated
   },
   ```

   The order in the array is the order on the site (numbers 01, 02 … follow it).
   Leave out `demo: true` for real work.

3. **Text** — add the same `id` under `projects.items` in **both** `de.json` and `en.json`:

   ```json
   "campaign-2026": {
     "title": "…",
     "summary": "Short introduction shown in the gallery.",
     "brief": "…",
     "challenge": "…",
     "role": "…",
     "process": ["Step one", "Step two"],
     "outcome": "…",
     "alt": { "cover": "Description of the cover image", "detail1": "…", "detail2": "…" }
   }
   ```

   Only `title`, `summary` and the `alt` texts are required. Missing fields are simply not shown.

Categories appear in the filter automatically once a project uses them. The filter itself only
shows up with at least four projects in two categories. The sitemap is regenerated on every build.

### Update or remove a project

Edit its entry in `projects.ts` and its text in both JSON files. To remove one, delete both.

---

## Images

- Put files into `public/media/…` and reference them as `/media/…`.
- Use JPEG or WebP for photos, PNG for graphics with transparency. Export at about **2000 px** on the
  long side, compressed (e.g. with [Squoosh](https://squoosh.app)) to under ~400 KB.
- The `img()` helper in `projects.ts` takes a format: `landscape` (3:2), `portrait` (4:5), `wide`
  (~2:1) or `square`. The format decides the layout in the gallery, so pick the one closest to the
  image. If your image has a different size, set `width`/`height` explicitly so the browser can
  reserve space:

  ```ts
  { src: '/media/projects/x/cover.jpg', width: 2000, height: 1250, format: 'landscape', altKey: 'cover' }
  ```

- Optional modern formats: add `sources: { avif: '/media/…/cover.avif', webp: '/media/…/cover.webp' }`.
- Replaced an image but kept its file name? Increase `MEDIA_VERSION` in `projects.ts`, otherwise
  browsers may keep showing the old file.
- Every image needs an `alt` text in both languages (`projects.items.<id>.alt.<altKey>`).
- Before/after comparison: set `beforeAfter: { before: img(…), after: img(…) }` on a project.

## Videos

Set `video` on a project — videos never autoplay and always have controls.

```ts
// Self-hosted MP4 (H.264, put it in public/media/…)
video: { type: 'file', src: '/media/projects/x/film.mp4', poster: '/media/projects/x/poster.jpg', width: 1920, height: 1080 },

// Or an embed (privacy-friendly player URLs are used)
video: { type: 'embed', provider: 'youtube', id: 'VIDEO_ID' },
video: { type: 'embed', provider: 'vimeo', id: '123456789' },
```

---

## Biography, translations and contact

- **Biography**: `about.bio` in both JSON files — one string per paragraph.
- **Any other text**: search for it in `src/i18n/locales/de.json`, then change the same key in
  `en.json`. Both files must keep identical keys. German follows Swiss conventions: no "ß"
  (use "ss").
- **LinkedIn / email / CV / portrait**: `src/data/profile.ts`. The contact button becomes an email
  button as soon as `email` is filled in; otherwise it links to LinkedIn.
- **Timeline**: `src/data/experience.ts` holds three chapters (today, apprenticeship, school — in display order) with
  organisations and dates (`'YYYY-MM'`, no `to` = "today"). Apprenticeship stations go into `steps`.
  Titles, descriptions and skill tags live under `journey.items` / `journey.steps` in both JSON files.

## Colours and fonts

All design tokens are in `src/styles/index.css` inside `@theme static { … }`. Only **five**
brand colours are set by hand — everything else is mixed from them with `color-mix()`:

```css
--color-canvas: #f5f0e9;       /* page background */
--color-ink: #000000;          /* text */
--color-accent: #830010;       /* burgundy: buttons, numbers, highlights */
--color-accent-deep: #490403;  /* deep red: dark sections, contact finale */
--color-white: #ffffff;
```

Derived automatically: `accent-soft`, `accent-mist`, `muted`, `muted-strong`, `mist`, `paper`.
Tailwind utilities (`bg-accent`, `text-ink` …) update automatically, and the 3D cameras, lighting,
gradients and transitions read the same tokens at runtime (`src/lib/theme.ts`).
Keep text contrast at WCAG AA (4.5:1) when changing `ink`, `canvas` or `accent`.

Static files are not recoloured automatically: `public/favicon.svg`, `public/og-image.png`,
`public/apple-touch-icon.png` and the placeholder images in `public/media/projects/`.

Fonts are self-hosted (no requests to Google): Bricolage Grotesque (display) and DM Sans (text),
loaded at the top of `index.css` from `@fontsource-variable/*`. To swap a font, install another
`@fontsource-variable/<name>` package, replace the import and update `--font-display` / `--font-sans`.

---

## Deploy

The site is a static single-page app. `npm run build` outputs `dist/` including `sitemap.xml`
and `robots.txt`.

1. Set `siteUrl` in `src/config/site.ts` to the real domain.
2. Deploy `dist/` to any static host. All routes must fall back to `index.html`:
   - **Netlify**: works out of the box via `public/_redirects`.
   - **Vercel**: works out of the box via `vercel.json` (framework preset: Vite).
   - **Other hosts** (e.g. Swiss shared hosting with Apache): add an `.htaccess` with a rewrite to
     `index.html` for paths that are not files.
3. Replace `public/og-image.png` (1200 × 630, social preview) if desired.

---

## How the experience works (for developers)

- **One WebGL canvas** (`components/three/GLCanvas.tsx`) is fixed above the page with
  `pointer-events: none`. Scenes render into it through drei `<View>` regions that track DOM
  elements (`components/three/SceneView.tsx`). A view mounts once its area comes within ~1.5
  screens of the viewport and then stays mounted (remounting recompiles shaders). The render loop
  is driven by the GSAP ticker right after Lenis, and sleeps when no view is visible.
- **3D cameras** (`scenes/models/`): a mirrorless photo camera (hero) and a vintage film camera
  with reels (contact), both modelled procedurally from primitives — no model files to download.
  The photo camera's lens follows the cursor and zooms out on scroll; tapping the LC monogram in the
  footer shouts "Action!": the film camera's reels roll fast and its tally light blinks.
- **Gallery images** keep a real `<img>`; the WebGL plane on top adds a restrained hover/scroll
  shader. Without WebGL, the `<img>` is all there is.
- **Shared state** between DOM and WebGL (`lib/sceneState.ts`) is mutable and read in `useFrame`,
  so nothing re-renders per frame.
- **Language** comes from the URL (`/de/…`, `/en/…`); i18next follows it. The last choice is stored
  in `localStorage` and used when visiting `/`.
- **Reduced motion**: no smooth scrolling, no intro or scroll choreography, no continuous rotation.
  **No WebGL**: an SVG illustration of the camera and plain images.
