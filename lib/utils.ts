import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CardData } from './store'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateVCard(cardData: CardData): string {
  const lines: string[] = []
  
  lines.push('BEGIN:VCARD')
  lines.push('VERSION:3.0')
  
  if (cardData.name) {
    lines.push(`FN:${cardData.name}`)
    const nameParts = cardData.name.split(' ')
    if (nameParts.length >= 2) {
      lines.push(`N:${nameParts[nameParts.length - 1]};${nameParts.slice(0, -1).join(' ')};;;`)
    } else {
      lines.push(`N:${cardData.name};;;;`)
    }
  }
  
  if (cardData.company) {
    lines.push(`ORG:${cardData.company}`)
  }
  
  if (cardData.title) {
    lines.push(`TITLE:${cardData.title}`)
  }
  
  if (cardData.phone) {
    const cleanPhone = cardData.phone.replace(/\s+/g, '')
    lines.push(`TEL;TYPE=CELL:${cleanPhone}`)
  }
  
  if (cardData.email) {
    lines.push(`EMAIL:${cardData.email}`)
  }
  
  if (cardData.website) {
    lines.push(`URL:${cardData.website}`)
  }
  
  const socialLinks: string[] = []
  if (cardData.telegram) {
    socialLinks.push(`Telegram: ${cardData.telegram}`)
  }
  if (cardData.vk) {
    socialLinks.push(`VK: ${cardData.vk}`)
  }
  if (cardData.instagram) {
    socialLinks.push(`Instagram: ${cardData.instagram}`)
  }
  
  if (socialLinks.length > 0) {
    lines.push(`NOTE:${socialLinks.join(' | ')}`)
  }
  
  lines.push('END:VCARD')
  
  return lines.join('\n')
}

