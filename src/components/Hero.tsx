import React, { useEffect, useRef } from 'react'

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    v.muted = true
    v.play().catch(() => {})

    const fadeDuration = 0.5

    function step() {
      if (!v) return
      const current = v.currentTime
      const duration = v.duration || 0
      let opacity = 1
      if (Number.isFinite(duration) && duration > 0) {
        if (current <= fadeDuration) {
          opacity = current / fadeDuration
        } else if (current >= duration - fadeDuration) {
          const t = (duration - current) / fadeDuration
          opacity = Math.max(0, t)
        } else {
          opacity = 1
        }
      }
      v.style.opacity = String(opacity)
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    function onEnded() {
      if (!v) return
      v.style.opacity = '0'
      setTimeout(() => {
        try {
          v.currentTime = 0
          const p = v.play()
          if (p && typeof p.catch === 'function') p.catch(() => {})
        } catch (e) {}
      }, 100)
    }

    v.addEventListener('ended', onEnded)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      v.removeEventListener('ended', onEnded)
    }
  }, [])

  return (
    <section className="relative z-0 min-h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        playsInline
        preload="auto"
        muted
        loop={false}
        style={{ top: '300px', inset: 'auto 0 0 0', transition: 'opacity 0.1s linear' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-95 z-5 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center pt-[calc(8rem-75px)] pb-40 px-6">
        <h1 className="font-instrument text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal leading-[0.95] tracking-tight" style={{ letterSpacing: '-2.46px', color: '#000000' }}>
          Beyond <em className="not-italic italic text-muted">silence,</em> we build <em className="not-italic italic text-muted">the eternal.</em>
        </h1>

        <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-muted animate-fade-rise-delay">
          Building platforms for brilliant minds, fearless makers, and thoughtful souls. Through the noise, we craft digital havens for deep work and pure flows.
        </p>

        <button className="rounded-full px-14 py-5 text-base mt-12 bg-black text-white transform transition-transform duration-150 hover:scale-105 animate-fade-rise-delay-2">
          Begin Journey
        </button>
      </div>
    </section>
  )
}
