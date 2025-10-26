'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const scrollToCustomizer = () => {
    document.getElementById('customizer')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Semi-transparent gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-blue-950/60 to-purple-950/70" />
      
      {/* Radial glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-500/15 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[80px]" />

      <div className="container relative z-10 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur-sm border border-cyan-500/20 mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Цифровая визитка нового поколения</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animated-gradient"
          >
            Умная NFC карточка
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Мгновенный обмен контактами одним касанием. Стильно, технологично, навсегда.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={scrollToCustomizer}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-8 py-6 shadow-lg shadow-cyan-500/50 glow-on-hover magnetic-button relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                Создать карточку
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 text-lg px-8 py-6"
            >
              Узнать больше
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center"
          >
            {[
              { value: '∞', label: 'Обновлений данных' },
              { value: '24/7', label: 'Поддержка' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl font-bold text-cyan-400">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

