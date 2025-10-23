import React from 'react'
import { motion } from 'framer-motion'

const posts = [
  { title: 'Что такое NFC и как это работает', date: '2025-09-01' },
  { title: 'Как оформить идеальную цифровую визитку', date: '2025-08-20' },
]

const Blog = () => (
  <section className="py-12 sm:py-16 bg-gray-950">
    <div className="container mx-auto px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Блог</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((p, i) => (
          <motion.article key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
            <div className="text-gray-400 text-sm mb-1">{new Date(p.date).toLocaleDateString('ru-RU')}</div>
            <div className="text-white font-semibold">{p.title}</div>
            <div className="text-gray-500 text-sm mt-1">Сoon...</div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
)

export default Blog


