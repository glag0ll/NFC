'use client'

import { motion } from 'framer-motion'
import { Zap, RefreshCw, Shield, TrendingUp } from 'lucide-react'

export default function Benefits() {
  const benefits = [
    {
      icon: Zap,
      title: 'Мгновенный обмен',
      description: 'Одно касание телефона - и ваши контакты переданы. Никаких приложений не нужно.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: RefreshCw,
      title: 'Обновляемые данные',
      description: 'Меняйте контакты в любое время без перевыпуска карточки.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Долговечность',
      description: 'Прочный пластик и водостойкое покрытие. Служит годами.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      title: 'Впечатление',
      description: 'Выделяйтесь среди конкурентов современным подходом к нетворкингу.',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Semi-transparent gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/70 via-blue-950/50 to-purple-950/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-transparent to-transparent" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-purple-500/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[90px]" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Почему выбирают нас
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            NFC карточки - это не просто визитка, это инструмент успешного нетворкинга
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 h-full glow-on-hover">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent" />
    </section>
  )
}

