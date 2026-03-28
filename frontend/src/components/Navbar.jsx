import { useState, useEffect, useRef } from 'react'
import logo from '../assets/logo.png'

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
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6
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
      style={{ transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)' }}
    >
      {children}
    </a>
  )
}

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [scrollPct,   setScrollPct]   = useState(0)
  const [active,      setActive]      = useState('')
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [mounted,     setMounted]     = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const menuRef = useRef(null)

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

  const smoothTo = (href) => {
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,900&family=Share+Tech+Mono&display=swap');

        /* ── KEYFRAMES ── */
        @keyframes navDrop   { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes logoIn    { from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes linksIn   { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pillIn    { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.4);opacity:0} }
        @keyframes scanline  { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
        @keyframes mobileIn  { from{opacity:0;transform:scaleY(0.9) translateY(-8px)} to{opacity:1;transform:scaleY(1) translateY(0)} }
        @keyframes itemIn    { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 1px 48px rgba(0,0,0,0.7),0 1px 0 rgba(232,0,45,0.1)} 50%{box-shadow:0 1px 48px rgba(0,0,0,0.7),0 1px 0 rgba(232,0,45,0.22)} }
        @keyframes tickerPop { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }
        @keyframes progressIn{ from{opacity:0} to{opacity:1} }

        /* ── ROOT ── */
        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          pointer-events: auto;
          animation: navDrop 0.65s cubic-bezier(0.16,1,0.3,1) 0.05s both;
        }

        /* ── STRIP ── */
        .nav-strip {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 0 40px; height: 60px;
          background: rgba(11,11,11,0.72);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden;
          transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
        }
        .nav-strip.scrolled {
          background: rgba(11,11,11,0.94);
          border-bottom-color: rgba(232,0,45,0.2);
          animation: glowPulse 5s ease-in-out infinite;
        }
        .nav-strip::after {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 25%; height: 100%;
          background: linear-gradient(to right,transparent,rgba(255,255,255,0.03),transparent);
          animation: scanline 7s linear infinite;
          pointer-events: none;
        }
        .nav-strip::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(to bottom,transparent,#E8002D 35%,#E8002D 65%,transparent);
          opacity: 0.7;
          transition: opacity 0.4s;
        }
        .nav-strip.scrolled::before { opacity: 1; }

        /* ── SCROLL PROGRESS BAR ── */
        .nav-progress {
          position: absolute; bottom: 0; left: 0;
          height: 2px;
          background: linear-gradient(to right,#E8002D,rgba(232,0,45,0.35));
          transform-origin: left;
          transition: width 0.12s linear;
          animation: progressIn 1s ease 0.8s both;
          pointer-events: none; z-index: 10;
        }
        .nav-progress::after {
          content: '';
          position: absolute; right: -3px; top: -2px;
          width: 7px; height: 6px;
          border-radius: 50%;
          background: #E8002D;
          box-shadow: 0 0 10px 3px rgba(232,0,45,0.55);
          opacity: 0.9;
        }

        /* ── LOGO ── */
        .nav-logo-wrap {
          display: flex; align-items: center; gap: 14px;
          text-decoration: none; cursor: pointer;
          position: relative; z-index: 1;
          animation: logoIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both;
          /* Generous tap target on mobile */
          padding: 8px 0;
          flex-shrink: 0;
        }
        .nav-logo-img {
          width: 38px; height: 38px; object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), filter 0.4s;
          flex-shrink: 0;
        }
        .nav-logo-wrap:hover .nav-logo-img {
          transform: scale(1.1) rotate(-4deg);
          filter: drop-shadow(0 0 10px rgba(232,0,45,0.55));
        }
        .nav-logo-text { display: flex; flex-direction: column; gap: 1px; }
        .nav-logo-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900; font-style: italic;
          font-size: 1.15rem; text-transform: uppercase;
          letter-spacing: 0.02em; line-height: 1; color: #fff;
          transition: color 0.25s, letter-spacing 0.3s;
        }
        .nav-logo-wrap:hover .nav-logo-name { color: #E8002D; letter-spacing: 0.05em; }
        .nav-logo-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.42rem; letter-spacing: 0.22em;
          text-transform: uppercase; color: #3a3a3a; line-height: 1;
          transition: color 0.25s;
        }
        .nav-logo-wrap:hover .nav-logo-sub { color: #555; }

        /* ── DESKTOP LINKS ── */
        .nav-links {
          display: flex; align-items: center; gap: 4px;
          position: relative; z-index: 1;
          animation: linksIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both;
        }

        .nav-link {
          position: relative;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 6px 16px;
          text-decoration: none; cursor: pointer;
          clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
        }
        .nav-link-bg {
          position: absolute; inset: 0;
          background: rgba(232,0,45,0.06);
          border: 1px solid rgba(232,0,45,0);
          clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
          opacity: 0;
          transition: opacity 0.25s, border-color 0.25s;
        }
        .nav-link:hover .nav-link-bg,
        .nav-link.active-link .nav-link-bg { opacity:1; border-color:rgba(232,0,45,0.18); }

        .nav-link-ticker {
          position: absolute; top: 2px; right: 4px;
          width: 4px; height: 4px;
          background: #E8002D;
          clip-path: polygon(0 0,100% 0,100% 100%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .nav-link.active-link .nav-link-ticker { opacity:1; animation: tickerPop 0.3s cubic-bezier(0.23,1,0.32,1) both; }

        .nav-link-sector {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.4rem; letter-spacing: 0.22em;
          text-transform: uppercase; color: #282828; line-height: 1;
          position: relative; z-index: 1;
          transition: color 0.25s, transform 0.3s cubic-bezier(0.23,1,0.32,1);
        }
        .nav-link:hover .nav-link-sector { color:rgba(232,0,45,0.55); transform:translateY(-2px); }
        .nav-link.active-link .nav-link-sector { color:rgba(232,0,45,0.45); }

        .nav-link-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-style: italic;
          font-size: 0.9rem; text-transform: uppercase;
          letter-spacing: 0.06em; color: #888; line-height: 1;
          position: relative; z-index: 1;
          transition: color 0.25s, letter-spacing 0.3s;
        }
        .nav-link:hover .nav-link-label { color:#fff; letter-spacing:0.1em; }
        .nav-link.active-link .nav-link-label { color:#E8002D; }

        .nav-link-bar {
          position: absolute; bottom: 0; left: 6px; right: 6px;
          height: 2px;
          background: linear-gradient(to right,transparent,#E8002D,transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .nav-link.active-link .nav-link-bar { transform:scaleX(1); }
        .nav-link:not(.active-link):hover .nav-link-bar { transform:scaleX(1); transform-origin:center; }

        /* ── STATUS PILL ── */
        .nav-status {
          display: flex; align-items: center; gap: 10px;
          position: relative; z-index: 1;
          flex-shrink: 0;
          animation: pillIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.44s both;
        }
        .nav-status-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 14px;
          border: 1px solid rgba(57,211,83,0.18);
          background: rgba(57,211,83,0.04);
          clip-path: polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%);
          cursor: default;
          transition: border-color 0.3s, background 0.3s, transform 0.3s;
          white-space: nowrap;
        }
        .nav-status-pill:hover { border-color:rgba(57,211,83,0.38); background:rgba(57,211,83,0.08); transform:translateY(-1px); }
        .nav-status-dot-wrap {
          position: relative; display: flex;
          align-items: center; justify-content: center;
          width: 10px; height: 10px;
          flex-shrink: 0;
        }
        .nav-status-ring {
          position: absolute; width: 10px; height: 10px;
          border-radius: 50%; border: 1px solid #39d353;
          animation: pulseRing 2s ease-out infinite;
        }
        .nav-status-core {
          width: 5px; height: 5px; border-radius: 50%; background: #39d353;
          animation: blink 1.4s ease-in-out infinite;
        }
        .nav-status-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.48rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: #39d353;
        }

        /* ── HAMBURGER ── */
        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer;
          padding: 10px 6px; /* larger tap target */
          position: relative; z-index: 2;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-hamburger-line {
          display: block; height: 1.5px; background: #666;
          transition:
            transform  0.35s cubic-bezier(0.23,1,0.32,1),
            opacity    0.25s,
            background 0.25s,
            width      0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .nav-hamburger:hover .nav-hamburger-line { background: #E8002D; }
        .nav-hamburger-line:nth-child(1) { width: 22px; }
        .nav-hamburger-line:nth-child(2) { width: 15px; }
        .nav-hamburger-line:nth-child(3) { width: 19px; }
        .nav-hamburger.open .nav-hamburger-line:nth-child(1) { transform:translateY(6.5px) rotate(45deg); width:22px; background:#E8002D; }
        .nav-hamburger.open .nav-hamburger-line:nth-child(2) { opacity:0; transform:translateX(-6px) scaleX(0); }
        .nav-hamburger.open .nav-hamburger-line:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); width:22px; background:#E8002D; }

        /* ── MOBILE MENU ── */
        .nav-mobile {
          position: absolute; top: 100%; left: 0; right: 0;
          background: rgba(9,9,9,0.98);
          border-bottom: 1px solid rgba(232,0,45,0.18);
          backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
          padding: 6px 0 20px;
          transform-origin: top;
          animation: mobileIn 0.3s cubic-bezier(0.23,1,0.32,1) both;
          overflow: hidden;
          /* Cap height on short viewports and scroll if needed */
          max-height: calc(100vh - 60px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .nav-mobile::before {
          content: '';
          position: absolute; top: 0; left: 0;
          height: 1px; width: 60%;
          background: linear-gradient(to right,#E8002D,transparent);
          opacity: 0.4;
        }

        .nav-mobile-link {
          display: flex; align-items: center; gap: 16px;
          padding: 14px 24px; /* bigger tap target */
          text-decoration: none; cursor: pointer;
          border-left: 2px solid transparent;
          position: relative; overflow: hidden;
          opacity: 0;
          animation: itemIn 0.35s cubic-bezier(0.23,1,0.32,1) both;
          transition: background 0.25s, border-color 0.25s;
          -webkit-tap-highlight-color: transparent;
          min-height: 48px; /* WCAG touch target */
        }
        .nav-mobile-link::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg,rgba(232,0,45,0) 0%,rgba(232,0,45,0.06) 50%,rgba(232,0,45,0) 100%);
          background-size: 200% 100%;
          opacity: 0; transition: opacity 0.3s;
        }
        .nav-mobile-link:hover::after,
        .nav-mobile-link:active::after { opacity:1; animation:shimmer 0.6s linear; }
        .nav-mobile-link:hover,
        .nav-mobile-link:active { border-left-color:#E8002D; }
        .nav-mobile-link.active-link { border-left-color:rgba(232,0,45,0.5); background:rgba(232,0,45,0.03); }

        .nav-mobile-sector {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.46rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: #2c2c2c;
          width: 22px; flex-shrink: 0;
          transition: color 0.25s;
        }
        .nav-mobile-link:hover .nav-mobile-sector,
        .nav-mobile-link.active-link .nav-mobile-sector { color:rgba(232,0,45,0.5); }

        .nav-mobile-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-style: italic;
          font-size: 1.4rem; text-transform: uppercase;
          letter-spacing: 0.04em; color: #444;
          transition: color 0.25s, letter-spacing 0.3s;
        }
        .nav-mobile-link:hover .nav-mobile-label,
        .nav-mobile-link:active .nav-mobile-label { color:#fff; letter-spacing:0.08em; }
        .nav-mobile-link.active-link .nav-mobile-label { color:#E8002D; }

        .nav-mobile-arrow {
          margin-left: auto;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem; color: #252525;
          transition: color 0.25s, transform 0.35s cubic-bezier(0.23,1,0.32,1);
          flex-shrink: 0;
        }
        .nav-mobile-link:hover .nav-mobile-arrow,
        .nav-mobile-link:active .nav-mobile-arrow { color:#E8002D; transform:translateX(5px); }

        .nav-mobile-sep {
          height: 1px; margin: 0 24px;
          background: linear-gradient(to right,rgba(255,255,255,0.04),transparent);
        }

        .nav-mobile-foot {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 24px 0;
          margin-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .nav-mobile-foot-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.48rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: #39d353;
        }

        /* ── RESPONSIVE ── */

        /* Large desktop: full layout */
        @media (min-width: 1025px) {
          .nav-status   { display: flex; }
          .nav-links    { display: flex; }
          .nav-hamburger{ display: none; }
          .nav-logo-text{ display: flex; }
          .nav-mobile   { display: none !important; }
        }

        /* Tablet: hide status pill, show links */
        @media (min-width: 769px) and (max-width: 1024px) {
          .nav-strip    { padding: 0 24px; }
          .nav-status   { display: none; }
          .nav-links    { display: flex; gap: 2px; }
          .nav-hamburger{ display: none; }
          .nav-logo-text{ display: flex; }
          .nav-mobile   { display: none !important; }
          /* Tighten link padding at tablet size */
          .nav-link     { padding: 6px 10px; }
          .nav-link-label { font-size: 0.8rem; }
        }

        /* Mobile: hamburger only */
        @media (max-width: 768px) {
          .nav-strip    { padding: 0 16px; height: 56px; }
          .nav-links    { display: none; }
          .nav-status   { display: none; }
          .nav-hamburger{ display: flex; }
          .nav-logo-text{ display: none; }
          /* Keep logo image visible but compensate for hidden text */
          .nav-logo-wrap{ gap: 0; }
          .nav-mobile   { /* visible when mobileOpen */ }
        }

        /* Very small phones */
        @media (max-width: 360px) {
          .nav-strip    { padding: 0 12px; }
          .nav-logo-img { width: 32px; height: 32px; }
        }
      `}</style>

      <nav
        className="nav-root"
        ref={menuRef}
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease' }}
        aria-label="Primary navigation"
      >
        <div className={`nav-strip${scrolled ? ' scrolled' : ''}`}>

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
            <img src={logo} className="nav-logo-img" alt="Logo" />
            <div className="nav-logo-text">
              <span className="nav-logo-name">Soham</span>
              <span className="nav-logo-sub">Full-Stack · Portfolio</span>
            </div>
          </a>

          {/* ── DESKTOP / TABLET LINKS ── */}
          <div className="nav-links" role="list">
            {NAV_LINKS.map((link) => (
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
                <span className="nav-link-sector">{link.sector}</span>
                <span className="nav-link-label">{link.label}</span>
                <span className="nav-link-bar" />
              </MagneticLink>
            ))}
          </div>

          {/* ── STATUS PILL (desktop only) ── */}
          <div className="nav-status">
            <div className="nav-status-pill" aria-label="Open to work">
              <div className="nav-status-dot-wrap">
                <span className="nav-status-ring" />
                <span className="nav-status-core" />
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
                  style={{ animationDelay: `${0.04 + i * 0.06}s` }}
                >
                  <span className="nav-mobile-sector">{link.sector}</span>
                  <span className="nav-mobile-label">{link.label}</span>
                  <span className="nav-mobile-arrow">→</span>
                </a>
                {i < NAV_LINKS.length - 1 && <div className="nav-mobile-sep" />}
              </div>
            ))}

            {/* status footer */}
            <div className="nav-mobile-foot">
              <div style={{ position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:10,height:10,flexShrink:0 }}>
                <span className="nav-status-ring" />
                <span className="nav-status-core" />
              </div>
              <span className="nav-mobile-foot-text">Open to work</span>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}