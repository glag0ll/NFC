'use client'

import { motion } from 'framer-motion'

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '10%',
          left: '10%',
        }}
        animate={{
          x: ['-10%', '10%', '-10%'],
          y: ['0%', '20%', '0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '50%',
          right: '10%',
        }}
        animate={{
          x: ['10%', '-10%', '10%'],
          y: ['0%', '-20%', '0%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: '10%',
          left: '30%',
        }}
        animate={{
          x: ['-5%', '5%', '-5%'],
          y: ['0%', '15%', '0%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Animated lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
          style={{
            width: '100%',
            top: `${20 + i * 15}%`,
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

