# Project analysis: Luana Costa portfolio

**Snapshot:** 19 Nov 2026. This is a briefing for an AI coding agent that will fix issues and propose improvements. It describes the code as it is now, the changes already made and why they were made, the known problems in priority order, and a list of ideas. Read [README.md](README.md) as well; it covers content editing and deployment.

---

## 1. What this is

- A **bilingual (German/English) portfolio** for Luana Costa, *Mediamatikerin EFZ* (a Swiss media/design apprenticeship qualification). It is aimed at recruiters and creative employers in Switzerland.
- The concept is an **editorial "creative universe"**: very large condensed display type, a cream, burgundy and deep-red palette, two procedurally modelled **3D cameras** (a photo camera in the hero, a film camera in the contact finale), WebGL shader effects on project images, smooth scrolling, and choreography driven by scrolling.
- **Status:** the structure and design are finished, but **most content is placeholder** (see §6). The site has not been deployed yet. The project is **not a git repository**. Run `git init` and make a first commit before changing anything.

## 2. Stack and commands

| Area | Choice |
| --- | --- |
| Build | Vite 8, TypeScript 7 (`tsc -b`), `@vitejs/plugin-react` |
| UI | React 19, react-router 8 (`createBrowserRouter`, data router) |
| Styling | Tailwind CSS 4 (`@theme static` tokens in `src/styles/index.css`), self-hosted variable fonts via `@fontsource-variable` |
| 3D | three 0.186, @react-three/fiber 9, @react-three/drei 10 |
| Motion | GSAP 3.15 + ScrollTrigger, `@gsap/react` (`useGSAP`), Lenis 1.3 (smooth scroll) |
| i18n | i18next + react-i18next, all text in `src/i18n/locales/{de,en}.json` (key sets are identical, verified) |
| Hosting | Static SPA; `vercel.json` and `public/_redirects` provide the SPA fallback; a custom Vite plugin generates `sitemap.xml` and `robots.txt` |

```bash
npm run dev      # http://localhost:5173 → /de
npm run build    # tsc -b && vite build → dist/
npm run preview  # serve dist on :4173
```

There are **no tests, no ESLint and no Prettier config**. The only automatic check is `tsc -b` (strict, `noUnusedLocals`, `noUnusedParameters`).

## 3. Architecture

### 3.1 File map

```
src/
  main.tsx, App.tsx            router: / → /:lang redirect; /:lang (home), /:lang/:segment/:slug (project), 404
  config/site.ts               siteUrl (placeholder), languages, storage key
  data/                        structure only, no visitor-facing text
    projects.ts                5 demo projects, img() helper with fixed sizes per format, MEDIA_VERSION cache-buster
    experience.ts              journey timeline (from LinkedIn, Oct 2026)
    expertise.ts               5 disciplines
    profile.ts                 email/cv/portrait are EMPTY; LinkedIn set
  i18n/                        config.ts (language = URL → localStorage → 'de'), locales/de.json, en.json
  styles/index.css             tokens (5 brand colours, rest via color-mix), type classes (.display, .heading-*), cursor, grain
  lib/
    sceneState.ts              mutable shared state DOM ↔ WebGL (pointer, scroll velocity, hero progress, workListState, viewRegistry)
    scroll.ts                  Lenis singleton + scrollToTarget()
    transition.ts              shared-element "image expands into project hero" overlay (GSAP, plain DOM)
    theme.ts                   reads CSS tokens at runtime → hex (used by 3D materials and GSAP)
    webgl.ts                   hasWebGL(), isLowPowerDevice()
    routes.ts                  /de/projekte/:slug vs /en/projects/:slug, section hash paths, equivalentPath()
  hooks/                       useSmoothScroll (Lenis on the GSAP ticker), useSeo (meta tags written on the client), useReducedMotion, useMediaQuery, useLanguage
  components/
    layout/                    Layout (GLProvider, Nav, Cursor, lazy GLCanvas), ScrollManager (scroll restoration), SiteFooter (easter egg)
    three/                     GLCanvas (single fixed canvas + View.Port + FrameDriver), SceneView (lazy mount + visibility registry), GLContext
    projects/                  ProjectEntry, ProjectFigure (img + optional GL plane), ProjectLink (transition), ResponsiveImage, ProjectVideo, BeforeAfter
    navigation/                Nav (switches to dark when over a [data-tone=dark] section), MobileMenu (focus trap), LanguageToggle
    ui/                        Cursor, Magnetic, Monogram, DemoBadge
  sections/                    Hero, SelectedWork (filter), About (+PortraitComposition parallax), Expertise (+DisciplinePreview CSS 3D), Journey, Contact
  scenes/                      HeroScene, ContactScene, CameraRig, SceneLighting (drei Environment + Lightformers), GalleryPlane (shader), models/ (PhotoCamera, FilmCamera, ModelMotion, materials), sceneQuality
  pages/                       HomePage, ProjectPage, NotFoundPage
```

### 3.2 Rendering model (important)

- **One transparent WebGL canvas** is `position: fixed` over the whole viewport with `z-index: 20` and `pointer-events: none`. Each 3D area is a drei `<View>` that tracks a DOM element (`SceneView`) and renders into it with scissor/viewport.
- **Consequence:** WebGL content **ignores CSS**. It is unaffected by `opacity`, `overflow: hidden`, `border-radius`, `clip-path`, `filter`, `visibility`, `z-index` or stacking order. Anything that should affect a WebGL image has to be mirrored into the shader by hand. The filter fade does this through `workListState.opacity`. DOM content with `z-index` above 20 (hero text `z-30`, nav `z-50`, mobile menu `z-45`, cursor `z-60`) sits above the canvas. Other content sits below it.
- **Render loop:** the canvas uses `frameloop="never"`. `FrameDriver` in `GLCanvas.tsx` calls R3F's `advance(time)` from the **GSAP ticker**. Lenis is added to the same ticker with priority, so every frame runs in this order: Lenis scroll → ScrollTrigger → WebGL render. The loop sleeps when `viewRegistry` reports 0 visible views, and clears the canvas when it goes to sleep.
- **Scene lifecycle:** `SceneView` mounts a scene when it comes within 150% of the viewport and **never unmounts it** while the page stays mounted. drei skips views that are off screen. Remounting a scene recompiled shaders and re-uploaded textures, which caused stalls while scrolling.
- **Fallbacks:** without WebGL, `CameraFallback` (SVG) and plain `<img>` are used. With reduced motion there is no Lenis and no intro or scroll choreography, and the shaders are static.

### 3.3 Other mechanics

- **Language:** the URL is the source of truth. `AppShell` syncs i18next and `<html lang>`. `LanguageToggle` navigates with `replace` and `state.preserveScroll`.
- **Scroll restoration:** `ScrollManager` keeps positions per history key in memory and in sessionStorage (written once scrolling has paused). It handles hash links and focuses the section's `h2`.
- **Page transition:** clicking a project clones its image into a fixed overlay, which expands to `--project-hero-h`. The overlay navigates when it has covered the screen, and `ProjectPage` releases it after the hero `img.decode()`.
- **Easter egg:** the monogram button in the footer sets `cameraState.action = 1` for 4.5 s. The film camera's reels spin fast and its tally light blinks.

## 4. Changes already made (do not revert)

These changes fixed real problems: the site lagged while scrolling and the project filter was broken.

| Change | File | Why |
| --- | --- | --- |
| R3F loop driven by the GSAP ticker after Lenis (`frameloop="never"` + `advance`) | `components/three/GLCanvas.tsx`, `hooks/useSmoothScroll.ts` | Two separate rAF loops made WebGL views trail the DOM by one frame, which looked like jitter. |
| Canvas DPR capped at 1.5 (1.25 on low-power devices); `PerformanceMonitor` with `flipflops={3}` and `onFallback` | `GLCanvas.tsx` | The full-screen canvas at 2× with MSAA was too heavy, and the DPR kept switching back and forth. |
| Scenes mount early and stay mounted; visibility is tracked separately | `components/three/SceneView.tsx` | Unmounting and remounting recompiled shaders, causing hitches on every scroll. |
| Canvas cleared when the loop goes to sleep | `GLCanvas.tsx` | A stale last frame could stay frozen on screen. |
| sessionStorage write debounced (250 ms + `pagehide`) | `components/layout/ScrollManager.tsx` | There was a synchronous storage write on every scroll frame. |
| Contact darkening is now a cream overlay's **opacity** instead of `background-color` | `sections/Contact/Contact.tsx` (`isolate`, `-z-10` overlay) | Animating the background repainted the whole section every frame. |
| Grain: no `mix-blend-mode`, promoted to its own layer | `styles/index.css` | Blending a filter-generated texture forced a repaint every frame. |
| Cursor only calls `setVisible` when visibility actually changes | `components/ui/Cursor.tsx` | It was calling React state on every mouse move. |
| **Filter:** the GSAP Flip animation was replaced by a cross-fade (list fades out, filter swaps, list fades in); WebGL planes follow through the `uOpacity` uniform ← `workListState.opacity`; the active button updates immediately; `ScrollTrigger.refresh()` runs after the swap | `sections/SelectedWork/SelectedWork.tsx`, `scenes/GalleryPlane.tsx`, `lib/sceneState.ts` | Flip with `absolute: true` flew the large WebGL images across the filter bar and stacked them on top of each other. |

How these were verified: `npm run build` passes. A headless Playwright/Chromium run (SwiftShader) clicked through every filter. Screenshots showed the correct projects and no page errors. **Not tested yet:** a real GPU, Safari or iOS, and Android.

## 5. Known issues and risks (prioritised)

### High

1. **The site is not a git repository.** There is no history and no way to roll back. Initialise git first.
2. **No pre-rendering, so SEO and social previews are weak.** All `<meta>` and OG tags are written on the client by `useSeo`. Crawlers and link previews (LinkedIn, WhatsApp, Slack) only see the German home page tags in `index.html`, for every URL including `/en/...` and every project page. The fix is to pre-render every route at build time, for example with react-router's prerender/SSG, `vite-plugin-ssg`, or a small Puppeteer prerender step. Each route then gets real HTML and meta tags.
3. **Placeholder content** is listed in §6. The site must not go live as it is.
4. **WebGL images ignore CSS** (see §3.2). Watch for:
   - The contact film camera (`ContactScene`, absolutely positioned on the right at `md+`) is drawn **above** the contact heading wherever they overlap, because the heading is below `z-20`.
   - During the project → page transition, the source plane keeps rendering with its shader zoom while the cloned DOM `<img>` expands, so the image can jump slightly.
   - Any future CSS effect on a project image (rounded corners, hover opacity, a clip-path reveal) will **not** appear unless it is also added in `GalleryPlane`.
5. **WebGL textures can double-download.** `GalleryPlane` always loads `image.src`, while `<picture>` may load the AVIF or WebP source. Once real photos replace the SVGs, every image is downloaded twice and the GPU gets the full-size file. The fix is to load the texture from the `<img>`'s `currentSrc` after it has loaded, or to pass a sized source.

### Medium

6. **`ResponsiveImage` has no `srcSet` on `<img>`.** The `sizes` attribute does nothing without `srcSet`, so phones download desktop-sized images. Add width variants (for example a build step with `vite-imagetools` or sharp) and generate `srcSet`.
7. **`img()` in `projects.ts` hard-codes width and height per format** (landscape is always 1600×1067, and so on). Real photos with other ratios get cropped (`object-cover`), and the shader's `uImageAspect` comes from the real texture, so the DOM and WebGL crops can differ. Read the real dimensions at build time instead.
8. **Bundle size.** The main chunk is about 609 KB (200 KB gzip) and the three/drei `View` chunk about 912 KB (242 KB gzip). Options:
   - Lazy-load `ProjectPage` and the GSAP plugins.
   - Check which drei exports pull in extra code: `Environment` brings HDR loaders, and `PerformanceMonitor` could be dropped.
   - Load both locales on demand.
9. **Font axis mismatch.** `.display` and `.heading-*` set `font-variation-settings: 'opsz' …`, but `index.css` imports Bricolage `standard.css` (wght + wdth only). The **opsz axis is never loaded**, so those settings do nothing. Either import `opsz.css` (or the full axis file), or remove the settings.
10. **Expertise list semantics.** The buttons use `aria-pressed` and change on `onPointerEnter`, which makes them behave like tabs. A proper tabs pattern (`role="tablist"`/`tab`/`tabpanel`, arrow keys) would be more accurate. The preview stage is `aria-hidden`, so screen-reader users get nothing from it.
11. **The custom cursor label can get stuck.** It updates only on `pointerover`. If the content under a stationary pointer changes (filter, route change), "Ansehen" can stay visible. Reset it on route or filter change.
12. **Heavy materials on mobile.** `MeshPhysicalMaterial` with clearcoat, sheen and **iridescence** (lens glass) is expensive on low-end phones. `sceneQuality.ts` only reduces geometry. Consider cheaper materials when `isLowPowerDevice()` is true.
13. **The README was partly outdated.** It mentions an `accent: 'coral'` project field that does not exist in the `Project` type. The rendering paragraph has been updated.

### Low

14. `<html lang>` is set in two places (`AppShell` and `useSeo`).
15. `NotFoundPage` inside `LanguageGuard` (for example `/fr`) works, but the fallback language comes from storage instead of the URL.
16. `Nav` runs `querySelectorAll('main [data-tone="dark"]')` on every scrolled frame. It is cheap, but an IntersectionObserver would be cleaner.
17. `THREE.Clock` deprecation warning in the console (R3F internal, not our code).
18. `siteUrl` is a placeholder (`https://luanacosta.ch`, marked TODO).

## 6. Content placeholders (must be done before launch)

| Item | Location | State |
| --- | --- | --- |
| All 5 projects | `data/projects.ts` + `projects.items` in both JSON files | **Fictional demos** with SVG placeholder art, labelled "Demo" on the site |
| Email | `data/profile.ts` | Empty, so the contact CTA falls back to LinkedIn |
| CV PDF | `data/profile.ts` → `cvUrl` | Empty (link hidden) |
| Portrait | `data/profile.ts` → `portrait` | Empty (monogram placeholder shown) |
| Biography | `about.bio` in both JSON files | Placeholder text, to be written by Luana |
| Disciplines | `data/expertise.ts` | Generic Mediamatiker:in fields; keep only the real ones |
| Domain | `config/site.ts` | Placeholder |
| OG image, favicon | `public/` | Static, not recoloured automatically |

## 7. Conventions and constraints (keep these)

- **All visitor-facing text goes in both `de.json` and `en.json`** with identical keys. Swiss German spelling: **no "ß"**, use "ss".
- **Demo content must stay labelled** (`demo: true` → `DemoBadge`). Never present it as real work.
- **Respect `prefers-reduced-motion`** everywhere. Use `useReducedMotion()` or `prefersReducedMotion()`, and give every animation a static path.
- **Privacy:** no third-party requests by default. Fonts are self-hosted, video embeds use `youtube-nocookie` and Vimeo `dnt=1`, and there is no analytics. Keep it that way, or add analytics only with consent and only with a privacy-friendly provider. Swiss nFADP applies.
- **Colours only through tokens** in `index.css`. 3D materials and GSAP read them through `themeColor()`. Keep text contrast at WCAG AA.
- **Never re-render React per frame.** Per-frame data goes through mutable objects in `lib/sceneState.ts` and is read in `useFrame`.
- **WebGL images:** any visual effect on a project image must also be added in `GalleryPlane` (see §3.2).
- **Do not reintroduce** GSAP Flip on the project list, per-frame storage writes, `mix-blend-mode` on large layers, or `background-color` scroll tweens on large sections.
- Keep the build green: `npm run build` (strict TS, no unused locals or parameters).

## 8. How to verify changes

- `npm run build`, then `npm run preview` (http://localhost:4173/de).
- A real browser with the DevTools Performance panel open, scrolling the full home page. Target: no long tasks over 50 ms while scrolling, and steady 60 fps on a mid-range laptop.
- Headless check that already works on this machine: Playwright from a sibling project, Chromium launched with `--use-angle=swiftshader --enable-unsafe-swiftshader`. Take screenshots before and after interactions, and toggle the `<canvas>` visibility to compare the WebGL layer with the DOM.
- Test with reduced motion turned on, with WebGL disabled (`chrome://flags` or a forced `hasWebGL() === false`), on a mobile viewport with touch, and in both languages.
- Lighthouse: performance, accessibility and SEO, on the home page and one project page.

## 9. Ideas for improvement

### Content and storytelling (highest value for a junior portfolio)

1. **Real case studies:** problem → process (sketches, iterations) → result. The `brief`/`challenge`/`process`/`outcome` fields already exist; add process images and short captions.
2. **"Currently" strip** near the hero, for example "Now: Sunrise trainee program · freelancing at VoiceSteps", generated from the `current` journey chapter.
3. **Downloadable CV** plus a one-page "at a glance" PDF. The data model already supports `cvUrl`.
4. **Testimonials or references** from apprenticeship stations (Sunrise teams), as a small quote slider.
5. **Skills and tools matrix:** the tools listed per project, aggregated into a "toolbox" with project counts.
6. **Photography gallery mode:** a full-screen lightbox with keyboard navigation and EXIF-style captions, for the photography category.

### Experience and interaction

7. **Project hover previews:** a short muted looping video, or a sequence of 3–4 frames, inside the WebGL plane (a video texture) for video projects.
8. **Interactive hero camera:** clicking or tapping the 3D photo camera "takes a picture", with a flash, a shutter sound only after user interaction, and a Polaroid-style card with a random project dropping out.
9. **Scroll-linked camera focus:** the hero lens focus ring drives a CSS blur (depth of field) on the hero background colour fields.
10. **Contact finale:** the film camera "projects" the visitor's selected project title onto the dark wall when "Action!" is triggered.
11. **Proper view transitions:** use the View Transitions API (with a fallback) for project → project navigation and the language switch.
12. **Filter count badges** on each category button, and the selected filter kept in the URL (`?category=photography`) so a link can share a filtered view.

### Technical and quality

13. **Pre-render all routes** (see issue 2), with per-route OG images generated at build time, for example from the project cover plus the title.
14. **Image pipeline:** sharp or `vite-imagetools` to generate AVIF/WebP plus width variants, a blur-up placeholder (LQIP), and real dimensions in `projects.ts`.
15. **CMS-lite:** move projects and translations into Markdown/MDX or JSON files per project, so Luana can add work without touching TypeScript (or use a headless CMS such as Decap or TinaCMS, which are git-based and free).
16. **Tooling:** git, ESLint (typescript-eslint, react-hooks, jsx-a11y), Prettier, a GitHub Action running build, Lighthouse CI and Playwright smoke tests (filter, transition, language switch, 404).
17. **Error monitoring** that respects privacy (self-hosted, or none), plus a "WebGL failed" fallback telemetry flag.
18. **Theme:** an optional "darkroom" dark mode using the existing tokens (`accent-deep` as the canvas). The tokens are already centralised.
19. **Accessibility pass:** the tabs pattern for Expertise, visible focus inside the WebGL-covered areas, a pause control for continuous motion (WCAG 2.2.2), and a check that the custom cursor never hides focus outlines.
20. **Performance budget:** lazy-load three only after first interaction or on idle on mobile (show the SVG fallback first), and keep the main JS under 150 KB gzip.
