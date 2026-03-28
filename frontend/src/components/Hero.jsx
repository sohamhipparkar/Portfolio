import { useState, useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'

const ROLES = ['DEVELOPER', 'PROGRAMMER', 'PROBLEM SOLVER']

/* ── Star Canvas ─────────────────────────────────────────────────── */
function StarCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 220 }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.5 + 0.2,
      a:       Math.random(),
      twinkle: Math.random() * Math.PI * 2,
      speed:   Math.random() * 0.006 + 0.001,
      drift:   (Math.random() - 0.5) * 0.04,
    }))

    const shooters = []
    const spawnShooter = () => {
      if (shooters.length < 3) {
        shooters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          len: Math.random() * 120 + 60,
          speed: Math.random() * 8 + 5,
          alpha: 1,
          angle: Math.PI / 5,
        })
      }
    }
    const shooterTimer = setInterval(spawnShooter, 3800)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(s => {
        s.twinkle += s.speed
        s.x += s.drift
        if (s.x > canvas.width) s.x = 0
        if (s.x < 0) s.x = canvas.width
        const alpha = s.a * (0.4 + 0.6 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      })

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i]
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.alpha -= 0.012

        if (s.alpha <= 0) { shooters.splice(i, 1); continue }

        const grad = ctx.createLinearGradient(
          s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len,
          s.x, s.y
        )
        grad.addColorStop(0, `rgba(255,255,255,0)`)
        grad.addColorStop(0.7, `rgba(232,0,45,${s.alpha * 0.4})`)
        grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`)

        ctx.beginPath()
        ctx.moveTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(shooterTimer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  )
}

/* ── Glitch Text ─────────────────────────────────────────────────── */
function GlitchName({ children, 'data-text': dataText }) {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const trigger = () => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 400)
    }
    const id = setInterval(trigger, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      data-text={dataText || children}
      style={{ position: 'relative', display: 'inline-block' }}
      className={glitching ? 'glitch-active' : ''}
    >
      {children}
    </span>
  )
}

/* ── Animated Counter ────────────────────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = target / 40
        const timer = setInterval(() => {
          start += step
          if (start >= target) { setVal(target); clearInterval(timer) }
          else setVal(Math.floor(start))
        }, 30)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{val}{suffix}</span>
}

/* ── Magnetic Button ─────────────────────────────────────────────── */
function MagneticBtn({ children, style, onClick, href, as = 'button', className }) {
  const btnRef = useRef(null)
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleMove = (e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) scale(${pressed ? 0.96 : 1.04})`
  }

  const handleLeave = () => {
    setHovered(false)
    if (btnRef.current) btnRef.current.style.transform = 'translate(0,0) scale(1)'
  }

  const handleEnter = () => setHovered(true)

  const props = {
    ref: btnRef,
    style: {
      ...style,
      transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1), background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.3s',
    },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onMouseEnter: handleEnter,
    onMouseDown: () => { setPressed(true); if (btnRef.current) btnRef.current.style.transform = 'translate(0,0) scale(0.96)' },
    onMouseUp: () => { setPressed(false) },
    className,
    onClick,
  }

  if (as === 'a') return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>
  return <button {...props}>{children}</button>
}

/* ── Reveal on scroll ────────────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── Cursor Trail ────────────────────────────────────────────────── */
function CursorTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const trail = []
    const MAX = 18

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      trail.push({ x: e.clientX, y: e.clientY, a: 1 })
      if (trail.length > MAX) trail.shift()
    }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 1; i < trail.length; i++) {
        const t = trail[i]
        const prev = trail[i - 1]
        const alpha = (i / MAX) * 0.18
        ctx.beginPath()
        ctx.moveTo(prev.x, prev.y)
        ctx.lineTo(t.x, t.y)
        ctx.strokeStyle = `rgba(232,0,45,${alpha})`
        ctx.lineWidth = (i / MAX) * 2.5
        ctx.lineCap = 'round'
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
    />
  )
}

/* ── useIsMobile hook ────────────────────────────────────────────── */
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

/* ── Hero ────────────────────────────────────────────────────────── */
export default function Hero({ onViewWork, onContact, resumeLink = '#' }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [rolePhase, setRolePhase] = useState('idle') // idle | out | in
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoverBtn, setHoverBtn] = useState(null)
  const sectionRef = useRef(null)
  const isMobile = useIsMobile(640)

  // ── Mount fade-in ──
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  // ── Role cycling with smooth out→in phases ──
  useEffect(() => {
    const id = setInterval(() => {
      setRolePhase('out')
      setTimeout(() => {
        setRoleIndex(i => (i + 1) % ROLES.length)
        setRolePhase('in')
        setTimeout(() => setRolePhase('idle'), 500)
      }, 380)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  // ── Parallax mouse ──
  useEffect(() => {
    if (isMobile) return
    const handleMouse = (e) => {
      const { innerWidth: w, innerHeight: h } = window
      setMousePos({ x: (e.clientX / w - 0.5) * 2, y: (e.clientY / h - 0.5) * 2 })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [isMobile])

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const roleStyle = {
    idle: { opacity: 1, transform: 'translateY(0) skewY(0deg)', filter: 'blur(0px)' },
    out:  { opacity: 0, transform: 'translateY(-14px) skewY(-2deg)', filter: 'blur(4px)' },
    in:   { opacity: 1, transform: 'translateY(0) skewY(0deg)', filter: 'blur(0px)' },
  }

  return (
    <>
      {!isMobile && <CursorTrail />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&family=Share+Tech+Mono&display=swap');

        /* ── Core keyframes ── */
        @keyframes blink        { 0%,100%{opacity:1}        50%{opacity:0.15} }
        @keyframes scrollBall   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        @keyframes nebula       { 0%,100%{opacity:.55;transform:scale(1) rotate(0deg)} 50%{opacity:1;transform:scale(1.07) rotate(4deg)} }
        @keyframes shimmer      { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes gridReveal   { from{opacity:0} to{opacity:1} }
        @keyframes pulseRing    { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.4);opacity:0} }
        @keyframes counterGlow  { 0%,100%{text-shadow:none} 50%{text-shadow:0 0 20px rgba(232,0,45,0.8)} }
        @keyframes scanline     { 0%{transform:translateY(-100%)} 100%{transform:translateY(200vh)} }
        @keyframes glitch1      { 0%,100%{clip-path:inset(0 0 100% 0)} 20%{clip-path:inset(33% 0 55% 0);transform:translateX(-4px)} 40%{clip-path:inset(70% 0 10% 0);transform:translateX(4px)} 60%{clip-path:inset(10% 0 80% 0);transform:translateX(-2px)} 80%{clip-path:inset(60% 0 30% 0);transform:translateX(3px)} }
        @keyframes glitch2      { 0%,100%{clip-path:inset(0 0 100% 0)} 20%{clip-path:inset(60% 0 20% 0);transform:translateX(4px)} 40%{clip-path:inset(10% 0 70% 0);transform:translateX(-4px)} 60%{clip-path:inset(80% 0 5% 0);transform:translateX(2px)} 80%{clip-path:inset(25% 0 65% 0);transform:translateX(-3px)} }

        /* ── NEW: staggered hero entrance ── */
        @keyframes heroSlideUp  { from{opacity:0;transform:translateY(36px) skewY(1.5deg)} to{opacity:1;transform:translateY(0) skewY(0)} }
        @keyframes heroFadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes stripeExpand { from{transform:scaleX(0);transform-origin:left} to{transform:scaleX(1);transform-origin:left} }
        @keyframes lineGrow     { from{width:0;opacity:0} to{width:100%;opacity:0.4} }
        @keyframes floatY       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes borderRace   { 0%{background-position:0% 0%} 100%{background-position:300% 0%} }

        /* ── Checker reveal ── */
        @keyframes checkerIn    { from{opacity:0;transform:scaleX(0)} to{opacity:0.2;transform:scaleX(1)} }

        /* ── Ghost number slow float ── */
        @keyframes ghostFloat   { 0%,100%{transform:translateY(-58%) translateX(0)} 50%{transform:translateY(-60%) translateX(-6px)} }

        /* ── Stagger delays ── */
        .hd0 { animation: heroSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.05s both }
        .hd1 { animation: heroSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.16s both }
        .hd2 { animation: heroSlideUp 1.0s cubic-bezier(0.16,1,0.3,1) 0.28s both }
        .hd3 { animation: heroSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.42s both }
        .hd4 { animation: heroSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.58s both }
        .hd5 { animation: heroSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.72s both }
        .hd6 { animation: heroFadeIn  1.1s ease               0.90s both }

        /* ── Checker strip ── */
        .checker-strip { animation: checkerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both; transform-origin: left }

        /* ── Clip-path button ── */
        .hero-btn-primary { clip-path: polygon(9px 0%, 100% 0%, calc(100% - 9px) 100%, 0% 100%) }

        /* ── Glitch ── */
        .glitch-active::before,
        .glitch-active::after {
          content: attr(data-text);
          position: absolute; inset: 0;
          color: #E8002D;
        }
        .glitch-active::before { animation: glitch1 0.4s steps(1) both }
        .glitch-active::after  { color: #38bdf8; animation: glitch2 0.4s steps(1) both }

        /* ── Telemetry hover ── */
        .telemetry-item {
          position: relative;
          cursor: default;
          transition: transform 0.25s cubic-bezier(0.23,1,0.32,1);
        }
        .telemetry-item::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 1px;
          background: #E8002D;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .telemetry-item:hover { transform: translateY(-4px) }
        .telemetry-item:hover::after { width: 100% }
        .telemetry-item:hover .telemetry-val { color: #fff !important }
        .telemetry-item:hover .telemetry-val.green { color: #6ee77a !important; text-shadow: 0 0 12px rgba(57,211,83,0.6) }
        .telemetry-lbl { transition: color 0.2s, letter-spacing 0.3s }
        .telemetry-item:hover .telemetry-lbl { color: #888 !important; letter-spacing: 0.26em }

        /* ── Primary button shimmer on hover ── */
        .hero-btn-primary:hover .btn-shimmer {
          animation: shimmer 0.55s linear;
        }
        /* ── Primary button glow ── */
        .hero-btn-primary {
          transition: box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.23,1,0.32,1) !important;
        }
        .hero-btn-primary:hover {
          box-shadow: 0 0 28px rgba(232,0,45,0.45), 0 0 6px rgba(232,0,45,0.2) !important;
        }
        .hero-btn-primary:active {
          box-shadow: 0 0 12px rgba(232,0,45,0.3) !important;
        }

        /* ── Secondary (resume) button border race ── */
        .border-race-btn { position: relative; overflow: hidden }
        .border-race-btn::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(90deg, transparent, #E8002D, #38bdf8, transparent);
          background-size: 300% 100%;
          animation: borderRace 1.8s linear infinite;
          opacity: 0;
          transition: opacity 0.35s;
          z-index: 0;
        }
        .border-race-btn > * { position: relative; z-index: 1 }
        .border-race-btn:hover::before { opacity: 1 }
        .border-race-btn:hover {
          color: #fff !important;
          border-color: transparent !important;
        }

        /* ── Scroll hint float ── */
        .scroll-hint { animation: heroFadeIn 1s ease 1.3s both }
        .scroll-hint:hover .scroll-mouse { border-color: #E8002D !important; box-shadow: 0 0 12px rgba(232,0,45,0.3) }

        /* ── Stat counter glow ── */
        .stat-val-animate { animation: counterGlow 3s ease-in-out infinite }

        /* ── Ghost number passive float (desktop only) ── */
        @media (min-width: 640px) {
          .ghost-num-wrap { animation: ghostFloat 9s ease-in-out infinite }
        }

        /* ── Mobile overrides ── */
        @media (max-width: 639px) {
          .hero-ghost-num   { display: none !important }
          .hero-nebula-tr   { width: 180px !important; height: 180px !important; top: 20px !important; right: 10px !important }
          .hero-nebula-mid  { display: none !important }
          .hero-btn-row     { flex-direction: column !important; width: 100% !important }
          .hero-btn-row a,
          .hero-btn-row button { width: 100% !important; justify-content: center !important }
          .hero-bottom-row  { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important }
          .hero-description { max-width: 100% !important }
        }
      `}</style>

      <section
        id="home"
        ref={sectionRef}
        style={{
          position: 'relative',
          minHeight: '100dvh',
          overflow: 'hidden',
          background: '#0b0b0b',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isMobile ? 'center' : 'flex-end',
          padding: isMobile ? '80px 20px 40px' : '0 48px 60px',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.5s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* Stars */}
        <StarCanvas />

        {/* Scanline grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.03) 50%)',
          backgroundSize: '100% 4px',
          opacity: 0.4,
        }} />

        {/* Scanline sweep */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(232,0,45,0.015), transparent)',
            animation: 'scanline 8s linear infinite',
          }} />
        </div>

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.045) 1px,transparent 1px)',
          backgroundSize: '72px 72px',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%)',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%)',
          transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)`,
          transition: 'transform 0.9s cubic-bezier(0.23,1,0.32,1)',
          animation: 'gridReveal 1.5s ease 0.2s both',
        }} />

        {/* Red glow — parallax */}
        <div style={{
          position: 'absolute', bottom: -100, left: -80, zIndex: 2, pointerEvents: 'none',
          width: isMobile ? 320 : 700, height: isMobile ? 260 : 500,
          background: 'radial-gradient(ellipse,rgba(232,0,45,0.13) 0%,transparent 70%)',
          transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
          transition: 'transform 1.3s cubic-bezier(0.23,1,0.32,1)',
        }} />

        {/* Blue accent glow — opposite parallax */}
        <div style={{
          position: 'absolute', top: '20%', right: '10%', zIndex: 2, pointerEvents: 'none',
          width: isMobile ? 160 : 320, height: isMobile ? 160 : 320,
          background: 'radial-gradient(ellipse,rgba(56,189,248,0.05) 0%,transparent 70%)',
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
          transition: 'transform 1.5s cubic-bezier(0.23,1,0.32,1)',
        }} />

        {/* Nebula — top right */}
        <div className="hero-nebula-tr" style={{
          position: 'absolute', top: 60, right: 100, zIndex: 2, pointerEvents: 'none',
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(ellipse at 40% 40%,rgba(56,189,248,0.09) 0%,rgba(232,0,45,0.05) 50%,transparent 70%)',
          animation: 'nebula 6s ease-in-out infinite',
          transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)`,
          transition: 'transform 1.6s cubic-bezier(0.23,1,0.32,1)',
        }} />

        {/* Nebula — mid */}
        <div className="hero-nebula-mid" style={{
          position: 'absolute', top: '30%', left: '20%', zIndex: 2, pointerEvents: 'none',
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(232,0,45,0.06) 0%,transparent 70%)',
          animation: 'nebula 9s ease-in-out infinite reverse',
          transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
          transition: 'transform 1s cubic-bezier(0.23,1,0.32,1)',
        }} />

        {/* Right stripe — animated reveal */}
        <div style={{
          position: 'absolute', top: 0, right: 0, zIndex: 2, pointerEvents: 'none',
          width: 3, height: '100%',
          background: 'linear-gradient(to bottom,transparent,#E8002D 30%,#E8002D 70%,transparent)',
          opacity: 0.55,
          transformOrigin: 'top',
          animation: 'heroFadeIn 1s ease 0.1s both',
        }} />

        {/* Top stripe — expanding */}
        <div style={{
          position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none',
          height: 2, width: '40%',
          background: 'linear-gradient(to right,#E8002D,transparent)',
          opacity: 0.4,
          transformOrigin: 'left',
          animation: 'stripeExpand 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both',
        }} />

        {/* Ghost driver number */}
        <div
          className="hero-ghost-num ghost-num-wrap"
          style={{
            position: 'absolute', right: 72,
            top: '50%',
            /* parallax applied inline, float animation via class */
            transform: `translateY(-58%) translate(${mousePos.x * 15}px, ${mousePos.y * 10}px)`,
            zIndex: 2, pointerEvents: 'none', userSelect: 'none',
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
            fontSize: 'clamp(9rem,19vw,19rem)', letterSpacing: '-0.04em', lineHeight: 1,
            color: 'rgba(255,255,255,0.028)',
            transition: 'transform 1.3s cubic-bezier(0.23,1,0.32,1)',
            animation: 'heroFadeIn 1.4s ease 0.3s both',
          }}>
          01
        </div>

        {/* ── Main content ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* Checker strip */}
          <div className="checker-strip" style={{
            width: 44, height: 7, marginBottom: 18,
            backgroundImage: 'repeating-conic-gradient(#fff 0% 25%,transparent 0% 50%)',
            backgroundSize: '7px 7px',
          }} />

          {/* Status line */}
          <div className="hd1" style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem',
            letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E8002D',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
            flexWrap: 'wrap',
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
            Full-Stack Developer · Available for hire
          </div>

          {/* Cycling role — now CSS-transition driven */}
          <div style={{ minHeight: 28, marginBottom: 8, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: "'Share Tech Mono',monospace", fontSize: '0.75rem',
                letterSpacing: '0.18em', textTransform: 'uppercase', color: '#666',
                transition: 'opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1), filter 0.38s ease',
                ...roleStyle[rolePhase],
              }}
            >
              {ROLES[roleIndex]}
            </span>
          </div>

          {/* Name */}
          <h1 className="hd2" style={{
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic',
            fontSize: 'clamp(3.8rem,12vw,10rem)', lineHeight: 0.88,
            letterSpacing: '-0.01em', textTransform: 'uppercase',
            color: '#fff', marginBottom: 20, position: 'relative',
          }}>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <GlitchName data-text="Soham">Soham</GlitchName>
            </span>
            <br />
            <span style={{ color: '#E8002D', position: 'relative' }}>
              Builds
              <span style={{
                position: 'absolute', bottom: -4, left: 0,
                height: 3, width: '100%',
                background: 'linear-gradient(to right, #E8002D, rgba(232,0,45,0.3))',
                transformOrigin: 'left',
                animation: 'stripeExpand 0.9s cubic-bezier(0.16,1,0.3,1) 0.6s both',
              }} />
            </span>
          </h1>

          {/* Telemetry row */}
          <div className="hd3" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '16px 20px' : '28px',
            marginBottom: isMobile ? 28 : 44,
            padding: '14px 0',
            borderTop: '1px solid rgba(255,255,255,0.10)',
            position: 'relative',
          }}>
            {/* Animated underline */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, height: 1,
              background: 'linear-gradient(to right, #E8002D 0%, rgba(232,0,45,0.3) 40%, transparent 70%)',
              opacity: 0,
              animation: 'lineGrow 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s forwards',
              width: '60%',
            }} />

            {[
              { lbl: 'Stack',  val: 'Full-Stack', num: null },
              { lbl: 'Base',   val: 'Pune, IN',   num: null },
              { lbl: 'XP',     val: null, num: 3, suffix: '+ Yrs' },
              { lbl: 'Status', val: 'GO', green: true, num: null },
            ].map((t, i) => (
              <div
                key={t.lbl}
                className="telemetry-item"
                style={{
                  display: 'flex', flexDirection: 'column', gap: 3,
                  animation: `heroSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) ${0.42 + i * 0.09}s both`,
                  minWidth: 60,
                }}
              >
                <span className="telemetry-lbl" style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: '0.52rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: '#444',
                }}>{t.lbl}</span>
                <span
                  className={`telemetry-val${t.green ? ' green stat-val-animate' : ''}`}
                  style={{
                    fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                    fontSize: '1rem', color: t.green ? '#39d353' : '#c8c8c8',
                    transition: 'color 0.2s, text-shadow 0.2s',
                  }}
                >
                  {t.num !== null
                    ? <><Counter target={t.num} />{t.suffix}</>
                    : t.val
                  }
                </span>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div
            className="hd5 hero-bottom-row"
            style={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'flex-end',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              gap: isMobile ? 20 : 24,
            }}
          >
            <p
              className="hero-description"
              style={{
                fontSize: '0.9rem', lineHeight: 1.75, color: '#666',
                maxWidth: isMobile ? '100%' : 400,
                margin: 0,
              }}
            >
              I build{' '}
              <strong style={{
                color: '#c8c8c8', fontWeight: 500,
                background: 'linear-gradient(90deg, #c8c8c8, #fff, #c8c8c8)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s linear infinite',
              }}>
                fast, precise digital products
              </strong>{' '}
              — from pixel-perfect interfaces to resilient backends. Every millisecond matters.
            </p>

            {/* Button row */}
            <div
              className="hero-btn-row"
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 10,
                flexShrink: 0,
                width: isMobile ? '100%' : 'auto',
              }}
            >
              <MagneticBtn
                className="hero-btn-primary"
                onClick={() => (onViewWork ? onViewWork() : go('projects'))}
                style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '13px 26px', border: 'none', cursor: 'pointer',
                  background: '#E8002D', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  position: 'relative', overflow: 'hidden',
                  width: isMobile ? '100%' : 'auto',
                  boxSizing: 'border-box',
                }}
              >
                <span className="btn-shimmer" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.18) 50%,transparent 100%)',
                  backgroundSize: '200% 100%',
                  pointerEvents: 'none',
                }} />
                View Work <ArrowUpRight size={12} style={{ transition: 'transform 0.25s', transform: 'translate(0,0)' }} />
              </MagneticBtn>

              <MagneticBtn
                as="a"
                href={resumeLink}
                className="border-race-btn"
                style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '13px 26px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)', color: '#c8c8c8',
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  textDecoration: 'none', position: 'relative', overflow: 'hidden',
                  width: isMobile ? '100%' : 'auto',
                  boxSizing: 'border-box',
                }}
              >
                Resume <ArrowUpRight size={12} />
              </MagneticBtn>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="scroll-hint"
          style={{
            position: 'absolute', bottom: isMobile ? 12 : 20, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 6, cursor: 'pointer',
          }}
          onClick={() => go('about')}
        >
          <span style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: '0.45rem',
            letterSpacing: '0.25em', color: '#333', textTransform: 'uppercase',
            marginBottom: 4,
            transition: 'color 0.3s, letter-spacing 0.3s',
          }}>scroll</span>
          <div
            className="scroll-mouse"
            style={{
              width: 18, height: 28, border: '1px solid #2a2a2a', borderRadius: 9,
              display: 'flex', justifyContent: 'center', paddingTop: 5,
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            <div style={{
              width: 2, height: 5, background: '#444', borderRadius: 1,
              animation: 'scrollBall 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </section>
    </>
  )
}