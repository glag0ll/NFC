import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import EditorVHSBackground from './EditorVHSBackground.jsx'

const presets = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    primary: '#FF006E',
    secondary: '#3A86FF',
  },
  {
    id: 'retro',
    name: 'Retro Wave',
    primary: '#FE00D7',
    secondary: '#240046',
  },
  {
    id: 'matrix',
    name: 'Matrix',
    primary: '#000000',
    secondary: '#000000',
  },
  {
    id: 'holo',
    name: 'Holographic',
    primary: '#667eea',
    secondary: '#764ba2',
  },
  {
    id: 'minimal',
    name: 'Minimal Dark',
    primary: '#1A1A1A',
    secondary: '#1A1A1A',
  },
]

const fontOptions = ['Inter', 'system-ui', 'ui-sans-serif', 'ui-monospace', 'monospace', 'serif']

const CardEditorModal = ({ isOpen, onClose, cardData, onChange }) => {
  const [localData, setLocalData] = useState(cardData)
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [fontFamily, setFontFamily] = useState('Inter')
  const [effects, setEffects] = useState({ holographic: true, glitch: false, pulse: false })
  const [isFlipped, setIsFlipped] = useState(false)
  const [showQR, setShowQR] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setLocalData(cardData)
    }
  }, [isOpen, cardData])

  const bgStyle = useMemo(() => {
    if (localData.backgroundStyle === 'solid') return localData.primaryColor
    return `linear-gradient(135deg, ${localData.primaryColor}, ${localData.secondaryColor})`
  }, [localData])

  const effectClasses = useMemo(() => {
    const arr = ['editor-card']
    if (effects.holographic) arr.push('editor-card-holographic')
    if (effects.glitch) arr.push('editor-glitch')
    if (effects.pulse) arr.push('editor-pulse')
    return arr.join(' ')
  }, [effects])

  const handleSave = () => {
    onChange({
      ...cardData,
      name: localData.name,
      title: localData.title,
      company: localData.company,
      phone: localData.phone,
      email: localData.email,
      telegram: localData.telegram,
      vk: localData.vk,
      instagram: localData.instagram,
      website: localData.website,
      backgroundStyle: localData.backgroundStyle,
      primaryColor: localData.primaryColor,
      secondaryColor: localData.secondaryColor,
      design: localData.design,
    })
    onClose()
  }

  const CardFace = ({ back = false }) => (
    <div
      className={`absolute inset-0 rounded-2xl shadow-2xl ${effectClasses}`}
      style={{ background: bgStyle, backfaceVisibility: 'hidden', transform: back ? 'rotateY(180deg)' : 'none' }}
    >
      <div className="relative h-full w-full p-6 flex flex-col justify-between">
        <div>
          {!back && (
            <>
              <div className="text-xs font-semibold opacity-75 mb-2" style={{ color: textColor }}>DIGITAL CARD</div>
              <div
                className="text-xl font-bold outline-none"
                style={{ color: textColor, fontFamily }}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setLocalData((p) => ({ ...p, name: e.target.textContent || '' }))}
              >
                {localData.name || 'Ваше имя'}
              </div>
              <div
                className="text-sm opacity-90 outline-none"
                style={{ color: textColor, fontFamily }}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setLocalData((p) => ({ ...p, title: e.target.textContent || '' }))}
              >
                {localData.title || 'Должность'}
              </div>
              <div
                className="text-xs opacity-80 outline-none"
                style={{ color: textColor, fontFamily }}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setLocalData((p) => ({ ...p, company: e.target.textContent || '' }))}
              >
                {localData.company || 'Компания'}
              </div>
            </>
          )}
          {back && (
            <>
              <div className="text-center">
                <div className="text-base font-semibold" style={{ color: textColor, fontFamily }}>{localData.company || 'Компания'}</div>
                <div className="text-xs opacity-80" style={{ color: textColor }}>{localData.website || 'website.com'}</div>
              </div>
            </>
          )}
        </div>
        <div className="flex items-end justify-between">
          {!back && (
            <div className="space-y-1 text-xs">
              <div className="outline-none" style={{ color: textColor }} contentEditable suppressContentEditableWarning onBlur={(e) => setLocalData((p) => ({ ...p, phone: e.target.textContent || '' }))}>{localData.phone || '+7 (999) 123-45-67'}</div>
              <div className="outline-none" style={{ color: textColor }} contentEditable suppressContentEditableWarning onBlur={(e) => setLocalData((p) => ({ ...p, email: e.target.textContent || '' }))}>{localData.email || 'email@example.com'}</div>
            </div>
          )}
          {showQR && (
            <div className="bg-white/90 rounded p-3 text-[10px] font-semibold text-gray-900 select-none">QR</div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <EditorVHSBackground />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="absolute inset-4 sm:inset-8 rounded-2xl bg-gradient-to-br from-gray-900/95 via-gray-950/95 to-black/90 border border-cyan-400/10 shadow-[0_0_40px_rgba(0,245,255,0.08)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5">
              <div className="text-sm sm:text-base font-semibold text-cyan-200">Расширенный редактор карточки</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsFlipped((v) => !v)} className="px-3 py-1.5 rounded-md text-xs sm:text-sm bg-white/5 hover:bg-white/10 text-white">Перевернуть</button>
                <button onClick={onClose} className="px-3 py-1.5 rounded-md text-xs sm:text-sm bg-white/5 hover:bg-white/10 text-white">Закрыть</button>
              </div>
            </div>

            {/* Content */}
            <div className="h-full grid grid-cols-1 lg:grid-cols-[300px_1fr_260px]">
              {/* Left controls */}
              <div className="hidden lg:block h-full overflow-y-auto p-4 border-r border-white/5">
                <div className="text-cyan-300 font-semibold mb-2 text-sm">Инфо</div>
                {[
                  { key: 'name', label: 'Имя' },
                  { key: 'title', label: 'Должность' },
                  { key: 'company', label: 'Компания' },
                  { key: 'phone', label: 'Телефон' },
                  { key: 'email', label: 'Email' },
                  { key: 'website', label: 'Веб-сайт' },
                ].map((f) => (
                  <div key={f.key} className="mb-3">
                    <label className="block text-[11px] uppercase tracking-wide text-cyan-200/80 mb-1">{f.label}</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40"
                      value={localData[f.key] || ''}
                      onChange={(e) => setLocalData((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.label}
                    />
                  </div>
                ))}

                <div className="mt-6 text-cyan-300 font-semibold mb-2 text-sm">Цвета</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wide text-cyan-200/80 mb-1">Основной</label>
                    <input type="color" className="w-full h-9 bg-white/5 border border-white/10 rounded" value={localData.primaryColor} onChange={(e) => setLocalData((p) => ({ ...p, primaryColor: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wide text-cyan-200/80 mb-1">Второй</label>
                    <input type="color" className="w-full h-9 bg-white/5 border border-white/10 rounded" value={localData.secondaryColor} onChange={(e) => setLocalData((p) => ({ ...p, secondaryColor: e.target.value }))} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => setLocalData((p) => ({ ...p, backgroundStyle: 'gradient' }))} className={`px-3 py-1.5 rounded-md text-xs ${localData.backgroundStyle === 'gradient' ? 'bg-cyan-500/20 text-cyan-200' : 'bg-white/5 text-white/80'}`}>Градиент</button>
                  <button onClick={() => setLocalData((p) => ({ ...p, backgroundStyle: 'solid' }))} className={`px-3 py-1.5 rounded-md text-xs ${localData.backgroundStyle === 'solid' ? 'bg-cyan-500/20 text-cyan-200' : 'bg-white/5 text-white/80'}`}>Сплошной</button>
                </div>

                <div className="mt-6 text-cyan-300 font-semibold mb-2 text-sm">Текст</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wide text-cyan-200/80 mb-1">Цвет текста</label>
                    <input type="color" className="w-full h-9 bg-white/5 border border-white/10 rounded" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wide text-cyan-200/80 mb-1">Шрифт</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded px-2 py-2 text-sm text-white" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                      {fontOptions.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 text-cyan-300 font-semibold mb-2 text-sm">Эффекты</div>
                {[
                  { key: 'holographic', label: 'Holographic shine' },
                  { key: 'glitch', label: 'Glitch' },
                  { key: 'pulse', label: 'Pulse' },
                ].map((ef) => (
                  <label key={ef.key} className="flex items-center gap-2 text-sm text-white/90 mb-2">
                    <input type="checkbox" className="accent-cyan-400" checked={effects[ef.key]} onChange={(e) => setEffects((p) => ({ ...p, [ef.key]: e.target.checked }))} />
                    {ef.label}
                  </label>
                ))}

                <label className="flex items-center gap-2 text-sm text-white/90 mt-3">
                  <input type="checkbox" className="accent-cyan-400" checked={showQR} onChange={(e) => setShowQR(e.target.checked)} />
                  Показать QR
                </label>
              </div>

              {/* Preview with reflection */}
              <div className="relative flex items-center justify-center p-4">
                <div className="[perspective:1200px]">
                  <div
                    className="relative w-[340px] h-[215px] sm:w-[420px] sm:h-[265px] rounded-2xl [transform-style:preserve-3d] duration-500 mx-auto"
                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  >
                    <CardFace back={false} />
                    <CardFace back />
                  </div>
                  {/* reflection clone */}
                  <div className="mt-4 opacity-40 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent)]">
                    <div
                      className="relative w-[340px] h-[215px] sm:w-[420px] sm:h-[265px] rounded-2xl [transform-style:preserve-3d] duration-500 mx-auto scale-y-[-1]"
                      style={{ transform: (isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)') + ' scaleY(-1)' }}
                    >
                      <CardFace back={false} />
                      <CardFace back />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right presets */}
              <div className="hidden lg:block h-full overflow-y-auto p-4 border-l border-white/5">
                <div className="text-cyan-300 font-semibold mb-2 text-sm">Пресеты</div>
                <div className="grid grid-cols-1 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setLocalData((d) => ({ ...d, primaryColor: p.primary, secondaryColor: p.secondary, backgroundStyle: p.primary === p.secondary ? 'solid' : 'gradient' }))}
                      className="w-full text-left rounded-md p-3 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <div className="text-xs font-semibold text-cyan-100">{p.name}</div>
                      <div className="h-2 mt-2 rounded" style={{ background: `linear-gradient(90deg, ${p.primary}, ${p.secondary})` }} />
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <button onClick={handleSave} className="px-3 py-2 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 text-sm">Сохранить</button>
                  <button onClick={onClose} className="px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white/90 text-sm">Отмена</button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CardEditorModal


