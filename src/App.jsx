import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import Model from './Model'
import Axes from './Axes'
import { useMVP } from './useMVP'
import { state, useSnapshot } from './state'

export default function App() {
  return (
    <Canvas camera={{ position: [7, 7, 7] }}>
      <Suspense fallback={null}>
        <OrbitControls autoRotate />
        <Axes />
        <gridHelper args={[10, 10, 0x555555, 0x111111]} />
        <Scene />
      </Suspense>
    </Canvas>
  )
}

/**
 * Put whatever you want in here, just designate the object and camera of interest
 */
function Scene() {
  const snap = useSnapshot(state)
  const { MVPScene, modelRef, cameraRef } = useMVP({ ...snap.transforms })
  return (
    <MVPScene>
      <ambientLight intensity={0.5} />
      <pointLight position={[1, 2, 3]} intensity={0.5} />
      <pointLight position={[1, 2, -3]} intensity={0.5} />
      <perspectiveCamera ref={cameraRef} far={10} near={1} position={[-2, 2, 3]} onUpdate={(c) => c.lookAt(2, 1, 0)} />
      <Model ref={modelRef} position={[2, 0, 0]} rotation={[0, -2, 0]} />
    </MVPScene>
  )
}
