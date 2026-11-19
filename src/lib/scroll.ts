import type Lenis from 'lenis'

let lenis: Lenis | null = null

export const setLenis = (instance: Lenis | null) => {
  lenis = instance
}

export const getLenis = () => lenis

/** Scrolls to an element or position, smoothly when Lenis is active. */
export function scrollToTarget(target: HTMLElement | number, options: { immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate: options.immediate, offset: 0, duration: 1.4 })
    return
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: options.immediate ? 'instant' : 'smooth' })
}
