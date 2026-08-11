import React from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-inter">
      <Hero />
      <div className="absolute inset-0 z-10 pointer-events-none" />
      <Nav />
    </div>
  )
}
