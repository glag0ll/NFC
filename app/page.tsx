import Hero from '@/components/hero'
import Benefits from '@/components/benefits'
import CardCustomizer from '@/components/card-customizer'
import FAQ from '@/components/faq'
import ParticlesBackground from '@/components/particles-background'
import CustomCursor from '@/components/custom-cursor'
import FloatingElements from '@/components/floating-elements'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background base */}
      <div className="fixed inset-0 bg-gray-950 -z-10" />
      
      {/* Wow эффекты */}
      <ParticlesBackground />
      <FloatingElements />
      <CustomCursor />
      
      {/* Контент */}
      <div className="relative z-10">
        <Hero />
        <Benefits />
        <CardCustomizer />
        <FAQ />
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 py-12 overflow-hidden">
        {/* Semi-transparent gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/60 via-blue-950/40 to-purple-950/50" />
        
        {/* Glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-500/15 rounded-full blur-[100px]" />
        <div className="container mx-auto px-6 text-center text-gray-400 relative z-10">
          <p className="mb-2">© 2025 NFC Cards. Все права защищены.</p>
          <p className="text-sm">Современные цифровые визитки для успешного нетворкинга</p>
        </div>
      </footer>
    </main>
  )
}

