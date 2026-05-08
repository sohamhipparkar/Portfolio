import { useState, useRef, useEffect } from 'react'
import { SectionStyles, SectionBg, SectionHeader, useMouseParallax, useReveal } from './SectionShared'

const techStack = [
  { name: 'HTML5',         cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3',          cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'JavaScript',    cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript',    cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'React',         cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Next.js',       cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Tailwind',      cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Framer Motion', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg' },
  { name: 'Vite',          cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
  { name: 'Node.js',       cat: 'backend',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Express',       cat: 'backend',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'Python',        cat: 'backend',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Java',          cat: 'backend',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'C++',           cat: 'backend',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { name: 'C',             cat: 'backend',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
  { name: 'MongoDB',       cat: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'PostgreSQL',    cat: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'MySQL',         cat: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'Git',           cat: 'tools',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Figma',         cat: 'tools',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'VSCode',        cat: 'tools',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  { name: 'Postman',       cat: 'tools',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
  { name: 'Canva',         cat: 'tools',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
  { name: 'NPM',           cat: 'tools',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg' },
  { name: 'AWS',           cat: 'tools',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'Azure',         cat: 'tools',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
  { name: 'Google Colab',  cat: 'tools',    icon: 'https://cdn.simpleicons.org/googlecolab/f9ab00' },
]

const categories = [
  { id: 'all',      label: 'All Systems', color: '#E8002D' },
  { id: 'frontend', label: 'Frontend',    color: '#38bdf8' },
  { id: 'backend',  label: 'Backend',     color: '#34d399' },
  { id: 'database', label: 'Database',    color: '#fbbf24' },
  { id: 'tools',    label: 'Tools',       color: '#a78bfa' },
]

const catColor = { frontend: '#38bdf8', backend: '#34d399', database: '#fbbf24', tools: '#a78bfa' }
const catAbbr  = { frontend: 'FE', backend: 'BE', database: 'DB', tools: 'TL' }

// Random telemetry percentage per tech (stable across renders via memo)
const telemPcts = Object.fromEntries(
  techStack.map((t) => [t.name, 40 + Math.floor(Math.random() * 55)])
)

// Animated counter
function Counter({ target, duration = 500 }) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setVal(Math.round(p * target))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])
  return <span>{val}</span>
}

function GlitchWord({ children }) {
  const [glitching, setGlitching] = useState(false)
  useEffect(() => {
    const id = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 180)
    }, 4000 + Math.random() * 3000)
    return () => clearInterval(id)
  }, [])
  return (
    <span
      className={glitching ? 'ts-glitch-active' : ''}
      style={{ position: 'relative', display: 'inline-block' }}
      data-text={typeof children === 'string' ? children : ''}
    >
      {children}
    </span>
  )
}

// Individual F1 card — isolated so hover state is per-card only
function TechCard({ tech, index }) {
  const [hovered, setHovered] = useState(false)
  const color = catColor[tech.cat] || '#E8002D'
  const pct   = telemPcts[tech.name]

  return (
    <div
      className="ts-card"
      style={{ '--ts-card-color': color, animationDelay: `${index * 25}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Carbon-fiber crosshatch (CSS only, no image) */}
      <div className="ts-carbon" />

      {/* Top speed stripe — sweeps left→right on hover */}
      <div className={`ts-stripe${hovered ? ' active' : ''}`} />

      {/* Corner pit-stop brackets */}
      <div className={`ts-corner ts-tl${hovered ? ' active' : ''}`} />
      <div className={`ts-corner ts-br${hovered ? ' active' : ''}`} />

      {/* DRS glare sweep */}
      <div className={`ts-drs${hovered ? ' active' : ''}`} />

      {/* Category code — top-left (FE / BE / DB / TL) */}
      <span className="ts-lap">{catAbbr[tech.cat]}</span>

      {/* Tire-compound dot — top-right */}
      <div className={`ts-compound${hovered ? ' active' : ''}`} />

      {/* Icon area */}
      <div className="ts-icon-wrap">
        <div className={`ts-ring${hovered ? ' active' : ''}`} />
        <img
          className={`ts-icon${hovered ? ' active' : ''}`}
          src={tech.icon}
          alt={tech.name}
          loading="lazy"
        />
      </div>

      {/* Name + rev bar */}
      <div className="ts-name-bar">
        <span className={`ts-name${hovered ? ' active' : ''}`}>{tech.name}</span>
        <div className="ts-rev">
          <div className={`ts-rev-fill${hovered ? ' active' : ''}`} />
        </div>
      </div>

      {/* Telemetry line at the bottom */}
      <div className="ts-telem" style={{ '--telem-pct': `${pct}%` }} />
    </div>
  )
}

export default function SkillsSection() {
  const [sectionRef, visible] = useReveal()
  const mousePos = useMouseParallax()
  const [active, setActive]           = useState('all')
  const [transitioning, setTransitioning] = useState(false)
  const [renderedItems, setRenderedItems] = useState(techStack)
  const [ripples, setRipples]         = useState([])
  const timeoutRef = useRef(null)

  const handleFilter = (id, e) => {
    if (id === active || transitioning) return

    // Ripple on button click
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect()
      const rippleId = Date.now()
      setRipples((r) => [...r, { id: rippleId, x: e.clientX - rect.left, y: e.clientY - rect.top, btnId: id }])
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== rippleId)), 600)
    }

    setTransitioning(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setActive(id)
      setRenderedItems(id === 'all' ? techStack : techStack.filter((t) => t.cat === id))
      setTransitioning(false)
    }, 260)
  }

  useEffect(() => { setRenderedItems(techStack) }, [])

  const activeColor = categories.find((c) => c.id === active)?.color || '#E8002D'

  return (
    <section
      id="tech"
      ref={sectionRef}
      className={`port-section${visible ? ' sec-visible' : ''}`}
      aria-label="Tech stack"
    >
      <SectionStyles />
      <style>{`
        /* ── Glitch ── */
        @keyframes ts-glitch-clip-1 { 0%,100%{clip-path:inset(30% 0 50% 0)} 25%{clip-path:inset(10% 0 60% 0)} 50%{clip-path:inset(50% 0 20% 0)} 75%{clip-path:inset(5% 0 80% 0)} }
        @keyframes ts-glitch-clip-2 { 0%,100%{clip-path:inset(60% 0 10% 0)} 25%{clip-path:inset(80% 0 5% 0)} 50%{clip-path:inset(20% 0 60% 0)} 75%{clip-path:inset(40% 0 30% 0)} }
        @keyframes ts-glitch-x-1    { 0%,100%{transform:translateX(0)} 33%{transform:translateX(-3px)} 66%{transform:translateX(3px)} }
        @keyframes ts-glitch-x-2    { 0%,100%{transform:translateX(0)} 33%{transform:translateX(3px)} 66%{transform:translateX(-3px)} }
        .ts-glitch-active::before,.ts-glitch-active::after { content:attr(data-text); position:absolute; inset:0; }
        .ts-glitch-active::before { color:var(--red); opacity:0.7; animation:ts-glitch-clip-1 .15s steps(1) both, ts-glitch-x-1 .15s steps(1) both; }
        .ts-glitch-active::after  { color:rgba(56,189,248,0.9); opacity:0.5; animation:ts-glitch-clip-2 .15s steps(1) both, ts-glitch-x-2 .15s steps(1) both; }

        /* ── Section scan line ── */
        .ts-scan-line {
          position:absolute; left:0; right:0; height:1px; top:0; pointer-events:none; z-index:5;
          background:linear-gradient(90deg,transparent,var(--red),transparent);
          opacity:0.35; animation:tsScan 5s ease-in-out infinite;
        }
        @keyframes tsScan { 0%{top:0%;opacity:0} 4%{opacity:.35} 96%{opacity:.35} 100%{top:100%;opacity:0} }

        /* ── Filter row ── */
        .ts-filter-row { display:flex; gap:2px; flex-wrap:wrap; margin-bottom:48px; }
        .ts-filter-btn {
          font-family:'Share Tech Mono',monospace; font-size:0.6rem; letter-spacing:0.14em;
          text-transform:uppercase; padding:10px 24px; border:1px solid var(--silver3);
          background:transparent; color:var(--silver3); cursor:pointer; position:relative;
          clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          transition:border-color .3s, color .3s, background .3s, box-shadow .3s, transform .2s;
          overflow:hidden;
        }
        .ts-filter-btn:hover { transform:translateY(-2px); box-shadow:0 4px 20px rgba(232,0,45,0.2); color:#fff; }
        .ts-filter-btn.active {
          color:#fff; border-color:var(--ts-btn-color,#E8002D);
          background:var(--ts-btn-color,#E8002D);
          box-shadow:0 0 18px -2px var(--ts-btn-color,#E8002D), 0 0 40px -8px var(--ts-btn-color,#E8002D);
          transform:translateY(-1px);
        }
        .ts-btn-ripple {
          position:absolute; border-radius:50%; pointer-events:none;
          background:rgba(255,255,255,0.3); transform:scale(0);
          animation:tsRipple .55s ease-out forwards;
          width:80px; height:80px; margin-top:-40px; margin-left:-40px;
        }
        @keyframes tsRipple { to { transform:scale(3); opacity:0; } }

        /* ── Grid ── */
        .ts-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(115px,1fr));
          gap:1px;
        }

        /* ── Card shell ── */
        .ts-card {
          background:var(--carbon);
          position:relative; overflow:hidden; cursor:default;
          aspect-ratio:1 / 1.15;
          display:flex; flex-direction:column;
          transition:transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
          opacity:0;
          animation:tsCardIn .4s cubic-bezier(.22,1,.36,1) forwards;
        }
        .ts-card:hover {
          transform:translateY(-5px) scale(1.04);
          box-shadow:0 12px 40px -8px var(--ts-card-color), 0 0 0 1px var(--ts-card-color);
          z-index:10;
        }
        @keyframes tsCardIn { to { opacity:1; } }
        .ts-grid.ts-exiting .ts-card { animation:tsCardOut .22s ease-in forwards !important; }
        @keyframes tsCardOut { to { opacity:0; transform:scale(0.92); } }

        /* ── Carbon-fiber crosshatch texture ── */
        .ts-carbon {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background-image:
            repeating-linear-gradient(45deg,  rgba(255,255,255,.013) 0px,rgba(255,255,255,.013) 1px,transparent 1px,transparent 9px),
            repeating-linear-gradient(-45deg, rgba(255,255,255,.013) 0px,rgba(255,255,255,.013) 1px,transparent 1px,transparent 9px);
        }

        /* ── Top speed stripe ── */
        .ts-stripe {
          position:absolute; top:0; left:0; right:0; height:3px; z-index:3;
          background:var(--ts-card-color);
          box-shadow:0 0 10px var(--ts-card-color);
          transform:scaleX(0); transform-origin:left;
          transition:transform .38s cubic-bezier(.34,1.56,.64,1);
        }
        .ts-stripe.active { transform:scaleX(1); }

        /* ── Pit-stop corner brackets ── */
        .ts-corner {
          position:absolute; width:12px; height:12px; z-index:3; pointer-events:none;
          transition:width .3s, height .3s, border-color .3s;
        }
        .ts-tl { top:0; left:0; border-top:1px solid transparent; border-left:1px solid transparent; }
        .ts-br { bottom:0; right:0; border-bottom:1px solid transparent; border-right:1px solid transparent; }
        .ts-corner.active { width:22px; height:22px; border-color:var(--ts-card-color) !important; }

        /* ── DRS glare sweep ── */
        .ts-drs {
          position:absolute; top:0; bottom:0; left:-120%; width:55%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.055),transparent);
          transform:skewX(-20deg); pointer-events:none; z-index:2;
          transition:none;
        }
        .ts-drs.active { transition:left .42s ease-in; left:160%; }

        /* ── Category abbreviation (top-left) ── */
        .ts-lap {
          position:absolute; top:7px; left:9px; z-index:4;
          font-family:'Share Tech Mono',monospace; font-size:0.48rem;
          font-weight:700; letter-spacing:0.22em; text-transform:uppercase;
          color:rgba(255,255,255,.16); transition:color .3s;
          pointer-events:none;
        }
        .ts-card:hover .ts-lap { color:var(--ts-card-color); }

        /* ── Tire-compound dot (top-right) ── */
        .ts-compound {
          position:absolute; top:8px; right:9px; z-index:4;
          width:7px; height:7px; border-radius:50%;
          background:var(--ts-card-color);
          box-shadow:0 0 5px var(--ts-card-color);
          opacity:.5; transition:opacity .3s, transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .ts-compound.active { opacity:1; transform:scale(1.5); }

        /* ── Icon area ── */
        .ts-icon-wrap {
          flex:1; display:flex; align-items:center; justify-content:center;
          position:relative; z-index:5; padding-top:18px;
        }

        /* Radar-ring pulse behind icon */
        .ts-ring {
          position:absolute; width:50px; height:50px; border-radius:50%;
          border:1px solid var(--ts-card-color); opacity:0;
          animation:tsRingPulse 2.2s ease-out infinite;
          transition:opacity .3s;
        }
        .ts-ring.active { opacity:1; }
        @keyframes tsRingPulse {
          0%   { transform:scale(.85); opacity:0; }
          40%  { opacity:.4; }
          100% { transform:scale(2); opacity:0; }
        }

        .ts-icon {
          width:40px; height:40px; object-fit:contain; position:relative; z-index:6;
          transition:transform .45s cubic-bezier(.34,1.56,.64,1), filter .3s;
          will-change:transform;
        }
        .ts-icon.active {
          transform:scale(1.28) translateY(-4px);
          filter:drop-shadow(0 0 10px var(--ts-card-color));
        }

        /* ── Name + rev bar ── */
        .ts-name-bar {
          position:relative; z-index:5; padding:7px 10px 11px; display:flex; flex-direction:column; gap:4px;
        }
        .ts-name {
          font-family:'Share Tech Mono',monospace; font-size:0.58rem; letter-spacing:0.1em;
          text-transform:uppercase; color:var(--silver3);
          transition:color .25s, letter-spacing .3s;
        }
        .ts-name.active { color:#fff; letter-spacing:0.16em; }

        /* Rev / RPM bar */
        .ts-rev { width:100%; height:2px; background:rgba(255,255,255,.07); border-radius:1px; overflow:hidden; }
        .ts-rev-fill {
          height:100%; width:0%; background:var(--ts-card-color); border-radius:1px;
          transition:width .5s cubic-bezier(.34,1.56,.64,1);
          position:relative;
        }
        .ts-rev-fill::after {
          content:''; position:absolute; right:0; top:0; bottom:0;
          width:14px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.55));
        }
        .ts-rev-fill.active { width:100%; }

        /* ── Bottom telemetry line ── */
        .ts-telem {
          position:absolute; bottom:0; left:0; right:0; height:2px; z-index:3;
          background:linear-gradient(90deg,
            var(--ts-card-color) var(--telem-pct,50%),
            rgba(255,255,255,.08) var(--telem-pct,50%)
          );
          opacity:.45; animation:tsTelemPulse 3.2s ease-in-out infinite;
        }
        .ts-card:hover .ts-telem { opacity:1; }
        @keyframes tsTelemPulse { 0%,100%{opacity:.3} 50%{opacity:.65} }

        /* ── Stagger per card ── */
        ${Array.from({ length: 30 }, (_, i) => `.ts-card:nth-child(${i + 1}) { animation-delay:${i * 25}ms; }`).join('\n')}

        /* ── Bottom bar ── */
        .ts-bottom {
          display:flex; align-items:center; justify-content:space-between;
          margin-top:32px; padding-top:20px; border-top:1px solid var(--rule); position:relative;
        }
        .ts-progress-track {
          position:absolute; top:-1px; left:0; height:1px;
          transition:width .5s cubic-bezier(.22,1,.36,1), background .3s;
        }
        .ts-count {
          font-family:'Share Tech Mono',monospace; font-size:0.58rem;
          letter-spacing:.18em; text-transform:uppercase; color:var(--silver3);
        }
        .ts-count span { transition:color .3s; }
        .ts-legend { display:flex; gap:20px; }
        .ts-legend-item {
          display:flex; align-items:center; gap:6px;
          font-family:'Share Tech Mono',monospace; font-size:0.55rem;
          letter-spacing:.1em; text-transform:uppercase; color:var(--silver3);
          transition:color .2s; cursor:pointer;
        }
        .ts-legend-item:hover { color:#fff; }
        .ts-legend-dot {
          width:7px; height:7px; border-radius:50%;
          transition:transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
        }
        .ts-legend-item:hover .ts-legend-dot { transform:scale(1.8); }

        @media (max-width:768px) {
          .ts-grid { grid-template-columns:repeat(auto-fill,minmax(88px,1fr)); }
          .ts-legend { display:none; }
        }
      `}</style>

      <SectionBg mousePos={mousePos} ghostNum="04" redGlowPos="bottom-left" />
      <div className="ts-scan-line" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1080 }}>
        <SectionHeader
          sectorLabel="Sector 04 - Technical Specs"
          title={[<GlitchWord key="technologies">Technologies</GlitchWord>, 'I Work', 'With']}
          subtitle="Every tool chosen deliberately — performance, DX, and longevity over trend."
        />

        {/* Filter row */}
        <div className="sec-d3 ts-filter-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`ts-filter-btn${active === cat.id ? ' active' : ''}`}
              style={{ '--ts-btn-color': cat.color }}
              onClick={(e) => handleFilter(cat.id, e)}
            >
              {ripples.filter((r) => r.btnId === cat.id).map((r) => (
                <span key={r.id} className="ts-btn-ripple" style={{ left: r.x, top: r.y }} />
              ))}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={`sec-d4 ts-grid${transitioning ? ' ts-exiting' : ''}`}>
          {renderedItems.map((tech, i) => (
            <TechCard key={tech.name} tech={tech} index={i} />
          ))}
        </div>

        {/* Bottom telemetry strip */}
        <div className="sec-d5 ts-bottom">
          <div
            className="ts-progress-track"
            style={{
              width: `${(renderedItems.length / techStack.length) * 100}%`,
              background: activeColor,
              boxShadow: `0 0 8px ${activeColor}`,
            }}
          />
          <span className="ts-count">
            <span style={{ color: activeColor }}>
              <Counter key={renderedItems.length} target={renderedItems.length} />
            </span>
            {' '}/{' '}{techStack.length}{' '}technologies
          </span>
          <div className="ts-legend">
            {categories.slice(1).map((cat) => (
              <div
                key={cat.id}
                className="ts-legend-item"
                onClick={(e) => handleFilter(cat.id, e)}
                style={{ color: active === cat.id ? cat.color : undefined }}
              >
                <div
                  className="ts-legend-dot"
                  style={{
                    background: cat.color,
                    boxShadow: active === cat.id ? `0 0 8px ${cat.color}` : 'none',
                    transform: active === cat.id ? 'scale(1.6)' : undefined,
                  }}
                />
                {cat.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}