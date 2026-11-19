import { isLowPowerDevice } from '../lib/webgl'

const low = isLowPowerDevice()

/** Geometry detail per device class — phones get lighter camera models. */
export const modelDetail = {
  /** Radial segments of lenses, dials and reels */
  segments: low ? 28 : 56,
  /** Corner smoothness of rounded bodies */
  smoothness: low ? 2 : 4,
}
