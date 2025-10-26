'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCardStore, type CardData } from '@/lib/store'
import { generateVCard } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { RotateCcw, Save, Box, SquareIcon, Upload, X, Image as ImageIcon } from 'lucide-react'
import QRCode from 'qrcode.react'

const Canvas3DView = dynamic(() => import('./canvas-3d-view'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p>Загрузка 3D...</p>
      </div>
    </div>
  ),
})

interface CardEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const presets = [
  { id: 'cyberpunk', name: 'Cyberpunk', primary: '#FF006E', secondary: '#3A86FF', emoji: '🎮' },
  { id: 'retro', name: 'Retro Wave', primary: '#FE00D7', secondary: '#240046', emoji: '🌆' },
  { id: 'matrix', name: 'Matrix', primary: '#00ff00', secondary: '#003300', emoji: '💚' },
  { id: 'holo', name: 'Holographic', primary: '#667eea', secondary: '#764ba2', emoji: '✨' },
  { id: 'minimal', name: 'Minimal Dark', primary: '#1A1A1A', secondary: '#1A1A1A', emoji: '⚫' },
  { id: 'ocean', name: 'Ocean Deep', primary: '#006994', secondary: '#00c6ff', emoji: '🌊' },
  { id: 'sunset', name: 'Sunset', primary: '#FF512F', secondary: '#F09819', emoji: '🌅' },
  { id: 'forest', name: 'Forest', primary: '#134E5E', secondary: '#71B280', emoji: '🌲' },
  { id: 'lavender', name: 'Lavender', primary: '#C471ED', secondary: '#F64F59', emoji: '💜' },
  { id: 'gold', name: 'Gold Luxury', primary: '#D4AF37', secondary: '#FFD700', emoji: '✨' },
]

const fontOptions = [
  { value: 'var(--font-inter)', label: 'Inter (По умолчанию)', displayFont: 'Inter' },
  { value: 'system-ui', label: 'System UI', displayFont: 'system-ui' },
  { value: 'var(--font-roboto)', label: 'Roboto', displayFont: 'Roboto' },
  { value: 'var(--font-open-sans)', label: 'Open Sans', displayFont: 'Open Sans' },
  { value: 'var(--font-montserrat)', label: 'Montserrat', displayFont: 'Montserrat' },
  { value: 'var(--font-poppins)', label: 'Poppins', displayFont: 'Poppins' },
  { value: 'var(--font-playfair)', label: 'Playfair Display', displayFont: 'Playfair Display' },
  { value: 'ui-monospace', label: 'Monospace', displayFont: 'ui-monospace' },
  { value: 'Georgia', label: 'Georgia', displayFont: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman', displayFont: 'Times New Roman' },
  { value: 'Arial', label: 'Arial', displayFont: 'Arial' },
  { value: 'Courier New', label: 'Courier New', displayFont: 'Courier New' },
]

export default function CardEditorDialog({ open, onOpenChange }: CardEditorDialogProps) {
  const { cardData, updateCardData, resetCardData } = useCardStore()
  const { showToast } = useToast()
  const [localData, setLocalData] = useState<CardData>(cardData)
  const [previewMode, setPreviewMode] = useState<'2d' | '3d'>('2d')
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bgInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setLocalData(cardData)
    }
  }, [open, cardData])

  const handleSave = () => {
    updateCardData(localData)
    onOpenChange(false)
    showToast('Изменения сохранены!', 'success')
  }

  const handleReset = () => {
    resetCardData()
    setLocalData(cardData)
    showToast('Карточка сброшена к значениям по умолчанию', 'info')
  }

  const updateLocal = (updates: Partial<CardData>) => {
    setLocalData((prev) => ({ ...prev, ...updates }))
  }

  const handleImageUpload = (type: 'logo' | 'background') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      showToast('Файл слишком большой! Максимум 2 МБ', 'error')
      return
    }

    if (!file.type.startsWith('image/')) {
      showToast('Пожалуйста, выберите изображение', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (type === 'logo') {
        updateLocal({ logo: base64 })
        showToast('Логотип загружен!', 'success')
      } else {
        updateLocal({ backgroundImage: base64 })
        showToast('Фоновое изображение загружено!', 'success')
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (type: 'logo' | 'background') => {
    if (type === 'logo') {
      updateLocal({ logo: undefined })
      showToast('Логотип удалён', 'info')
    } else {
      updateLocal({ backgroundImage: undefined })
      showToast('Фоновое изображение удалено', 'info')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full lg:max-w-7xl lg:max-h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-gray-900/98 via-gray-950/98 to-black/95 border-cyan-400/20">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-cyan-200">Расширенный редактор карточки</DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMode(previewMode === '2d' ? '3d' : '2d')}
                  className="hidden sm:flex"
                >
                  {previewMode === '2d' ? <Box className="h-4 w-4 mr-1" /> : <SquareIcon className="h-4 w-4 mr-1" />}
                  {previewMode === '2d' ? '3D' : '2D'}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="info" className="h-full flex flex-col lg:flex-row">
              <TabsList className="lg:hidden w-full justify-start rounded-none border-b border-white/10">
                <TabsTrigger value="info">Инфо</TabsTrigger>
                <TabsTrigger value="design">Дизайн</TabsTrigger>
                <TabsTrigger value="preview">Превью</TabsTrigger>
              </TabsList>
              <div className="hidden lg:block w-72 border-r border-white/10 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ОСНОВНАЯ ИНФОРМАЦИЯ</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-cyan-200/80">👤 Имя</Label>
                      <Input
                        value={localData.name}
                        onChange={(e) => updateLocal({ name: e.target.value })}
                        placeholder="Иван Иванов"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-cyan-200/80">💼 Должность</Label>
                      <Input
                        value={localData.title}
                        onChange={(e) => updateLocal({ title: e.target.value })}
                        placeholder="Frontend Developer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-cyan-200/80">🏢 Компания</Label>
                      <Input
                        value={localData.company}
                        onChange={(e) => updateLocal({ company: e.target.value })}
                        placeholder="Tech Company"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">КОНТАКТЫ</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-cyan-200/80">📞 Телефон</Label>
                      <Input
                        value={localData.phone}
                        onChange={(e) => updateLocal({ phone: e.target.value })}
                        placeholder="+7 (999) 123-45-67"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-cyan-200/80">✉️ Email</Label>
                      <Input
                        type="email"
                        value={localData.email}
                        onChange={(e) => updateLocal({ email: e.target.value })}
                        placeholder="email@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-cyan-200/80">🌐 Веб-сайт</Label>
                      <Input
                        value={localData.website}
                        onChange={(e) => updateLocal({ website: e.target.value })}
                        placeholder="https://example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">СОЦИАЛЬНЫЕ СЕТИ</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'telegram', label: '✈️ Telegram', placeholder: '@username' },
                      { key: 'vk', label: '🔵 VK', placeholder: 'vk.com/username' },
                      { key: 'instagram', label: '📷 Instagram', placeholder: '@username' },
                    ].map((field) => (
                      <div key={field.key}>
                        <Label className="text-xs text-cyan-200/80">{field.label}</Label>
                        <Input
                          value={localData[field.key as keyof CardData] as string}
                          onChange={(e) => updateLocal({ [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <TabsContent value="info" className="lg:hidden flex-1 overflow-y-auto p-4 space-y-6 mt-0">
                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ОСНОВНАЯ ИНФОРМАЦИЯ</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'name', label: '👤 Имя', placeholder: 'Иван Иванов' },
                      { key: 'title', label: '💼 Должность', placeholder: 'Frontend Developer' },
                      { key: 'company', label: '🏢 Компания', placeholder: 'Tech Company' },
                    ].map((field) => (
                      <div key={field.key}>
                        <Label className="text-xs text-cyan-200/80">{field.label}</Label>
                        <Input
                          value={localData[field.key as keyof CardData] as string}
                          onChange={(e) => updateLocal({ [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">КОНТАКТЫ</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'phone', label: '📞 Телефон', placeholder: '+7 (999) 123-45-67' },
                      { key: 'email', label: '✉️ Email', placeholder: 'email@example.com', type: 'email' },
                      { key: 'website', label: '🌐 Веб-сайт', placeholder: 'https://example.com' },
                      { key: 'telegram', label: '✈️ Telegram', placeholder: '@username' },
                      { key: 'vk', label: '🔵 VK', placeholder: 'vk.com/username' },
                      { key: 'instagram', label: '📷 Instagram', placeholder: '@username' },
                    ].map((field) => (
                      <div key={field.key}>
                        <Label className="text-xs text-cyan-200/80">{field.label}</Label>
                        <Input
                          type={field.type}
                          value={localData[field.key as keyof CardData] as string}
                          onChange={(e) => updateLocal({ [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="design" className="lg:hidden flex-1 overflow-y-auto p-4 space-y-6 mt-0">
                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ЦВЕТА</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-cyan-200/80">Основной</Label>
                      <Input
                        type="color"
                        value={localData.primaryColor}
                        onChange={(e) => updateLocal({ primaryColor: e.target.value })}
                        className="mt-1 h-12 cursor-pointer"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-cyan-200/80">Второй</Label>
                      <Input
                        type="color"
                        value={localData.secondaryColor}
                        onChange={(e) => updateLocal({ secondaryColor: e.target.value })}
                        className="mt-1 h-12 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant={localData.backgroundStyle === 'gradient' ? 'cyan' : 'ghost'}
                      onClick={() => updateLocal({ backgroundStyle: 'gradient' })}
                      className="flex-1"
                    >
                      Градиент
                    </Button>
                    <Button
                      variant={localData.backgroundStyle === 'solid' ? 'cyan' : 'ghost'}
                      onClick={() => updateLocal({ backgroundStyle: 'solid' })}
                      className="flex-1"
                    >
                      Сплошной
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ТЕКСТ</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-cyan-200/80">Цвет текста</Label>
                      <Input
                        type="color"
                        value={localData.textColor}
                        onChange={(e) => updateLocal({ textColor: e.target.value })}
                        className="mt-1 h-12 cursor-pointer"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-cyan-200/80">Шрифт</Label>
                      <Select
                        value={localData.fontFamily}
                        onValueChange={(value) => updateLocal({ fontFamily: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: font.displayFont }}>{font.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ЭФФЕКТЫ</h3>
                  <div className="space-y-2">
                    {[
                      { key: 'holographic', label: '✨ Holographic shine' },
                      { key: 'glitch', label: '⚡ Glitch' },
                      { key: 'pulse', label: '💫 Pulse' },
                    ].map((effect) => (
                      <div key={effect.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={effect.key}
                          checked={localData.effects[effect.key as keyof typeof localData.effects]}
                          onCheckedChange={(checked) =>
                            updateLocal({
                              effects: {
                                ...localData.effects,
                                [effect.key]: checked,
                              },
                            })
                          }
                        />
                        <Label htmlFor={effect.key} className="text-sm cursor-pointer">
                          {effect.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showQR"
                    checked={localData.showQR}
                    onCheckedChange={(checked) => updateLocal({ showQR: checked as boolean })}
                  />
                  <Label htmlFor="showQR" className="text-sm cursor-pointer">
                    Показать QR-код
                  </Label>
                </div>

                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ГОТОВЫЕ ПРЕСЕТЫ</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                    {presets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() =>
                          updateLocal({
                            primaryColor: preset.primary,
                            secondaryColor: preset.secondary,
                            backgroundStyle: preset.primary === preset.secondary ? 'solid' : 'gradient',
                          })
                        }
                        className="w-full text-left rounded-md p-2.5 bg-white/5 hover:bg-white/12 border border-white/10 hover:border-cyan-500/40 transition-all group"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-base">{preset.emoji}</span>
                          <div className="text-[10px] font-semibold text-cyan-100 leading-tight">{preset.name}</div>
                        </div>
                        <div
                          className="h-1.5 rounded-full group-hover:h-2 transition-all"
                          style={{
                            background: `linear-gradient(90deg, ${preset.primary}, ${preset.secondary})`,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <div className="hidden lg:flex flex-1 items-center justify-center p-6">
                {previewMode === '3d' ? (
                  <div className="w-full h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <Canvas3DView cardData={localData} />
                  </div>
                ) : (
                  <div className="w-full max-w-lg">
                    <div
                      className={`relative overflow-hidden rounded-xl shadow-2xl ${
                        localData.effects.holographic ? 'card-holographic' : ''
                      } ${localData.effects.glitch ? 'card-glitch' : ''} ${
                        localData.effects.pulse ? 'card-pulse' : ''
                      }`}
                      style={{
                        aspectRatio: '1.75/1',
                        background:
                          localData.backgroundStyle === 'gradient'
                            ? `linear-gradient(135deg, ${localData.primaryColor}, ${localData.secondaryColor})`
                            : localData.primaryColor,
                        color: localData.textColor,
                        fontFamily: localData.fontFamily,
                      }}
                    >
                      <div className="absolute left-0 top-0 p-6 h-full flex flex-col justify-between" style={{ width: '65%' }}>
                        <div>
                          <div className="text-[0.65rem] font-bold opacity-50 tracking-widest mb-3">DIGITAL CARD</div>
                          <div className="text-2xl font-bold mb-1.5 leading-tight">{localData.name || 'Ваше имя'}</div>
                          <div className="text-sm opacity-90 mb-1">{localData.title || 'Должность'}</div>
                          <div className="text-xs opacity-70 mb-3">{localData.company || 'Компания'}</div>
                        </div>
                        <div className="text-[0.65rem] opacity-80 space-y-1">
                          {localData.phone && (
                            <div className="flex items-center gap-1">
                              <span className="opacity-60 font-semibold text-[0.6rem]">Телефон:</span>
                              <span>{localData.phone}</span>
                            </div>
                          )}
                          {localData.email && (
                            <div className="flex items-center gap-1">
                              <span className="opacity-60 font-semibold text-[0.6rem]">Email:</span>
                              <span className="text-[0.6rem]">{localData.email}</span>
                            </div>
                          )}
                          {localData.website && (
                            <div className="flex items-center gap-1">
                              <span className="opacity-60 font-semibold text-[0.55rem]">Сайт:</span>
                              <span className="text-[0.55rem]">{localData.website}</span>
                            </div>
                          )}
                          {(localData.telegram || localData.vk || localData.instagram) && (
                            <div className="flex gap-1.5 mt-2 flex-wrap">
                              {localData.telegram && (
                                <div className="bg-white/10 px-2 py-0.5 rounded text-[0.6rem] flex items-center gap-1">
                                  ✈️ {localData.telegram}
                                </div>
                              )}
                              {localData.vk && (
                                <div className="bg-white/10 px-2 py-0.5 rounded text-[0.6rem] flex items-center gap-1">
                                  🔵 VK
                                </div>
                              )}
                              {localData.instagram && (
                                <div className="bg-white/10 px-2 py-0.5 rounded text-[0.6rem] flex items-center gap-1">
                                  📷 {localData.instagram}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 space-y-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className="h-0.5 rounded-full"
                            style={{ 
                              width: `${120 - i * 10}px`,
                              backgroundColor: localData.textColor,
                              opacity: 0.3 - i * 0.04
                            }}
                          />
                        ))}
                      </div>
                      <div className="absolute right-6 top-6">
                        <div className="relative w-10 h-10">
                          <div 
                            className="absolute inset-0 rounded-full border-2"
                            style={{ borderColor: '#ffd700' }}
                          />
                          <div 
                            className="absolute inset-2 rounded-full border-2"
                            style={{ borderColor: '#ffd700' }}
                          />
                          <div 
                            className="absolute inset-3.5 rounded-full border-2"
                            style={{ borderColor: '#ffd700' }}
                          />
                          <div 
                            className="absolute inset-4.5 rounded-full"
                            style={{ backgroundColor: '#ffaa00' }}
                          />
                        </div>
                      </div>
                      {localData.showQR && (
                        <div className="absolute bottom-6 right-6 bg-white p-2 rounded">
                          <QRCode value={generateVCard(localData)} size={40} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <TabsContent value="preview" className="lg:hidden flex-1 p-4 mt-0">
                <div className="h-full flex items-center justify-center">
                  <div
                    className={`relative overflow-hidden rounded-xl shadow-2xl w-full ${
                      localData.effects.holographic ? 'card-holographic' : ''
                    } ${localData.effects.glitch ? 'card-glitch' : ''} ${
                      localData.effects.pulse ? 'card-pulse' : ''
                    }`}
                    style={{
                      aspectRatio: '1.75/1',
                      background:
                        localData.backgroundStyle === 'gradient'
                          ? `linear-gradient(135deg, ${localData.primaryColor}, ${localData.secondaryColor})`
                          : localData.primaryColor,
                      color: localData.textColor,
                      fontFamily: localData.fontFamily,
                    }}
                  >
                    <div className="absolute left-0 top-0 p-6 h-full flex flex-col justify-start" style={{ width: '60%' }}>
                      <div className="text-[0.65rem] font-bold opacity-50 tracking-widest mb-3">DIGITAL CARD</div>
                      <div className="text-2xl font-bold mb-1.5 leading-tight">{localData.name || 'Ваше имя'}</div>
                      <div className="text-sm opacity-90 mb-1">{localData.title || 'Должность'}</div>
                      <div className="text-xs opacity-70">{localData.company || 'Компания'}</div>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className="h-0.5 rounded-full"
                          style={{ 
                            width: `${100 - i * 8}px`,
                            backgroundColor: localData.textColor,
                            opacity: 0.3 - i * 0.04
                          }}
                        />
                      ))}
                    </div>
                    <div className="absolute right-4 top-4">
                      <div className="relative w-8 h-8">
                        <div 
                          className="absolute inset-0 rounded-full border-2"
                          style={{ borderColor: '#ffd700' }}
                        />
                        <div 
                          className="absolute inset-1.5 rounded-full border-2"
                          style={{ borderColor: '#ffd700' }}
                        />
                        <div 
                          className="absolute inset-3 rounded-full border"
                          style={{ borderColor: '#ffd700' }}
                        />
                        <div 
                          className="absolute inset-3.5 rounded-full"
                          style={{ backgroundColor: '#ffaa00' }}
                        />
                      </div>
                    </div>
                    {localData.showQR && (
                      <div className="absolute bottom-4 right-4 bg-white p-1.5 rounded">
                        <QRCode value={generateVCard(localData)} size={32} />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <div className="hidden lg:block w-64 border-l border-white/10 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ЦВЕТА</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-cyan-200/80">Основной</Label>
                      <Input
                        type="color"
                        value={localData.primaryColor}
                        onChange={(e) => updateLocal({ primaryColor: e.target.value })}
                        className="mt-1 h-12 cursor-pointer"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-cyan-200/80">Второй</Label>
                      <Input
                        type="color"
                        value={localData.secondaryColor}
                        onChange={(e) => updateLocal({ secondaryColor: e.target.value })}
                        className="mt-1 h-12 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-3">
                    <Button
                      variant={localData.backgroundStyle === 'gradient' ? 'cyan' : 'ghost'}
                      onClick={() => updateLocal({ backgroundStyle: 'gradient' })}
                      size="sm"
                    >
                      Градиент
                    </Button>
                    <Button
                      variant={localData.backgroundStyle === 'solid' ? 'cyan' : 'ghost'}
                      onClick={() => updateLocal({ backgroundStyle: 'solid' })}
                      size="sm"
                    >
                      Сплошной
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ТЕКСТ</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-cyan-200/80">Цвет текста</Label>
                      <Input
                        type="color"
                        value={localData.textColor}
                        onChange={(e) => updateLocal({ textColor: e.target.value })}
                        className="mt-1 h-12 cursor-pointer"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-cyan-200/80">Шрифт</Label>
                      <Select
                        value={localData.fontFamily}
                        onValueChange={(value) => updateLocal({ fontFamily: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: font.displayFont }}>{font.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ЭФФЕКТЫ</h3>
                  <div className="space-y-2">
                    {[
                      { key: 'holographic', label: '✨ Holographic' },
                      { key: 'glitch', label: '⚡ Glitch' },
                      { key: 'pulse', label: '💫 Pulse' },
                    ].map((effect) => (
                      <div key={effect.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`desktop-${effect.key}`}
                          checked={localData.effects[effect.key as keyof typeof localData.effects]}
                          onCheckedChange={(checked) =>
                            updateLocal({
                              effects: {
                                ...localData.effects,
                                [effect.key]: checked,
                              },
                            })
                          }
                        />
                        <Label htmlFor={`desktop-${effect.key}`} className="text-sm cursor-pointer">
                          {effect.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="desktop-showQR"
                    checked={localData.showQR}
                    onCheckedChange={(checked) => updateLocal({ showQR: checked as boolean })}
                  />
                  <Label htmlFor="desktop-showQR" className="text-sm cursor-pointer">
                    Показать QR
                  </Label>
                </div>

                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ГОТОВЫЕ ПРЕСЕТЫ</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                    {presets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() =>
                          updateLocal({
                            primaryColor: preset.primary,
                            secondaryColor: preset.secondary,
                            backgroundStyle: preset.primary === preset.secondary ? 'solid' : 'gradient',
                          })
                        }
                        className="w-full text-left rounded-md p-2.5 bg-white/5 hover:bg-white/12 border border-white/10 hover:border-cyan-500/40 transition-all group"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-base">{preset.emoji}</span>
                          <div className="text-[10px] font-semibold text-cyan-100 leading-tight">{preset.name}</div>
                        </div>
                        <div
                          className="h-1.5 rounded-full group-hover:h-2 transition-all"
                          style={{
                            background: `linear-gradient(90deg, ${preset.primary}, ${preset.secondary})`,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">ИЗОБРАЖЕНИЯ</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-cyan-200/80 mb-2 block">🖼️ Логотип</Label>
                      {localData.logo ? (
                        <div className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={localData.logo} 
                            alt="Logo" 
                            className="w-full h-24 object-contain bg-white/5 rounded-lg border border-white/10"
                          />
                          <button
                            onClick={() => removeImage('logo')}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => logoInputRef.current?.click()}
                          className="w-full h-20 border-2 border-dashed border-white/20 hover:border-cyan-500/50 rounded-lg flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-all group"
                        >
                          <Upload className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs text-cyan-200/80">Загрузить</span>
                        </button>
                      )}
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload('logo')}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-cyan-200/80 mb-2 block">🎨 Фон</Label>
                      {localData.backgroundImage ? (
                        <div className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={localData.backgroundImage} 
                            alt="Background" 
                            className="w-full h-24 object-cover rounded-lg border border-white/10"
                          />
                          <button
                            onClick={() => removeImage('background')}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => bgInputRef.current?.click()}
                          className="w-full h-20 border-2 border-dashed border-white/20 hover:border-cyan-500/50 rounded-lg flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-all group"
                        >
                          <ImageIcon className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs text-cyan-200/80">Загрузить</span>
                        </button>
                      )}
                      <input
                        ref={bgInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload('background')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
          <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row gap-2 justify-end">
            <Button variant="yellow" onClick={handleReset} className="sm:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
            <Button variant="cyan" onClick={handleSave} className="sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

