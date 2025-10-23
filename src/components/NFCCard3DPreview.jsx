import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text, MeshReflectorMaterial, Environment, ContactShadows } from '@react-three/drei'

const NFCCard3DPreview = ({ cardData }) => {
  const cardRef = useRef()
  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
    }
  })
  return (
    <group>
      {/* environment and ground reflection */}
      <Environment preset="city" />
      <mesh position={[0, -1.4, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[10, 10]} />
        <MeshReflectorMaterial
          blur={[300, 60]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={18}
          roughness={0.9}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0a"
          metalness={0.4}
        />
      </mesh>

      <group ref={cardRef} position={[0, 0, 0]}>
        <RoundedBox args={[3.5, 2.2, 0.15]} radius={0.12}>
          <meshPhysicalMaterial
            color={cardData.primaryColor || '#1e293b'}
            metalness={0.85}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.04}
            reflectivity={1}
          />
        </RoundedBox>
        <RoundedBox args={[3.42, 2.12, 0.01]} radius={0.11} position={[0, 0, 0.08]}>
          <meshPhysicalMaterial
            color={cardData.secondaryColor || '#8b5cf6'}
            metalness={0.6}
            roughness={0.2}
            transparent
            opacity={0.35}
          />
        </RoundedBox>
        <group position={[0, 0, 0.11]}>
          <Text position={[-1.5, 0.55, 0]} fontSize={0.22} color={cardData.textColor || 'white'} anchorX="left" anchorY="middle" maxWidth={2.9}>
            {cardData.name || 'Ваше Имя'}
          </Text>
          <Text position={[-1.5, 0.18, 0]} fontSize={0.12} color="#cbd5e1" anchorX="left" anchorY="middle" maxWidth={2.9}>
            {(cardData.title || 'Должность') + ' • ' + (cardData.company || 'Компания')}
          </Text>
        </group>
      </group>

      <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={8} blur={1.5} far={2} />
    </group>
  )
}

export default NFCCard3DPreview

