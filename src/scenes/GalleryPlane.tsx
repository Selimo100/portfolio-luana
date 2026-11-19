import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera, View, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState, workListState } from '../lib/sceneState'

export interface PlaneInteraction {
  /** 0 | 1 target, damped in the shader uniforms */
  hover: number
  /** Pointer position in uv space (0 … 1, y up) */
  x: number
  y: number
}

interface Props {
  src: string
  interaction: PlaneInteraction
  reducedMotion: boolean
}

const vertexShader = /* glsl */ `
  uniform float uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    // A soft bend while scrolling — strongest in the middle of the image
    pos.y += sin(uv.x * 3.14159) * uVelocity * 0.022;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  uniform float uHover;
  uniform float uEnter;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uOpacity;
  varying vec2 vUv;

  // object-fit: cover in uv space
  vec2 cover(vec2 uv) {
    vec2 s = vec2(1.0);
    if (uPlaneAspect > uImageAspect) s.y = uImageAspect / uPlaneAspect;
    else s.x = uPlaneAspect / uImageAspect;
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 toMouse = vUv - uMouse;
    float d = length(toMouse * vec2(uPlaneAspect, 1.0));

    // Restrained: a slight zoom toward the pointer and a faint ripple around it
    float zoom = 1.0 - 0.045 * uHover - 0.1 * (1.0 - uEnter);
    vec2 uv = (vUv - 0.5) * zoom + 0.5 + (uMouse - 0.5) * 0.02 * uHover;
    float ripple = sin(d * 26.0 - uTime * 2.2) * smoothstep(0.42, 0.0, d) * 0.0045 * uHover;
    uv += normalize(toMouse + 1e-5) * ripple;

    vec2 cuv = cover(uv);
    float shift = 0.0018 * uHover * smoothstep(0.6, 0.0, d);
    vec4 color = texture2D(uTex, cuv);
    color.r = texture2D(uTex, cuv + vec2(shift, 0.0)).r;
    color.b = texture2D(uTex, cuv - vec2(shift, 0.0)).b;
    gl_FragColor = vec4(color.rgb, uOpacity);
    #include <colorspace_fragment>
  }
`

function ImagePlane({ src, interaction, reducedMotion }: Props) {
  const texture = useTexture(src, (t) => {
    const tex = Array.isArray(t) ? t[0] : t
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
  })
  const size = useThree((s) => s.size)
  const mesh = useRef<THREE.Mesh>(null)

  const material = useMemo(() => {
    const image = texture.image as { width: number; height: number }
    return new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: texture },
        uImageAspect: { value: image.width / image.height },
        uPlaneAspect: { value: 1 },
        uHover: { value: 0 },
        uEnter: { value: reducedMotion ? 1 : 0 },
        uTime: { value: 0 },
        uVelocity: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uOpacity: { value: 1 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      toneMapped: false,
    })
  }, [texture, reducedMotion])

  // Texture is cached by the loader and shared; the material is ours to free
  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const u = material.uniforms
    const dt = Math.min(delta, 1 / 20)
    const m = mesh.current
    if (m) m.scale.set(size.width, size.height, 1)
    u.uPlaneAspect.value = size.width / Math.max(size.height, 1)
    // WebGL ignores CSS opacity, so the list's filter fade is mirrored here
    u.uOpacity.value = workListState.opacity
    if (reducedMotion) return
    u.uTime.value = state.clock.elapsedTime
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, interaction.hover, 4, dt)
    u.uEnter.value = THREE.MathUtils.damp(u.uEnter.value, 1, 2.2, dt)
    const mouse = u.uMouse.value as THREE.Vector2
    mouse.x = THREE.MathUtils.damp(mouse.x, interaction.x, 6, dt)
    mouse.y = THREE.MathUtils.damp(mouse.y, interaction.y, 6, dt)
    const v = THREE.MathUtils.clamp(scrollState.velocity / 40, -1, 1)
    u.uVelocity.value = THREE.MathUtils.damp(u.uVelocity.value, v, 6, dt)
  })

  return (
    <mesh ref={mesh} material={material}>
      <planeGeometry args={[1, 1, 24, 24]} />
    </mesh>
  )
}

/** WebGL layer over a project image. The DOM <img> underneath stays as fallback. */
export default function GalleryPlane(props: Props) {
  return (
    <View className="absolute inset-0">
      <OrthographicCamera makeDefault position={[0, 0, 10]} near={0.1} far={100} />
      <Suspense fallback={null}>
        <ImagePlane {...props} />
      </Suspense>
    </View>
  )
}
