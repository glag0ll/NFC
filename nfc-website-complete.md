# NFC Cards Website - Полное техническое решение

## Описание проекта
Современный веб-сайт для продажи NFC-карточек с индивидуальным дизайном. Пользователи могут настраивать внешний вид карточки, вводить свои данные и заказывать персонализированные NFC-карты, которые будут открывать их цифровую визитку при прикосновении к телефону.

## Технический стек

### Основные технологии
- **React 18** - основная библиотека для UI
- **TypeScript** - типизация для надежности кода
- **Vite** - быстрая сборка проекта
- **Tailwind CSS** - утилитарные стили

### Анимационные библиотеки
- **Framer Motion** - основные анимации и переходы
- **Three.js** + **@react-three/fiber** - 3D визуализация карточек
- **GSAP** - сложные анимационные последовательности
- **Lottie React** - дизайнерские анимации
- **React Spring** - физические анимации

### Дополнительные библиотеки
- **React Router DOM** - маршрутизация
- **React Hook Form** - работа с формами
- **Axios** - HTTP запросы
- **React Intersection Observer** - анимации при прокрутке

## Структура проекта

```
nfc-cards-website/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── models/           # 3D модели карточек
│       ├── textures/         # Текстуры для 3D
│       └── animations/       # Lottie файлы
├── src/
│   ├── components/
│   │   ├── UI/              # Базовые UI компоненты
│   │   ├── Layout/          # Компоненты макета
│   │   ├── CardCustomizer/  # Настройщик карточек
│   │   ├── 3D/              # 3D компоненты
│   │   └── Animations/      # Анимационные компоненты
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── types/
│   └── services/
├── package.json
└── README.md
```

## Ключевые компоненты

### 1. Hero секция с 3D анимацией

```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text3D, Float } from '@react-three/drei'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
    >
      {/* Particles Background */}
      <div className="absolute inset-0">
        <ParticlesBackground />
      </div>
      
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Float speed={2} rotationIntensity={1}>
            <NFCCard3D />
          </Float>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center text-white"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Создай свою NFC карточку
          </h1>
          <p className="text-xl mb-8">
            Персональная цифровая визитка в одном прикосновении
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-lg font-semibold"
          >
            Начать создание
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  )
}
```

### 2. Интерактивный настройщик карточек

```jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'

const CardCustomizer = () => {
  const [cardData, setCardData] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    telegram: '',
    vk: '',
    design: 'modern',
    color: '#3b82f6'
  })

  const [activeTab, setActiveTab] = useState('personal')

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* 3D Preview */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-2xl font-bold mb-6 text-center">Предпросмотр</h3>
            
            {/* 3D Card Preview */}
            <div className="h-96 rounded-xl overflow-hidden">
              <Canvas camera={{ position: [0, 0, 8] }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} />
                <NFCCard3DPreview 
                  cardData={cardData}
                  design={cardData.design}
                  color={cardData.color}
                />
                <OrbitControls 
                  enableZoom={false}
                  autoRotate
                  autoRotateSpeed={2}
                />
              </Canvas>
            </div>
            
            {/* QR Code Demo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <div className="inline-block p-4 bg-white rounded-lg">
                <QRCodeSVG value={`https://mycard.com/${cardData.name}`} size={100} />
              </div>
              <p className="mt-2 text-sm text-gray-400">QR код для устройств без NFC</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Customization Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {['personal', 'contacts', 'design'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'personal' && 'Личные данные'}
                {tab === 'contacts' && 'Контакты'}
                {tab === 'design' && 'Дизайн'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800"
            >
              {activeTab === 'personal' && (
                <PersonalDataForm cardData={cardData} setCardData={setCardData} />
              )}
              {activeTab === 'contacts' && (
                <ContactsForm cardData={cardData} setCardData={setCardData} />
              )}
              {activeTab === 'design' && (
                <DesignForm cardData={cardData} setCardData={setCardData} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-lg font-semibold"
            >
              Предпросмотр
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold"
            >
              Заказать карточку
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
```

### 3. 3D модель NFC карточки

```jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const NFCCard3DPreview = ({ cardData, design, color }) => {
  const cardRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <group>
      {/* Glow Effect */}
      <RoundedBox
        ref={glowRef}
        args={[3.6, 2.3, 0.05]}
        radius={0.1}
        position={[0, 0, -0.05]}
      >
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </RoundedBox>

      {/* Main Card */}
      <RoundedBox
        ref={cardRef}
        args={[3.5, 2.2, 0.1]}
        radius={0.1}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Card Content */}
      <group position={[0, 0, 0.06]}>
        {/* Name */}
        <Text
          position={[-1.5, 0.5, 0]}
          fontSize={0.2}
          color="white"
          anchorX="left"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {cardData.name || 'Ваше имя'}
        </Text>

        {/* Title */}
        <Text
          position={[-1.5, 0.2, 0]}
          fontSize={0.12}
          color="#cccccc"
          anchorX="left"
          anchorY="middle"
        >
          {cardData.title || 'Должность'}
        </Text>

        {/* Company */}
        <Text
          position={[-1.5, -0.1, 0]}
          fontSize={0.1}
          color="#aaaaaa"
          anchorX="left"
          anchorY="middle"
        >
          {cardData.company || 'Компания'}
        </Text>

        {/* NFC Icon */}
        <mesh position={[1.2, -0.7, 0]}>
          <circleGeometry args={[0.15]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>

        {/* QR Code Area */}
        <mesh position={[1.2, 0.3, 0]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    </group>
  )
}
```

### 4. Форма с анимированными полями

```jsx
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'

const AnimatedInput = ({ label, name, register, errors, type = "text", icon }) => {
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Floating Label */}
      <motion.label
        animate={{
          y: focused || hasValue ? -25 : 0,
          scale: focused || hasValue ? 0.85 : 1,
          color: focused ? '#3b82f6' : '#9ca3af'
        }}
        className="absolute left-3 top-3 pointer-events-none transition-colors"
      >
        {label}
      </motion.label>

      {/* Input Field */}
      <motion.input
        {...register(name, { required: true })}
        type={type}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false)
          setHasValue(e.target.value.length > 0)
        }}
        whileFocus={{
          borderColor: '#3b82f6',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
        }}
        className="w-full p-4 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white transition-all"
      />

      {/* Icon */}
      <div className="absolute left-4 top-4 text-gray-400">
        {icon}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {errors[name] && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-red-400"
          >
            Поле обязательно для заполнения
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

### 5. Анимация частиц на фоне

```jsx
import { useCallback } from 'react'
import Particles from 'react-particles'
import { loadSlim } from 'tsparticles-slim'

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"],
          },
          links: {
            color: "#3b82f6",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
      }}
    />
  )
}
```

## Интеграция с backend

### API endpoints
- `POST /api/cards` - создание заказа карточки
- `GET /api/templates` - получение шаблонов дизайна
- `POST /api/preview` - генерация превью карточки
- `GET /api/orders/:id` - статус заказа

### Структура данных карточки
```typescript
interface NFCCardData {
  id: string
  personalInfo: {
    name: string
    title: string
    company: string
    bio?: string
  }
  contacts: {
    phone?: string
    email?: string
    website?: string
    telegram?: string
    vk?: string
    instagram?: string
    linkedin?: string
  }
  design: {
    template: string
    colors: {
      primary: string
      secondary: string
      accent: string
    }
    logo?: string
    background?: string
  }
  nfcData: {
    url: string
    enabled: boolean
  }
}
```

## Пример package.json

```json
{
  "name": "nfc-cards-website",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "framer-motion": "^10.16.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0",
    "three": "^0.157.0",
    "gsap": "^3.12.0",
    "lottie-react": "^2.4.0",
    "react-spring": "^9.7.0",
    "react-hook-form": "^7.47.0",
    "react-intersection-observer": "^9.5.0",
    "qrcode.react": "^3.1.0",
    "react-particles": "^2.12.0",
    "tsparticles-slim": "^2.12.0",
    "axios": "^1.6.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/three": "^0.157.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}
```

## Развертывание
1. **Development**: `npm run dev`
2. **Production build**: `npm run build`
3. **Deploy**: Vercel, Netlify или собственный сервер

## Рекомендации по UX
1. **Прогрессивное раскрытие** - показывать настройки поэтапно
2. **Мгновенный фидбек** - изменения отображаются в реальном времени
3. **Микроанимации** - подтверждают действия пользователя
4. **Адаптивность** - работает на всех устройствах
5. **Быстрая загрузка** - оптимизация изображений и кода

Этот проект создаст уникальный, современный и функциональный сайт для продажи NFC-карточек с потрясающими визуальными эффектами!