import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { StudioMaterials } from './materials'
import { modelDetail } from '../sceneQuality'

const HALF_PI = Math.PI / 2

interface Props {
  m: StudioMaterials
  /** 0 → 1: extends the lens barrel (driven by scroll) */
  zoomRef: { current: number }
}

/**
 * A stylised mirrorless photo camera, modelled from primitives.
 * Local axes: lens points to +z, top plate to +y.
 */
export function PhotoCamera({ m, zoomRef }: Props) {
  const lensFront = useRef<THREE.Group>(null)
  const focusRing = useRef<THREE.Mesh>(null)
  const zoom = useRef(0)
  const seg = modelDetail.segments
  const smooth = modelDetail.smoothness

  useFrame((_, delta) => {
    zoom.current = THREE.MathUtils.damp(zoom.current, zoomRef.current, 5, Math.min(delta, 1 / 20))
    if (lensFront.current) lensFront.current.position.y = zoom.current * 0.6
    if (focusRing.current) focusRing.current.rotation.y = zoom.current * 2.6
  })

  return (
    <group position={[0, -0.2, -0.3]}>
      {/* Body, leatherette band and satin top plate */}
      <RoundedBox args={[3, 1.85, 1]} radius={0.2} smoothness={smooth} material={m.primary} />
      <RoundedBox args={[3.03, 0.95, 1.03]} radius={0.08} smoothness={smooth} position={[0, -0.25, 0]} material={m.leather} />
      <RoundedBox args={[3.03, 0.42, 1.03]} radius={0.14} smoothness={smooth} position={[0, 0.74, 0]} material={m.cream} />

      {/* Viewfinder hump, window, hot shoe and eyepiece */}
      <RoundedBox args={[1.15, 0.62, 0.9]} radius={0.16} smoothness={smooth} position={[0.2, 1.08, -0.04]} material={m.cream} />
      <mesh position={[0.2, 1.15, 0.42]} material={m.glass}>
        <boxGeometry args={[0.5, 0.18, 0.02]} />
      </mesh>
      <mesh position={[0.2, 1.41, -0.04]} material={m.metal}>
        <boxGeometry args={[0.5, 0.05, 0.36]} />
      </mesh>
      <RoundedBox args={[0.62, 0.42, 0.22]} radius={0.1} smoothness={smooth} position={[0.2, 1.05, -0.55]} material={m.leather} />

      {/* Grip */}
      <RoundedBox args={[0.72, 1.6, 0.42]} radius={0.2} smoothness={smooth} position={[-1.1, -0.1, 0.62]} material={m.leather} />

      {/* Shutter button with collar */}
      <mesh position={[-1.1, 1.0, 0.25]} material={m.deep}>
        <cylinderGeometry args={[0.15, 0.15, 0.12, seg]} />
      </mesh>
      <mesh position={[-1.1, 0.96, 0.25]} rotation-x={HALF_PI} material={m.soft}>
        <torusGeometry args={[0.2, 0.045, 12, seg]} />
      </mesh>

      {/* Mode dials */}
      <mesh position={[1.05, 0.98, -0.05]} material={m.metal}>
        <cylinderGeometry args={[0.33, 0.33, 0.08, seg]} />
      </mesh>
      <mesh position={[1.05, 1.05, -0.05]} material={m.soft}>
        <cylinderGeometry args={[0.3, 0.3, 0.12, seg]} />
      </mesh>
      <mesh position={[-0.55, 1.02, -0.1]} material={m.metal}>
        <cylinderGeometry args={[0.24, 0.24, 0.14, seg]} />
      </mesh>

      {/* Strap lugs */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.56, 0.62, 0]} rotation-y={HALF_PI} material={m.metal}>
          <torusGeometry args={[0.09, 0.03, 8, 16]} />
        </mesh>
      ))}

      {/* Rear screen and AF-assist light */}
      <RoundedBox args={[1.8, 1.05, 0.05]} radius={0.02} smoothness={2} position={[0.35, -0.15, -0.52]} material={m.glass} />
      <mesh position={[1.18, 0.5, 0.52]} material={m.tally}>
        <sphereGeometry args={[0.05, 16, 12]} />
      </mesh>

      {/* Lens — built along local +y, rotated to point forward */}
      <group position={[0.2, -0.12, 0.5]} rotation-x={HALF_PI}>
        <mesh position-y={0.07} material={m.cream}>
          <cylinderGeometry args={[0.84, 0.84, 0.14, seg]} />
        </mesh>
        <mesh position-y={0.55} material={m.metal}>
          <cylinderGeometry args={[0.74, 0.78, 0.9, seg]} />
        </mesh>
        <mesh ref={focusRing} position-y={0.6} material={m.leather}>
          <cylinderGeometry args={[0.8, 0.8, 0.32, seg]} />
        </mesh>
        <group ref={lensFront}>
          <mesh position-y={1.15} material={m.metal}>
            <cylinderGeometry args={[0.7, 0.72, 0.6, seg]} />
          </mesh>
          <mesh position-y={1.44} material={m.matte}>
            <cylinderGeometry args={[0.6, 0.6, 0.02, seg]} />
          </mesh>
          <mesh position-y={1.46} rotation-x={HALF_PI} material={m.accent}>
            <torusGeometry args={[0.66, 0.035, 12, seg]} />
          </mesh>
          {/* Domed front element: a spherical cap with coated glass */}
          <mesh position-y={0.773} material={m.glass}>
            <sphereGeometry args={[0.9, seg, 16, 0, Math.PI * 2, 0, 0.72]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
