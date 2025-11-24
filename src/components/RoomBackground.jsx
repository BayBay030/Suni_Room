import { useTexture } from '@react-three/drei'

export function RoomBackground() {
    const [floor, wallNorth, wallWest] = useTexture([
        '/floor.jpg',
        '/wall_north.jpg',
        '/wall_west.jpg'
    ])

    return (
        <group>
            {/* Floor (12x12) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                <planeGeometry args={[12, 12]} />
                <meshStandardMaterial map={floor} />
            </mesh>

            {/* North Wall (Back) */}
            <mesh position={[0, 3, -6]}>
                <planeGeometry args={[12, 8]} />
                <meshStandardMaterial map={wallNorth} side={2} />
            </mesh>

            {/* West Wall (Left) */}
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-6, 3, 0]}>
                <planeGeometry args={[12, 8]} />
                <meshStandardMaterial map={wallWest} side={2} />
            </mesh>
        </group>
    )
}
