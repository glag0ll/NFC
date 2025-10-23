import React from 'react'
import { motion } from 'framer-motion'

const items = [
  { title: 'Мгновенное обновление', nfc: 'Сразу меняете ссылку и контакты', paper: 'Нужно печатать заново' },
  { title: 'Бесконечные контакты', nfc: 'Все соцсети и ссылки', paper: 'Ограничено размером карты' },
  { title: 'Один клик', nfc: 'Сохранение в телефон', paper: 'Ручной набор' },
]

const Benefits = () => (
  <section className="py-12 sm:py-16 bg-gray-950">
    <div className="container mx-auto px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Почему NFC лучше бумаги</h2>
      <div className="grid grid-cols-1 gap-4">
        {items.map((i, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="font-semibold text-white mb-2">{i.title}</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"><span className="text-green-400 font-medium">NFC:</span> {i.nfc}</div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"><span className="text-red-400 font-medium">Бумага:</span> {i.paper}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default Benefits


