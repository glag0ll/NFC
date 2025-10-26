'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    // Проверяем, это мобильное устройство или нет
    setIsMobile(window.innerWidth < 768)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      const target = e.target as HTMLElement
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      )
    }

    window.addEventListener('mousemove', updateCursor)
    return () => window.removeEventListener('mousemove', updateCursor)
  }, [])

  // Не показываем на мобильных
  if (isMobile) return null

  return (
    <>
      {/* Outer ring */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference transition-transform duration-200"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
        }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400" />
      </div>

      {/* Inner dot */}
      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-100"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isPointer ? 0.5 : 1})`,
        }}
      >
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
      </div>
    </>
  )
}

