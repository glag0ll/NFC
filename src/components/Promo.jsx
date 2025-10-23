import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function useCountdown(targetTs) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, targetTs - now)
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  const s = Math.floor((diff / 1000) % 60)
  return { d, h, m, s }
}

const Promo = () => {
  const target = Date.now() + 7 * 24 * 60 * 60 * 1000
  const { d, h, m, s } = useCountdown(target)
  return (
    <section className="py-10 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-y border-yellow-500/20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl p-6 sm:p-8 bg-gray-900/60 border border-yellow-400/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-yellow-400 font-extrabold uppercase tracking-widest">Акция недели</div>
              <div className="text-white text-2xl sm:text-3xl font-bold">Бесплатная доставка по России</div>
              <div className="text-gray-400">успей оформить заказ до окончания таймера</div>
            </div>
            <div className="flex gap-3">
              {[{v:d,l:'д'}, {v:h,l:'ч'}, {v:m,l:'м'}, {v:s,l:'с'}].map((t, i) => (
                <div key={i} className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl bg-gray-800/70 border border-yellow-400/30 flex flex-col items-center justify-center">
                  <div className="text-white text-xl sm:text-2xl font-bold tabular-nums">{String(t.v).padStart(2,'0')}</div>
                  <div className="text-yellow-300 text-xs uppercase">{t.l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Promo


