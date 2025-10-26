'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Что такое NFC карточка?',
      answer: 'NFC карточка - это современная цифровая визитка с встроенным чипом. При касании телефона карточкой, автоматически открывается ваш цифровой профиль со всеми контактами.',
    },
    {
      question: 'Нужно ли устанавливать приложение?',
      answer: 'Нет! NFC работает на всех современных смартфонах без установки дополнительных приложений. Просто поднесите телефон к карточке.',
    },
    {
      question: 'Можно ли изменить данные на карточке?',
      answer: 'Да! В личном кабинете вы можете в любой момент обновить свои контактные данные, ссылки на соцсети и другую информацию без перевыпуска карточки.',
    },
    {
      question: 'Сколько времени занимает изготовление?',
      answer: 'Производство занимает 2-3 рабочих дня. Доставка по России - от 3 до 7 дней в зависимости от региона.',
    },
    {
      question: 'Карточка водостойкая?',
      answer: 'Да, карточка выполнена из прочного пластика с водостойким покрытием. Она выдержит попадание воды и ежедневное использование.',
    },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Semi-transparent gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/70 via-blue-950/50 to-purple-950/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-transparent to-transparent" />
      
      {/* Glow effects */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-blue-500/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[110px]" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Часто задаваемые вопросы
          </h2>
          <p className="text-gray-400 text-lg">Все, что вам нужно знать о NFC карточках</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 transition-all glow-on-hover"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white pr-8">{faq.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-cyan-400 transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 text-gray-400"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

