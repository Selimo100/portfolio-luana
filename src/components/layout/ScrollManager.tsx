import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToTarget } from '../../lib/scroll'

const STORAGE_KEY = 'lc-scroll-positions'

function readPositions(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

/**
 * Scroll behaviour across routes:
 * - new page → top, hash link → section, back/forward → previous position,
 * - language switch (state.preserveScroll) → stays where it is.
 */
export function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const positions = useRef<Record<string, number>>(readPositions())
  const previousPath = useRef<string | null>(null)

  useEffect(() => {
    history.scrollRestoration = 'manual'
  }, [])

  // Remember the scroll position of the current history entry
  // (kept in memory on scroll; written to sessionStorage only once scrolling pauses —
  // a synchronous storage write on every frame causes visible stutter)
  useEffect(() => {
    let timer = 0
    const persist = () => {
      window.clearTimeout(timer)
      timer = 0
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions.current))
      } catch {
        /* ignore */
      }
    }
    const onScroll = () => {
      positions.current[location.key] = window.scrollY
      window.clearTimeout(timer)
      timer = window.setTimeout(persist, 250)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', persist)
    return () => {
      if (timer) persist()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', persist)
    }
  }, [location.key])

  useLayoutEffect(() => {
    const state = location.state as { preserveScroll?: boolean } | null
    const samePage = previousPath.current === location.pathname
    previousPath.current = location.pathname
    if (state?.preserveScroll) return

    const saved = positions.current[location.key]
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (navigationType === 'POP' && saved !== undefined) {
        scrollToTarget(saved, { immediate: true })
        return
      }
      if (location.hash) {
        const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
        if (el) {
          scrollToTarget(el, { immediate: !samePage })
          // Move focus for keyboard and screen-reader users
          const heading = el.querySelector<HTMLElement>('h2')
          if (heading) {
            heading.setAttribute('tabindex', '-1')
            heading.focus({ preventScroll: true })
          }
          return
        }
      }
      scrollToTarget(0, { immediate: true })
    })
    return () => cancelAnimationFrame(raf)
  }, [location.key])

  return null
}
