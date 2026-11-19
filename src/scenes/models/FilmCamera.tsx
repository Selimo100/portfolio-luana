import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { StudioMaterials } from './materials'
import { modelDetail } from '../sceneQuality'
import { cameraState } from '../../lib/sceneState'

const HALF_PI = Math.PI / 2

/** One film reel: an accent-coloured disc with punched "holes" and a cream hub. Axis along x. */
function Reel({ m, position, reelRef }: { m: StudioMaterials; position: [number, number, number]; reelRef: (g: THREE.Group | null) => void }) {
  const seg = modelDetail.segments
  return (
    <group position={position} ref={reelRef}>
      <mesh rotation-z={HALF_PI} material={m.accent}>
        <cylinderGeometry args={[0.85, 0.85, 0.16, seg]} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[0, Math.cos(a) * 0.5, Math.sin(a) * 0.5]} rotation-z={HALF_PI} material={m.matte}>
            <cylinderGeometry args={[0.17, 0.17, 0.17, 20]} />
          </mesh>
        )
      })}
      <mesh rotation-z={HALF_PI} material={m.cream}>
        <cylinderGeometry args={[0.14, 0.14, 0.3, 20]} />
      </mesh>
    </group>
  )
}

interface Props {
  m: StudioMaterials
  reducedMotion: boolean
}

/**
 * A vintage film camera with two reels — the motion counterpart to the photo camera.
 * Reels turn slowly; "Action!" (the footer monogram) makes them roll fast and lights the tally.
 */
export function FilmCamera({ m, reducedMotion }: Props) {
  const reels = useRef<(THREE.Group | null)[]>([])
  const action = useRef(0)
  const seg = modelDetail.segments
  const smooth = modelDetail.smoothness

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20)
    action.current = THREE.MathUtils.damp(action.current, cameraState.action, 3, dt)
    if (!reducedMotion) {
      const speed = 0.7 + action.current * 7
      for (const reel of reels.current) if (reel) reel.rotation.x -= dt * speed
    }
    const blink = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 8)
    m.tally.emissiveIntensity = 0.25 + action.current * (reducedMotion ? 2 : 1.2 + blink * 2)
  })

  return (
    <group position={[0, -0.75, -0.35]}>
      {/* Body with leatherette side panels and base plate */}
      <RoundedBox args={[1.5, 1.7, 2.4]} radius={0.18} smoothness={smooth} material={m.light} />
      <RoundedBox args={[1.54, 1.1, 1.9]} radius={0.08} smoothness={smooth} position-y={-0.1} material={m.leather} />
      <mesh position-y={-0.92} material={m.metal}>
        <boxGeometry args={[1.2, 0.12, 1.8]} />
      </mesh>

      {/* Reels on arms */}
      {[
        [0, 1.9, -0.6],
        [0, 1.75, 0.8],
      ].map((pos, i) => (
        <group key={i}>
          <mesh position={[0, 1.1, pos[2]]} material={m.metal}>
            <boxGeometry args={[0.12, pos[1] - 1, 0.12]} />
          </mesh>
          <Reel m={m} position={pos as [number, number, number]} reelRef={(g) => (reels.current[i] = g)} />
        </group>
      ))}

      {/* Side crank */}
      <mesh position={[0.8, -0.1, -0.2]} rotation-z={HALF_PI} material={m.cream}>
        <cylinderGeometry args={[0.32, 0.32, 0.08, seg]} />
      </mesh>
      <mesh position={[0.88, -0.32, -0.2]} material={m.accent}>
        <boxGeometry args={[0.08, 0.45, 0.1]} />
      </mesh>

      {/* Viewfinder at the back */}
      <mesh position={[-0.45, 0.45, -1.45]} rotation-x={HALF_PI} material={m.metal}>
        <cylinderGeometry args={[0.16, 0.18, 0.6, seg]} />
      </mesh>
      <mesh position={[-0.45, 0.45, -1.78]} rotation-x={HALF_PI} material={m.leather}>
        <cylinderGeometry args={[0.22, 0.2, 0.14, seg]} />
      </mesh>

      {/* Tally light */}
      <mesh position={[0.45, 0.62, 1.21]} material={m.tally}>
        <sphereGeometry args={[0.08, 16, 12]} />
      </mesh>

      {/* Lens with focus ring, glass and matte box */}
      <group position={[0, -0.05, 1.2]} rotation-x={HALF_PI}>
        <mesh position-y={0.45} material={m.metal}>
          <cylinderGeometry args={[0.5, 0.55, 0.9, seg]} />
        </mesh>
        <mesh position-y={0.5} material={m.leather}>
          <cylinderGeometry args={[0.57, 0.57, 0.26, seg]} />
        </mesh>
        <mesh position-y={0.45} material={m.glass}>
          <sphereGeometry args={[0.6, seg, 12, 0, Math.PI * 2, 0, 0.75]} />
        </mesh>
        <mesh position-y={1.22} rotation-y={Math.PI / 4} material={m.matte}>
          <cylinderGeometry args={[0.98, 0.62, 0.62, 4, 1, true]} />
        </mesh>
      </group>
    </group>
  )
}
