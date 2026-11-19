import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { View } from '@react-three/drei'
import * as THREE from 'three'
import { CameraRig } from './CameraRig'
import { SceneLighting } from './SceneLighting'
import { ModelMotion } from './models/ModelMotion'
import { PhotoCamera } from './models/PhotoCamera'
import { useStudioMaterials } from './models/materials'
import { heroState } from '../lib/sceneState'

interface Props {
  reducedMotion: boolean
}

/** Positions the camera model responsively inside the hero and moves it on scroll. */
function HeroComposition({ reducedMotion }: Props) {
  const anchor = useRef<THREE.Group>(null)
  const intro = useRef(reducedMotion ? 1 : heroState.intro)
  // Scroll zooms the lens out and tips the camera toward the work below
  const zoom = useRef(0)
  const tilt = useRef(0)
  const materials = useStudioMaterials()
  const state = useRef({ x: 0, y: 0, s: 1, init: false })

  useFrame(({ size }, delta) => {
    const g = anchor.current
    if (!g) return
    intro.current = reducedMotion ? 1 : heroState.intro
    const p = reducedMotion ? 0 : heroState.progress
    zoom.current = p
    tilt.current = p * 0.55
    const aspect = size.width / Math.max(size.height, 1)
    // Visible half-height at the model plane (z = 0) for the base camera
    const halfH = Math.tan(THREE.MathUtils.degToRad(30) / 2) * 10
    const halfW = halfH * aspect

    // Landscape: slightly right of centre, between the two name lines.
    // Portrait: centred, sitting between "LUANA" and "COSTA."
    const landscape = aspect > 1.05
    const targetX = landscape ? halfW * 0.27 : 0
    const targetY = landscape ? halfH * 0.04 : halfH * 0.06
    const fit = landscape ? halfH * 0.5 : Math.min(halfW * 0.62, halfH * 0.42)
    const targetScale = fit / 2

    // Scroll: the camera drifts upward and to the side as the work section takes over
    const sx = targetX + p * halfW * (landscape ? 0.35 : 0.2)
    const sy = targetY + p * halfH * 0.55

    const st = state.current
    const dt = Math.min(delta, 1 / 20)
    if (!st.init) {
      Object.assign(st, { x: sx, y: sy, s: targetScale, init: true })
    }
    st.x = THREE.MathUtils.damp(st.x, sx, 5, dt)
    st.y = THREE.MathUtils.damp(st.y, sy, 5, dt)
    st.s = THREE.MathUtils.damp(st.s, targetScale, 5, dt)
    g.position.set(st.x, st.y, 0)
    g.scale.setScalar(st.s)
  })

  return (
    <group ref={anchor}>
      <ModelMotion reducedMotion={reducedMotion} introRef={intro} tiltRef={tilt}>
        <PhotoCamera m={materials} zoomRef={zoom} />
      </ModelMotion>
    </group>
  )
}

export default function HeroScene({ reducedMotion }: Props) {
  return (
    <View className="absolute inset-0">
      <CameraRig reducedMotion={reducedMotion} followScroll />
      <SceneLighting tone="light" />
      <HeroComposition reducedMotion={reducedMotion} />
    </View>
  )
}
