import { useTexture, Billboard, RoundedBox } from '@react-three/drei'
import { useStore, WAYPOINTS } from '../store'
import { useRef, useEffect } from 'react'


export function InteractiveObjects() {
    const { setActiveModal, setDialogue, audioStates, toggleAudio, isMuted } = useStore() // Updated useStore destructuring

    // Load textures for each object
    const [birdTexture, plantTexture, bookshelfTexture] = useTexture([
        '/bird.png',
        '/plant.png',
        '/bookshelf.png'
    ])
    // Fallback/Placeholder for others if needed
    const defaultTexture = useTexture('/vite.svg')

    // Calculate aspect ratios (Texture is loaded via Suspense so image is available)
    const plantRatio = plantTexture.image.width / plantTexture.image.height
    const bookshelfRatio = bookshelfTexture.image.width / bookshelfTexture.image.height

    // Audio Refs
    const birdAudio = useRef(new Audio('/sounds/Bird_1hr.mp3'))
    const coffeeAudio = useRef(new Audio('/sounds/Coffee_1hr.mp3'))

    // Audio Logic
    useEffect(() => {
        birdAudio.current.loop = true
        coffeeAudio.current.loop = true
        return () => {
            birdAudio.current.pause()
            coffeeAudio.current.pause()
        }
    }, [])

    useEffect(() => {
        if (audioStates.bird && !isMuted) birdAudio.current.play().catch(e => console.log(e))
        else birdAudio.current.pause()

        if (audioStates.coffee && !isMuted) coffeeAudio.current.play().catch(e => console.log(e))
        else coffeeAudio.current.pause()
    }, [audioStates, isMuted])

    const handleDJClick = () => {
        setActiveModal('SPOTIFY')
        setDialogue("Let's jam! 🎵")
        setTimeout(() => setDialogue(null), 3000)
    }

    const handleBirdClick = () => {
        toggleAudio('bird')
        setDialogue(audioStates.bird ? "Shh... 🤫" : "Sing for me! 🐦")
        setTimeout(() => setDialogue(null), 2000)
    }

    const handleCoffeeClick = () => {
        toggleAudio('coffee')
        setDialogue(audioStates.coffee ? "Coffee done. ☕" : "Brewing coffee... ☕")
        setTimeout(() => setDialogue(null), 2000)
    }

    const handleBellClick = () => {
        setActiveModal('CONTACT')
        setDialogue("Calling the author... 🔔")
        setTimeout(() => setDialogue(null), 2000)
    }

    return (
        <group>
            {/* DJ Table Base (South-West) - No Interaction */}
            <mesh position={[-2, -0.25, 3]} scale={[1.2, 1.2, 1.2]} castShadow>
                <RoundedBox args={[4, 1.5, 2]} radius={0.1} smoothness={4}>
                    <meshStandardMaterial color="#F5E4E0" />
                </RoundedBox>
            </mesh>
            {/* DJ Equipment - Interactive & Pink */}
            <mesh position={[-2, 0.65, 3]} scale={[1.2, 1.2, 1.2]} onClick={handleDJClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
                <RoundedBox args={[2, 0.3, 1]} radius={0.05} smoothness={4}>
                    <meshStandardMaterial color="hotpink" />
                </RoundedBox>
            </mesh>

            {/* Bird (West Window) */}
            <Billboard position={[-4.8, 3, 1]} scale={[1.5, 1.5, 1.5]} follow={true} lockX={false} lockY={false} lockZ={false}>
                <mesh onClick={handleBirdClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial map={birdTexture} transparent />
                </mesh>
            </Billboard>

            {/* Plant (East Side) - On Floor */}
            <Billboard position={[5, -0.25, -1]} scale={[1.5, 1.5, 1.5]} follow={true}>
                <mesh>
                    <planeGeometry args={[1.5 * plantRatio, 1.5]} />
                    <meshBasicMaterial map={plantTexture} transparent color="white" />
                </mesh>
            </Billboard>

            {/* Bookshelf (East-North Corner) - On Floor */}
            <Billboard position={[5, 0.5, -4]} scale={[1.5, 1.5, 1.5]} follow={true} lockX={false} lockY={false} lockZ={false}>
                <mesh>
                    <planeGeometry args={[3 * bookshelfRatio, 3]} />
                    <meshBasicMaterial map={bookshelfTexture} transparent color="white" />
                </mesh>
            </Billboard>

            {/* Coffee Machine (South-East Corner) */}
            <mesh position={[5, 0.6, 5]} onClick={handleCoffeeClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'} castShadow>
                <RoundedBox args={[1, 1.2, 1]} radius={0.1} smoothness={4}>
                    <meshStandardMaterial color="#8B4513" />
                </RoundedBox>
            </mesh>

            {/* Single Bed (North Wall, Right of Desk) - NEW */}
            <mesh position={[2, -0.4, -4.5]} scale={[1.2, 1.2, 1.2]}>
                <RoundedBox args={[2.5, 1, 4]} radius={0.1} smoothness={4}>
                    <meshStandardMaterial color="#F5E4E0" />
                </RoundedBox>
                {/* Pillow */}
                <mesh position={[0, 0.6, -1.5]}>
                    <RoundedBox args={[1.5, 0.3, 0.8]} radius={0.1} smoothness={4}>
                        <meshStandardMaterial color="white" />
                    </RoundedBox>
                </mesh>
            </mesh>

            {/* Desk (North-West) */}
            <mesh position={[-3, 0, -4.5]} scale={[1.2, 1.2, 1.2]}>
                <RoundedBox args={[3, 2, 1.5]} radius={0.1} smoothness={4}>
                    <meshStandardMaterial color="#F5E4E0" />
                </RoundedBox>
            </mesh>

            {/* Bell (On Desk) */}
            <mesh position={[-3, 1.3, -4.5]} scale={[1.2, 1.2, 1.2]} onClick={handleBellClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
                <coneGeometry args={[0.2, 0.3]} />
                <meshStandardMaterial color="gold" />
            </mesh>

            {/* Window Frame REMOVED */}
        </group>
    )
}
