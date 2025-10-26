'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import NFCCard3D from './nfc-card-3d'
import type { CardData } from '@/lib/store'

interface Canvas3DViewProps {
  cardData: CardData
}

function Scene({ cardData }: Canvas3DViewProps) {
  return (
    <Suspense fallback={null}>
      {/* Мягкий ambient свет */}
      <ambientLight intensity={0.4} />
      
      {/* Карточка с встроенным освещением */}
      <NFCCard3D cardData={cardData} />
      
      {/* Управление камерой */}
      <OrbitControls 
        enableZoom={true}
        minDistance={6}
        maxDistance={12}
        autoRotate 
        autoRotateSpeed={1.2}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </Suspense>
  )
}

export default function Canvas3DView({ cardData }: Canvas3DViewProps) {
  return (
    <Canvas
      camera={{ 
        position: [0, 0.5, 8], 
        fov: 40,
        near: 0.1,
        far: 1000
      }}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: 2, // ACESFilmicToneMapping
        toneMappingExposure: 1.2
      }}
      dpr={[1, 2]}
      shadows="soft"
      onCreated={({ gl }) => {
        gl.setClearColor('#0b1020', 0)
      }}
    >
      <Scene cardData={cardData} />
    </Canvas>
  )
}

