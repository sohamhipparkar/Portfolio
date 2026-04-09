import { useState, useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'

const ROLES = ['DEVELOPER', 'PROGRAMMER', 'PROBLEM SOLVER', 'TECH ENTHUSIAST', 'INNOVATOR']

/* ── Noise texture SVG data URI ───────────────────────────────────── */
const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`

/* ── Star Canvas ─────────────────────────────────────────────────── */
function StarCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.15,
      a: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.007 + 0.001,
      drift: (Math.random() - 0.5) * 0.035,
      hue: Math.random() > 0.85 ? `rgba(56,189,248,` : `rgba(255,255,255,`,
    }))

    const shooters = []
    const spawnShooter = () => {
      if (shooters.length < 4) {
        shooters.push({
          x: Math.random() * canvas.width * 0.7,
          y: Math.random() * canvas.height * 0.45,
          len: Math.random() * 150 + 80,
          speed: Math.random() * 10 + 6,
          alpha: 1,
          angle: Math.PI / 5 + (Math.random() - 0.5) * 0.3,
        })
      }
    }
    const shooterTimer = setInterval(spawnShooter, 3200)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(s => {
        s.twinkle += s.speed
        s.x += s.drift
        if (s.x > canvas.width) s.x = 0
        if (s.x < 0) s.x = canvas.width
        const alpha = s.a * (0.35 + 0.65 * Math.abs(Math.sin(s.twinkle)))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `${s.hue}${alpha})`
        ctx.fill()
        // glow for bright stars
        if (s.r > 1.2) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `${s.hue}${alpha * 0.15})`
          ctx.fill()
        }
      })

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i]
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.alpha -= 0.01
        if (s.alpha <= 0) { shooters.splice(i, 1); continue }

        const grad = ctx.createLinearGradient(
          s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len, s.x, s.y
        )
        grad.addColorStop(0, `rgba(255,255,255,0)`)
        grad.addColorStop(0.6, `rgba(232,0,45,${s.alpha * 0.35})`)
        grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`)

        ctx.beginPath()
        ctx.moveTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.8
        ctx.stroke()

        // tip glow
        const tipGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 5)
        tipGrad.addColorStop(0, `rgba(255,255,255,${s.alpha * 0.8})`)
        tipGrad.addColorStop(1, `rgba(255,255,255,0)`)
        ctx.beginPath()
        ctx.arc(s.x, s.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = tipGrad
        ctx.fill()
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

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />
}

/* ── Particle burst on load ──────────────────────────────────────── */
function ParticleBurst() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const cx = canvas.width * 0.5
    const cy = canvas.height * 0.65

    const particles = Array.from({ length: 60 }, (_, i) => {
      const angle = (i / 60) * Math.PI * 2
      const speed = Math.random() * 3 + 1
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 1,
        decay: Math.random() * 0.012 + 0.008,
        r: Math.random() * 2.5 + 0.5,
        color: Math.random() > 0.5 ? '#E8002D' : '#38bdf8',
      }
    })

    let raf
    let started = false
    const delay = setTimeout(() => {
      started = true
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let alive = false
        particles.forEach(p => {
          if (p.life <= 0) return
          alive = true
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.04
          p.life -= p.decay
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0')
          ctx.fill()
        })
        if (alive) raf = requestAnimationFrame(animate)
      }
      animate()
    }, 800)

    return () => {
      clearTimeout(delay)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none' }} />
}

/* ── Glitch Text ─────────────────────────────────────────────────── */
function GlitchName({ children, 'data-text': dataText }) {
  const [glitching, setGlitching] = useState(false)
  useEffect(() => {
    const trigger = () => { setGlitching(true); setTimeout(() => setGlitching(false), 450) }
    const id = setInterval(trigger, 3500)
    trigger()
    return () => clearInterval(id)
  }, [])
  return (
    <span data-text={dataText || children} style={{ position: 'relative', display: 'inline-block' }} className={glitching ? 'glitch-active' : ''}>
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
        const step = target / 45
        const timer = setInterval(() => {
          start += step
          if (start >= target) { setVal(target); clearInterval(timer) }
          else setVal(Math.floor(start))
        }, 28)
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

  const handleMove = (e) => {
    const btn = btnRef.current; if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(${pressed ? 0.97 : 1.05})`
  }
  const handleLeave = () => { if (btnRef.current) btnRef.current.style.transform = 'translate(0,0) scale(1)' }

  const props = {
    ref: btnRef,
    style: { ...style, transition: 'transform 0.35s cubic-bezier(0.23,1,0.32,1), background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.3s' },
    onMouseMove: handleMove, onMouseLeave: handleLeave,
    onMouseDown: () => { setPressed(true); if (btnRef.current) btnRef.current.style.transform = 'scale(0.96)' },
    onMouseUp: () => setPressed(false),
    className, onClick,
  }
  if (as === 'a') return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>
  return <button {...props}>{children}</button>
}

/* ── Reveal on scroll ────────────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  )
}

/* ── Cursor Trail ────────────────────────────────────────────────── */
function CursorTrail() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const trail = []
    const MAX = 24

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => { trail.push({ x: e.clientX, y: e.clientY }); if (trail.length > MAX) trail.shift() }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 1; i < trail.length; i++) {
        const t = trail[i], prev = trail[i - 1]
        const alpha = (i / MAX) * 0.22
        const width = (i / MAX) * 3
        ctx.beginPath()
        ctx.moveTo(prev.x, prev.y)
        ctx.lineTo(t.x, t.y)
        ctx.strokeStyle = `rgba(232,0,45,${alpha})`
        ctx.lineWidth = width
        ctx.lineCap = 'round'
        ctx.stroke()
      }
      if (trail.length > 0) {
        const last = trail[trail.length - 1]
        const dotGrad = ctx.createRadialGradient(last.x, last.y, 0, last.x, last.y, 6)
        dotGrad.addColorStop(0, 'rgba(232,0,45,0.5)')
        dotGrad.addColorStop(1, 'rgba(232,0,45,0)')
        ctx.beginPath(); ctx.arc(last.x, last.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = dotGrad; ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
}

/* ── useIsMobile ─────────────────────────────────────────────────── */
function useIsMobile(bp = 640) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < bp : false)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < bp)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [bp])
  return isMobile
}

/* ── TypewriterRole: character-by-character ──────────────────────── */
function TypewriterRole({ roles }) {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing') // typing | pause | erasing

  useEffect(() => {
    const current = roles[roleIdx]
    let timeout

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 55)
      } else {
        timeout = setTimeout(() => setPhase('pause'), 1800)
      }
    } else if (phase === 'pause') {
      timeout = setTimeout(() => setPhase('erasing'), 400)
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 32)
      } else {
        setRoleIdx((i) => (i + 1) % roles.length)
        setPhase('typing')
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, phase, roleIdx, roles])

  return (
    <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#666' }}>
      {displayed}
      <span className="cursor-blink">_</span>
    </span>
  )
}

/* ── RedLineAccent: animated SVG line ────────────────────────────── */
function RedLineAccent({ width = 200 }) {
  return (
    <svg width={width} height="8" viewBox={`0 0 ${width} 8`} fill="none" style={{ display: 'block', marginBottom: 20, overflow: 'visible' }}>
      <line x1="0" y1="4" x2={width} y2="4" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="0" y1="4" x2={width} y2="4" stroke="#E8002D" strokeWidth="1.5" strokeDasharray={width} strokeDashoffset={width} style={{ animation: 'dashDraw 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s forwards' }} />
      <circle cx="0" cy="4" r="3" fill="#E8002D" style={{ animation: 'dotAppear 0.3s ease 1.2s both' }} />
      <circle cx={width} cy="4" r="2" fill="rgba(232,0,45,0.4)" style={{ animation: 'dotAppear 0.3s ease 1.3s both' }} />
    </svg>
  )
}

/* ── Hero ────────────────────────────────────────────────────────── */
export default function Hero({ onViewWork, onContact, resumeLink = '#' }) {
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [introPhase, setIntroPhase] = useState(0) // 0=pre 1=visible 2=letters-animate
  const sectionRef = useRef(null)
  const isMobile = useIsMobile(640)

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 60)
    const t2 = setTimeout(() => setIntroPhase(1), 200)
    const t3 = setTimeout(() => setIntroPhase(2), 700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    if (isMobile) return
    const h = (e) => {
      const { innerWidth: w, innerHeight: h } = window
      setMousePos({ x: (e.clientX / w - 0.5) * 2, y: (e.clientY / h - 0.5) * 2 })
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [isMobile])

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      {!isMobile && <CursorTrail />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700;1,900&family=Share+Tech+Mono&display=swap');

        /* ── Core keyframes ── */
        @keyframes blink        { 0%,100%{opacity:1}50%{opacity:0.1} }
        @keyframes scrollBall   { 0%,100%{transform:translateY(0)}50%{transform:translateY(7px)} }
        @keyframes nebula       { 0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.95;transform:scale(1.08)} }
        @keyframes shimmer      { 0%{background-position:-200% 0}100%{background-position:200% 0} }
        @keyframes gridReveal   { from{opacity:0}to{opacity:1} }
        @keyframes pulseRing    { 0%{transform:scale(1);opacity:.7}100%{transform:scale(2.8);opacity:0} }
        @keyframes pulseRing2   { 0%{transform:scale(1);opacity:.4}100%{transform:scale(2.2);opacity:0} }
        @keyframes scanline     { 0%{transform:translateY(-100%)}100%{transform:translateY(250vh)} }
        @keyframes glitch1      { 0%,100%{clip-path:inset(0 0 100% 0)}20%{clip-path:inset(33% 0 55% 0);transform:translateX(-5px)}40%{clip-path:inset(70% 0 10% 0);transform:translateX(5px)}60%{clip-path:inset(10% 0 80% 0);transform:translateX(-3px)}80%{clip-path:inset(60% 0 30% 0);transform:translateX(4px)} }
        @keyframes glitch2      { 0%,100%{clip-path:inset(0 0 100% 0)}20%{clip-path:inset(60% 0 20% 0);transform:translateX(5px)}40%{clip-path:inset(10% 0 70% 0);transform:translateX(-5px)}60%{clip-path:inset(80% 0 5% 0);transform:translateX(3px)}80%{clip-path:inset(25% 0 65% 0);transform:translateX(-4px)} }
        @keyframes heroSlideUp  { from{opacity:0;transform:translateY(40px) skewY(1.5deg)}to{opacity:1;transform:translateY(0)skewY(0)} }
        @keyframes heroFadeIn   { from{opacity:0}to{opacity:1} }
        @keyframes stripeExpand { from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left} }
        @keyframes lineGrow     { from{width:0;opacity:0}to{width:100%;opacity:.45} }
        @keyframes floatY       { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
        @keyframes ghostFloat   { 0%,100%{transform:translateY(-58%)translateX(0)}50%{transform:translateY(-61%)translateX(-8px)} }
        @keyframes borderRace   { 0%{background-position:0%0%}100%{background-position:300%0%} }
        @keyframes checkerIn    { from{opacity:0;transform:scaleX(0)}to{opacity:.9;transform:scaleX(1)} }
        @keyframes dashDraw     { to{stroke-dashoffset:0} }
        @keyframes dotAppear    { from{opacity:0;r:0}to{opacity:1} }
        @keyframes counterGlow  { 0%,100%{text-shadow:none}50%{text-shadow:0 0 22px rgba(232,0,45,.8)} }
        @keyframes letterDrop   { from{opacity:0;transform:translateY(-30px) rotateX(-90deg)}to{opacity:1;transform:translateY(0) rotateX(0)} }
        @keyframes redFlare     { 0%{opacity:0;transform:scaleX(0) scaleY(0)}40%{opacity:.9}100%{opacity:0;transform:scaleX(1.4) scaleY(1.4)} }
        @keyframes nameReveal   { from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0% 0 0)} }
        @keyframes hFlicker     { 0%,97%,100%{opacity:1}98%{opacity:.4}99%{opacity:1}99.5%{opacity:.2} }
        @keyframes subtleFloat  { 0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(0.5deg)} }
        @keyframes wipeRight    { from{transform:translateX(-105%)}to{transform:translateX(105%)} }

        /* ── Stagger classes ── */
        .hd0{animation:heroSlideUp .85s cubic-bezier(.16,1,.3,1) .05s both}
        .hd1{animation:heroSlideUp .85s cubic-bezier(.16,1,.3,1) .18s both}
        .hd2{animation:heroSlideUp 1s  cubic-bezier(.16,1,.3,1) .32s both}
        .hd3{animation:heroSlideUp .85s cubic-bezier(.16,1,.3,1) .48s both}
        .hd4{animation:heroSlideUp .85s cubic-bezier(.16,1,.3,1) .62s both}
        .hd5{animation:heroSlideUp .85s cubic-bezier(.16,1,.3,1) .78s both}
        .hd6{animation:heroFadeIn 1.1s ease .95s both}

        .checker-strip{animation:checkerIn .65s cubic-bezier(.16,1,.3,1) .05s both;transform-origin:left}

        /* ── Name letter animation ── */
        .name-letter{display:inline-block;animation:letterDrop .5s cubic-bezier(.34,1.56,.64,1) both}

        /* ── Glitch ── */
        .glitch-active::before,.glitch-active::after{content:attr(data-text);position:absolute;inset:0;color:#E8002D}
        .glitch-active::before{animation:glitch1 .45s steps(1) both}
        .glitch-active::after{color:#38bdf8;animation:glitch2 .45s steps(1) both}

        /* ── Cursor blink ── */
        .cursor-blink{animation:blink 1s ease-in-out infinite;color:#E8002D}

        /* ── Telemetry ── */
        .telemetry-item{position:relative;cursor:default;transition:transform .25s cubic-bezier(.23,1,.32,1)}
        .telemetry-item::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:#E8002D;transition:width .35s cubic-bezier(.16,1,.3,1)}
        .telemetry-item:hover{transform:translateY(-5px)}
        .telemetry-item:hover::after{width:100%}
        .telemetry-item:hover .telemetry-val{color:#fff!important}
        .telemetry-item:hover .telemetry-val.green{color:#6ee77a!important;text-shadow:0 0 14px rgba(57,211,83,.7)}
        .telemetry-lbl{transition:color .2s,letter-spacing .3s}
        .telemetry-item:hover .telemetry-lbl{color:#777!important;letter-spacing:.28em}

        /* ── Primary button ── */
        .hero-btn-primary{clip-path:polygon(9px 0%,100% 0%,calc(100% - 9px) 100%,0% 100%)}
        .hero-btn-primary:hover .btn-shimmer{animation:wipeRight .5s ease forwards}
        .hero-btn-primary{transition:box-shadow .3s ease,transform .3s cubic-bezier(.23,1,.32,1)!important}
        .hero-btn-primary:hover{box-shadow:0 0 35px rgba(232,0,45,.5),0 0 8px rgba(232,0,45,.25)!important}
        .hero-btn-primary:active{box-shadow:0 0 14px rgba(232,0,45,.3)!important}

        /* ── Resume button ── */
        .border-race-btn{position:relative;overflow:hidden}
        .border-race-btn::before{content:'';position:absolute;inset:-1px;background:linear-gradient(90deg,transparent,#E8002D,#38bdf8,transparent);background-size:300% 100%;animation:borderRace 1.8s linear infinite;opacity:0;transition:opacity .35s;z-index:0}
        .border-race-btn>*{position:relative;z-index:1}
        .border-race-btn:hover::before{opacity:1}
        .border-race-btn:hover{color:#fff!important;border-color:transparent!important}

        /* ── Scroll hint ── */
        .scroll-hint{animation:heroFadeIn 1s ease 1.4s both}
        .scroll-hint:hover .scroll-mouse{border-color:#E8002D!important;box-shadow:0 0 14px rgba(232,0,45,.4)}

        /* ── Stat glow ── */
        .stat-val-animate{animation:counterGlow 3s ease-in-out infinite}

        /* ── Ghost number ── */
        @media(min-width:640px){.ghost-num-wrap{animation:ghostFloat 9s ease-in-out infinite}}

        /* ── "Builds" text flicker ── */
        .name-builds{animation:hFlicker 7s ease-in-out infinite}

        /* ── Red flash overlay on load ── */
        @keyframes flashIn{0%{opacity:0}30%{opacity:.06}100%{opacity:0}}
        .flash-overlay{animation:flashIn 1.2s ease .2s both;pointer-events:none}

        /* ── Mobile ── */
        @media(max-width:639px){
          .hero-ghost-num{display:none!important}
          .hero-nebula-tr{width:200px!important;height:200px!important;top:20px!important;right:10px!important}
          .hero-nebula-mid{display:none!important}
          .hero-btn-row{flex-direction:column!important;width:100%!important}
          .hero-btn-row a,.hero-btn-row button{width:100%!important;justify-content:center!important}
          .hero-bottom-row{flex-direction:column!important;align-items:flex-start!important;gap:20px!important}
          .hero-description{max-width:100%!important}
        }
      `}</style>

      <section
        id="home"
        ref={sectionRef}
        style={{
          position: 'relative',
          minHeight: '100dvh',
          overflow: 'hidden',
          background: '#090909',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isMobile ? 'center' : 'flex-end',
          padding: isMobile ? '80px 20px 40px' : '0 52px 64px',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.45s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* Stars */}
        <StarCanvas />

        {/* Particle burst on load */}
        <ParticleBurst />

        {/* Red flash overlay */}
        <div className="flash-overlay" style={{ position: 'absolute', inset: 0, zIndex: 5, background: '#E8002D' }} />

        {/* Noise grain */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', backgroundImage: NOISE, opacity: 0.35 }} />

        {/* Scanline grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(transparent 50%,rgba(0,0,0,0.025) 50%)',
          backgroundSize: '100% 4px', opacity: 0.45,
        }} />

        {/* Scanline sweep */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '80px',
            background: 'linear-gradient(to bottom,transparent,rgba(232,0,45,0.02),transparent)',
            animation: 'scanline 9s linear infinite',
          }} />
        </div>

        {/* Grid overlay — parallax */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%)',
          transform: `translate(${mousePos.x * -7}px,${mousePos.y * -7}px)`,
          transition: 'transform 1s cubic-bezier(.23,1,.32,1)',
          animation: 'gridReveal 1.5s ease .2s both',
        }} />

        {/* Red bottom-left glow */}
        <div style={{
          position: 'absolute', bottom: -120, left: -100, zIndex: 2, pointerEvents: 'none',
          width: isMobile ? 340 : 750, height: isMobile ? 280 : 550,
          background: 'radial-gradient(ellipse,rgba(232,0,45,0.14) 0%,transparent 70%)',
          transform: `translate(${mousePos.x * 14}px,${mousePos.y * 14}px)`,
          transition: 'transform 1.4s cubic-bezier(.23,1,.32,1)',
        }} />

        {/* Blue accent glow */}
        <div style={{
          position: 'absolute', top: '18%', right: '8%', zIndex: 2, pointerEvents: 'none',
          width: isMobile ? 180 : 360, height: isMobile ? 180 : 360,
          background: 'radial-gradient(ellipse,rgba(56,189,248,0.07) 0%,transparent 70%)',
          transform: `translate(${mousePos.x * -11}px,${mousePos.y * -11}px)`,
          transition: 'transform 1.6s cubic-bezier(.23,1,.32,1)',
        }} />

        {/* Nebula top-right */}
        <div className="hero-nebula-tr" style={{
          position: 'absolute', top: 60, right: 90, zIndex: 2, pointerEvents: 'none',
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(ellipse at 40% 40%,rgba(56,189,248,0.1) 0%,rgba(232,0,45,0.05) 50%,transparent 70%)',
          animation: 'nebula 7s ease-in-out infinite',
          transform: `translate(${mousePos.x * -20}px,${mousePos.y * -20}px)`,
          transition: 'transform 1.7s cubic-bezier(.23,1,.32,1)',
        }} />

        {/* Nebula mid */}
        <div className="hero-nebula-mid" style={{
          position: 'absolute', top: '28%', left: '18%', zIndex: 2, pointerEvents: 'none',
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(232,0,45,0.07) 0%,transparent 70%)',
          animation: 'nebula 10s ease-in-out infinite reverse',
          transform: `translate(${mousePos.x * 9}px,${mousePos.y * 9}px)`,
          transition: 'transform 1.1s cubic-bezier(.23,1,.32,1)',
        }} />

        {/* Right stripe */}
        <div style={{
          position: 'absolute', top: 0, right: 0, zIndex: 2, pointerEvents: 'none',
          width: 2, height: '100%',
          background: 'linear-gradient(to bottom,transparent,#E8002D 30%,#E8002D 70%,transparent)',
          opacity: 0.5,
          animation: 'heroFadeIn 1s ease .1s both',
        }} />

        {/* Top stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none',
          height: 2, width: '45%',
          background: 'linear-gradient(to right,#E8002D,transparent)',
          opacity: 0.45,
          transformOrigin: 'left',
          animation: 'stripeExpand .95s cubic-bezier(.16,1,.3,1) .3s both',
        }} />

        {/* Bottom stripe */}
        <div style={{
          position: 'absolute', bottom: 0, right: 0, zIndex: 2, pointerEvents: 'none',
          height: 1, width: '30%',
          background: 'linear-gradient(to left,rgba(56,189,248,0.4),transparent)',
          transformOrigin: 'right',
          animation: 'stripeExpand .9s cubic-bezier(.16,1,.3,1) .6s both',
        }} />

        {/* Corner accents */}
        {[
          { top: 14, left: 14 },
          { top: 14, right: 14 },
          { bottom: 14, left: 14 },
          { bottom: 14, right: 14 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos, zIndex: 3, pointerEvents: 'none',
            width: 16, height: 16,
            borderTop: i < 2 ? '1px solid rgba(232,0,45,0.4)' : 'none',
            borderBottom: i >= 2 ? '1px solid rgba(232,0,45,0.4)' : 'none',
            borderLeft: i === 0 || i === 2 ? '1px solid rgba(232,0,45,0.4)' : 'none',
            borderRight: i === 1 || i === 3 ? '1px solid rgba(232,0,45,0.4)' : 'none',
            animation: `heroFadeIn 1s ease ${0.8 + i * 0.08}s both`,
          }} />
        ))}

        {/* Ghost driver number */}
        <div
          className="hero-ghost-num ghost-num-wrap"
          style={{
            position: 'absolute', right: 60, top: '50%',
            transform: `translateY(-58%) translate(${mousePos.x * 16}px,${mousePos.y * 11}px)`,
            zIndex: 2, pointerEvents: 'none', userSelect: 'none',
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
            fontSize: 'clamp(9rem,20vw,20rem)', letterSpacing: '-0.04em', lineHeight: 1,
            color: 'rgba(255,255,255,0.025)',
            transition: 'transform 1.4s cubic-bezier(.23,1,.32,1)',
            animation: 'heroFadeIn 1.6s ease .4s both',
          }}>
          01
        </div>

        {/* ── Main content ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* Checker strip */}
          <div className="checker-strip" style={{
            width: 50, height: 8, marginBottom: 20,
            backgroundImage: 'repeating-conic-gradient(#fff 0% 25%,transparent 0% 50%)',
            backgroundSize: '8px 8px',
          }} />

          {/* Status line */}
          <div className="hd1" style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: '0.58rem',
            letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E8002D',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
            flexWrap: 'wrap',
          }}>
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14 }}>
              <span style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', border: '1px solid #E8002D', animation: 'pulseRing 2s ease-out infinite' }} />
              <span style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', border: '1px solid rgba(232,0,45,0.3)', animation: 'pulseRing2 2s ease-out .4s infinite' }} />
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E8002D', animation: 'blink 1.6s ease-in-out infinite' }} />
            </span>
            Full-Stack Developer · Available for hire
          </div>

          {/* Typewriter role */}
          <div style={{ minHeight: 30, marginBottom: 10, overflow: 'hidden', display: 'flex', alignItems: 'center' }} className="hd1">
            <TypewriterRole roles={ROLES} />
          </div>

          {/* Red accent line */}
          <div className="hd2">
            <RedLineAccent width={isMobile ? 140 : 260} />
          </div>

          {/* Name — letter-by-letter drop */}
          <h1 className="hd2" style={{
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic',
            fontSize: 'clamp(4rem,13vw,11rem)', lineHeight: 0.86,
            letterSpacing: '-0.01em', textTransform: 'uppercase',
            color: '#fff', marginBottom: 24, position: 'relative',
          }}>
            <span style={{ display: 'block' }}>
              <GlitchName data-text="SOHAM">
                {'SOHAM'.split('').map((c, i) => (
                  <span key={i} className="name-letter" style={{
                    animationDelay: `${0.35 + i * 0.06}s`,
                    display: 'inline-block',
                  }}>
                    {c}
                  </span>
                ))}
              </GlitchName>
            </span>
            <span style={{ color: '#E8002D', position: 'relative', display: 'inline-block', lineHeight: 1 }} className="name-builds">
              {'BUILDS'.split('').map((c, i) => (
                <span key={i} className="name-letter" style={{
                  animationDelay: `${0.65 + i * 0.055}s`,
                  display: 'inline-block',
                }}>
                  {c}
                </span>
              ))}
              {/* Underline */}
              <span style={{
                position: 'absolute', bottom: -4, left: 0,
                height: 3, width: '100%',
                background: 'linear-gradient(to right,#E8002D,rgba(232,0,45,0.25))',
                transformOrigin: 'left',
                animation: 'stripeExpand .9s cubic-bezier(.16,1,.3,1) 1s both',
              }} />
            </span>
          </h1>

          {/* Telemetry row */}
          <div className="hd3" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '14px 18px' : '28px',
            marginBottom: isMobile ? 28 : 48,
            padding: '16px 0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
          }}>
            {/* Animated bottom rule */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, height: 1,
              background: 'linear-gradient(to right,#E8002D 0%,rgba(232,0,45,0.25) 40%,transparent 70%)',
              opacity: 0,
              animation: 'lineGrow 1s cubic-bezier(.16,1,.3,1) .6s forwards',
              width: '65%',
            }} />

            {[
              { lbl: 'Stack',  val: 'Full-Stack', num: null },
              { lbl: 'Base',   val: 'Pune, IN',   num: null },
              { lbl: 'XP',     val: null, num: 3, suffix: '+ Yrs' },
              { lbl: 'Status', val: 'GO', green: true, num: null },
            ].map((t, i) => (
              <div key={t.lbl} className="telemetry-item" style={{
                display: 'flex', flexDirection: 'column', gap: 4,
                animation: `heroSlideUp .7s cubic-bezier(.16,1,.3,1) ${0.45 + i * 0.1}s both`,
                minWidth: 64,
              }}>
                <span className="telemetry-lbl" style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: '0.5rem',
                  letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a3a3a',
                }}>{t.lbl}</span>
                <span className={`telemetry-val${t.green ? ' green stat-val-animate' : ''}`} style={{
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                  fontSize: '1.05rem', color: t.green ? '#39d353' : '#b8b8b8',
                  transition: 'color .2s,text-shadow .2s',
                }}>
                  {t.num !== null ? <><Counter target={t.num} />{t.suffix}</> : t.val}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="hd5 hero-bottom-row" style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            gap: isMobile ? 20 : 28,
          }}>
            <p className="hero-description" style={{
              fontSize: '0.88rem', lineHeight: 1.8, color: '#555',
              maxWidth: isMobile ? '100%' : 420, margin: 0,
            }}>
              I build{' '}
              <strong style={{
                color: '#c8c8c8', fontWeight: 500,
                background: 'linear-gradient(90deg,#c8c8c8,#fff,#c8c8c8)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3.5s linear infinite',
              }}>
                fast, precise digital products
              </strong>{' '}
              — from pixel-perfect interfaces to resilient backends. Every millisecond matters.
            </p>

            {/* Buttons */}
            <div className="hero-btn-row" style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 10, flexShrink: 0,
              width: isMobile ? '100%' : 'auto',
            }}>
              <MagneticBtn
                className="hero-btn-primary"
                onClick={() => (onViewWork ? onViewWork() : go('projects'))}
                style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  padding: '14px 28px', border: 'none', cursor: 'pointer',
                  background: '#E8002D', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  position: 'relative', overflow: 'hidden',
                  width: isMobile ? '100%' : 'auto', boxSizing: 'border-box',
                }}
              >
                <span className="btn-shimmer" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.25) 50%,transparent 100%)',
                  backgroundSize: '200% 100%',
                  pointerEvents: 'none',
                }} />
                View Work <ArrowUpRight size={13} />
              </MagneticBtn>

              <MagneticBtn
                as="a" href={resumeLink}
                className="border-race-btn"
                style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  padding: '14px 28px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)', color: '#aaa',
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  textDecoration: 'none', position: 'relative', overflow: 'hidden',
                  width: isMobile ? '100%' : 'auto', boxSizing: 'border-box',
                }}
              >
                Resume <ArrowUpRight size={13} />
              </MagneticBtn>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="scroll-hint"
          style={{
            position: 'absolute', bottom: isMobile ? 14 : 22, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 6, cursor: 'pointer',
          }}
          onClick={() => go('about')}
        >
          <span style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: '0.42rem',
            letterSpacing: '0.28em', color: '#2e2e2e', textTransform: 'uppercase',
            marginBottom: 3, transition: 'color .3s,letter-spacing .3s',
          }}>scroll</span>
          <div className="scroll-mouse" style={{
            width: 18, height: 28, border: '1px solid #222', borderRadius: 9,
            display: 'flex', justifyContent: 'center', paddingTop: 5,
            transition: 'border-color .3s ease,box-shadow .3s ease',
          }}>
            <div style={{
              width: 2, height: 5, background: '#333', borderRadius: 1,
              animation: 'scrollBall 2.2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </section>
    </>
  )
}