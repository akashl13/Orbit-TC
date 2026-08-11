import React from 'react'

const MenuItem: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <a
    href="#"
    className={`text-sm transition-colors ${active ? 'text-black' : 'text-muted'}`}
  >
    {label}
  </a>
)

export default function Nav() {
  return (
    <nav className="z-20 relative max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <div className="text-3xl tracking-tight font-instrument text-black">Aethera<sup className="align-super text-sm">®</sup></div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex gap-6 items-center">
          <MenuItem label="Home" active />
          <MenuItem label="Studio" />
          <MenuItem label="About" />
          <MenuItem label="Journal" />
          <MenuItem label="Reach Us" />
        </div>
        <button className="rounded-full px-6 py-2.5 text-sm bg-black text-white transform transition-transform duration-150 hover:scale-105">
          Begin Journey
        </button>
      </div>
    </nav>
  )
}
