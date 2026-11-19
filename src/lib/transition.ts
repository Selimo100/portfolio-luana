import gsap from 'gsap'

/**
 * Shared-element page transition: the clicked project image expands into the
 * hero of the project page. The overlay is a plain fixed <div>, independent of
 * React, so it survives the route change and is released by the next page.
 */
let overlay: HTMLDivElement | null = null

export function expandImageTransition(source: HTMLElement, onCovered: () => void) {
  releaseTransition(true)
  const rect = source.getBoundingClientRect()
  const img = source.querySelector('img')

  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  Object.assign(layer.style, { position: 'fixed', inset: '0', zIndex: '45', pointerEvents: 'none' })

  const backdrop = document.createElement('div')
  Object.assign(backdrop.style, { position: 'absolute', inset: '0', background: 'var(--color-accent-soft)', opacity: '0' })

  const frame = document.createElement('div')
  Object.assign(frame.style, {
    position: 'absolute',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    overflow: 'hidden',
  })
  if (img) {
    const clone = document.createElement('img')
    clone.src = img.currentSrc || img.src
    clone.alt = ''
    Object.assign(clone.style, { width: '100%', height: '100%', objectFit: 'cover' })
    frame.appendChild(clone)
  }
  layer.append(backdrop, frame)
  document.body.appendChild(layer)
  overlay = layer

  const heroHeight = getComputedStyle(document.documentElement).getPropertyValue('--project-hero-h').trim() || '78svh'

  gsap
    .timeline({ onComplete: onCovered })
    .to(backdrop, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
    .to(frame, { top: 0, left: 0, width: '100%', height: heroHeight, duration: 0.9, ease: 'expo.inOut' }, 0)
}

/** Called by the project page once its hero image is ready. */
export function releaseTransition(immediate = false) {
  const layer = overlay
  if (!layer) return
  overlay = null
  if (immediate) {
    layer.remove()
    return
  }
  gsap.to(layer, { opacity: 0, duration: 0.6, delay: 0.1, ease: 'power2.out', onComplete: () => layer.remove() })
}
