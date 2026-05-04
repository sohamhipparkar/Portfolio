import { useEffect, useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

  :root {
    --f1-red: #E8002D;
    --f1-red-dim: rgba(232, 0, 45, 0.15);
    --f1-red-glow: rgba(232, 0, 45, 0.4);
    --carbon: #0A0A0C;
    --carbon-mid: #111116;
    --carbon-light: #1A1A22;
    --chrome: #C8C8D4;
    --chrome-dim: rgba(200, 200, 212, 0.4);
    --chrome-faint: rgba(200, 200, 212, 0.08);
    --white: #F0F0F8;
    --nav-height: 64px;
    --transition-snap: cubic-bezier(0.16, 1, 0.3, 1);
    --transition-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--carbon);
    min-height: 200vh;
    font-family: 'DM Mono', monospace;
  }

  /* ── NAV SHELL ── */
  .f1-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    height: var(--nav-height);
    display: flex;
    align-items: center;
    padding: 0 2rem;
    gap: 2rem;

    /* Base: fully transparent */
    background: transparent;
    border-bottom: 1px solid transparent;
    transition:
      background 0.5s var(--transition-snap),
      border-color 0.5s var(--transition-snap),
      backdrop-filter 0.5s var(--transition-snap);
  }

  /* Speed-stripe at top — expands on scroll */
  .f1-nav::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--f1-red) 40%, #FF6B00 70%, transparent 100%);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s var(--transition-snap);
  }

  /* Bottom hairline that appears on scroll */
  .f1-nav::after {
    content: '';
    position: absolute;
    bottom: 0; left: 2rem; right: 2rem;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--chrome-dim), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .f1-nav.scrolled {
    background: rgba(10, 10, 12, 0.85);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border-bottom-color: var(--chrome-faint);
  }
  .f1-nav.scrolled::before { transform: scaleX(1); }
  .f1-nav.scrolled::after  { opacity: 1; }

  /* ── LOGO ── */
  .nav-logo-wrap {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    text-decoration: none;
    position: relative;
  }

  .nav-logo-wrap img {
    width: 40px; height: 40px;
    object-fit: contain;
    position: relative;
    z-index: 1;
    transition: transform 0.4s var(--transition-bounce), filter 0.3s ease;
    filter: drop-shadow(0 0 0px var(--f1-red));
  }

  /* Spinning ring behind logo on hover */
  .nav-logo-wrap::before {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1.5px solid transparent;
    border-top-color: var(--f1-red);
    border-right-color: var(--f1-red);
    transform: rotate(0deg);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .nav-logo-wrap:hover img {
    transform: scale(1.1) rotate(-5deg);
    filter: drop-shadow(0 0 12px var(--f1-red-glow));
  }
  .nav-logo-wrap:hover::before {
    opacity: 1;
    animation: spin-ring 1.2s linear infinite;
  }

  @keyframes spin-ring {
    to { transform: rotate(360deg); }
  }

  /* ── SPACER ── */
  .nav-spacer { flex: 1; }

  /* Center toggle is mobile-only */
  .nav-center-toggle {
    display: none;
  }

  /* ── NAV LINKS ── */
  .nav-links {
    display: flex;
    align-items: center;
    list-style: none;
    gap: 0.25rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-links li {
    position: relative;
    /* Stagger entrance on mount */
    opacity: 0;
    transform: translateY(-8px);
    animation: link-enter 0.5s var(--transition-snap) forwards;
  }
  .nav-links li:nth-child(1) { animation-delay: 0.08s; }
  .nav-links li:nth-child(2) { animation-delay: 0.16s; }
  .nav-links li:nth-child(3) { animation-delay: 0.24s; }
  .nav-links li:nth-child(4) { animation-delay: 0.32s; }

  @keyframes link-enter {
    to { opacity: 1; transform: translateY(0); }
  }

  .nav-links a {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.9rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--chrome-dim);
    text-decoration: none;
    border-radius: 2px;
    position: relative;
    transition: color 0.25s ease;
    overflow: hidden;
  }

  /* Section index counter */
  .nav-links a .link-index {
    font-size: 0.55rem;
    color: var(--f1-red);
    opacity: 0.6;
    transition: opacity 0.25s ease;
  }

  /* Hover fill sweep */
  .nav-links a::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--chrome-faint);
    transform: translateX(-101%);
    transition: transform 0.3s var(--transition-snap);
    border-radius: 2px;
  }

  /* Active underline */
  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0.9rem; right: 0.9rem;
    height: 1.5px;
    background: var(--f1-red);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s var(--transition-snap);
  }

  .nav-links a:hover {
    color: var(--white);
  }
  .nav-links a:hover::before { transform: translateX(0); }
  .nav-links a:hover::after  { transform: scaleX(1); }
  .nav-links a:hover .link-index { opacity: 1; }

  /* Active state */
  .nav-links a.active {
    color: var(--white);
  }
  .nav-links a.active::after {
    transform: scaleX(1);
    background: linear-gradient(90deg, var(--f1-red), #FF6B00);
  }

  /* ── PIT STOP BUTTON ── */
  .nav-pit {
    position: relative;
    padding: 0 1.4rem;
    height: 36px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--white);
    background: var(--f1-red);
    border: none;
    cursor: pointer;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    transition: background 0.25s ease, transform 0.2s var(--transition-bounce);
    white-space: nowrap;

    /* Mount animation */
    opacity: 0;
    animation: pit-enter 0.5s var(--transition-snap) 0.45s forwards;
  }

  @keyframes pit-enter {
    to { opacity: 1; }
  }

  /* Shine sweep on hover */
  .nav-pit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.45s ease;
  }

  /* Right arrow track */
  .nav-pit .pit-arrow {
    display: inline-block;
    margin-left: 0.5rem;
    transition: transform 0.25s var(--transition-bounce);
  }

  .nav-pit:hover {
    background: #FF1E44;
    transform: scale(1.04);
  }
  .nav-pit:hover::before { transform: translateX(100%); }
  .nav-pit:hover .pit-arrow { transform: translateX(4px); }
  .nav-pit:active { transform: scale(0.97); }

  /* ── TELEMETRY TICKER (decorative) ── */
  .nav-telemetry {
    position: absolute;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    font-family: 'DM Mono', monospace;
    font-size: 0.5rem;
    color: var(--chrome-dim);
    letter-spacing: 0.1em;
    opacity: 0;
    white-space: nowrap;
    transition: opacity 0.4s ease 0.1s;
    pointer-events: none;
  }
  .f1-nav.scrolled .nav-telemetry { opacity: 0.35; }

  /* ── MOBILE NAV TOGGLE ── */
  @media (max-width: 900px) {
    .f1-nav {
      padding: 0 0.9rem;
      gap: 0.9rem;
    }

    .f1-nav::after {
      left: 0.9rem;
      right: 0.9rem;
    }

    .nav-spacer {
      display: none;
    }

    .nav-center-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 32px;
      padding: 0 0.85rem;
      border: 1px solid var(--chrome-faint);
      border-radius: 999px;
      background: rgba(17, 17, 22, 0.75);
      color: var(--chrome);
      font-family: 'DM Mono', monospace;
      font-size: 0.58rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      cursor: pointer;
      z-index: 3;
      transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
    }

    .nav-center-toggle:hover,
    .nav-center-toggle:focus-visible {
      border-color: var(--f1-red);
      color: var(--white);
      background: rgba(17, 17, 22, 0.92);
      outline: none;
    }

    .nav-center-toggle::after {
      content: '▾';
      margin-left: 0.45rem;
      color: var(--f1-red);
      transform: translateY(-1px);
      transition: transform 0.25s var(--transition-snap);
    }

    .f1-nav.mobile-open .nav-center-toggle::after {
      transform: rotate(180deg) translateY(1px);
    }

    .nav-pit {
      margin-left: auto;
      height: 32px;
      padding: 0 1rem;
      font-size: 0.53rem;
      letter-spacing: 0.12em;
    }

    .nav-links {
      position: absolute;
      top: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) translateY(-10px);
      width: min(92vw, 360px);
      flex-direction: column;
      gap: 0.2rem;
      padding: 0.45rem;
      border: 1px solid var(--chrome-faint);
      border-radius: 8px;
      background: rgba(10, 10, 12, 0.95);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s var(--transition-snap), visibility 0.25s;
      z-index: 2;
    }

    .f1-nav.mobile-open .nav-links {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }

    .nav-links li {
      width: 100%;
      opacity: 1;
      transform: none;
      animation: none;
    }

    .nav-links a {
      width: 100%;
      justify-content: flex-start;
      padding: 0.58rem 0.72rem;
      font-size: 0.62rem;
      letter-spacing: 0.11em;
    }

    .nav-telemetry {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .f1-nav {
      padding: 0 0.55rem;
      gap: 0.6rem;
    }

    .f1-nav::after {
      left: 0.55rem;
      right: 0.55rem;
    }

    .nav-logo-wrap img {
      width: 34px;
      height: 34px;
    }

    .nav-center-toggle {
      height: 30px;
      padding: 0 0.7rem;
      font-size: 0.52rem;
    }

    .nav-pit {
      height: 30px;
      padding: 0 0.8rem;
      font-size: 0.49rem;
      letter-spacing: 0.1em;
    }

    .nav-links {
      width: calc(100vw - 1.1rem);
    }

    .nav-links a {
      padding: 0.52rem 0.65rem;
      font-size: 0.58rem;
      letter-spacing: 0.09em;
    }
  }

  /* ── DEMO SCAFFOLD ── */
  .demo-wrap {
    padding: 6rem 2rem 2rem;
    color: var(--chrome-dim);
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    line-height: 1.8;
  }

  .nav-links a.launching {
    color: var(--white);
    animation: nav-launch 0.62s var(--transition-snap) both;
  }

  .nav-links a.launching::before {
    transform: translateX(0);
    background: linear-gradient(90deg, rgba(232,0,45,0.16), rgba(255,255,255,0.08), rgba(232,0,45,0.16));
    animation: launch-sweep 0.62s ease-out both;
  }

  .nav-links a.launching::after {
    transform: scaleX(1);
    background: linear-gradient(90deg, var(--f1-red), #FFB000);
    box-shadow: 0 0 12px rgba(232,0,45,0.35);
  }

  .nav-links a.launching .link-index {
    opacity: 1;
  }

  @keyframes nav-launch {
    0% { transform: translateY(0) scale(1); }
    38% { transform: translateY(-2px) scale(1.04); }
    100% { transform: translateY(0) scale(1); }
  }

  @keyframes launch-sweep {
    0% { transform: translateX(-100%); opacity: 0; }
    15% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  }
`;

const sections = ["about", "work", "tech", "projects"];

export default function PortfolioNav({ scrollY: scrollYProp, onNavigate, logoImg }) {
  const [scrollY, setScrollY] = useState(scrollYProp ?? 0);
  const [active, setActive]   = useState(null);
  //const [tick, setTick]       = useState("LAP 01 · 1:23.456 · PIT WINDOW OPEN · DRS ENABLED");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [launching, setLaunching] = useState(null);
  const navRef = useRef(null);
  const launchTimerRef = useRef(null);

  // If no external scrollY prop, track internally
  useEffect(() => {
    if (scrollYProp !== undefined) return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollYProp]);

  // Tick telemetry string
  {/*useEffect(() => {
    const tickers = [
      "LAP 01 · 1:23.456 · DRS ENABLED · TYRE: SOFT",
      "SECTOR 2 · GAP +0.342 · PIT WINDOW: OPEN",
      "PUSH NOW · ENERGY DEPLOY 100% · FINAL LAP",
      "LAP 07 · 1:21.890 · FASTEST LAP ■ PURPLE",
    ];
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % tickers.length; setTick(tickers[i]); }, 3000);
    return () => clearInterval(id);
  }, []);*/}

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [isMobileMenuOpen]);

  const isScrolled = (scrollYProp ?? scrollY) > 60;

  const navigate = (section) => {
    if (launchTimerRef.current) clearTimeout(launchTimerRef.current);
    setActive(section);
    setLaunching(section);
    launchTimerRef.current = setTimeout(() => setLaunching(null), 620);
    setIsMobileMenuOpen(false);
    if (onNavigate) onNavigate(section);
  };

  const goHome = (e) => {
    e.preventDefault();
    setActive(null);
    setIsMobileMenuOpen(false);
    const el = document.getElementById("home");
    if (el) { navigate("home"); return; }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{styles}</style>

      <nav
        ref={navRef}
        className={`f1-nav${isScrolled ? " scrolled" : ""}${isMobileMenuOpen ? " mobile-open" : ""}`}
      >

        {/* LOGO */}
        <a href="#home" className="nav-logo-wrap" onClick={goHome} aria-label="Go to top">
          {logoImg
            ? <img src={logoImg} alt="Logo" />
            : (
              /* Fallback SVG mark if no logoImg prop */
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <polygon points="18,2 34,32 2,32" fill="none" stroke="#E8002D" strokeWidth="2"/>
                <polygon points="18,10 28,28 8,28" fill="#E8002D" opacity="0.3"/>
                <line x1="18" y1="10" x2="18" y2="26" stroke="#E8002D" strokeWidth="1.5"/>
              </svg>
            )
          }
        </a>

        <div className="nav-spacer" />

        <button
          type="button"
          className="nav-center-toggle"
          aria-expanded={isMobileMenuOpen}
          aria-controls="portfolio-nav-links"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          Menu
        </button>

        {/* LINKS */}
        <ul className="nav-links" id="portfolio-nav-links">
          {sections.map((section, i) => (
            <li key={section}>
              <a
                href="#"
                className={`${active === section ? "active" : ""}${launching === section ? " launching" : ""}`}
                onClick={(e) => { e.preventDefault(); navigate(section); }}
              >
                <span className="link-index">{String(i + 2).padStart(2, "0")}</span>
                {section}
              </a>
            </li>
          ))}
        </ul>

        {/* PIT STOP CTA */}
        <button className="nav-pit" onClick={() => navigate("contact")}>
          Pit Stop <span className="pit-arrow">→</span>
        </button>

        {/* Telemetry ticker — visible only when scrolled */}
        {/* <span className="nav-telemetry" aria-hidden="true">{tick}</span> */}
      </nav>
    </>
  );
}