'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useCardStore } from '@/lib/store'
import { generateVCard } from '@/lib/utils'
import { Button } from './ui/button'
import { Box, SquareIcon } from 'lucide-react'
import QRCode from 'qrcode.react'

// Динамический импорт Canvas для избежания SSR проблем
const Canvas3DView = dynamic(() => import('./canvas-3d-view').catch(() => {
  // Fallback если 3D не загрузится
  return { default: () => (
    <div className="flex items-center justify-center h-full text-white">
      <div className="text-center">
        <p className="text-yellow-400 mb-2">⚠️ 3D недоступно</p>
        <p className="text-sm text-gray-400">Используйте плоский вид</p>
      </div>
    </div>
  )}
}), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p>Загрузка 3D модели...</p>
      </div>
    </div>
  ),
})

export default function CardPreview() {
  const cardData = useCardStore((state) => state.cardData)
  const [previewMode, setPreviewMode] = useState<'3d' | 'flat'>('flat')

  const effectClasses = [
    'relative overflow-hidden',
    cardData.effects.holographic && 'card-holographic',
    cardData.effects.glitch && 'card-glitch',
    cardData.effects.pulse && 'card-pulse',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="space-y-4">
      {/* Toggle buttons */}
      <div className="flex gap-2 bg-gray-800/50 backdrop-blur-sm rounded-lg p-2">
        <Button
          onClick={() => setPreviewMode('3d')}
          variant={previewMode === '3d' ? 'cyan' : 'ghost'}
          className="flex-1"
        >
          <Box className="mr-2 h-4 w-4" />
          3D Превью
        </Button>
        <Button
          onClick={() => setPreviewMode('flat')}
          variant={previewMode === 'flat' ? 'cyan' : 'ghost'}
          className="flex-1"
        >
          <SquareIcon className="mr-2 h-4 w-4" />
          Плоский вид
        </Button>
      </div>

      {/* Preview container */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold mb-6 text-center text-white">Предпросмотр карточки</h3>

        <AnimatePresence mode="wait">
          {previewMode === '3d' ? (
            <motion.div
              key="3d"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-72 sm:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900"
            >
              <Canvas3DView cardData={cardData} />
            </motion.div>
          ) : (
            <motion.div
              key="flat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div
                className={`${effectClasses} rounded-xl shadow-2xl`}
                style={{
                  aspectRatio: '1.75/1',
                  background:
                    cardData.backgroundStyle === 'gradient'
                      ? `linear-gradient(135deg, ${cardData.primaryColor}, ${cardData.secondaryColor})`
                      : cardData.primaryColor,
                  color: cardData.textColor,
                  fontFamily: cardData.fontFamily,
                  position: 'relative',
                }}
              >
                {/* Левая часть - текст */}
                <div className="absolute left-0 top-0 p-6 h-full flex flex-col justify-between" style={{ width: '65%' }}>
                  <div>
                    <div className="text-[0.65rem] font-bold opacity-50 tracking-widest mb-3">DIGITAL CARD</div>
                    <div className="text-2xl font-bold mb-1.5 leading-tight">{cardData.name || 'Ваше имя'}</div>
                    <div className="text-sm opacity-90 mb-1">{cardData.title || 'Должность'}</div>
                    <div className="text-xs opacity-70 mb-3">{cardData.company || 'Компания'}</div>
                  </div>
                  
                  {/* Контакты */}
                  <div className="text-[0.65rem] opacity-80 space-y-1">
                    {cardData.phone && (
                      <div className="flex items-center gap-1">
                        <span className="opacity-60 font-semibold text-[0.6rem]">Телефон:</span>
                        <span>{cardData.phone}</span>
                      </div>
                    )}
                    {cardData.email && (
                      <div className="flex items-center gap-1">
                        <span className="opacity-60 font-semibold text-[0.6rem]">Email:</span>
                        <span className="text-[0.6rem]">{cardData.email}</span>
                      </div>
                    )}
                    {cardData.website && (
                      <div className="flex items-center gap-1">
                        <span className="opacity-60 font-semibold text-[0.55rem]">Сайт:</span>
                        <span className="text-[0.55rem]">{cardData.website}</span>
                      </div>
                    )}
                    
                    {/* Социальные сети */}
                    {(cardData.telegram || cardData.vk || cardData.instagram) && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {cardData.telegram && (
                          <div className="bg-white/10 px-2 py-0.5 rounded text-[0.6rem] flex items-center gap-1">
                            ✈️ {cardData.telegram}
                          </div>
                        )}
                        {cardData.vk && (
                          <div className="bg-white/10 px-2 py-0.5 rounded text-[0.6rem] flex items-center gap-1">
                            🔵 VK
                          </div>
                        )}
                        {cardData.instagram && (
                          <div className="bg-white/10 px-2 py-0.5 rounded text-[0.6rem] flex items-center gap-1">
                            📷 {cardData.instagram}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Правая часть - декоративные линии */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 space-y-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-0.5 rounded-full"
                      style={{ 
                        width: `${120 - i * 10}px`,
                        backgroundColor: cardData.textColor,
                        opacity: 0.3 - i * 0.04
                      }}
                    />
                  ))}
                </div>

                {/* NFC иконка - правый верхний угол */}
                <div className="absolute right-6 top-6">
                  <div className="relative w-10 h-10">
                    {/* Внешнее кольцо */}
                    <div 
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: '#ffd700' }}
                    />
                    {/* Среднее кольцо */}
                    <div 
                      className="absolute inset-2 rounded-full border-2"
                      style={{ borderColor: '#ffd700' }}
                    />
                    {/* Внутреннее кольцо */}
                    <div 
                      className="absolute inset-3.5 rounded-full border-2"
                      style={{ borderColor: '#ffd700' }}
                    />
                    {/* Центр */}
                    <div 
                      className="absolute inset-4.5 rounded-full"
                      style={{ backgroundColor: '#ffaa00' }}
                    />
                  </div>
                </div>

                {/* QR код внизу справа (если включен) */}
                    {cardData.showQR && (
                      <div className="absolute bottom-6 right-6 bg-white p-2 rounded">
                        <QRCode value={generateVCard(cardData)} size={40} />
                      </div>
                    )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <div className="inline-block p-4 bg-white rounded-lg">
                <QRCode value={generateVCard(cardData)} size={80} />
              </div>
              <p className="mt-2 text-sm text-gray-400">Отсканируйте QR код для сохранения контакта</p>
            </motion.div>
      </div>
    </div>
  )
}

