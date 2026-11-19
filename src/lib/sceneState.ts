/**
 * Mutable state shared between the DOM and the WebGL scenes.
 * Deliberately not React state: it is written by event listeners / GSAP
 * and read inside `useFrame`, so nothing re-renders on every frame.
 */
export const pointer = {
  /** Normalised viewport position, -1 … 1 */
  x: 0,
  y: 0,
  /** true once a precise pointer (mouse / pen) has moved */
  active: false,
}

export const scrollState = {
  /** Smoothed scroll velocity in px/frame (from Lenis or native scroll) */
  velocity: 0,
}

export const heroState = {
  /** 0 = hero fully visible, 1 = scrolled past */
  progress: 0,
  /** 0 → 1 during the intro sequence */
  intro: 0,
}

export const workListState = {
  /** Opacity of the project list while the filter cross-fades; the WebGL image planes follow it */
  opacity: 1,
}

export const cameraState = {
  /** 1 while the film camera is "rolling" (secret interaction), else 0 */
  action: 0,
}

/** Counts mounted WebGL views so the render loop can sleep when none are on screen. */
type Listener = (count: number) => void
let activeViews = 0
const listeners = new Set<Listener>()

export const viewRegistry = {
  add() {
    activeViews += 1
    listeners.forEach((l) => l(activeViews))
  },
  remove() {
    activeViews = Math.max(0, activeViews - 1)
    listeners.forEach((l) => l(activeViews))
  },
  subscribe(listener: Listener) {
    listeners.add(listener)
    listener(activeViews)
    return () => {
      listeners.delete(listener)
    }
  },
}
