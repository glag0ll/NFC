import React from 'react'
import { motion } from 'framer-motion'

const items = [
  { id: 1, title: 'Modern', thumb: 'https://images.unsplash.com/photo-1520975940209-9c6b2a3a32d0?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, title: 'Minimal', thumb: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, title: 'Creative', thumb: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, title: 'Corporate', thumb: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop' },
]

const Examples = () => {
  return (
    <section id="examples" className="relative py-12 sm:py-16 bg-gradient-to-br from-gray-950 via-blue-950/30 to-purple-950/20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
          Живые примеры
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((card) => (
            <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ scale: 1.02 }} className="group relative overflow-hidden rounded-xl bg-gray-900/50 border border-gray-800">
              <img src={card.thumb} alt={card.title} className="w-full h-44 sm:h-52 object-cover opacity-90 group-hover:opacity-100 transition" loading="lazy" />
              <div className="p-4">
                <div className="text-white font-semibold">{card.title}</div>
                <div className="text-gray-400 text-sm">Короткий видео/фото-пример дизайна</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Examples


