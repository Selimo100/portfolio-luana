import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { heroState } from '../lib/sceneState'

interface Props {
  reducedMotion: boolean
  /** Base camera distance */
  distance?: number
  fov?: number
  /** Follow the hero scroll progress (hero → work transition) */
  followScroll?: boolean
}

const lookTarget = new THREE.Vector3()

/**
 * Cinematic perspective camera. On scroll it slowly dollies in, drops and
 * widens its field of view, so the camera model appears to drift past the viewer.
 * Values are damped every frame; the projection matrix is only updated when
 * the fov actually changes.
 */
export function CameraRig({ reducedMotion, distance = 10, fov = 30, followScroll = false }: Props) {
  const camera = useRef<THREE.PerspectiveCamera>(null)
  const current = useRef({ z: distance, y: 0, fov, look: 0 })

  useFrame((_, delta) => {
    const cam = camera.current
    if (!cam) return
    const p = followScroll && !reducedMotion ? heroState.progress : 0
    const c = current.current
    const dt = Math.min(delta, 1 / 20)

    c.z = THREE.MathUtils.damp(c.z, distance - p * 2.4, 4, dt)
    c.y = THREE.MathUtils.damp(c.y, -p * 1.3, 4, dt)
    c.look = THREE.MathUtils.damp(c.look, -p * 0.5, 4, dt)
    const nextFov = THREE.MathUtils.damp(c.fov, fov + p * 9, 4, dt)

    cam.position.set(0, c.y, c.z)
    cam.lookAt(lookTarget.set(0, c.look, 0))
    if (Math.abs(nextFov - cam.fov) > 1e-4) {
      c.fov = nextFov
      cam.fov = nextFov
      cam.updateProjectionMatrix()
    }
  })

  return <PerspectiveCamera ref={camera} makeDefault fov={fov} near={0.1} far={60} position={[0, 0, distance]} />
}
