let cached: boolean | null = null

/** Feature-detects WebGL once. The site works fully without it. */
export function hasWebGL(): boolean {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    cached = !!gl
    // Free the probe context immediately
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}

/** Rough device tier used to scale geometry detail and pixel ratio. */
export function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const lowMemory = nav.deviceMemory !== undefined && nav.deviceMemory <= 4
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4
  return coarse || lowMemory || fewCores
}
