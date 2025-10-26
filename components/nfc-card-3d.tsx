'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Environment, ContactShadows, Html } from '@react-three/drei'
import QRCode from 'qrcode.react'
import * as THREE from 'three'
import type { CardData } from '@/lib/store'
import { generateVCard } from '@/lib/utils'

interface NFCCard3DProps {
  cardData: CardData
}

export default function NFCCard3D({ cardData }: NFCCard3DProps) {
  const cardRef = useRef<any>()
  
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    if (cardData.backgroundStyle === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, cardData.primaryColor || '#0f172a')
      gradient.addColorStop(1, cardData.secondaryColor || '#6366f1')
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = cardData.primaryColor || '#0f172a'
    }
    
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [cardData.primaryColor, cardData.secondaryColor, cardData.backgroundStyle])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(time * 0.3) * 0.15
      cardRef.current.rotation.x = Math.sin(time * 0.2) * 0.05
    }
  })

  return (
    <group>
      <Environment preset="sunset" />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-3, 2, 2]} intensity={1.5} color="#00f5ff" />
      <pointLight position={[3, 2, -2]} intensity={1.5} color="#8b5cf6" />
      <spotLight position={[0, 5, 0]} intensity={0.8} angle={0.5} penumbra={1} color="#ffffff" />

      <group ref={cardRef} position={[0, 0, 0]}>
        <RoundedBox args={[3.5, 2.2, 0.15]} radius={0.15} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={cardData.primaryColor || '#0f172a'}
            metalness={0.6}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
            reflectivity={1.5}
            envMapIntensity={1.2}
            side={THREE.FrontSide}
          />
        </RoundedBox>

        <mesh position={[0, 0, 0.076]}>
          <planeGeometry args={[3.45, 2.15]} />
          <meshPhysicalMaterial
            map={gradientTexture}
            metalness={0.6}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
            reflectivity={1.5}
            envMapIntensity={1.2}
            depthWrite={true}
            depthTest={true}
          />
        </mesh>

        <mesh position={[0, 0, -0.076]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.45, 2.15]} />
          <meshStandardMaterial
            color={cardData.backgroundStyle === 'gradient' ? cardData.secondaryColor : cardData.primaryColor}
            metalness={0.7}
            roughness={0.2}
            envMapIntensity={1.0}
            depthWrite={true}
            depthTest={true}
          />
        </mesh>

        {cardData.effects.holographic && (
          <mesh position={[0, 0, 0.077]}>
            <planeGeometry args={[3.45, 2.15]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.15}
              metalness={1}
              roughness={0}
              envMapIntensity={2}
            />
          </mesh>
        )}

        {cardData.effects.glitch && (
          <>
            <mesh position={[0.003, -0.003, 0.078]}>
              <planeGeometry args={[3.45, 2.15]} />
              <meshBasicMaterial
                color="#ff00ff"
                transparent
                opacity={0.12}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <mesh position={[-0.003, 0.003, 0.079]}>
              <planeGeometry args={[3.45, 2.15]} />
              <meshBasicMaterial
                color="#00ffff"
                transparent
                opacity={0.1}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </>
        )}

        {cardData.effects.pulse && (
          <>
            <mesh position={[0, 0, 0.08]}>
              <planeGeometry args={[3.45, 2.15]} />
              <meshBasicMaterial
                color="#3b82f6"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <mesh position={[0, 0, 0.081]}>
              <planeGeometry args={[3.2, 1.9]} />
              <meshBasicMaterial
                color="#8b5cf6"
                transparent
                opacity={0.2}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </>
        )}

        <group position={[1.35, 0.75, 0.065]}>
          {[
            { r: 0.18, tube: 0.018, Geometry: 'torus' },
            { r: 0.12, tube: 0.014, Geometry: 'torus' },
            { r: 0.07, tube: 0.01, Geometry: 'torus' },
          ].map((ring, i) => (
            <mesh key={i}>
              <torusGeometry args={[ring.r, ring.tube, 16, 32]} />
              <meshStandardMaterial 
                color="#ffd700" 
                metalness={1} 
                roughness={0.05}
                emissive="#ffaa00"
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
          <mesh>
            <circleGeometry args={[0.035, 32]} />
            <meshStandardMaterial 
              color="#ffaa00" 
              metalness={0.9} 
              roughness={0.05}
              emissive="#ff8800"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>

        {cardData.showQR && (
          <Html
            position={[1.25, -0.75, 0.065]}
            transform
            distanceFactor={5}
            zIndexRange={[0, 0]}
          >
            <div style={{
              background: 'white',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              <QRCode 
                value={generateVCard(cardData)} 
                size={42}
                level="M"
                includeMargin={false}
              />
            </div>
          </Html>
        )}

        <group position={[0.6, 0.35, 0.065]}>
          {[0, 0.1, 0.2, 0.3, 0.4].map((offset, i) => (
            <mesh key={i} position={[0, -offset, 0]}>
              <boxGeometry args={[1.6 - i * 0.15, 0.03, 0.01]} />
              <meshStandardMaterial 
                color={cardData.textColor || '#ffffff'} 
                metalness={0.9}
                roughness={0.1}
                transparent
                opacity={0.6 - i * 0.08}
                emissive={cardData.textColor || '#ffffff'}
                emissiveIntensity={0.25}
              />
            </mesh>
          ))}
        </group>

        <Html
          position={[-1.3, 0, 0.065]}
          transform
          distanceFactor={1.8}
          zIndexRange={[0, 0]}
        >
          <div 
            style={{ 
              color: cardData.textColor || '#ffffff',
              fontFamily: cardData.fontFamily || 'Inter',
              width: '200px',
              height: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                opacity: 0.5,
                letterSpacing: '3px',
                marginBottom: '12px',
                textTransform: 'uppercase',
                textShadow: '0 2px 8px rgba(0,0,0,0.95)',
                whiteSpace: 'nowrap'
              }}>
                DIGITAL CARD
              </div>
              <div style={{ 
                fontSize: '40px', 
                fontWeight: 700,
                marginBottom: '7px',
                textShadow: '0 4px 12px rgba(0,0,0,0.95)',
                lineHeight: '1.05',
                letterSpacing: '-0.5px',
                whiteSpace: 'nowrap'
              }}>
                {cardData.name || 'Ваше имя'}
              </div>
              <div style={{ 
                fontSize: '19px', 
                opacity: 0.9,
                marginBottom: '5px',
                fontWeight: 400,
                letterSpacing: '0.3px',
                textShadow: '0 3px 8px rgba(0,0,0,0.9)',
                whiteSpace: 'nowrap'
              }}>
                {cardData.title || 'Должность'}
              </div>
              <div style={{ 
                fontSize: '15px', 
                opacity: 0.7,
                fontWeight: 300,
                letterSpacing: '0.3px',
                textShadow: '0 3px 8px rgba(0,0,0,0.9)',
                whiteSpace: 'nowrap',
              }}>
                {cardData.company || 'Компания'}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '11px',
                opacity: 0.8,
                fontWeight: 400,
                lineHeight: '1.6',
                textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                marginBottom: '8px'
              }}>
                {cardData.phone && (
                  <div style={{ marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ opacity: 0.6, fontSize: '10px', fontWeight: 600 }}>Телефон:</span>
                    <span>{cardData.phone}</span>
                  </div>
                )}
                {cardData.email && (
                  <div style={{ marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ opacity: 0.6, fontSize: '10px', fontWeight: 600 }}>Email:</span>
                    <span style={{ fontSize: '10px' }}>{cardData.email}</span>
                  </div>
                )}
                {cardData.website && (
                  <div style={{ marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ opacity: 0.6, fontSize: '9px', fontWeight: 600 }}>Сайт:</span>
                    <span style={{ fontSize: '9px' }}>{cardData.website}</span>
                  </div>
                )}
              </div>
              {(cardData.telegram || cardData.vk || cardData.instagram) && (
                <div style={{
                  fontSize: '10px',
                  opacity: 0.8,
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap'
                }}>
                  {cardData.telegram && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '2px',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '2px 5px',
                      borderRadius: '3px'
                    }}>
                      <span style={{ fontSize: '9px' }}>✈️</span>
                      <span style={{ fontSize: '9px' }}>{cardData.telegram}</span>
                    </div>
                  )}
                  {cardData.vk && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '2px',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '2px 5px',
                      borderRadius: '3px'
                    }}>
                      <span style={{ fontSize: '9px' }}>🔵</span>
                      <span style={{ fontSize: '8px' }}>VK</span>
                    </div>
                  )}
                  {cardData.instagram && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '2px',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '2px 5px',
                      borderRadius: '3px'
                    }}>
                      <span style={{ fontSize: '9px' }}>📷</span>
                      <span style={{ fontSize: '9px' }}>{cardData.instagram}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Html>
      </group>
      <ContactShadows 
        position={[0, -1.1, 0]} 
        opacity={0.6} 
        scale={6} 
        blur={2.5} 
        far={4}
        color="#000000"
      />
    </group>
  )
}

