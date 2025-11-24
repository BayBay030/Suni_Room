import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { useStore, WAYPOINTS } from '../store'
import { Html, useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

export function Character() {
  const ref = useRef()
  const { characterState, targetPosition, setCharacterState, setTargetPosition, pickRandomWaypoint, triggerRandomDialogue, dialogue } = useStore()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  // Load GLB Model & Animations
  const { scene, animations } = useGLTF('/walk.glb')
  const { actions, names } = useAnimations(animations, ref)

  // Animation Logic
  useEffect(() => {
    // If there are animations, play the first one when walking
    if (names.length > 0) {
      const action = actions[names[0]]
      if (characterState === 'WALKING') {
        action.reset().fadeIn(0.2).play()
      } else {
        action.fadeOut(0.2)
      }
    }
  }, [characterState, actions, names])

  // Drag logic
  const bind = useDrag(({ active, movement: [mx, my], offset: [ox, oy], timeStamp }) => {
    if (active) {
      setCharacterState('DRAGGED')
      // Convert screen pixels to 3D units roughly
      // This is a simplification; for precise 3D drag we'd use a plane raycaster
      const x = (ox / aspect)
      const y = -(oy / aspect)

      // We want to drag relative to initial position, but for now let's just map mouse to plane
      // Better approach: use movement delta
      if (ref.current) {
        // Reset target so it doesn't fight back
        // We handle position update in useFrame or here directly
        // Let's use a temp vector for the drag position
        ref.current.userData.dragPos = { x: mx / aspect, y: -my / aspect }
      }
    } else {
      // Released
      setCharacterState('IDLE')
      // Snap to floor if too high? Or just let it walk
      if (ref.current) {
        // Update target position to where we dropped it (clamped to floor)
        const dropPos = ref.current.position.clone()
        dropPos.y = 0 // Force floor level (Model pivot usually at feet)
        setTargetPosition([dropPos.x, 0, dropPos.z])
      }
    }
  }, { pointerEvents: true })

  // State machine logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (characterState === 'IDLE' || characterState === 'MEDITATING' || characterState === 'WORKING' || characterState === 'DJING') {
        // 50% chance to move
        if (Math.random() > 0.5) {
          const nextPos = pickRandomWaypoint()
          setTargetPosition(nextPos)
          setCharacterState('WALKING')
        }
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [characterState, pickRandomWaypoint, setCharacterState, setTargetPosition])

  useFrame((state, delta) => {
    if (!ref.current) return

    if (characterState === 'DRAGGED') {
      // Follow mouse (simplified)
      // We need the actual mouse position in 3D
      // A better way is to use state.pointer
      const vec = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5)
      vec.unproject(state.camera)
      const dir = vec.sub(state.camera.position).normalize()
      const pos = state.camera.position.clone().add(dir.multiplyScalar(10))

      // Lerp to mouse position
      ref.current.position.lerp(pos, 0.2)

      // Gentle dangle (no somersault)
      const time = state.clock.elapsedTime
      ref.current.rotation.z = Math.sin(time * 5) * 0.1 // Slight swing
      ref.current.rotation.x = Math.sin(time * 3) * 0.05

    } else if (characterState === 'WALKING') {
      const currentPos = ref.current.position
      const target = new THREE.Vector3(...targetPosition)

      // Move towards target
      const direction = target.clone().sub(currentPos)
      direction.y = 0 // Keep on floor
      const distance = direction.length()

      if (distance > 0.1) {
        direction.normalize()
        const newPos = ref.current.position.clone().add(direction.multiplyScalar(delta * 2))

        // Clamp position to room boundaries
        newPos.x = THREE.MathUtils.clamp(newPos.x, -5.5, 5.5)
        newPos.z = THREE.MathUtils.clamp(newPos.z, -5.5, 5.5)

        ref.current.position.copy(newPos)

        // Look at target
        ref.current.lookAt(target.x, currentPos.y, target.z)

        // Bobbing (Disabled if using animation)
        // ref.current.position.y = 0 + Math.sin(state.clock.elapsedTime * 10) * 0.05 
      } else {
        // Arrived
        ref.current.position.set(targetPosition[0], 0, targetPosition[2])

        // Determine state based on location
        if (targetPosition === WAYPOINTS.RUG) setCharacterState('MEDITATING')
        else if (targetPosition === WAYPOINTS.DESK) setCharacterState('WORKING')
        else if (targetPosition === WAYPOINTS.DJ) setCharacterState('DJING')
        else if (targetPosition === WAYPOINTS.BOOKSHELF) setCharacterState('IDLE')
        else setCharacterState('IDLE')
      }
    } else {
      // Idle / Sitting animations
      const time = state.clock.elapsedTime

      if (characterState === 'MEDITATING' || characterState === 'WORKING') {
        // Sitting down - Adjust height for sitting
        // Assuming model pivot is at feet, sitting might need lowering or animation
        // For now, let's just lower slightly if it's a static mesh
        // ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, -0.2, 0.1) 
      } else {
        // Standing / Dozing
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0, 0.1) // Return to floor

        // Dozing animation (slow nod)
        ref.current.rotation.x = Math.sin(time * 2) * 0.05 // Nodding
        ref.current.rotation.z = Math.sin(time * 1) * 0.02 // Swaying
      }

      // Reset rotation Y slowly if needed, or keep looking at target
    }
  })

  return (
    <group
      ref={ref}
      position={[0, 0, 0]} // Initial height at floor (0) assuming pivot at feet
      onClick={triggerRandomDialogue}
      {...bind()}
    >
      {/* GLB Character Model */}
      <primitive object={scene} scale={[3.6, 3.6, 3.6]} />

      {/* Dialogue Bubble */}
      {dialogue && (
        <Html position={[0, 7.5, 0]} center>
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white/50 whitespace-nowrap pointer-events-none">
            <p className="text-gray-800 font-medium text-sm">{dialogue}</p>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 rotate-45 border-b border-r border-white/50"></div>
          </div>
        </Html>
      )}
    </group>
  )
}
