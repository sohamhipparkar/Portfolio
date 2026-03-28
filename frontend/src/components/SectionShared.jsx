import { useEffect, useRef, useState } from 'react'

export const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,900&family=Barlow:wght@300;400;500&family=Share+Tech+Mono&display=swap');

  :root {
    --red:      #E8002D;
    --red-dim:  #9B001E;
    --ink:      #0b0b0b;
    --carbon:   #141414;
    --silver:   #c8c8c8;
    --silver2:  #888;
    --silver3:  #444;
    --rule:     rgba(255,255,255,0.07);
    --rule2:    rgba(255,255,255,0.13);
  }

  @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0.15} }
  @keyframes pulseRing  { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
  @keyframes heroIn     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes softGlow   { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes scanline   { 0%{transform:translateY(-100%)} 100%{transform:translateY(200vh)} }
  @keyframes nebula     { 0%,100%{opacity:.55;transform:scale(1) rotate(0deg)} 50%{opacity:1;transform:scale(1.07) rotate(4deg)} }
  @keyframes barFill    { from{transform:scaleX(0)} to{transform:scaleX(1)} }

  .sec-d0,.sec-d1,.sec-d2,.sec-d3,.sec-d4,.sec-d5,.sec-d6 { opacity: 0 }
  .sec-visible .sec-d0 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .00s both }
  .sec-visible .sec-d1 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .10s both }
  .sec-visible .sec-d2 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .20s both }
  .sec-visible .sec-d3 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .32s both }
  .sec-visible .sec-d4 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .44s both }
  .sec-visible .sec-d5 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .56s both }
  .sec-visible .sec-d6 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .68s both }
  .sec-visible .sec-bar { animation: barFill 1s cubic-bezier(.16,1,.3,1) .6s both; }

  .port-section {
    position: relative;
    overflow: hidden;
    background: var(--ink);
    padding: 72px 48px 96px;
    font-family: 'Barlow Condensed', sans-serif;
  }

  .port-divider {
    height: 1px;
    margin: 0 48px;
    background: linear-gradient(90deg, transparent, var(--rule2) 20%, var(--rule2) 80%, transparent);
  }

  @media (max-width: 768px) {
    .port-section { padding: 48px 24px 64px; }
    .port-divider { margin: 0 20px; }
  }
`

export function SectionStyles() {
  return <style>{sharedStyles}</style>
}

export function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

export function useMouseParallax() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handle = (e) => {
      const { innerWidth: w, innerHeight: h } = window
      setMousePos({ x: (e.clientX / w - 0.5) * 2, y: (e.clientY / h - 0.5) * 2 })
    }

    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  return mousePos
}

export function SectionBg({ mousePos, ghostNum, redGlowPos = 'bottom-left' }) {
  const glowStyle = redGlowPos === 'bottom-left' ? { bottom: -100, left: -80 } : { top: -100, right: -80 }

  return (
    <>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.03) 50%)',
        backgroundSize: '100% 4px', opacity: 0.4,
      }} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '60px',
          background: 'linear-gradient(to bottom, transparent, rgba(232,0,45,0.012), transparent)',
          animation: 'scanline 10s linear infinite',
        }} />
      </div>

      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)',
        backgroundSize: '72px 72px',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%)',
        maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%)',
        transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)`,
        transition: 'transform 0.8s cubic-bezier(0.23,1,0.32,1)',
      }} />

      <div aria-hidden="true" style={{
        position: 'absolute', ...glowStyle, zIndex: 2, pointerEvents: 'none',
        width: 600, height: 440,
        background: 'radial-gradient(ellipse,rgba(232,0,45,0.12) 0%,transparent 70%)',
        animation: 'softGlow 6s ease-in-out infinite',
        transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
        transition: 'transform 1.2s cubic-bezier(0.23,1,0.32,1)',
      }} />

      <div aria-hidden="true" style={{
        position: 'absolute', top: 60, right: 100, zIndex: 2, pointerEvents: 'none',
        width: 340, height: 340, borderRadius: '50%',
        background: 'radial-gradient(ellipse at 40% 40%,rgba(56,189,248,0.07) 0%,rgba(232,0,45,0.04) 50%,transparent 70%)',
        animation: 'nebula 7s ease-in-out infinite',
        transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
        transition: 'transform 1.5s cubic-bezier(0.23,1,0.32,1)',
      }} />

      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none',
        width: 3, height: '100%',
        background: 'linear-gradient(to bottom,transparent,#E8002D 30%,#E8002D 70%,transparent)',
        opacity: 0.55,
      }} />

      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, right: 0, zIndex: 2, pointerEvents: 'none',
        height: 2, width: '40%',
        background: 'linear-gradient(to left,#E8002D,transparent)',
        opacity: 0.4,
      }} />

      <div aria-hidden="true" style={{
        position: 'absolute', right: 48, top: '50%',
        transform: `translateY(-58%) translate(${mousePos.x * 12}px, ${mousePos.y * 8}px)`,
        zIndex: 2, pointerEvents: 'none', userSelect: 'none',
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
        fontSize: 'clamp(9rem,19vw,19rem)', letterSpacing: '-0.04em', lineHeight: 1,
        color: 'rgba(255,255,255,0.025)',
        transition: 'transform 1.2s cubic-bezier(0.23,1,0.32,1)',
      }}>
        {ghostNum}
      </div>
    </>
  )
}

export function SectionHeader({ sectorLabel, title, subtitle }) {
  return (
    <>
      <div className="sec-d0" style={{
        width: 44, height: 7, marginBottom: 18, opacity: 0.2,
        backgroundImage: 'repeating-conic-gradient(#fff 0% 25%,transparent 0% 50%)',
        backgroundSize: '7px 7px',
      }} />

      <div className="sec-d0" style={{ marginBottom: 20 }}>
        <span style={{
          fontFamily: "'Share Tech Mono',monospace",
          display: 'inline-flex', alignItems: 'center', gap: 10,
          fontSize: '0.6rem', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: '#E8002D',
        }}>
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 12, height: 12 }}>
            <span style={{
              position: 'absolute', width: 12, height: 12, borderRadius: '50%',
              border: '1px solid #E8002D', animation: 'pulseRing 2s ease-out infinite',
            }} />
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#E8002D',
              animation: 'blink 1.4s ease-in-out infinite',
            }} />
          </span>
          {sectorLabel}
        </span>
      </div>

      <h2 className="sec-d1" style={{
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic',
        fontSize: 'clamp(3.5rem,9vw,8rem)', lineHeight: 0.9,
        letterSpacing: '-0.01em', textTransform: 'uppercase',
        color: '#fff', marginBottom: 20, position: 'relative',
      }}>
        {title[0]}
        <br />
        <span style={{ color: '#E8002D', position: 'relative', display: 'inline-block' }}>
          {title[1]}
          <span className="sec-bar" style={{
            position: 'absolute', bottom: -4, left: 0,
            height: 3, width: '100%',
            background: 'linear-gradient(to right, #E8002D, rgba(232,0,45,0.25))',
            display: 'block', transformOrigin: 'left',
          }} />
        </span>
        {title[2] ? ` ${title[2]}` : ''}
      </h2>

      {subtitle && (
        <p className="sec-d2" style={{
          fontFamily: "'Share Tech Mono',monospace",
          color: '#555', fontSize: '0.75rem', lineHeight: 1.8,
          maxWidth: 440, marginBottom: 48, letterSpacing: '0.05em',
        }}>
          {subtitle}
        </p>
      )}
    </>
  )
}
