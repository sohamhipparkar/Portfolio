import { useEffect, useRef, useState } from 'react'

/* ── Animated Counter ─────────────────────────────────────────── */
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

/* ── Reveal on scroll ─────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

export default function AboutSection() {
  const [sectionRef, visible] = useReveal()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e) => {
      const { innerWidth: w, innerHeight: h } = window
      setMousePos({ x: (e.clientX / w - 0.5) * 2, y: (e.clientY / h - 0.5) * 2 })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const techSpecs = [
    { k: 'Frontend', v: 'React · Framer Motion · Tailwind CSS · Animation' },
    { k: 'Backend',  v: 'Node.js · Express · REST · Prisma' },
    { k: 'Database', v: 'PostgreSQL · MongoDB · Redis' },
    { k: 'DevOps',   v: 'Git · Vercel · AWS' },
    { k: 'Design',   v: 'Figma · Motion · Typography' },
  ]

  const chips = [
    'React', 'Express', 'Node.js', 'Python',
    'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'Figma',
  ]

  const profileCards = [
    { emoji: '🎓', label: 'Student',       sub: "MIT ADT · Class of '27", color: '#38bdf8' },
    { emoji: '💻', label: 'Developer',      sub: 'Full Stack Engineer',           color: '#E8002D' },
    { emoji: '🏆', label: 'Problem Solver', sub: 'DSA & Competitive Programming', color: '#a78bfa' },
  ]

  const stats = [
    { lbl: 'Experience', num: 3,    suffix: '+ Yrs' },
    { lbl: 'Shipped',    num: 10,   suffix: '+ Projects' },
    { lbl: 'Commits',    num: 700, suffix: '+' },
    { lbl: 'Status',     val: 'OPEN', green: true },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&family=Share+Tech+Mono&display=swap');

        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes heroIn    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes softGlow  { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes barFill   { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes scanline  { 0%{transform:translateY(-100%)} 100%{transform:translateY(200vh)} }
        @keyframes nebula    { 0%,100%{opacity:.55;transform:scale(1) rotate(0deg)} 50%{opacity:1;transform:scale(1.07) rotate(4deg)} }

        .ab-d0,.ab-d1,.ab-d2,.ab-d3,.ab-d4,.ab-d5,.ab-d6 { opacity:0 }
        .ab-visible .ab-d0 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .00s both }
        .ab-visible .ab-d1 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .10s both }
        .ab-visible .ab-d2 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .20s both }
        .ab-visible .ab-d3 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .32s both }
        .ab-visible .ab-d4 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .44s both }
        .ab-visible .ab-d5 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .56s both }
        .ab-visible .ab-d6 { animation: heroIn .9s cubic-bezier(.16,1,.3,1) .68s both }

        .ab-visible .ab-bar {
          animation: barFill 1s cubic-bezier(.16,1,.3,1) .6s both;
        }

        .ab-card {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          padding: 20px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: default;
          transition: border-color .25s, background .25s, transform .25s cubic-bezier(.23,1,.32,1), box-shadow .25s;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
        }
        .ab-card:hover {
          background: rgba(255,255,255,0.055);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.35);
        }

        .ab-chip {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem;
          font-weight: 400;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.03);
          color: #666;
          padding: 5px 13px;
          cursor: default;
          transition: border-color .2s, color .2s, background .2s, transform .2s;
          white-space: nowrap;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
        }
        .ab-chip:hover {
          border-color: rgba(232,0,45,0.45);
          color: #fff;
          background: rgba(232,0,45,0.08);
          transform: translateY(-2px);
        }

        .ab-spec-row {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 13px 20px;
          transition: background .2s;
        }
        .ab-spec-row:hover { background: rgba(255,255,255,0.03) }
        .ab-spec-row:hover .ab-spec-key { color: #E8002D !important }

        .ab-stat {
          display: flex;
          flex-direction: column;
          gap: 3px;
          cursor: default;
          transition: transform .2s;
        }
        .ab-stat:hover { transform: translateY(-3px) }
        .ab-stat:hover .ab-stat-val { color: #fff !important }
        .ab-stat:hover .ab-stat-val.green { color: #6ee77a !important; text-shadow: 0 0 12px rgba(57,211,83,0.6) }

        @media (max-width: 768px) {
          .ab-grid { grid-template-columns: 1fr !important }
          .ab-stats-row { flex-wrap: wrap !important; gap: 20px !important }
          .ab-section { padding: 48px 24px 64px !important }
        }
      `}</style>

      <section
        id="about"
        ref={sectionRef}
        className={`ab-section${visible ? ' ab-visible' : ''}`}
        style={{
          position: 'relative',
          background: '#0b0b0b',
          overflow: 'hidden',
          padding: '72px 48px 96px',
          fontFamily: "'Barlow Condensed', sans-serif",
        }}
        aria-label="About me"
      >
        {/* Scanline texture */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.03) 50%)',
          backgroundSize: '100% 4px', opacity: 0.4,
        }} />

        {/* Scanline sweep */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(232,0,45,0.012), transparent)',
            animation: 'scanline 10s linear infinite',
          }} />
        </div>

        {/* Grid overlay — parallax */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '72px 72px',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%)',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%)',
          transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)`,
          transition: 'transform 0.8s cubic-bezier(0.23,1,0.32,1)',
        }} />

        {/* Red glow — parallax */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: -100, left: -80, zIndex: 2, pointerEvents: 'none',
          width: 600, height: 440,
          background: 'radial-gradient(ellipse,rgba(232,0,45,0.12) 0%,transparent 70%)',
          animation: 'softGlow 6s ease-in-out infinite',
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
          transition: 'transform 1.2s cubic-bezier(0.23,1,0.32,1)',
        }} />

        {/* Nebula bloom — parallax */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 60, right: 100, zIndex: 2, pointerEvents: 'none',
          width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(ellipse at 40% 40%,rgba(56,189,248,0.07) 0%,rgba(232,0,45,0.04) 50%,transparent 70%)',
          animation: 'nebula 7s ease-in-out infinite',
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
          transition: 'transform 1.5s cubic-bezier(0.23,1,0.32,1)',
        }} />

        {/* Left accent stripe */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none',
          width: 3, height: '100%',
          background: 'linear-gradient(to bottom,transparent,#E8002D 30%,#E8002D 70%,transparent)',
          opacity: 0.55,
        }} />

        {/* Bottom stripe */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 0, right: 0, zIndex: 2, pointerEvents: 'none',
          height: 2, width: '40%',
          background: 'linear-gradient(to left,#E8002D,transparent)',
          opacity: 0.4,
        }} />

        {/* Ghost section number — parallax */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: 48, top: '50%',
          transform: `translateY(-58%) translate(${mousePos.x * 12}px, ${mousePos.y * 8}px)`,
          zIndex: 2, pointerEvents: 'none', userSelect: 'none',
          fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
          fontSize: 'clamp(9rem,19vw,19rem)', letterSpacing: '-0.04em', lineHeight: 1,
          color: 'rgba(255,255,255,0.025)',
          transition: 'transform 1.2s cubic-bezier(0.23,1,0.32,1)',
        }}>
          02
        </div>

        {/* ── Main content ── */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1080 }}>

          {/* Checker flag */}
          <div className="ab-d0" style={{
            width: 44, height: 7, marginBottom: 18, opacity: 0.2,
            backgroundImage: 'repeating-conic-gradient(#fff 0% 25%,transparent 0% 50%)',
            backgroundSize: '7px 7px',
          }} />

          {/* Eyebrow badge */}
          <div className="ab-d0" style={{ marginBottom: 20 }}>
            <span style={{
              fontFamily: "'Share Tech Mono',monospace",
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: '0.6rem', letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#E8002D',
            }}>
              <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 12, height: 12 }}>
                <span style={{
                  position: 'absolute', width: 12, height: 12, borderRadius: '50%',
                  border: '1px solid #E8002D',
                  animation: 'pulseRing 2s ease-out infinite',
                }} />
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#E8002D',
                  animation: 'blink 1.4s ease-in-out infinite',
                }} />
              </span>
              Sector 02 · About
            </span>
          </div>

          {/* Heading */}
          <h2 className="ab-d1" style={{
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic',
            fontSize: 'clamp(4rem,10vw,9rem)', lineHeight: 0.9,
            letterSpacing: '-0.01em', textTransform: 'uppercase',
            color: '#fff', marginBottom: 20, position: 'relative',
          }}>
            Hi, I'm a
            <br />
            <span style={{ color: '#E8002D', position: 'relative', display: 'inline-block' }}>
              Full‑Stack
              <span className="ab-bar" style={{
                position: 'absolute', bottom: -4, left: 0,
                height: 3, width: '100%',
                background: 'linear-gradient(to right, #E8002D, rgba(232,0,45,0.25))',
                display: 'block', transformOrigin: 'left',
              }} />
            </span>
            {' '}Developer
          </h2>

          {/* Sub */}
          <p className="ab-d2" style={{
            fontFamily: "'Share Tech Mono',monospace",
            color: '#555', fontSize: '0.75rem', lineHeight: 1.8,
            maxWidth: 440, marginBottom: 52, letterSpacing: '0.05em',
          }}>
            Building fast, polished products at the intersection of engineering and design.
          </p>

          {/* Telemetry / Stats */}
          <div
            className="ab-d3 ab-stats-row"
            style={{
              display: 'flex', gap: 32, flexWrap: 'wrap',
              padding: '16px 0', marginBottom: 52,
              borderTop: '1px solid rgba(255,255,255,0.09)',
              position: 'relative',
            }}
          >
            {/* Animated border bottom */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, height: 1,
              background: 'linear-gradient(to right, #E8002D 0%, rgba(232,0,45,0.3) 40%, transparent 70%)',
              width: '60%', opacity: 0.4,
            }} />

            {stats.map((s, i) => (
              <div
                key={s.lbl}
                className="ab-stat"
                style={{ animation: `heroIn .7s cubic-bezier(.16,1,.3,1) ${0.44 + i * 0.08}s both` }}
              >
                <span style={{
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: '0.52rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: '#444',
                }}>
                  {s.lbl}
                </span>
                <span
                  className={`ab-stat-val${s.green ? ' green' : ''}`}
                  style={{
                    fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                    fontSize: '1.5rem', letterSpacing: '-0.01em',
                    color: s.green ? '#39d353' : '#c8c8c8',
                    textShadow: s.green ? '0 0 18px rgba(57,211,83,0.35)' : 'none',
                    transition: 'color .2s, text-shadow .2s',
                  }}
                >
                  {s.num != null ? <Counter target={s.num} suffix={s.suffix} /> : s.val}
                </span>
              </div>
            ))}
          </div>

          {/* Profile Cards */}
          <div
            className="ab-d3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 10, marginBottom: 56,
            }}
          >
            {profileCards.map((card) => (
              <div
                key={card.label}
                className="ab-card"
                onMouseEnter={e => e.currentTarget.style.borderColor = card.color + '55'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <span style={{ fontSize: '1.6rem', lineHeight: 1, flexShrink: 0 }}>
                  {card.emoji}
                </span>
                <div>
                  <p style={{
                    fontFamily: "'Share Tech Mono',monospace",
                    fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: card.color, marginBottom: 5,
                  }}>
                    {card.label}
                  </p>
                  <p style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    color: '#666', fontSize: '0.9rem', lineHeight: 1.3, fontWeight: 400,
                  }}>
                    {card.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Main two-column grid */}
          <div
            className="ab-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}
          >
            {/* Bio + stack chips */}
            <div className="ab-d5">
              <p style={{
                fontFamily: "'Barlow Condensed',sans-serif",
                color: '#666', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: 16, fontWeight: 400,
              }}>
                I'm a{' '}
                <strong style={{
                  fontWeight: 700, color: '#c8c8c8',
                  background: 'linear-gradient(90deg,#c8c8c8,#fff,#c8c8c8)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s linear infinite',
                }}>
                  full-stack developer
                </strong>{' '}
                who obsesses over load times, clean architecture, and shipping products that feel as good as they perform.
              </p>
              <p style={{
                fontFamily: "'Barlow Condensed',sans-serif",
                color: '#666', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: 36,
              }}>
                Currently pursuing my degree at{' '}
                <strong style={{ color: '#bbb', fontWeight: 700 }}>MIT Art Design and Technology University</strong>,
                graduating in <strong style={{ color: '#bbb', fontWeight: 700 }}>2027</strong>.
                Every detail matters — every millisecond counts.
              </p>

              {/* Stack chips */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 22 }}>
                <p style={{
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: '0.52rem', letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: '#444', marginBottom: 14,
                }}>
                  Tech Stack
                </p>
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
                  {chips.map((chip) => (
                    <li key={chip}>
                      <span className="ab-chip">{chip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tech spec panel */}
            <div
              className="ab-d6"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Panel header */}
              <div style={{
                padding: '11px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.025)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#E8002D', flexShrink: 0,
                  animation: 'blink 1.4s ease-in-out infinite',
                }} />
                <p style={{
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: '0.52rem', letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: '#555', margin: 0,
                }}>
                  Skills Breakdown
                </p>
                {/* Right-side decorative dashes */}
                <span style={{
                  marginLeft: 'auto',
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: '0.45rem', color: '#2a2a2a', letterSpacing: '0.1em',
                }}>
                  ─ ─ ─ ─
                </span>
              </div>

              {/* Rows */}
              <dl style={{ margin: 0, padding: '4px 0' }}>
                {techSpecs.map((row, i) => (
                  <div
                    key={row.k}
                    className="ab-spec-row"
                    style={{
                      borderBottom: i !== techSpecs.length - 1
                        ? '1px solid rgba(255,255,255,0.05)'
                        : 'none',
                    }}
                  >
                    <dt
                      className="ab-spec-key"
                      style={{
                        fontFamily: "'Share Tech Mono',monospace",
                        fontSize: '0.52rem', letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: '#3e3e3e',
                        width: 72, flexShrink: 0, paddingTop: 2,
                        transition: 'color .2s',
                      }}
                    >
                      {row.k}
                    </dt>
                    <dd style={{
                      fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 400,
                      fontSize: '0.95rem', color: '#777',
                      lineHeight: 1.5, margin: 0, letterSpacing: '0.02em',
                    }}>
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Bottom red accent */}
              <div style={{
                height: 2,
                background: 'linear-gradient(to right, #E8002D, rgba(232,0,45,0.15), transparent)',
                opacity: 0.5,
              }} />

              {/* Corner accent */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 0, height: 0,
                borderStyle: 'solid',
                borderWidth: '0 14px 14px 0',
                borderColor: `transparent #E8002D transparent transparent`,
                opacity: 0.4,
              }} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}