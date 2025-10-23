import React from 'react'
import Hero from './components/Hero.jsx'
import CardCustomizer from './components/CardCustomizer.jsx'
import Examples from './components/Examples.jsx'
import FAQ from './components/FAQ.jsx'
import Promo from './components/Promo.jsx'
import Benefits from './components/Benefits.jsx'
import Blog from './components/Blog.jsx'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Hero />
      <Promo />
      <Benefits />
      <Examples />
      <CardCustomizer />
      <FAQ />
      <Blog />
    </div>
  )
}

export default App

