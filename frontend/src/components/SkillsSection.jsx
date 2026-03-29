import { useState, useRef, useEffect } from 'react'
import { SectionStyles, SectionBg, SectionHeader, useMouseParallax, useReveal } from './SectionShared'

const techStack = [
  { name: 'HTML5', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'JavaScript', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'React', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Next.js', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Tailwind', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Framer Motion', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg' },
  { name: 'Vite', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
  { name: 'Node.js', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Express', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'Python', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Java', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'C++', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { name: 'C', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
  { name: 'MongoDB', cat: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'PostgreSQL', cat: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'MySQL', cat: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'Git', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Figma', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'VSCode', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  { name: 'Postman', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
  { name: 'Canva', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
  { name: 'NPM', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg' },
  { name: 'AWS', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'Azure', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
  { name: 'Google Colab', cat: 'tools', icon: 'https://cdn.simpleicons.org/googlecolab/f9ab00' },
]

const categories = [
  { id: 'all', label: 'All Systems', color: '#E8002D' },
  { id: 'frontend', label: 'Frontend', color: '#38bdf8' },
  { id: 'backend', label: 'Backend', color: '#34d399' },
  { id: 'database', label: 'Database', color: '#fbbf24' },
  { id: 'tools', label: 'Tools', color: '#a78bfa' },
]

const catColor = { frontend: '#38bdf8', backend: '#34d399', database: '#fbbf24', tools: '#a78bfa' }

// Animated counter
function Counter({ target, duration = 600 }) {
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
    const interval = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 180)
    }, 4000 + Math.random() * 3000)

    return () => clearInterval(interval)
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

export default function SkillsSection() {
  const [sectionRef, visible] = useReveal()
  const mousePos = useMouseParallax()
  const [active, setActive] = useState('all')
  const [prev, setPrev] = useState('all')
  const [transitioning, setTransitioning] = useState(false)
  const [renderedItems, setRenderedItems] = useState(techStack)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [ripples, setRipples] = useState([]) // btn ripple effects
  const timeoutRef = useRef(null)

  const handleFilter = (id, e) => {
    if (id === active || transitioning) return
    // Ripple on button
    const rect = e.currentTarget.getBoundingClientRect()
    const rx = e.clientX - rect.left
    const ry = e.clientY - rect.top
    const rippleId = Date.now()
    setRipples((r) => [...r, { id: rippleId, x: rx, y: ry, btnId: id }])
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== rippleId)), 600)

    setPrev(active)
    setTransitioning(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setActive(id)
      setRenderedItems(id === 'all' ? techStack : techStack.filter((t) => t.cat === id))
      setTransitioning(false)
    }, 280)
  }

  // Initial render
  useEffect(() => {
    setRenderedItems(techStack)
  }, [])

  const activeColor = categories.find((c) => c.id === active)?.color || '#E8002D'

  return (
    <section id="tech" ref={sectionRef} className={`port-section${visible ? ' sec-visible' : ''}`} aria-label="Tech stack">
      <SectionStyles />
      <style>{`
        @keyframes ts-glitch-clip-1 { 0%,100%{clip-path:inset(30% 0 50% 0)} 25%{clip-path:inset(10% 0 60% 0)} 50%{clip-path:inset(50% 0 20% 0)} 75%{clip-path:inset(5% 0 80% 0)} }
        @keyframes ts-glitch-clip-2 { 0%,100%{clip-path:inset(60% 0 10% 0)} 25%{clip-path:inset(80% 0 5% 0)} 50%{clip-path:inset(20% 0 60% 0)} 75%{clip-path:inset(40% 0 30% 0)} }
        @keyframes ts-glitch-x-1    { 0%,100%{transform:translateX(0)} 33%{transform:translateX(-3px)} 66%{transform:translateX(3px)} }
        @keyframes ts-glitch-x-2    { 0%,100%{transform:translateX(0)} 33%{transform:translateX(3px)} 66%{transform:translateX(-3px)} }

        .ts-glitch-active::before,
        .ts-glitch-active::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
        }
        .ts-glitch-active::before {
          color: var(--red);
          opacity: 0.7;
          animation: ts-glitch-clip-1 .15s steps(1) both, ts-glitch-x-1 .15s steps(1) both;
        }
        .ts-glitch-active::after {
          color: rgba(56,189,248,0.9);
          opacity: 0.5;
          animation: ts-glitch-clip-2 .15s steps(1) both, ts-glitch-x-2 .15s steps(1) both;
        }

        /* ── Filter buttons ── */
        .ts-filter-row {
          display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 48px;
        }
        .ts-filter-btn {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.14em;
          text-transform: uppercase; padding: 8px 20px; border: 1px solid var(--silver3);
          background: transparent; color: var(--silver3); cursor: pointer; position: relative;
          clip-path: polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%);
          transition: border-color 0.3s, color 0.3s, background 0.3s, box-shadow 0.3s, transform 0.2s;
          overflow: hidden;
        }
        .ts-filter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(232,0,45,0.2);
        }
        .ts-filter-btn.active {
          color: #fff; border-color: var(--ts-active-color, #E8002D);
          background: var(--ts-active-color, #E8002D);
          box-shadow: 0 0 18px -2px var(--ts-active-color, #E8002D),
                      0 0 40px -8px var(--ts-active-color, #E8002D);
          transform: translateY(-1px);
        }
        /* ripple */
        .ts-btn-ripple {
          position: absolute; border-radius: 50%; pointer-events: none;
          background: rgba(255,255,255,0.3); transform: scale(0);
          animation: tsRipple 0.55s ease-out forwards;
          width: 80px; height: 80px; margin-top: -40px; margin-left: -40px;
        }
        @keyframes tsRipple {
          to { transform: scale(3); opacity: 0; }
        }

        /* ── Scanning line on section ── */
        .ts-scan-line {
          position: absolute; left: 0; right: 0; height: 1px; top: 0;
          background: linear-gradient(90deg, transparent, var(--red), transparent);
          opacity: 0.35;
          animation: tsScan 4s ease-in-out infinite;
          pointer-events: none; z-index: 5;
        }
        @keyframes tsScan {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 0.35; }
          95% { opacity: 0.35; }
          100% { top: 100%; opacity: 0; }
        }

        /* ── Grid ── */
        .ts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 2px;
          /* staggered entrance */
        }

        /* ── Card ── */
        .ts-card {
          background: var(--carbon); border: 1px solid var(--rule); padding: 28px 16px;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          position: relative; overflow: hidden; cursor: default;
          transition: border-color 0.3s, background 0.3s, transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
          /* entrance */
          opacity: 0; transform: translateY(16px) scale(0.96);
          animation: tsCardIn 0.45s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes tsCardIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* exit when transitioning */
        .ts-grid.ts-exiting .ts-card {
          animation: tsCardOut 0.25s ease-in forwards;
        }
        @keyframes tsCardOut {
          to { opacity: 0; transform: translateY(-8px) scale(0.94); }
        }

        /* corner accent lines */
        .ts-card::after {
          content: ''; position: absolute; top: 0; left: 0;
          width: 10px; height: 10px;
          border-top: 1px solid transparent; border-left: 1px solid transparent;
          transition: border-color 0.3s, width 0.3s, height 0.3s;
        }
        .ts-card::before {
          content: ''; position: absolute; bottom: 0; right: 0;
          width: 10px; height: 10px;
          border-bottom: 1px solid transparent; border-right: 1px solid transparent;
          transition: border-color 0.3s, width 0.3s, height 0.3s;
          z-index: 1;
        }
        .ts-card:hover::after {
          width: 20px; height: 20px;
          border-color: var(--ts-card-color, var(--red));
        }
        .ts-card:hover::before {
          width: 20px; height: 20px;
          border-color: var(--ts-card-color, var(--red));
          z-index: 1;
        }

        /* glow sweep on hover */
        .ts-card-sweep {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(135deg, var(--ts-card-color, rgba(232,0,45,0.08)) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.35s; z-index: 0;
        }
        .ts-card:hover .ts-card-sweep { opacity: 1; }

        /* bottom border glow */
        .ts-card-glow {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: var(--ts-card-color, var(--red));
          transform: scaleX(0); transform-origin: center;
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1);
          z-index: 2;
        }
        .ts-card:hover .ts-card-glow { transform: scaleX(1); }

        .ts-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 32px -8px var(--ts-card-color, rgba(232,0,45,0.4)),
                      0 0 0 1px var(--ts-card-color, var(--red));
          border-color: var(--ts-card-color, var(--red));
          z-index: 2;
        }

        /* icon */
        .ts-icon {
          width: 40px; height: 40px; object-fit: contain; position: relative; z-index: 2;
          transition: transform 0.4s cubic-bezier(.34,1.56,.64,1), filter 0.3s;
          will-change: transform;
        }
        .ts-card:hover .ts-icon {
          transform: scale(1.22) rotate(-4deg);
          filter: drop-shadow(0 0 8px var(--ts-card-color, rgba(232,0,45,0.6)));
        }

        /* name */
        .ts-name {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--silver3); text-align: center;
          transition: color 0.25s, letter-spacing 0.3s; position: relative; z-index: 2;
        }
        .ts-card:hover .ts-name {
          color: var(--ts-card-color, #fff);
          letter-spacing: 0.16em;
        }

        /* ── Bottom bar ── */
        .ts-bottom {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--rule);
          position: relative;
        }
        /* animated progress bar */
        .ts-progress-track {
          position: absolute; top: -1px; left: 0;
          height: 1px;
          background: var(--ts-active-color, var(--red));
          box-shadow: 0 0 8px var(--ts-active-color, var(--red));
          transition: width 0.5s cubic-bezier(.22,1,.36,1), background 0.3s;
        }
        .ts-count {
          font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--silver3);
        }
        .ts-count span { color: var(--ts-active-color, var(--red)); transition: color 0.3s; }
        .ts-legend { display: flex; gap: 20px; }
        .ts-legend-item {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--silver3);
          transition: color 0.2s;
          cursor: pointer;
        }
        .ts-legend-item:hover { color: #fff; }
        .ts-legend-dot {
          width: 6px; height: 6px; border-radius: 50%;
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
        }
        .ts-legend-item:hover .ts-legend-dot {
          transform: scale(1.7);
          box-shadow: 0 0 6px currentColor;
        }

        /* ── Stagger delays ── */
        ${Array.from({ length: 27 }, (_, i) => `.ts-card:nth-child(${i + 1}) { animation-delay: ${i * 28}ms; }`).join('\n')}

        @media (max-width: 768px) {
          .ts-grid { grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); }
          .ts-legend { display: none; }
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
              style={{
                '--ts-active-color': cat.color,
              }}
              onClick={(e) => handleFilter(cat.id, e)}
            >
              {/* ripple */}
              {ripples.filter((r) => r.btnId === cat.id).map((r) => (
                <span
                  key={r.id}
                  className="ts-btn-ripple"
                  style={{ left: r.x, top: r.y }}
                />
              ))}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          className={`sec-d4 ts-grid${transitioning ? ' ts-exiting' : ''}`}
          style={{ '--ts-active-color': activeColor }}
        >
          {renderedItems.map((tech) => {
            const color = catColor[tech.cat] || '#E8002D'
            return (
              <div
                key={tech.name}
                className="ts-card"
                data-cat={tech.cat}
                style={{ '--ts-card-color': color }}
                onMouseEnter={() => setHoveredCard(tech.name)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="ts-card-sweep" />
                <div className="ts-card-glow" />
                <img className="ts-icon" src={tech.icon} alt={tech.name} loading="lazy" />
                <span className="ts-name">{tech.name}</span>
              </div>
            )
          })}
        </div>

        {/* Bottom */}
        <div className="sec-d5 ts-bottom">
          <div
            className="ts-progress-track"
            style={{
              width: `${(renderedItems.length / techStack.length) * 100}%`,
              '--ts-active-color': activeColor,
            }}
          />
          <span className="ts-count">
            <Counter key={renderedItems.length} target={renderedItems.length} />
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
                    transform: active === cat.id ? 'scale(1.5)' : undefined,
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