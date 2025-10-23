import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text, MeshReflectorMaterial } from '@react-three/drei'

const NFCCard3D = () => {
  const cardRef = useRef()
  const glowRef = useRef()
  const nfcIconRef = useRef()

  useFrame((state, delta) => {
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      cardRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
    if (nfcIconRef.current) {
      nfcIconRef.current.rotation.z += delta * 2
    }
  })

  return (
    <group>
      <RoundedBox ref={glowRef} args={[3.7, 2.4, 0.05]} radius={0.15} position={[0, 0, -0.1]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
      </RoundedBox>
      <RoundedBox ref={cardRef} args={[3.5, 2.2, 0.15]} radius={0.12}>
        <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.1} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1} />
      </RoundedBox>
      <RoundedBox args={[3.4, 2.1, 0.01]} radius={0.12} position={[0, 0, 0.08]}>
        <meshPhysicalMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} transparent opacity={0.3} transmission={0.5} />
      </RoundedBox>
      <group position={[0, 0, 0.1]}>
        <Text position={[-1.4, 0.7, 0]} fontSize={0.15} color="#00ff88" anchorX="left" anchorY="middle">
          DIGITAL CARD
        </Text>
        <Text position={[-1.4, 0.3, 0]} fontSize={0.25} color="white" anchorX="left" anchorY="middle">
          Ваше Имя
        </Text>
        <Text position={[-1.4, 0.05, 0]} fontSize={0.12} color="#cbd5e1" anchorX="left" anchorY="middle">
          Должность • Компания
        </Text>
        <group position={[-1.4, -0.4, 0]}>
          <mesh position={[0, 0, 0]}>
            <circleGeometry args={[0.08]} />
            <meshBasicMaterial color="#0ea5e9" />
          </mesh>
          <mesh position={[0.3, 0, 0]}>
            <circleGeometry args={[0.08]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          <mesh position={[0.6, 0, 0]}>
            <circleGeometry args={[0.08]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
        </group>
        <mesh position={[1.2, 0.2, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
      <mesh position={[0, -1.5, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[8, 8]} />
        <MeshReflectorMaterial
          blur={[200, 60]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={25}
          roughness={1}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh>
    </group>
  )
}

export default NFCCard3D

