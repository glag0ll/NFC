import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerformanceMonitor } from '@react-three/drei'
import { useForm } from 'react-hook-form'
import QRCode from 'qrcode.react'
import NFCCard3DPreview from './NFCCard3DPreview.jsx'
import CardEditorModal from './CardEditorModal.jsx'

const CardCustomizer = () => {
  const [cardData, setCardData] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    telegram: '',
    vk: '',
    instagram: '',
    website: '',
    design: 'modern',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    backgroundStyle: 'gradient'
  })
  const [activeTab, setActiveTab] = useState('personal')
  const [previewMode, setPreviewMode] = useState('3d')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [canvasKey, setCanvasKey] = useState(0)
  const [canvasDpr, setCanvasDpr] = useState([1, 1.15])
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const watchedData = watch()
  useEffect(() => { setCardData(prev => ({ ...prev, ...watchedData })) }, [watchedData])
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)')
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener?.('change', onChange)
    // Force initial resize to kick 3D context in maximized/fullscreen
    setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    const onFs = () => setCanvasKey((k) => k + 1)
    window.addEventListener('fullscreenchange', onFs)
    window.addEventListener('orientationchange', onFs)
    return () => {
      mql.removeEventListener?.('change', onChange)
      window.removeEventListener('fullscreenchange', onFs)
      window.removeEventListener('orientationchange', onFs)
    }
  }, [])
  useEffect(() => {
    // Detect long frame stalls and remount Canvas
    let last = performance.now()
    let rafId
    const tick = (t) => {
      if (previewMode === '3d' && t - last > 4000) setCanvasKey((k) => k + 1)
      last = t
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [previewMode])
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' })
  const onSubmit = async (data) => {
    try {
      setSubmitState({ status: 'loading', message: '' })
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cardData, ...data })
      })
      if (!res.ok) throw new Error('Request failed')
      setSubmitState({ status: 'success', message: 'Заявка отправлена! Мы свяжемся с вами.' })
    } catch (e) {
      setSubmitState({ status: 'error', message: 'Ошибка отправки. Попробуйте позже.' })
    }
  }

  const designTemplates = [
    { id: 'modern', name: 'Современный', preview: '/templates/modern.jpg' },
    { id: 'minimal', name: 'Минималистичный', preview: '/templates/minimal.jpg' },
    { id: 'creative', name: 'Креативный', preview: '/templates/creative.jpg' },
    { id: 'corporate', name: 'Корпоративный', preview: '/templates/corporate.jpg' }
  ]
  const colorPalettes = [
    { primary: '#3b82f6', secondary: '#8b5cf6', name: 'Синий' },
    { primary: '#10b981', secondary: '#06b6d4', name: 'Зеленый' },
    { primary: '#f59e0b', secondary: '#ef4444', name: 'Оранжевый' },
    { primary: '#8b5cf6', secondary: '#ec4899', name: 'Фиолетовый' }
  ]

  return (
    <div id="customizer" className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white">
      <div className="container mx-auto px-6 py-12">
        <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Создай свою уникальную NFC карточку
        </motion.h1>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-lg p-2">
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => setPreviewMode('3d')} className={`flex-1 py-2 px-4 rounded-md transition-all ${previewMode === '3d' ? 'bg-blue-600 text-white shadow-inner' : 'text-gray-400 hover:text-white'}`}>3D Превью</motion.button>
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => setPreviewMode('flat')} className={`flex-1 py-2 px-4 rounded-md transition-all ${previewMode === 'flat' ? 'bg-blue-600 text-white shadow-inner' : 'text-gray-400 hover:text-white'}`}>Плоский вид</motion.button>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold mb-6 text-center">Предпросмотр карточки</h3>
              <AnimatePresence mode="wait">
                {previewMode === '3d' ? (
                  <motion.div key="p3d" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-72 sm:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 relative">
                    <Canvas
                      key={canvasKey}
                      camera={{ position: [0, 0, 8], fov: 45 }}
                      dpr={isMobile ? [1, 1.05] : canvasDpr}
                      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
                      onCreated={({ gl }) => {
                        const handleContextLost = (e) => e.preventDefault()
                        gl.domElement.addEventListener('webglcontextlost', handleContextLost, { passive: false })
                        const handleContextRestored = () => setCanvasKey((k) => k + 1)
                        gl.domElement.addEventListener('webglcontextrestored', handleContextRestored)
                      }}
                    >
                      <PerformanceMonitor onDecline={() => setCanvasDpr([1, 1])} onIncline={() => setCanvasDpr([1, 1.15])} />
                      <ambientLight intensity={0.6} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <NFCCard3DPreview cardData={cardData} />
                      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
                    </Canvas>
                    <button onClick={() => setIsEditorOpen(true)} className="absolute inset-0 z-10" title="Открыть расширенный редактор" aria-label="Открыть расширенный редактор"></button>
                  </motion.div>
                ) : (
                  <motion.div key="pflat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="relative">
                    <div className="w-full aspect-[1.75/1] rounded-xl shadow-2xl p-6 text-white relative overflow-hidden" style={{ background: cardData.backgroundStyle === 'gradient' ? `linear-gradient(135deg, ${cardData.primaryColor}, ${cardData.secondaryColor})` : cardData.primaryColor }}>
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-semibold opacity-75 mb-2">DIGITAL CARD</div>
                        <div className="text-xl font-bold">{cardData.name || 'Ваше имя'}</div>
                        <div className="text-sm opacity-90">{cardData.title || 'Должность'}</div>
                        <div className="text-xs opacity-75">{cardData.company || 'Компания'}</div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1 text-xs">
                          {cardData.phone && <div>📞 {cardData.phone}</div>}
                          {cardData.email && <div>✉️ {cardData.email}</div>}
                        </div>
                        <div className="bg-white p-2 rounded">
                          <QRCode value={`https://card.example.com/${cardData.name || 'demo'}`} size={40} />
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50" />
                    <button onClick={() => setIsEditorOpen(true)} className="absolute inset-0 z-10" title="Открыть расширенный редактор" aria-label="Открыть расширенный редактор"></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-center">
                <div className="inline-block p-4 bg-white rounded-lg">
                  <QRCode value={`https://card.example.com/${cardData.name || 'demo'}`} size={80} />
                </div>
                <p className="mt-2 text-sm text-gray-400">Ссылка на вашу цифровую визитку</p>
              </motion.div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-gray-700/50">
              <h4 className="font-semibold mb-4">Что получите:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                {[
                  { color: 'bg-green-400', title: 'Премиум NFC', text: 'Физическая карточка с долговечным покрытием' },
                  { color: 'bg-blue-400', title: 'Цифровая страница', text: 'Ваша персональная web-страница' },
                  { color: 'bg-purple-400', title: 'QR-код', text: 'Совместимость с любыми устройствами' },
                  { color: 'bg-yellow-400', title: 'Изменение данных', text: 'Обновляйте контакты без перевыпуска' },
                ].map((i, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/40">
                    <div className={`w-2 h-2 ${i.color} rounded-full mt-2`}></div>
                    <div>
                      <div className="font-medium text-white">{i.title}</div>
                      <div className="text-gray-400 text-xs">{i.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex space-x-1 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1">
              {[
                { id: 'personal', label: 'Личные данные', icon: '👤' },
                { id: 'contacts', label: 'Контакты', icon: '📱' },
                { id: 'design', label: 'Дизайн', icon: '🎨' }
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 px-4 rounded-md transition-all text-sm font-medium ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}>
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-400 text-center">Шаг {activeTab === 'personal' ? 1 : activeTab === 'contacts' ? 2 : 3} из 3</div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 space-y-6">
                  {activeTab === 'personal' && (<>
                    <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
                    <AnimatedInput label="Полное имя" name="name" register={register} errors={errors} icon="👤" placeholder="Иван Иванов" />
                    <AnimatedInput label="Должность" name="title" register={register} errors={errors} icon="💼" placeholder="Frontend Developer" />
                    <AnimatedInput label="Компания" name="company" register={register} errors={errors} icon="🏢" placeholder="Tech Company" />
                  </>)}
                  {activeTab === 'contacts' && (<>
                    <h3 className="text-lg font-semibold mb-4">Контактная информация</h3>
                    <AnimatedInput label="Телефон" name="phone" register={register} errors={errors} icon="📞" placeholder="+7 (999) 123-45-67" />
                    <AnimatedInput label="Email" name="email" type="email" register={register} errors={errors} icon="✉️" placeholder="email@example.com" />
                    <AnimatedInput label="Telegram" name="telegram" register={register} errors={errors} icon="✈️" placeholder="@username" />
                    <AnimatedInput label="VK" name="vk" register={register} errors={errors} icon="🔵" placeholder="vk.com/username" />
                    <AnimatedInput label="Instagram" name="instagram" register={register} errors={errors} icon="📷" placeholder="@username" />
                    <AnimatedInput label="Веб-сайт" name="website" register={register} errors={errors} icon="🌐" placeholder="https://example.com" />
                  </>)}
                  {activeTab === 'design' && (<>
                    <h3 className="text-lg font-semibold mb-4">Дизайн карточки</h3>
                    <div>
                      <label className="block text-sm font-medium mb-3">Шаблон дизайна</label>
                      <div className="grid grid-cols-2 gap-3">
                        {designTemplates.map((template) => (
                          <motion.div key={template.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${cardData.design === template.id ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'}`} onClick={() => setCardData(prev => ({ ...prev, design: template.id }))}>
                            <div className="aspect-[1.75/1] bg-gradient-to-br from-gray-700 to-gray-800 rounded mb-2"></div>
                            <div className="text-sm text-center">{template.name}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3">Цветовая схема</label>
                      <div className="grid grid-cols-2 gap-3">
                        {colorPalettes.map((palette, index) => (
                          <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${cardData.primaryColor === palette.primary ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'}`} onClick={() => setCardData(prev => ({ ...prev, primaryColor: palette.primary, secondaryColor: palette.secondary }))}>
                            <div className="flex space-x-2 mb-2">
                              <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.primary }}></div>
                              <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.secondary }}></div>
                            </div>
                            <div className="text-sm">{palette.name}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3">Стиль фона</label>
                      <div className="flex space-x-3">
                        <button type="button" onClick={() => setCardData(prev => ({ ...prev, backgroundStyle: 'gradient' }))} className={`px-4 py-2 rounded-lg transition-all ${cardData.backgroundStyle === 'gradient' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Градиент</button>
                        <button type="button" onClick={() => setCardData(prev => ({ ...prev, backgroundStyle: 'solid' }))} className={`px-4 py-2 rounded-lg transition-all ${cardData.backgroundStyle === 'solid' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Сплошной</button>
                      </div>
                    </div>
                  </>)}
                </motion.div>
              </AnimatePresence>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3 sm:py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all">Сохранить черновик</motion.button>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all shadow-lg">Заказать карточку</motion.button>
              </div>
              {submitState.status !== 'idle' && (
                <p className={`text-sm ${submitState.status === 'success' ? 'text-green-400' : submitState.status === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
                  {submitState.status === 'loading' ? 'Отправка...' : submitState.message}
                </p>
              )}
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-500/30">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Итого к оплате:</div>
                    <div className="text-sm text-gray-300">Включает доставку по России</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">1 990 ₽</div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      <CardEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} cardData={cardData} onChange={setCardData} />
    </div>
  )
}

const AnimatedInput = ({ label, name, register, errors, type = 'text', icon, placeholder }) => {
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
      <motion.label animate={{ y: focused || hasValue ? -28 : 0, scale: focused || hasValue ? 0.85 : 1, color: focused ? '#3b82f6' : '#9ca3af' }} className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none transition-colors font-medium">{label}</motion.label>
      <motion.input {...register(name, { required: true })} type={type} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={(e) => { setFocused(false); setHasValue(e.target.value.length > 0) }} whileFocus={{ borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' }} className="w-full h-12 sm:h-14 pl-12 pr-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white transition-all focus:outline-none backdrop-blur-sm text-base sm:text-lg" />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">{icon}</div>
      <AnimatePresence>
        {errors[name] && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-2 text-sm text-red-400">Поле обязательно для заполнения</motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CardCustomizer

