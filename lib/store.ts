import { create } from 'zustand'

export interface CardData {
  name: string
  title: string
  company: string
  phone: string
  email: string
  telegram: string
  vk: string
  instagram: string
  website: string
  design: string
  primaryColor: string
  secondaryColor: string
  backgroundStyle: 'gradient' | 'solid'
  textColor: string
  fontFamily: string
  effects: {
    holographic: boolean
    glitch: boolean
    pulse: boolean
  }
  showQR: boolean
  logo?: string
  backgroundImage?: string
}

interface CardStore {
  cardData: CardData
  updateCardData: (data: Partial<CardData>) => void
  resetCardData: () => void
}

const defaultCardData: CardData = {
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
  backgroundStyle: 'gradient',
  textColor: '#FFFFFF',
  fontFamily: 'var(--font-inter)',
  effects: { holographic: true, glitch: false, pulse: false },
  showQR: true,
}

export const useCardStore = create<CardStore>((set) => ({
  cardData: defaultCardData,
  updateCardData: (data) =>
    set((state) => ({
      cardData: { ...state.cardData, ...data },
    })),
  resetCardData: () => set({ cardData: defaultCardData }),
}))

