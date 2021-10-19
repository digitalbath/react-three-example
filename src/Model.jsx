import { useGLTF } from '@react-three/drei'
import { forwardRef } from 'react'

export default forwardRef((props, ref) => {
  const { scene } = useGLTF('https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/dogue/model.gltf')
  return <primitive ref={ref} object={scene} {...props} />
})
