import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis } from '../lib/scroll'
import { scrollState } from '../lib/sceneState'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger and Lenis
 * share one clock. Disabled for reduced motion — native scrolling is used then.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      // Native scrolling still feeds a velocity value to the WebGL image planes
      let last = window.scrollY
      let timer = 0
      const onScroll = () => {
        scrollState.velocity = window.scrollY - last
        last = window.scrollY
        window.clearTimeout(timer)
        timer = window.setTimeout(() => (scrollState.velocity = 0), 80)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.clearTimeout(timer)
        scrollState.velocity = 0
      }
    }

    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, anchors: false })
    setLenis(lenis)
    const onScroll = () => {
      scrollState.velocity = lenis.velocity
      ScrollTrigger.update()
    }
    lenis.on('scroll', onScroll)
    const tick = (time: number) => lenis.raf(time * 1000)
    // Run first in each frame, so ScrollTrigger and the WebGL views see this frame's scroll position
    gsap.ticker.add(tick, false, true)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
      scrollState.velocity = 0
    }
  }, [enabled])
}
