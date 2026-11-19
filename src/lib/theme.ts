/**
 * Reads the colour tokens from src/styles/index.css at runtime, so WebGL
 * materials and GSAP tweens use exactly the same palette as the CSS.
 * Derived tokens (color-mix) are resolved by the browser and returned as hex.
 */
export type ColorToken =
  | 'canvas'
  | 'ink'
  | 'accent'
  | 'accent-deep'
  | 'accent-soft'
  | 'accent-mist'
  | 'muted'
  | 'mist'
  | 'white'

const cache = new Map<ColorToken, string>()
let probe: HTMLSpanElement | null = null
let ctx: CanvasRenderingContext2D | null = null

export function themeColor(token: ColorToken): string {
  const cached = cache.get(token)
  if (cached) return cached

  if (!probe) {
    probe = document.createElement('span')
    probe.style.display = 'none'
    document.body.appendChild(probe)
    ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  }
  probe.style.color = `var(--color-${token})`
  const computed = getComputedStyle(probe).color

  // Normalise any CSS colour syntax (rgb(), color(srgb …)) to hex via a 1px canvas
  let hex = '#000000'
  if (ctx) {
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = computed
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
  }
  cache.set(token, hex)
  return hex
}
