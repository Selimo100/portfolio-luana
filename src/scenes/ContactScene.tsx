import { View } from '@react-three/drei'
import { CameraRig } from './CameraRig'
import { SceneLighting } from './SceneLighting'
import { ModelMotion } from './models/ModelMotion'
import { FilmCamera } from './models/FilmCamera'
import { useStudioMaterials } from './models/materials'

interface Props {
  reducedMotion: boolean
}

function FilmCameraModel({ reducedMotion }: Props) {
  const materials = useStudioMaterials()
  return (
    <group scale={0.95}>
      <ModelMotion reducedMotion={reducedMotion} baseX={0.12} baseY={-0.95} pointerInfluence={0.6}>
        <FilmCamera m={materials} reducedMotion={reducedMotion} />
      </ModelMotion>
    </group>
  )
}

/** The finale: a film camera, ready to roll on the dark background. */
export default function ContactScene({ reducedMotion }: Props) {
  return (
    <View className="absolute inset-0">
      <CameraRig reducedMotion={reducedMotion} distance={10} fov={28} />
      <SceneLighting tone="dark" />
      <FilmCameraModel reducedMotion={reducedMotion} />
    </View>
  )
}
