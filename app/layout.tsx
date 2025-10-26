import type { Metadata } from "next"
import { Inter, Roboto, Open_Sans, Montserrat, Poppins, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter'
})

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ["latin", "cyrillic"],
  variable: '--font-roboto'
})

const openSans = Open_Sans({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-open-sans'
})

const montserrat = Montserrat({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-montserrat'
})

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins'
})

const playfair = Playfair_Display({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: "NFC Cards - Умные цифровые визитки",
  description: "Создайте свою уникальную NFC карточку для мгновенного обмена контактами",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${poppins.variable} ${playfair.variable}`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}

