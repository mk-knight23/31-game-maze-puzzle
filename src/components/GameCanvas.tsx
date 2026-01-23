import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CuboidCollider, BallCollider, Physics } from '@react-three/rapier'
import { Environment, Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/stores/gameStore'
import { generateMaze, getMazeWalls, isExit } from '@/utils/mazeGenerator'
import { DIFFICULTY_CONFIGS } from '@/types/game'
import { useKeyboard } from '@/hooks/useKeyboard'

// Ball component with physics
function Ball({ mazeSize, onExit }: { mazeSize: number; onExit: () => void }) {
  const ballRef = useRef<THREE.Mesh>(null)
  const rigidBodyRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const { settings } = useGameStore()
  const config = DIFFICULTY_CONFIGS[settings.difficulty]
  const impulseRef = useRef(new THREE.Vector2(0, 0))
  
  // Load ball texture
  const ballTexture = useTexture('/ball.png')
  
  // Keyboard controls
  useKeyboard({
    onMove: (dir) => {
      impulseRef.current = dir
    },
    enabled: true,
  })
  
  useFrame(() => {
    if (!rigidBodyRef.current) return
    
    // Apply impulse based on keyboard input
    const impulse = impulseRef.current
    if (impulse.length() > 0) {
      rigidBodyRef.current.applyImpulse(
        { x: impulse.x * config.ballSpeed * 0.01, y: impulse.y * config.ballSpeed * 0.01, z: 0 },
        true
      )
    }
    
    // Check for exit
    const pos = rigidBodyRef.current.translation()
    if (isExit(pos.x, pos.y, mazeSize)) {
      onExit()
    }
  })
  
  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[1, 1, 0.25]}
      colliders={false}
      linearDamping={2}
      angularDamping={1}
    >
      <BallCollider args={[0.25]} restitution={0.3} friction={0.5} />
      <mesh ref={ballRef} castShadow>
        <sphereGeometry args={[0.25, 32, 16]} />
        <meshStandardMaterial map={ballTexture} metalness={0.3} roughness={0.4} />
      </mesh>
    </RigidBody>
  )
}

// Maze walls component
function MazeWalls({ maze }: { maze: boolean[][] }) {
  const walls = useMemo(() => getMazeWalls(maze), [maze])
  const brickTexture = useTexture('/brick.png')
  
  // Create instanced geometry for performance
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  
  return (
    <group>
      {walls.map((wall, i) => (
        <RigidBody key={i} type="fixed" position={[wall.x, wall.y, 0.5]} colliders={false}>
          <CuboidCollider args={[0.5, 0.5, 0.5]} />
          <mesh castShadow receiveShadow geometry={geometry}>
            <meshStandardMaterial map={brickTexture} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  )
}

// Ground plane
function Ground({ size }: { size: number }) {
  const concreteTexture = useTexture('/concrete.png')
  
  useEffect(() => {
    concreteTexture.wrapS = concreteTexture.wrapT = THREE.RepeatWrapping
    concreteTexture.repeat.set(size * 2, size * 2)
  }, [concreteTexture, size])
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(size - 1) / 2, (size - 1) / 2, 0]} receiveShadow>
      <planeGeometry args={[size * 3, size * 3]} />
      <meshStandardMaterial map={concreteTexture} />
    </mesh>
  )
}

// Exit marker
function ExitMarker({ mazeSize }: { mazeSize: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = (mazeSize - 2) + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.rotation.z = state.clock.elapsedTime
    }
  })
  
  return (
    <group position={[mazeSize + 0.5, mazeSize - 2, 0.5]}>
      <mesh ref={meshRef}>
        <torusGeometry args={[0.3, 0.1, 16, 32]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.3}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        EXIT
      </Text>
    </group>
  )
}

// Camera controller
function CameraController({ mazeSize }: { mazeSize: number }) {
  const { camera } = useThree()
  const { settings } = useGameStore()
  
  useEffect(() => {
    if (settings.cameraMode === 'fixed') {
      const center = (mazeSize - 1) / 2
      camera.position.set(center, center, mazeSize * 0.8)
      camera.lookAt(center, center, 0)
    }
  }, [camera, mazeSize, settings.cameraMode])
  
  useFrame(() => {
    if (settings.cameraMode === 'follow') {
      // Camera follows ball - handled by looking at ball position
      // For now, keep a top-down view that gradually moves
    }
  })
  
  return null
}

// Main game scene
function GameScene({ maze, mazeSize, onExit }: { 
  maze: boolean[][]
  mazeSize: number
  onExit: () => void 
}) {
  return (
    <>
      <CameraController mazeSize={mazeSize} />
      <ambientLight intensity={0.4} />
      <pointLight position={[mazeSize / 2, mazeSize / 2, 10]} intensity={1} castShadow />
      <directionalLight position={[10, 10, 10]} intensity={0.5} castShadow />
      
      <Physics gravity={[0, 0, -9.81]}>
        <Ball mazeSize={mazeSize} onExit={onExit} />
        <MazeWalls maze={maze} />
        
        {/* Floor collider */}
        <RigidBody type="fixed" position={[(mazeSize - 1) / 2, (mazeSize - 1) / 2, -0.5]}>
          <CuboidCollider args={[mazeSize * 2, mazeSize * 2, 0.5]} />
        </RigidBody>
      </Physics>
      
      <Ground size={mazeSize} />
      <ExitMarker mazeSize={mazeSize} />
      <Environment preset="night" />
    </>
  )
}

// Main canvas component
export function GameCanvas() {
  const { gameState, mazeSize, level, nextLevel, setElapsedTime } = useGameStore()
  const [maze, setMaze] = useState<boolean[][]>([])
  const [key, setKey] = useState(0) // Force re-render on level change
  const startTimeRef = useRef<number>(Date.now())
  
  // Generate new maze when level changes
  useEffect(() => {
    if (gameState === 'playing' || gameState === 'transitioning') {
      setMaze(generateMaze(mazeSize))
      setKey((k) => k + 1)
      startTimeRef.current = Date.now()
    }
  }, [mazeSize, level, gameState])
  
  // Update elapsed time
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTimeRef.current) / 1000)
    }, 100)
    
    return () => clearInterval(interval)
  }, [gameState, setElapsedTime])
  
  const handleExit = () => {
    if (gameState === 'playing') {
      nextLevel()
    }
  }
  
  if (maze.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-game-bg">
        <div className="text-white font-game">Generating maze...</div>
      </div>
    )
  }
  
  return (
    <div className="w-full h-full">
      <Canvas
        key={key}
        shadows
        camera={{ 
          position: [mazeSize / 2, mazeSize / 2, mazeSize * 0.8], 
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        className="touch-none"
      >
        <color attach="background" args={['#0a0a1a']} />
        <fog attach="fog" args={['#0a0a1a', mazeSize, mazeSize * 3]} />
        <GameScene maze={maze} mazeSize={mazeSize} onExit={handleExit} />
      </Canvas>
    </div>
  )
}
