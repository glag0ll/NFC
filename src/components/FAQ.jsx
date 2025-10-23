import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const qa = [
  { q: 'Чем отличается физическая NFC карта?', a: 'Физическая карта с NFC чипом открывает вашу цифровую страницу в одно касание телефона.' },
  { q: 'Как менять данные на цифровой странице?', a: 'Мы предоставляем ссылку-редактор. Обновляете контакты — изменения видят все по той же ссылке.' },
  { q: 'Безопасность данных', a: 'Мы храним только предоставленные вами публичные контакты. Передача защищена HTTPS.' },
  { q: 'Если карточка потеряна', a: 'Мы перенесём вашу страницу на новую карту. Старую деактивируем.' },
]

const FAQ = () => {
  return (
    <section className="py-12 sm:py-16 bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">FAQ</h2>
        <div className="space-y-3">
          <AnimatePresence>
            {qa.map((item, idx) => (
              <motion.details key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group bg-gray-900/60 border border-gray-800 rounded-lg p-4">
                <summary className="cursor-pointer select-none text-white font-medium list-none">{item.q}</summary>
                <div className="text-gray-400 mt-2">{item.a}</div>
              </motion.details>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default FAQ


