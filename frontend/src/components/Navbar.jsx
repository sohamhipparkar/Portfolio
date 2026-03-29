import { useState, useEffect, useRef } from 'react'

// ── placeholder logo (replace with: import logo from '../assets/logo.png') ──
const logo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23E8002D' opacity='.15' stroke='%23E8002D' stroke-width='1'/%3E%3Ctext x='20' y='26' text-anchor='middle' font-family='serif' font-weight='900' font-size='18' fill='%23E8002D'%3ES%3C/text%3E%3C/svg%3E"

const NAV_LINKS = [
  { href: '#about',    label: 'About',    sector: '02' },
  { href: '#work',     label: 'Work',     sector: '03' },
  { href: '#projects', label: 'Projects', sector: '04' },
  { href: '#contact',  label: 'Contact',  sector: '05' },
]

/* ── Magnetic link wrapper ─────────────────────────────────────── */
function MagneticLink({ children, className, href, onClick, onMouseEnter, onMouseLeave, role, ariaCurrent }) {
  const ref = useRef(null)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const handleLeave = (e) => {
    if (ref.current) ref.current.style.transform = ''
    onMouseLeave?.(e)
  }

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleLeave}
      role={role}
      aria-current={ariaCurrent}
      style={{ transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)' }}
    >
      {children}
    </a>
  )
}

/* ── Glitch text effect ─────────────────────────────────────────── */
function GlitchText({ children, className, active }) {
  return (
    <span className={`glitch-wrap ${className || ''} ${active ? 'glitch-active' : ''}`} data-text={children}>
      {children}
    </span>
  )
}

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [scrollPct,   setScrollPct]   = useState(0)
  const [active,      setActive]      = useState('')
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [mounted,     setMounted]     = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const [mousePos,    setMousePos]    = useState({ x: -200, y: -200 })
  const menuRef  = useRef(null)
  const canvasRef = useRef(null)
  const frameRef  = useRef(null)

  /* staggered mount */
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t) }, [])

  /* close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 769) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* scroll depth → progress bar + shadow */
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(total > 0 ? (sy / total) * 100 : 0)
      setScrolled(sy > 24)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* active section */
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1))
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive('#' + id) },
        { threshold: 0.35 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  /* close mobile on outside click */
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* track mouse for spotlight effect */
  useEffect(() => {
    const onMove = (e) => {
      const nav = menuRef.current
      if (!nav) return
      const rect = nav.getBoundingClientRect()
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* animated noise canvas */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame = 0
    const draw = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const img = ctx.createImageData(canvas.width, canvas.height)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 18 | 0
        img.data[i]   = v
        img.data[i+1] = v
        img.data[i+2] = v
        img.data[i+3] = 28
      }
      ctx.putImageData(img, 0, 0)
      frame++
      if (frame % 3 === 0) frameRef.current = requestAnimationFrame(draw)
      else frameRef.current = requestAnimationFrame(draw)
    }
    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  const smoothTo = (href) => {
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,900&family=Share+Tech+Mono&display=swap');

        /* ── KEYFRAMES ── */
        @keyframes navDrop     { from{opacity:0;transform:translateY(-110%)} to{opacity:1;transform:translateY(0)} }
        @keyframes logoIn      { from{opacity:0;transform:translateX(-28px) skewX(-4deg)} to{opacity:1;transform:translateX(0) skewX(0)} }
        @keyframes linksIn     { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pillIn      { from{opacity:0;transform:translateX(28px) skewX(4deg)} to{opacity:1;transform:translateX(0) skewX(0)} }
        @keyframes blink       { 0%,100%{opacity:1} 48%{opacity:0.08} }
        @keyframes pulseRing   { 0%{transform:scale(1);opacity:0.75} 100%{transform:scale(2.6);opacity:0} }
        @keyframes scanline    { 0%{transform:translateX(-100%)} 100%{transform:translateX(500%)} }
        @keyframes mobileIn    { from{opacity:0;transform:scaleY(0.88) translateY(-12px);filter:blur(6px)} to{opacity:1;transform:scaleY(1) translateY(0);filter:blur(0)} }
        @keyframes itemIn      { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shimmer     { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes glowPulse   { 0%,100%{box-shadow:0 2px 60px rgba(0,0,0,0.8),0 1px 0 rgba(232,0,45,0.08)} 50%{box-shadow:0 2px 60px rgba(0,0,0,0.9),0 1px 0 rgba(232,0,45,0.28)} }
        @keyframes tickerPop   { from{opacity:0;transform:scale(0) rotate(-45deg)} to{opacity:1;transform:scale(1) rotate(0)} }
        @keyframes progressIn  { from{opacity:0} to{opacity:1} }
        @keyframes liquidFlow  { 0%{transform:scaleX(0);transform-origin:left} 45%{transform:scaleX(1);transform-origin:left} 55%{transform:scaleX(1);transform-origin:right} 100%{transform:scaleX(0);transform-origin:right} }
        @keyframes glitch1     { 0%,96%{clip-path:none;transform:none;opacity:0} 97%{clip-path:polygon(0 20%,100% 20%,100% 40%,0 40%);transform:translate(-3px,1px);opacity:0.7;color:#00ffcc} 98%{clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%);transform:translate(3px,-1px);opacity:0.6;color:#E8002D} 99%,100%{clip-path:none;transform:none;opacity:0} }
        @keyframes glitch2     { 0%,94%{clip-path:none;transform:none;opacity:0} 95%{clip-path:polygon(0 35%,100% 35%,100% 55%,0 55%);transform:translate(2px,2px);opacity:0.5;color:#00ffcc} 96%{clip-path:polygon(0 5%,100% 5%,100% 25%,0 25%);transform:translate(-2px,-2px);opacity:0.4;color:#ffff00} 97%,100%{clip-path:none;transform:none;opacity:0} }
        @keyframes logoHover   { 0%{filter:drop-shadow(0 0 0px rgba(232,0,45,0))} 50%{filter:drop-shadow(0 0 18px rgba(232,0,45,0.7)) drop-shadow(0 0 6px #fff)} 100%{filter:drop-shadow(0 0 0px rgba(232,0,45,0))} }
        @keyframes redAccent   { 0%,100%{opacity:0.5;height:60%} 50%{opacity:1;height:80%} }
        @keyframes cornerSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orb         { 0%{transform:scale(1) translate(0,0);opacity:0.6} 33%{transform:scale(1.15) translate(8px,-4px);opacity:0.8} 66%{transform:scale(0.9) translate(-6px,6px);opacity:0.5} 100%{transform:scale(1) translate(0,0);opacity:0.6} }
        @keyframes borderTrace { 0%{stroke-dashoffset:400} 100%{stroke-dashoffset:0} }

        /* ── ROOT ── */
        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          pointer-events: auto;
          animation: navDrop 0.8s cubic-bezier(0.16,1,0.3,1) 0.05s both;
        }

        /* ── STRIP ── */
        .nav-strip {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 0 40px; height: 60px;
          background: rgba(8,8,8,0.65);
          backdrop-filter: blur(28px) saturate(180%) brightness(0.9);
          -webkit-backdrop-filter: blur(28px) saturate(180%) brightness(0.9);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative; overflow: hidden;
          transition: background 0.5s, border-color 0.5s, box-shadow 0.5s;
        }
        .nav-strip.scrolled {
          background: rgba(7,7,7,0.97);
          border-bottom-color: rgba(232,0,45,0.25);
          animation: glowPulse 6s ease-in-out infinite;
        }

        /* noise overlay */
        .nav-noise {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0;
          opacity: 0.55; mix-blend-mode: overlay;
        }

        /* mouse spotlight */
        .nav-spotlight {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 1;
          background: radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(232,0,45,0.06) 0%, transparent 70%);
          transition: background 0.05s linear;
        }

        /* scanline shimmer */
        .nav-strip::after {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 18%; height: 100%;
          background: linear-gradient(to right,transparent,rgba(255,255,255,0.025),transparent);
          animation: scanline 9s linear infinite;
          pointer-events: none; z-index: 2;
        }

        /* left accent bar */
        .nav-strip::before {
          content: '';
          position: absolute; left: 0; top: 10%; bottom: 10%; width: 2px;
          background: linear-gradient(to bottom,transparent,#E8002D 30%,rgba(232,0,45,0.4) 70%,transparent);
          animation: redAccent 4s ease-in-out infinite;
          z-index: 3;
        }

        /* ambient red orb */
        .nav-orb {
          position: absolute; right: -60px; top: -30px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle,rgba(232,0,45,0.12) 0%,transparent 70%);
          pointer-events: none; z-index: 0;
          animation: orb 8s ease-in-out infinite;
          filter: blur(20px);
        }

        /* ── SCROLL PROGRESS BAR ── */
        .nav-progress {
          position: absolute; bottom: 0; left: 0;
          height: 2px;
          background: linear-gradient(to right,#E8002D,#ff4d6d,rgba(232,0,45,0.2));
          transform-origin: left;
          transition: width 0.15s linear;
          animation: progressIn 1.2s ease 0.9s both;
          pointer-events: none; z-index: 10;
          box-shadow: 0 0 8px rgba(232,0,45,0.6);
        }
        .nav-progress::after {
          content: '';
          position: absolute; right: -4px; top: -3px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #ff4d6d;
          box-shadow: 0 0 12px 4px rgba(232,0,45,0.7), 0 0 24px 8px rgba(232,0,45,0.25);
          animation: blink 1s ease-in-out infinite;
        }

        /* ── LOGO ── */
        .nav-logo-wrap {
          display: flex; align-items: center; gap: 14px;
          text-decoration: none; cursor: pointer;
          position: relative; z-index: 5;
          animation: logoIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s both;
          padding: 8px 0;
          flex-shrink: 0;
        }
        .nav-logo-img-wrap {
          position: relative; width: 38px; height: 38px; flex-shrink: 0;
        }
        .nav-logo-img {
          width: 38px; height: 38px; object-fit: contain;
          transition: transform 0.5s cubic-bezier(0.23,1,0.32,1), filter 0.5s;
          position: relative; z-index: 1;
        }
        .nav-logo-ring {
          position: absolute; inset: -3px;
          border-radius: 50%;
          border: 1px solid rgba(232,0,45,0);
          transition: border-color 0.4s, box-shadow 0.4s;
        }
        .nav-logo-wrap:hover .nav-logo-ring {
          border-color: rgba(232,0,45,0.5);
          box-shadow: 0 0 18px rgba(232,0,45,0.3), inset 0 0 8px rgba(232,0,45,0.1);
          animation: cornerSpin 3s linear infinite;
        }
        .nav-logo-wrap:hover .nav-logo-img {
          transform: scale(1.12) rotate(-6deg);
          animation: logoHover 0.6s ease-in-out;
        }
        .nav-logo-text { display: flex; flex-direction: column; gap: 2px; }
        .nav-logo-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900; font-style: italic;
          font-size: 1.15rem; text-transform: uppercase;
          letter-spacing: 0.02em; line-height: 1; color: #fff;
          transition: color 0.3s, letter-spacing 0.4s;
          position: relative;
        }
        .nav-logo-wrap:hover .nav-logo-name { color: #E8002D; letter-spacing: 0.06em; }
        .nav-logo-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.42rem; letter-spacing: 0.24em;
          text-transform: uppercase; color: #2a2a2a; line-height: 1;
          transition: color 0.3s, letter-spacing 0.4s;
        }
        .nav-logo-wrap:hover .nav-logo-sub { color: #444; letter-spacing: 0.3em; }

        /* ── DESKTOP LINKS ── */
        .nav-links {
          display: flex; align-items: center; gap: 4px;
          position: relative; z-index: 5;
          animation: linksIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s both;
        }

        .nav-link {
          position: relative;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 6px 18px;
          text-decoration: none; cursor: pointer;
          clip-path: polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%);
          overflow: hidden;
        }

        /* sliding bg fill on hover */
        .nav-link-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg,rgba(232,0,45,0.04) 0%,rgba(232,0,45,0.1) 100%);
          border: 1px solid rgba(232,0,45,0);
          clip-path: polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.3s, border-color 0.3s, transform 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .nav-link:hover .nav-link-bg,
        .nav-link.active-link .nav-link-bg {
          opacity: 1;
          border-color: rgba(232,0,45,0.22);
          transform: translateY(0);
        }

        /* corner triangle ticker */
        .nav-link-ticker {
          position: absolute; top: 3px; right: 5px;
          width: 5px; height: 5px;
          background: #E8002D;
          clip-path: polygon(0 0,100% 0,100% 100%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .nav-link.active-link .nav-link-ticker {
          opacity: 1;
          animation: tickerPop 0.4s cubic-bezier(0.23,1,0.32,1) both;
        }

        .nav-link-sector {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.4rem; letter-spacing: 0.26em;
          text-transform: uppercase; color: #222; line-height: 1;
          position: relative; z-index: 1;
          transition: color 0.3s, transform 0.4s cubic-bezier(0.23,1,0.32,1), letter-spacing 0.3s;
        }
        .nav-link:hover .nav-link-sector {
          color: rgba(232,0,45,0.65);
          transform: translateY(-3px);
          letter-spacing: 0.32em;
        }
        .nav-link.active-link .nav-link-sector { color: rgba(232,0,45,0.55); }

        /* glitch label */
        .glitch-wrap {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-style: italic;
          font-size: 0.9rem; text-transform: uppercase;
          letter-spacing: 0.06em; color: #777; line-height: 1;
          position: relative; z-index: 1;
          transition: color 0.3s, letter-spacing 0.4s;
          display: block;
        }
        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute; inset: 0;
          pointer-events: none;
        }
        .glitch-wrap::before { animation: glitch1 8s linear infinite; }
        .glitch-wrap::after  { animation: glitch2 8s linear infinite 0.3s; }
        .nav-link:hover .glitch-wrap   { color: #fff; letter-spacing: 0.12em; }
        .nav-link.active-link .glitch-wrap { color: #E8002D; }

        /* liquid underline */
        .nav-link-bar {
          position: absolute; bottom: 0; left: 7px; right: 7px;
          height: 2px;
          background: linear-gradient(to right, transparent, #E8002D 30%, #ff6680 60%, transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.23,1,0.32,1);
          box-shadow: 0 0 8px rgba(232,0,45,0.5);
        }
        .nav-link.active-link .nav-link-bar { transform: scaleX(1); }
        .nav-link:not(.active-link):hover .nav-link-bar {
          transform: scaleX(1);
          transform-origin: center;
          animation: liquidFlow 0.6s cubic-bezier(0.23,1,0.32,1) forwards;
        }

        /* top highlight line on hover */
        .nav-link-top {
          position: absolute; top: 0; left: 7px; right: 7px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(232,0,45,0.4), transparent);
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1) 0.05s;
        }
        .nav-link:hover .nav-link-top { transform: scaleX(1); }

        /* ── STATUS PILL ── */
        .nav-status {
          display: flex; align-items: center; gap: 10px;
          position: relative; z-index: 5;
          flex-shrink: 0;
          animation: pillIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.48s both;
        }
        .nav-status-pill {
          display: flex; align-items: center; gap: 9px;
          padding: 5px 16px;
          border: 1px solid rgba(57,211,83,0.15);
          background: rgba(57,211,83,0.03);
          clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          cursor: default; white-space: nowrap;
          position: relative; overflow: hidden;
          transition: border-color 0.35s, background 0.35s, transform 0.35s, box-shadow 0.35s;
        }
        .nav-status-pill::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg,transparent,rgba(57,211,83,0.06),transparent);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .nav-status-pill:hover::before { opacity:1; animation: shimmer 1.2s linear; }
        .nav-status-pill:hover {
          border-color: rgba(57,211,83,0.4);
          background: rgba(57,211,83,0.07);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(57,211,83,0.1), 0 0 0 1px rgba(57,211,83,0.08);
        }
        .nav-status-dot-wrap {
          position: relative; display: flex;
          align-items: center; justify-content: center;
          width: 10px; height: 10px; flex-shrink: 0;
        }
        .nav-status-ring {
          position: absolute; width: 10px; height: 10px;
          border-radius: 50%; border: 1px solid #39d353;
          animation: pulseRing 2.2s ease-out infinite;
        }
        .nav-status-ring2 {
          position: absolute; width: 10px; height: 10px;
          border-radius: 50%; border: 1px solid #39d353;
          animation: pulseRing 2.2s ease-out infinite 1.1s;
        }
        .nav-status-core {
          width: 5px; height: 5px; border-radius: 50%;
          background: #39d353;
          box-shadow: 0 0 6px 2px rgba(57,211,83,0.5);
          animation: blink 1.6s ease-in-out infinite;
        }
        .nav-status-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.48rem; letter-spacing: 0.22em;
          text-transform: uppercase; color: #39d353;
        }

        /* ── HAMBURGER ── */
        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer;
          padding: 10px 6px;
          position: relative; z-index: 6;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-hamburger-line {
          display: block; height: 1.5px; background: #555;
          transition:
            transform  0.4s cubic-bezier(0.23,1,0.32,1),
            opacity    0.3s,
            background 0.3s,
            width      0.4s cubic-bezier(0.23,1,0.32,1),
            box-shadow 0.3s;
        }
        .nav-hamburger:hover .nav-hamburger-line {
          background: #E8002D;
          box-shadow: 0 0 8px rgba(232,0,45,0.5);
        }
        .nav-hamburger-line:nth-child(1) { width: 22px; }
        .nav-hamburger-line:nth-child(2) { width: 15px; }
        .nav-hamburger-line:nth-child(3) { width: 19px; }
        .nav-hamburger.open .nav-hamburger-line:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg); width: 22px;
          background: #E8002D;
          box-shadow: 0 0 10px rgba(232,0,45,0.6);
        }
        .nav-hamburger.open .nav-hamburger-line:nth-child(2) { opacity:0; transform:translateX(-8px) scaleX(0); }
        .nav-hamburger.open .nav-hamburger-line:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg); width: 22px;
          background: #E8002D;
          box-shadow: 0 0 10px rgba(232,0,45,0.6);
        }

        /* ── MOBILE MENU ── */
        .nav-mobile {
          position: absolute; top: 100%; left: 0; right: 0;
          background: rgba(6,6,6,0.99);
          border-bottom: 1px solid rgba(232,0,45,0.22);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          padding: 8px 0 24px;
          transform-origin: top;
          animation: mobileIn 0.38s cubic-bezier(0.23,1,0.32,1) both;
          max-height: calc(100vh - 60px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .nav-mobile::before {
          content: '';
          position: absolute; top: 0; left: 0;
          height: 1px; width: 55%;
          background: linear-gradient(to right,#E8002D,rgba(232,0,45,0.3),transparent);
          opacity: 0.6;
        }
        .nav-mobile::after {
          content: '';
          position: absolute; top: 0; right: 0;
          height: 1px; width: 30%;
          background: linear-gradient(to left,rgba(0,255,204,0.15),transparent);
        }

        .nav-mobile-link {
          display: flex; align-items: center; gap: 18px;
          padding: 16px 28px;
          text-decoration: none; cursor: pointer;
          border-left: 2px solid transparent;
          position: relative; overflow: hidden;
          opacity: 0;
          animation: itemIn 0.4s cubic-bezier(0.23,1,0.32,1) both;
          transition: background 0.3s, border-color 0.3s;
          -webkit-tap-highlight-color: transparent;
          min-height: 52px;
        }
        .nav-mobile-link::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg,rgba(232,0,45,0) 0%,rgba(232,0,45,0.07) 50%,rgba(232,0,45,0) 100%);
          background-size: 200% 100%;
          opacity: 0; transition: opacity 0.3s;
        }
        .nav-mobile-link:hover::after,
        .nav-mobile-link:active::after { opacity:1; animation:shimmer 0.7s linear; }
        .nav-mobile-link:hover,
        .nav-mobile-link:active {
          border-left-color: #E8002D;
          background: rgba(232,0,45,0.03);
        }
        .nav-mobile-link.active-link {
          border-left-color: rgba(232,0,45,0.55);
          background: rgba(232,0,45,0.05);
        }

        .nav-mobile-sector {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.46rem; letter-spacing: 0.22em;
          text-transform: uppercase; color: #252525;
          width: 22px; flex-shrink: 0;
          transition: color 0.3s;
        }
        .nav-mobile-link:hover .nav-mobile-sector,
        .nav-mobile-link.active-link .nav-mobile-sector { color: rgba(232,0,45,0.55); }

        .nav-mobile-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900; font-style: italic;
          font-size: 1.6rem; text-transform: uppercase;
          letter-spacing: 0.03em; color: #333;
          transition: color 0.3s, letter-spacing 0.4s, text-shadow 0.3s;
        }
        .nav-mobile-link:hover .nav-mobile-label,
        .nav-mobile-link:active .nav-mobile-label {
          color: #fff;
          letter-spacing: 0.07em;
          text-shadow: 0 0 20px rgba(255,255,255,0.2);
        }
        .nav-mobile-link.active-link .nav-mobile-label {
          color: #E8002D;
          text-shadow: 0 0 16px rgba(232,0,45,0.3);
        }

        .nav-mobile-arrow {
          margin-left: auto;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem; color: #1e1e1e;
          transition: color 0.3s, transform 0.4s cubic-bezier(0.23,1,0.32,1);
          flex-shrink: 0;
        }
        .nav-mobile-link:hover .nav-mobile-arrow,
        .nav-mobile-link:active .nav-mobile-arrow { color: #E8002D; transform: translateX(7px); }

        .nav-mobile-sep {
          height: 1px; margin: 0 28px;
          background: linear-gradient(to right,rgba(255,255,255,0.035),transparent);
        }

        .nav-mobile-foot {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 28px 0;
          margin-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.035);
          animation: fadeSlideUp 0.4s ease 0.4s both;
        }
        .nav-mobile-foot-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.48rem; letter-spacing: 0.22em;
          text-transform: uppercase; color: #39d353;
        }

        /* ── RESPONSIVE ── */
        @media (min-width: 1025px) {
          .nav-status    { display: flex; }
          .nav-links     { display: flex; }
          .nav-hamburger { display: none; }
          .nav-logo-text { display: flex; }
          .nav-mobile    { display: none !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .nav-strip     { padding: 0 24px; }
          .nav-status    { display: none; }
          .nav-links     { display: flex; gap: 2px; }
          .nav-hamburger { display: none; }
          .nav-logo-text { display: flex; }
          .nav-mobile    { display: none !important; }
          .nav-link      { padding: 6px 11px; }
          .glitch-wrap   { font-size: 0.82rem; }
        }
        @media (max-width: 768px) {
          .nav-strip     { padding: 0 16px; height: 56px; }
          .nav-links     { display: none; }
          .nav-status    { display: none; }
          .nav-hamburger { display: flex; }
          .nav-logo-text { display: none; }
          .nav-logo-wrap { gap: 0; }
        }
        @media (max-width: 360px) {
          .nav-strip   { padding: 0 12px; }
          .nav-logo-img{ width: 32px; height: 32px; }
        }
      `}</style>

      <nav
        className="nav-root"
        ref={menuRef}
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease' }}
        aria-label="Primary navigation"
      >
        <div
          className={`nav-strip${scrolled ? ' scrolled' : ''}`}
          style={{ '--mx': `${mousePos.x}px`, '--my': `${mousePos.y}px` }}
        >
          {/* animated noise canvas */}
          <canvas ref={canvasRef} className="nav-noise" aria-hidden="true" />

          {/* mouse spotlight */}
          <div className="nav-spotlight" aria-hidden="true" />

          {/* ambient red orb */}
          <div className="nav-orb" aria-hidden="true" />

          {/* ── SCROLL PROGRESS BAR ── */}
          <div
            className="nav-progress"
            style={{ width: `${scrollPct}%` }}
            aria-hidden="true"
          />

          {/* ── LOGO ── */}
          <a
            className="nav-logo-wrap"
            href="/"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            aria-label="Back to top"
          >
            <div className="nav-logo-img-wrap">
              <img src={logo} className="nav-logo-img" alt="Logo" />
              <span className="nav-logo-ring" aria-hidden="true" />
            </div>
            <div className="nav-logo-text">
              <span className="nav-logo-name">Soham</span>
              <span className="nav-logo-sub">Full-Stack · Portfolio</span>
            </div>
          </a>

          {/* ── DESKTOP / TABLET LINKS ── */}
          <div className="nav-links" role="list">
            {NAV_LINKS.map((link, i) => (
              <MagneticLink
                key={link.href}
                href={link.href}
                className={`nav-link${active === link.href ? ' active-link' : ''}`}
                role="listitem"
                ariaCurrent={active === link.href ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); smoothTo(link.href) }}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <div className="nav-link-bg" />
                <div className="nav-link-ticker" />
                <div className="nav-link-top" />
                <span className="nav-link-sector">{link.sector}</span>
                <GlitchText active={hoveredLink === link.href}>{link.label}</GlitchText>
                <span className="nav-link-bar" />
              </MagneticLink>
            ))}
          </div>

          {/* ── STATUS PILL (desktop only) ── */}
          <div className="nav-status">
            <div className="nav-status-pill" aria-label="Open to work">
              <div className="nav-status-dot-wrap">
                <span className="nav-status-ring"  aria-hidden="true" />
                <span className="nav-status-ring2" aria-hidden="true" />
                <span className="nav-status-core"  aria-hidden="true" />
              </div>
              <span className="nav-status-text">Open to work</span>
            </div>
          </div>

          {/* ── HAMBURGER (mobile only) ── */}
          <button
            className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="nav-mobile-menu"
          >
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        {mobileOpen && (
          <div
            id="nav-mobile-menu"
            className="nav-mobile"
            role="menu"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link, i) => (
              <div key={link.href}>
                <a
                  className={`nav-mobile-link${active === link.href ? ' active-link' : ''}`}
                  href={link.href}
                  role="menuitem"
                  onClick={(e) => { e.preventDefault(); smoothTo(link.href) }}
                  style={{ animationDelay: `${0.04 + i * 0.07}s` }}
                >
                  <span className="nav-mobile-sector">{link.sector}</span>
                  <span className="nav-mobile-label">{link.label}</span>
                  <span className="nav-mobile-arrow">→</span>
                </a>
                {i < NAV_LINKS.length - 1 && <div className="nav-mobile-sep" />}
              </div>
            ))}

            <div className="nav-mobile-foot">
              <div style={{ position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:10,height:10,flexShrink:0 }}>
                <span className="nav-status-ring"  aria-hidden="true" />
                <span className="nav-status-ring2" aria-hidden="true" />
                <span className="nav-status-core"  aria-hidden="true" />
              </div>
              <span className="nav-mobile-foot-text">Open to work</span>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}