import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { themeColor } from '../../lib/theme'

/** Fine noise used as bump map — gives the grips a leatherette grain. */
function createGrainTexture(size = 128) {
  const data = new Uint8Array(size * size * 4)
  for (let i = 0; i < size * size; i++) {
    const v = 110 + Math.random() * 145
    data.set([v, v, v, 255], i * 4)
  }
  const texture = new THREE.DataTexture(data, size, size)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(5, 5)
  texture.needsUpdate = true
  return texture
}

/**
 * The studio palette translated into materials. Colours come from the CSS
 * tokens (src/styles/index.css), so changing the palette recolours the cameras.
 */
export function useStudioMaterials() {
  const materials = useMemo(() => {
    const grain = createGrainTexture()
    const white = new THREE.Color('#ffffff')
    const ink = new THREE.Color(themeColor('ink'))
    // Pure black reads flat in 3D — lift the dark parts slightly toward the canvas tone
    const lifted = (amount: number) => ink.clone().lerp(new THREE.Color(themeColor('canvas')), amount)
    const satin = (color: THREE.ColorRepresentation, extra: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, clearcoat: 0.45, clearcoatRoughness: 0.3, ...extra })

    return {
      grain,
      /** Main body colour (photo camera) */
      primary: satin(themeColor('accent'), { roughness: 0.36, clearcoat: 0.7, clearcoatRoughness: 0.2 }),
      /** Light body colour (film camera) */
      light: satin(themeColor('white'), { sheen: 0.3, sheenColor: white, roughness: 0.38 }),
      /** Satin cream metal for top plates and mounts */
      cream: satin(themeColor('canvas'), { metalness: 0.35, roughness: 0.3 }),
      soft: satin(themeColor('accent-soft')),
      accent: satin(themeColor('accent'), { roughness: 0.32, clearcoat: 0.8 }),
      deep: satin(themeColor('accent-deep'), { roughness: 0.35, clearcoat: 0.7 }),
      metal: satin(lifted(0.08), { metalness: 0.55, roughness: 0.32, clearcoat: 0.6 }),
      leather: new THREE.MeshPhysicalMaterial({ color: lifted(0.035), roughness: 0.78, bumpMap: grain, bumpScale: 1.2 }),
      matte: new THREE.MeshStandardMaterial({ color: lifted(0.03), roughness: 0.9, side: THREE.DoubleSide }),
      glass: new THREE.MeshPhysicalMaterial({
        color: lifted(0.02),
        roughness: 0.04,
        metalness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        iridescence: 1,
        iridescenceIOR: 1.6,
        iridescenceThicknessRange: [200, 900],
        envMapIntensity: 1.6,
      }),
      tally: new THREE.MeshStandardMaterial({ color: themeColor('accent'), emissive: themeColor('accent'), emissiveIntensity: 0.3 }),
    }
  }, [])

  // Free GPU resources when the scene unmounts
  useEffect(
    () => () => {
      Object.values(materials).forEach((resource) => resource.dispose())
    },
    [materials],
  )

  return materials
}

export type StudioMaterials = ReturnType<typeof useStudioMaterials>
