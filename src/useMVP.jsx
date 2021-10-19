import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useHelper } from '@react-three/drei'
import { useSpring } from '@react-spring/three'
import * as THREE from 'three'

// Scratch variables
const identity = new THREE.Matrix4()
const mat4 = new THREE.Matrix4()
const flat = new THREE.Matrix4().makeScale(2.5, 2.5, -0.01).setPosition(2.5, 2.5, 0)

export function useMVP({ model, view, projection, screen }) {
  const modelRef = useRef()
  const cameraRef = useRef()
  const sceneRef = useRef()

  // Visualize camera frustum and view plane
  useHelper(cameraRef, THREE.CameraHelper)

  // Matrices to apply
  const { modelMatrix, modelMatrixInverse, viewMatrix, projectionMatrix } = useMemo(() => {
    const modelMatrix = new THREE.Matrix4()
    const modelMatrixInverse = new THREE.Matrix4()
    const viewMatrix = new THREE.Matrix4()
    const projectionMatrix = new THREE.Matrix4()
    return { modelMatrix, modelMatrixInverse, viewMatrix, projectionMatrix }
  }, [])

  useLayoutEffect(() => {
    // Reset scene transforms so we can capture the original matrices
    sceneRef.current.matrix.identity()

    // Make sure matrices are up to date
    sceneRef.current.updateMatrixWorld()
    cameraRef.current.updateProjectionMatrix()

    // Save matrices
    modelMatrix.copy(modelRef.current.matrixWorld)
    modelMatrixInverse.copy(modelMatrix).invert()
    viewMatrix.copy(cameraRef.current.matrixWorldInverse)
    projectionMatrix.copy(cameraRef.current.projectionMatrix)
  }, [])

  const spring = useSpring({
    model: Number(model),
    view: Number(view),
    projection: Number(projection),
    screen: Number(screen),
  })

  useFrame(() => {
    sceneRef.current.matrix.copy(modelMatrixInverse)

    lerpMatrix(identity, modelMatrix, spring.model.get(), mat4)
    sceneRef.current.matrix.premultiply(mat4)

    lerpMatrix(identity, viewMatrix, spring.view.get(), mat4)
    sceneRef.current.matrix.premultiply(mat4)

    lerpMatrix(identity, projectionMatrix, spring.projection.get(), mat4)
    sceneRef.current.matrix.premultiply(mat4)

    lerpMatrix(identity, flat, spring.screen.get(), mat4)
    sceneRef.current.matrix.premultiply(mat4)
  })

  const MVPScene = ({ children }) => <group matrixAutoUpdate={false} ref={sceneRef} children={children} />
  return { MVPScene, modelRef, cameraRef }
}

function lerpMatrix(a, b, t, out) {
  for (let i = 0; i < out.elements.length; ++i) {
    out.elements[i] = THREE.MathUtils.lerp(a.elements[i], b.elements[i], t)
  }
}
