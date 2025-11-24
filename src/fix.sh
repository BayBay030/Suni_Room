#!/bin/bash

# 1. 修復 store.js
echo "正在修復 store.js..."
echo "import { create } from 'zustand'

export const WAYPOINTS = {
  RUG: [0, -1, 0],
  DESK: [0, -1, -2],
  DJ: [0, -1, 2],
  WINDOW: [3, -1, 0]
}

export const useStore = create((set) => ({
  characterState: 'IDLE',
  targetPosition: WAYPOINTS.RUG,
  dialogue: null,
  iframeUrl: null,
  
  setCharacterState: (state) => set({ characterState: state }),
  setTargetPosition: (pos) => set({ targetPosition: pos }),
  setDialogue: (text) => set({ dialogue: text }),
  setIframeUrl: (url) => set({ iframeUrl: url }),
  
  triggerRandomDialogue: () => {
    const dialogues = [
      'This rug is so soft...',
      'I should work on my painting.',
      'Is that a bird?',
      'Time to mix some beats!',
      'Zzz...'
    ]
    const text = dialogues[Math.floor(Math.random() * dialogues.length)]
    set({ dialogue: text })
    setTimeout(() => set({ dialogue: null }), 3000)
  },
  
  pickRandomWaypoint: () => {
    const keys = Object.keys(WAYPOINTS)
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    return WAYPOINTS[randomKey]
  }
}))" > src/store.js

# 2. 修復 Character.jsx
echo "正在修復 Character.jsx..."
echo "import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { useStore, WAYPOINTS } from '../store'
import * as THREE from 'three'

export function Character() {
  const ref = useRef()
  const { characterState, targetPosition, setCharacterState, setTargetPosition, pickRandomWaypoint, triggerRandomDialogue } = useStore()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  const bind = useDrag(({ active, movement: [mx, my], offset: [ox, oy], timeStamp }) => {
    if (active) {
      setCharacterState('DRAGGED')
      const x = (ox / aspect) 
      const y = -(oy / aspect) 
      if (ref.current) {
        ref.current.userData.dragPos = { x: mx / aspect, y: -my / aspect }
      }
    } else {
      setCharacterState('IDLE')
      if (ref.current) {
        const dropPos = ref.current.position.clone()
        dropPos.y = -1
        setTargetPosition([dropPos.x, -1, dropPos.z])
      }
    }
  }, { pointerEvents: true })

  useEffect(() => {
    const interval = setInterval(() => {
      if (characterState === 'IDLE' || characterState === 'MEDITATING' || characterState === 'WORKING' || characterState === 'DJING') {
        if (Math.random() > 0.5) {
          const nextPos = pickRandomWaypoint()
          setTargetPosition(nextPos)
          setCharacterState('WALKING')
        }
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [characterState, pickRandomWaypoint, setCharacterState, setTargetPosition])

  useFrame((state, delta) => {
    if (!ref.current) return

    if (characterState === 'DRAGGED') {
       const vec = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5)
       vec.unproject(state.camera)
       const dir = vec.sub(state.camera.position).normalize()
       const pos = state.camera.position.clone().add(dir.multiplyScalar(10))
       ref.current.position.lerp(pos, 0.2)
       const time = state.clock.elapsedTime
       ref.current.rotation.z = Math.sin(time * 10) * 0.2
       ref.current.rotation.x = Math.sin(time * 8) * 0.1
    } else if (characterState === 'WALKING') {
      const currentPos = ref.current.position
      const target = new THREE.Vector3(...targetPosition)
      const direction = target.clone().sub(currentPos)
      direction.y = 0
      const distance = direction.length()
      if (distance > 0.1) {
        direction.normalize()
        ref.current.position.add(direction.multiplyScalar(delta * 2))
        ref.current.lookAt(target.x, currentPos.y, target.z)
        ref.current.position.y = -1 + Math.sin(state.clock.elapsedTime * 10) * 0.1
      } else {
        ref.current.position.set(targetPosition[0], -1, targetPosition[2])
        if (targetPosition === WAYPOINTS.RUG) setCharacterState('MEDITATING')
        else if (targetPosition === WAYPOINTS.DESK) setCharacterState('WORKING')
        else if (targetPosition === WAYPOINTS.DJ) setCharacterState('DJING')
        else setCharacterState('IDLE')
      }
    } else {
        ref.current.rotation.y += delta * 0.5
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, 0.1)
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, 0.1)
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, -1, 0.1)
    }
  })

  return (
    <mesh ref={ref} position={[0, -1, 0]} onClick={triggerRandomDialogue} {...bind()} castShadow>
      <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
      <meshStandardMaterial color={characterState === 'WALKING' ? 'hotpink' : characterState === 'DRAGGED' ? 'cyan' : 'orange'} />
    </mesh>
  )
}" > src/components/Character.jsx

# 3. 修復 RoomBackground.jsx
echo "正在修復 RoomBackground.jsx..."
echo "import { useTexture } from '@react-three/drei'

export function RoomBackground() {
  const texture = useTexture('/background.png')
  return (
    <mesh position={[0, 0, -5]} scale={[16, 9, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}" > src/components/RoomBackground.jsx

# 4. 修復 InteractiveObjects.jsx
echo "正在修復 InteractiveObjects.jsx..."
echo "import { useStore, WAYPOINTS } from '../store'

export function InteractiveObjects() {
  const { setIframeUrl, setDialogue } = useStore()

  const handleDJClick = () => {
    window.open('https://open.spotify.com/playlist/37i9dQZF1DX5trt9i14X7j', '_blank')
    setDialogue('Let\'s jam! 🎵')
    setTimeout(() => setDialogue(null), 3000)
  }

  const handleBirdClick = () => {
    setIframeUrl('https://flappy-bird.io/')
    setDialogue('Chirp chirp! 🐦')
    setTimeout(() => setDialogue(null), 3000)
  }
  
  const handleBellClick = () => {
    setDialogue('Calling the author... 🔔')
    setTimeout(() => {
        window.open('https://discord.com/users/YOUR_DISCORD_ID', '_blank')
        setDialogue(null)
    }, 2000)
  }

  return (
    <group>
      <mesh position={WAYPOINTS.DJ} onClick={handleDJClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color='hotpink' transparent opacity={0.3} />
      </mesh>
      <mesh position={[3.5, 0, 0]} onClick={handleBirdClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color='yellow' />
      </mesh>
      <mesh position={[0, -0.5, -2]} onClick={handleBellClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
        <coneGeometry args={[0.2, 0.3]} />
        <meshStandardMaterial color='gold' />
      </mesh>
    </group>
  )
}" > src/components/InteractiveObjects.jsx

echo "修復完成！"