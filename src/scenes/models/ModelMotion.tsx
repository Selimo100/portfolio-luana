import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer } from '../../lib/sceneState'

interface Props {
  children: ReactNode
  reducedMotion: boolean
  /** Resting orientation (radians) */
  baseX?: number
  baseY?: number
  /** How strongly the model turns toward the cursor */
  pointerInfluence?: number
  /** 0 → 1 entrance progress */
  introRef?: { current: number }
  /** Extra tilt added from outside, e.g. scroll */
  tiltRef?: { current: number }
}

/**
 * Turns a model toward the pointer with damping and clear limits, so the
 * lens appears to follow the visitor. Touch devices get a slow idle sway.
 */
export function ModelMotion({ children, reducedMotion, baseX = 0.15, baseY = -0.5, pointerInfluence = 1, introRef, tiltRef }: Props) {
  const group = useRef<THREE.Group>(null)
  const motion = useRef({ rx: 0, ry: 0, float: 0 })

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 1 / 20)
    const m = motion.current
    const t = state.clock.elapsedTime

    if (!reducedMotion) {
      const tx = pointer.active ? -pointer.y * 0.28 * pointerInfluence : Math.sin(t * 0.31) * 0.08
      const ty = pointer.active ? pointer.x * 0.55 * pointerInfluence : Math.sin(t * 0.23) * 0.22
      m.rx = THREE.MathUtils.damp(m.rx, tx, 3, dt)
      m.ry = THREE.MathUtils.damp(m.ry, ty, 3, dt)
      m.float = Math.sin(t * 0.8) * 0.06
    }

    const settle = 1 - (introRef ? introRef.current : 1)
    const tilt = tiltRef ? tiltRef.current : 0
    g.rotation.set(baseX + m.rx + tilt - settle * 0.4, baseY + m.ry - settle * 1.8, settle * 0.25)
    g.position.y = m.float
    g.scale.setScalar(0.75 + 0.25 * (introRef ? introRef.current : 1))
  })

  return <group ref={group}>{children}</group>
}
