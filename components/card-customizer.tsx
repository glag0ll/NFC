'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useCardStore } from '@/lib/store'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CardPreview from './card-preview'
import CardEditorDialog from './card-editor-dialog'
import { Pencil, User, Phone, Palette, Save, CheckCircle2 } from 'lucide-react'

export default function CardCustomizer() {
  const { cardData, updateCardData } = useCardStore()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('personal')
  const [editorOpen, setEditorOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    const draft = localStorage.getItem('nfc-card-draft')
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        updateCardData(parsedDraft)
        showToast('Черновик восстановлен', 'info')
      } catch (e) {
        console.error('Ошибка загрузки черновика')
      }
    }
  }, [updateCardData, showToast])

  const completionProgress = useMemo(() => {
    const fields = [
      cardData.name,
      cardData.title,
      cardData.company,
      cardData.phone,
      cardData.email,
    ]
    const filledFields = fields.filter(field => field && field.trim().length > 0).length
    return Math.round((filledFields / fields.length) * 100)
  }, [cardData])

  const saveDraft = () => {
    try {
      localStorage.setItem('nfc-card-draft', JSON.stringify(cardData))
      showToast('Черновик сохранён!', 'success')
    } catch (error) {
      showToast('Ошибка сохранения черновика', 'error')
    }
  }

  const onSubmit = async (data: any) => {
    if (!cardData.name || !cardData.phone || !cardData.email) {
      showToast('Заполните обязательные поля: Имя, Телефон, Email', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cardData, ...data }),
      })
      
      if (response.ok) {
        showToast('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success')
        localStorage.removeItem('nfc-card-draft')
      } else {
        showToast('Ошибка отправки заявки. Попробуйте еще раз.', 'error')
      }
    } catch (error) {
      showToast('Ошибка сети. Проверьте подключение к интернету.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const colorPalettes = [
    { primary: '#3b82f6', secondary: '#8b5cf6', name: 'Синий', icon: '💙' },
    { primary: '#10b981', secondary: '#06b6d4', name: 'Зеленый', icon: '💚' },
    { primary: '#f59e0b', secondary: '#ef4444', name: 'Оранжевый', icon: '🧡' },
    { primary: '#8b5cf6', secondary: '#ec4899', name: 'Фиолетовый', icon: '💜' },
    { primary: '#ef4444', secondary: '#dc2626', name: 'Красный', icon: '❤️' },
    { primary: '#06b6d4', secondary: '#0891b2', name: 'Бирюзовый', icon: '🩵' },
    { primary: '#eab308', secondary: '#f59e0b', name: 'Желтый', icon: '💛' },
    { primary: '#ec4899', secondary: '#d946ef', name: 'Розовый', icon: '🩷' },
  ]

  return (
    <section
      id="customizer"
      className="relative min-h-screen text-white py-12 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/75 via-blue-950/55 to-purple-950/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-cyan-500/15 rounded-full blur-[110px]" />
      <div className="absolute bottom-1/4 right-0 w-[900px] h-[900px] bg-purple-500/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
        >
          Создай свою уникальную NFC карточку
        </motion.h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left: Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <CardPreview />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Заполнено</span>
                <span className="text-sm font-bold text-cyan-400">{completionProgress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full transition-all ${
                    completionProgress === 100
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                />
              </div>
              {completionProgress === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2 text-green-400 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Карточка готова к заказу!</span>
                </motion.div>
              )}
            </motion.div>
            <Button
              onClick={() => setEditorOpen(true)}
              variant="cyan"
              size="lg"
              className="w-full glow-on-hover magnetic-button group"
            >
              <Pencil className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Расширенный редактор
            </Button>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h4 className="font-semibold mb-4">Что получите:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                {[
                  { color: 'bg-green-400', title: 'Премиум NFC', text: 'Физическая карточка с долговечным покрытием' },
                  { color: 'bg-blue-400', title: 'Цифровая страница', text: 'Ваша персональная web-страница' },
                  { color: 'bg-purple-400', title: 'QR-код', text: 'Совместимость с любыми устройствами' },
                  { color: 'bg-yellow-400', title: 'Изменение данных', text: 'Обновляйте контакты без перевыпуска' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/40">
                    <div className={`w-2 h-2 ${item.color} rounded-full mt-2`} />
                    <div>
                      <div className="font-medium text-white">{item.title}</div>
                      <div className="text-gray-400 text-xs">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Личные</span>
                </TabsTrigger>
                <TabsTrigger value="contacts" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">Контакты</span>
                </TabsTrigger>
                <TabsTrigger value="design" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Дизайн</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <TabsContent value="personal" className="space-y-4 mt-0">
                    <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2">
                          Полное имя <span className="text-red-400 text-sm">*</span>
                        </Label>
                        <Input
                          id="name"
                          {...register('name', { required: true })}
                          value={cardData.name}
                          onChange={(e) => updateCardData({ name: e.target.value })}
                          placeholder="Иван Иванов"
                          className={`mt-1 ${!cardData.name && 'border-red-500/50'}`}
                        />
                        {!cardData.name && (
                          <p className="text-xs text-red-400 mt-1">Обязательное поле</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="title">Должность</Label>
                        <Input
                          id="title"
                          {...register('title')}
                          value={cardData.title}
                          onChange={(e) => updateCardData({ title: e.target.value })}
                          placeholder="Frontend Developer"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Компания</Label>
                        <Input
                          id="company"
                          {...register('company')}
                          value={cardData.company}
                          onChange={(e) => updateCardData({ company: e.target.value })}
                          placeholder="Tech Company"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="contacts" className="space-y-4 mt-0">
                    <h3 className="text-lg font-semibold mb-4">Контактная информация</h3>
                    <div className="space-y-4">
                      {/* Телефон */}
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          📞 Телефон <span className="text-red-400 text-sm">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...register('phone', { required: true })}
                          value={cardData.phone}
                          onChange={(e) => updateCardData({ phone: e.target.value })}
                          placeholder="+7 (999) 123-45-67"
                          className={`mt-1 ${!cardData.phone && 'border-red-500/50'}`}
                        />
                        {!cardData.phone && (
                          <p className="text-xs text-red-400 mt-1">Обязательное поле</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2">
                          ✉️ Email <span className="text-red-400 text-sm">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                          value={cardData.email}
                          onChange={(e) => updateCardData({ email: e.target.value })}
                          placeholder="email@example.com"
                          className={`mt-1 ${!cardData.email && 'border-red-500/50'}`}
                        />
                        {!cardData.email && (
                          <p className="text-xs text-red-400 mt-1">Обязательное поле</p>
                        )}
                      </div>
                      {[
                        { id: 'telegram', label: 'Telegram', icon: '✈️', placeholder: '@username' },
                        { id: 'vk', label: 'VK', icon: '🔵', placeholder: 'vk.com/username' },
                        { id: 'instagram', label: 'Instagram', icon: '📷', placeholder: '@username' },
                        { id: 'website', label: 'Веб-сайт', icon: '🌐', placeholder: 'https://example.com' },
                      ].map((field) => (
                        <div key={field.id}>
                          <Label htmlFor={field.id}>
                            {field.icon} {field.label}
                          </Label>
                          <Input
                            id={field.id}
                            {...register(field.id)}
                            value={cardData[field.id as keyof typeof cardData] as string}
                            onChange={(e) => updateCardData({ [field.id]: e.target.value })}
                            placeholder={field.placeholder}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="design" className="space-y-4 mt-0">
                    <h3 className="text-lg font-semibold mb-4">Дизайн карточки</h3>

                    <div>
                      <Label>Готовые цветовые схемы</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                        {colorPalettes.map((palette, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              cardData.primaryColor === palette.primary
                                ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20'
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                            onClick={() =>
                              updateCardData({ primaryColor: palette.primary, secondaryColor: palette.secondary })
                            }
                          >
                            <div className="flex space-x-2 mb-2">
                              <div 
                                className="w-6 h-6 rounded shadow-md" 
                                style={{ backgroundColor: palette.primary }} 
                              />
                              <div 
                                className="w-6 h-6 rounded shadow-md" 
                                style={{ backgroundColor: palette.secondary }} 
                              />
                            </div>
                            <div className="text-xs font-medium flex items-center gap-1">
                              <span>{palette.icon}</span>
                              <span>{palette.name}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Стиль фона</Label>
                      <div className="flex space-x-3 mt-2">
                        <Button
                          type="button"
                          onClick={() => updateCardData({ backgroundStyle: 'gradient' })}
                          variant={cardData.backgroundStyle === 'gradient' ? 'cyan' : 'outline'}
                          className="flex-1"
                        >
                          Градиент
                        </Button>
                        <Button
                          type="button"
                          onClick={() => updateCardData({ backgroundStyle: 'solid' })}
                          variant={cardData.backgroundStyle === 'solid' ? 'cyan' : 'outline'}
                          className="flex-1"
                        >
                          Сплошной
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="button" 
                    onClick={saveDraft}
                    variant="secondary" 
                    className="flex-1 group"
                  >
                    <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Сохранить черновик
                  </Button>
                  <Button 
                    type="submit" 
                    variant="cyan" 
                    className="flex-1 glow-on-hover"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Отправка...
                      </>
                    ) : (
                      'Заказать карточку'
                    )}
                  </Button>
                </div>

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
            </Tabs>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-950/40 via-transparent to-transparent" />
      <CardEditorDialog open={editorOpen} onOpenChange={setEditorOpen} />
    </section>
  )
}

