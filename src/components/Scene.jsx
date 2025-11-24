import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { Character } from './Character'
import { RoomBackground } from './RoomBackground'
import { InteractiveObjects } from './InteractiveObjects'
import { Suspense, useRef, useEffect } from 'react'
import { useStore } from '../store'

function SceneContent() {
  const { cameraRotation } = useStore()
  const controlsRef = useRef()

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(cameraRotation)
    }
  }, [cameraRotation])

  return (
    <>
      <PerspectiveCamera makeDefault position={[6, 5, 6]} fov={50} />
      <OrbitControls
        ref={controlsRef}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={1.0}
        maxPolarAngle={1.0}
        enableRotate={false} // Disable mouse rotation
        enableZoom={true}
      />
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />

      <RoomBackground />
      <Character />
      <InteractiveObjects />
    </>
  )
}

export function Scene() {
  return (
    <div className="w-full h-full relative">
      <Canvas shadows onCreated={() => console.log('Canvas created')}>
        <Suspense fallback={<mesh><boxGeometry /><meshBasicMaterial color='red' /></mesh>}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
