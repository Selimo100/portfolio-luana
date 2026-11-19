import { useMemo } from 'react'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { themeColor } from '../lib/theme'

interface Props {
  /** 'light' for the off-white hero, 'dark' for the contact finale */
  tone?: 'light' | 'dark'
}

/**
 * Studio lighting built from procedural light-formers — no HDR download.
 * Large soft panels give the camera bodies and lens glass long, controlled reflections.
 */
export function SceneLighting({ tone = 'light' }: Props) {
  const dark = tone === 'dark'
  // Fill lights and the reflected "room" take their tint from the palette
  const c = useMemo(() => {
    const white = new THREE.Color('#ffffff')
    return {
      fill: themeColor(dark ? 'accent-mist' : 'accent-soft'),
      strip: themeColor('accent-soft'),
      room: dark
        ? '#' + new THREE.Color(themeColor('accent-deep')).lerp(white, 0.18).getHexString()
        : '#' + new THREE.Color(themeColor('canvas')).multiplyScalar(0.95).getHexString(),
    }
  }, [dark])
  return (
    <>
      <ambientLight intensity={dark ? 0.5 : 0.45} />
      <directionalLight position={[3.5, 4, 5]} intensity={dark ? 2 : 1.6} color="#fff6ee" />
      <directionalLight position={[-4, -2, -3]} intensity={dark ? 0.9 : 0.5} color={c.fill} />
      <Environment resolution={128} frames={1}>
        {/* Warm key panel */}
        <Lightformer form="rect" intensity={dark ? 2.2 : 2.8} color="#fff4ea" position={[0, 5, -6]} scale={[12, 4, 1]} />
        {/* Long side strips create the satin highlights along the edges */}
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[-6, 1, 1]} rotation-y={Math.PI / 2} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.2} color={c.strip} position={[6, -1, 0]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
        {/* Soft tinted fill from below */}
        <Lightformer form="circle" intensity={dark ? 1.4 : 0.9} color={c.fill} position={[0, -6, 2]} rotation-x={-Math.PI / 2} scale={6} />
        {/* Background tone of the reflected room */}
        <mesh scale={30}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial color={c.room} side={1} />
        </mesh>
      </Environment>
    </>
  )
}
