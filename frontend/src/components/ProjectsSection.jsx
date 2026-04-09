import { ArrowUpRight } from 'lucide-react'
import { SectionStyles, SectionBg, SectionHeader, useMouseParallax, useReveal } from './SectionShared'
import { useRef, useEffect, useState, useCallback } from 'react'

const Github = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

function ProjectLinks({ github, live, style }) {
  if (!github && !live) return null
  return (
    <div className="proj-links" style={style}>
      {github && (
        <a href={github} target="_blank" rel="noreferrer" className="proj-link proj-link-gh" aria-label="GitHub repository">
          <Github size={12} /> <span>Repo</span>
        </a>
      )}
      {live && (
        <a href={live} target="_blank" rel="noreferrer" className="proj-link proj-link-live" aria-label="Live demo">
          <span>Live</span> <ArrowUpRight size={12} />
        </a>
      )}
    </div>
  )
}

/* ── Magnetic tilt card hook ────────────────────────────────── */
function useTilt(strength = 12) {
  const ref = useRef(null)
  const frameRef = useRef(null)
  const handleMove = useCallback((e) => {
    if (!ref.current) return
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      ref.current.style.transform = `perspective(900px) rotateY(${dx * strength}deg) rotateX(${-dy * strength * 0.6}deg) translateY(-4px)`
    })
  }, [strength])
  const handleLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px)'
  }, [])
  return { ref, handleMove, handleLeave }
}

/* ── Glitch number component ────────────────────────────────── */
function GlitchNum({ children }) {
  return (
    <div className="proj-num-wrap" aria-hidden="true">
      <span className="proj-num" data-text={children}>{children}</span>
    </div>
  )
}

/* ── Animated tag ────────────────────────────────────────────── */
function AnimTag({ children, delay = 0 }) {
  return (
    <span className="proj-tag" style={{ animationDelay: `${delay}ms` }}>{children}</span>
  )
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
      className={glitching ? 'proj-glitch-active' : ''}
      style={{ position: 'relative', display: 'inline-block' }}
      data-text={typeof children === 'string' ? children : ''}
    >
      {children}
    </span>
  )
}

/* ── Regular card ────────────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const { ref, handleMove, handleLeave } = useTilt(8)
  const [cardVisible, setCardVisible] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCardVisible(true) },
      { threshold: 0.15 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={(el) => { ref.current = el; cardRef.current = el }}
      className={`proj-card${cardVisible ? ' proj-card--visible' : ''}`}
      style={{ '--card-delay': `${index * 80}ms` }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Animated border beam */}
      <div className="proj-beam" />
      <div className="proj-scan" />
      <div className="proj-corner" />
      <div className="proj-noise" />

      <GlitchNum>{project.num}</GlitchNum>
      <h3 className="proj-title">{project.title}</h3>
      <p className="proj-desc">{project.desc}</p>

      <div className="proj-tags">
        {project.tags.map((tag, i) => (
          <AnimTag key={tag} delay={i * 40}>{tag}</AnimTag>
        ))}
      </div>

      <ProjectLinks github={project.github} live={project.live} style={{ marginTop: 'auto' }} />
    </div>
  )
}

export default function ProjectsSection({ projects }) {
  const [sectionRef, visible] = useReveal()
  const mousePos = useMouseParallax()
  const { ref: featRef, handleMove: featMove, handleLeave: featLeave } = useTilt(4)

  const featured = projects.find((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`port-section${visible ? ' sec-visible' : ''}`}
      aria-label="Selected projects"
    >
      <SectionStyles />
      <style>{`
        /* ── Keyframes ──────────────────────────────────────────── */
        @keyframes proj-glitch-clip-1 { 0%,100%{clip-path:inset(30% 0 50% 0)} 25%{clip-path:inset(10% 0 60% 0)} 50%{clip-path:inset(50% 0 20% 0)} 75%{clip-path:inset(5% 0 80% 0)} }
        @keyframes proj-glitch-clip-2 { 0%,100%{clip-path:inset(60% 0 10% 0)} 25%{clip-path:inset(80% 0 5% 0)} 50%{clip-path:inset(20% 0 60% 0)} 75%{clip-path:inset(40% 0 30% 0)} }
        @keyframes proj-glitch-x-1    { 0%,100%{transform:translateX(0)} 33%{transform:translateX(-3px)} 66%{transform:translateX(3px)} }
        @keyframes proj-glitch-x-2    { 0%,100%{transform:translateX(0)} 33%{transform:translateX(3px)} 66%{transform:translateX(-3px)} }

        .proj-glitch-active::before,
        .proj-glitch-active::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
        }
        .proj-glitch-active::before {
          color: var(--red);
          opacity: 0.7;
          animation: proj-glitch-clip-1 .15s steps(1) both, proj-glitch-x-1 .15s steps(1) both;
        }
        .proj-glitch-active::after {
          color: rgba(56,189,248,0.9);
          opacity: 0.5;
          animation: proj-glitch-clip-2 .15s steps(1) both, proj-glitch-x-2 .15s steps(1) both;
        }

        @keyframes glitch-clip-1 {
          0%,100% { clip-path: inset(0 0 95% 0); transform: translate(-2px, 0); }
          25%      { clip-path: inset(20% 0 70% 0); transform: translate(2px, 0); }
          50%      { clip-path: inset(60% 0 20% 0); transform: translate(-1px, 0); }
          75%      { clip-path: inset(80% 0 5% 0);  transform: translate(1px, 0); }
        }
        @keyframes glitch-clip-2 {
          0%,100% { clip-path: inset(80% 0 0 0);   transform: translate(2px, 0) skewX(2deg); }
          33%      { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 0) skewX(-1deg); }
          66%      { clip-path: inset(5% 0 80% 0);  transform: translate(1px, 0); }
        }
        @keyframes scan-sweep {
          0%   { top: -1px; opacity: 0; }
          5%   { opacity: 0.8; }
          95%  { opacity: 0.5; }
          100% { top: calc(100% + 1px); opacity: 0; }
        }
        @keyframes beam-rotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes card-in {
          0%   { opacity: 0; transform: perspective(900px) translateY(28px) rotateX(8deg); }
          100% { opacity: 1; transform: perspective(900px) translateY(0) rotateX(0deg); }
        }
        @keyframes featured-in {
          0%   { opacity: 0; transform: perspective(1200px) translateY(40px) rotateX(6deg); }
          100% { opacity: 1; transform: perspective(1200px) translateY(0) rotateX(0deg); }
        }
        @keyframes tag-pop {
          0%   { opacity: 0; transform: scale(0.75) skewX(-4deg); }
          70%  { transform: scale(1.06) skewX(0deg); }
          100% { opacity: 1; transform: scale(1) skewX(0deg); }
        }
        @keyframes num-flicker {
          0%,95%,100% { opacity: 1; }
          96%          { opacity: 0.6; }
          97%          { opacity: 1; }
          98%          { opacity: 0.75; }
        }
        @keyframes shimmer-slide {
          0%   { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }
        @keyframes noise-shift {
          0%,100% { background-position: 0 0; }
          10%      { background-position: -5% -10%; }
          30%      { background-position: 3% 5%; }
          50%      { background-position: -4% 7%; }
          70%      { background-position: 6% -3%; }
          90%      { background-position: -2% 9%; }
        }
        @keyframes border-pulse {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }
        @keyframes stat-in {
          0%   { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes badge-breathe {
          0%,100% { box-shadow: 0 0 0 0 rgba(232,0,45,0); }
          50%      { box-shadow: 0 0 14px 2px rgba(232,0,45,0.25); }
        }
        @keyframes counter-up {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* ── Glitch Number ──────────────────────────────────────── */
        .proj-num-wrap { position: relative; width: fit-content; }
        .proj-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: 5rem;
          line-height: 1;
          color: rgba(232,0,45,0.35);
          letter-spacing: -0.02em;
          user-select: none;
          display: block;
          position: relative;
          animation: num-flicker 6s infinite;
          animation-delay: var(--card-delay, 0ms);
          transition: color 0.3s;
        }
        .proj-num::before,
        .proj-num::after {
          content: attr(data-text);
          position: absolute;
          left: 0; top: 0;
          font-family: inherit;
          font-weight: inherit;
          font-style: inherit;
          font-size: inherit;
          line-height: inherit;
          letter-spacing: inherit;
          opacity: 0;
          pointer-events: none;
        }
        .proj-num::before { color: rgba(0,200,255,0.5); }
        .proj-num::after  { color: rgba(232,0,45,0.5); }

        .proj-card:hover .proj-num,
        .proj-featured:hover .proj-num { color: rgba(232,0,45,0.65); }
        .proj-card:hover .proj-num::before {
          animation: glitch-clip-1 0.4s steps(1) infinite;
          opacity: 1;
        }
        .proj-card:hover .proj-num::after {
          animation: glitch-clip-2 0.35s steps(1) infinite 0.05s;
          opacity: 1;
        }
        .proj-featured:hover .proj-num::before {
          animation: glitch-clip-1 0.5s steps(1) infinite;
          opacity: 1;
        }
        .proj-featured:hover .proj-num::after {
          animation: glitch-clip-2 0.45s steps(1) infinite 0.07s;
          opacity: 1;
        }

        /* ── Noise overlay ──────────────────────────────────────── */
        .proj-noise {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          mix-blend-mode: overlay;
          transition: opacity 0.3s;
        }
        .proj-card:hover .proj-noise,
        .proj-featured:hover .proj-noise {
          opacity: 1;
          animation: noise-shift 0.5s steps(1) infinite;
        }

        /* ── Border beam ────────────────────────────────────────── */
        .proj-beam {
          position: absolute;
          inset: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(232,0,45,0.5) 60deg, transparent 120deg);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
          border-radius: 50%;
        }
        .proj-card:hover .proj-beam {
          opacity: 1;
          animation: beam-rotate 3s linear infinite;
        }
        /* Mask beam to border only */
        .proj-card { overflow: hidden; }

        /* ── Featured Card ──────────────────────────────────────── */
        .proj-featured {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid var(--rule);
          background: var(--carbon);
          position: relative;
          overflow: hidden;
          margin-bottom: 2px;
          transition: border-color 0.35s, box-shadow 0.35s;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .proj-featured::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(232,0,45,0.08) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
          z-index: 1;
        }
        .proj-featured:hover {
          border-color: var(--red);
          box-shadow: 0 0 0 1px rgba(232,0,45,0.15), 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .proj-featured:hover::before { opacity: 1; }

        /* Shimmer on hover */
        .proj-featured::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          transform: translateX(-100%) skewX(-12deg);
          pointer-events: none;
          z-index: 2;
        }
        .proj-featured:hover::after {
          animation: shimmer-slide 0.7s ease forwards;
        }

        .proj-featured-left {
          padding: 40px;
          border-right: 1px solid var(--rule);
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          z-index: 3;
          transition: border-color 0.35s;
        }
        .proj-featured:hover .proj-featured-left { border-color: rgba(232,0,45,0.25); }

        .proj-featured-right {
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          z-index: 3;
        }

        /* ── Animated section reveal for featured ───────────────── */
        .sec-visible .proj-featured {
          animation: featured-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: 0.15s;
        }

        /* ── Title ──────────────────────────────────────────────── */
        .proj-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: 2.2rem;
          text-transform: uppercase;
          color: #fff;
          line-height: 1.05;
          letter-spacing: 0.01em;
          margin: 0;
          transition: color 0.25s, letter-spacing 0.3s;
        }
        .proj-featured:hover .proj-title,
        .proj-card:hover .proj-title {
          color: var(--red);
          letter-spacing: 0.04em;
        }

        /* ── Description ────────────────────────────────────────── */
        .proj-desc {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.75;
          color: var(--silver2);
          margin: 0;
          max-width: 480px;
          transition: color 0.25s;
        }
        .proj-featured:hover .proj-desc,
        .proj-card:hover .proj-desc { color: rgba(200,200,210,0.9); }

        /* ── Tag Pills ──────────────────────────────────────────── */
        .proj-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .proj-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.56rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--silver3);
          border: 1px solid var(--silver3);
          padding: 3px 10px;
          clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
          transition: border-color 0.25s, color 0.25s, background 0.25s, transform 0.2s;
          animation: tag-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
          animation-play-state: paused;
        }
        .sec-visible .proj-tag { animation-play-state: running; }
        .proj-featured:hover .proj-tag,
        .proj-card:hover .proj-tag {
          border-color: rgba(232,0,45,0.5);
          color: var(--silver2);
          background: rgba(232,0,45,0.05);
        }
        .proj-tag:hover {
          transform: translateY(-1px) scale(1.04);
          border-color: var(--red) !important;
          color: #fff !important;
        }

        /* ── Featured badge ─────────────────────────────────────── */
        .proj-badge-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .proj-featured-badge {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--red);
          padding: 5px 14px;
          border: 1px solid rgba(232,0,45,0.4);
          clip-path: polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%);
          animation: badge-breathe 2.5s ease-in-out infinite;
          transition: background 0.25s;
        }
        .proj-featured:hover .proj-featured-badge {
          background: rgba(232,0,45,0.1);
        }

        /* ── Right panel meta ───────────────────────────────────── */
        .proj-meta-block {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .proj-meta-row {
          position: relative;
          overflow: hidden;
        }
        .proj-meta-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--silver3);
          margin-bottom: 6px;
          transition: color 0.25s;
        }
        .proj-featured:hover .proj-meta-label { color: rgba(232,0,45,0.6); }
        .proj-meta-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-style: italic;
          font-size: 1rem;
          text-transform: uppercase;
          color: var(--silver2);
          letter-spacing: 0.04em;
          transition: color 0.25s, letter-spacing 0.3s;
        }
        .proj-featured:hover .proj-meta-value {
          color: #fff;
          letter-spacing: 0.08em;
        }
        /* Reveal underline on hover */
        .proj-meta-row::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0;
          height: 1px;
          background: rgba(232,0,45,0.4);
          transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .proj-featured:hover .proj-meta-row::after { width: 100%; }

        /* ── Stat pills ─────────────────────────────────────────── */
        .proj-stats { display: flex; flex-wrap: wrap; gap: 8px; }
        .proj-stat {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.56rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          background: rgba(232,0,45,0.08);
          border: 1px solid rgba(232,0,45,0.2);
          color: rgba(232,0,45,0.75);
          clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
          animation: stat-in 0.4s cubic-bezier(0.22,1,0.36,1) both;
          animation-play-state: paused;
          transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.2s;
        }
        .sec-visible .proj-stat { animation-play-state: running; }
        .proj-stat:nth-child(1) { animation-delay: 0.4s; }
        .proj-stat:nth-child(2) { animation-delay: 0.5s; }
        .proj-stat:nth-child(3) { animation-delay: 0.6s; }
        .proj-featured:hover .proj-stat {
          background: rgba(232,0,45,0.14);
          border-color: rgba(232,0,45,0.45);
          color: rgba(232,0,45,1);
          transform: translateX(2px);
        }

        /* ── CTA Links ──────────────────────────────────────────── */
        .proj-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        .proj-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 8px 18px;
          clip-path: polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%);
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }
        .proj-link::before {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .proj-link:hover::before { transform: translateX(0); }
        .proj-link svg { transition: transform 0.25s; flex-shrink: 0; position: relative; z-index: 1; }
        .proj-link span { position: relative; z-index: 1; }

        .proj-link-gh {
          color: var(--silver3);
          border: 1px solid var(--silver3);
          background: transparent;
        }
        .proj-link-gh::before { background: rgba(255,255,255,0.07); }
        .proj-link-gh:hover { border-color: #fff; color: #fff; }
        .proj-link-gh:hover svg { transform: scale(1.2) rotate(-5deg); }

        .proj-link-live {
          color: #fff;
          border: 1px solid var(--red);
          background: rgba(232,0,45,0.12);
        }
        .proj-link-live::before { background: var(--red); }
        .proj-link-live:hover { color: #fff; }
        .proj-link-live:hover svg { transform: translate(3px, -3px); }

        /* ── Corner accent ──────────────────────────────────────── */
        .proj-corner {
          position: absolute;
          top: 0; right: 0;
          width: 60px; height: 60px;
          overflow: hidden;
          pointer-events: none;
          z-index: 4;
        }
        .proj-corner::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 0; height: 0;
          border-style: solid;
          border-width: 0 60px 60px 0;
          border-color: transparent rgba(232,0,45,0.15) transparent transparent;
          transition: border-color 0.25s, border-width 0.3s;
        }
        .proj-featured:hover .proj-corner::before,
        .proj-card:hover .proj-corner::before {
          border-color: transparent rgba(232,0,45,0.5) transparent transparent;
          border-width: 0 72px 72px 0;
        }

        /* ── Scan line ──────────────────────────────────────────── */
        .proj-scan {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(232,0,45,0.6) 30%, rgba(232,0,45,0.9) 50%, rgba(232,0,45,0.6) 70%, transparent 100%);
          top: -1px;
          opacity: 0;
          pointer-events: none;
          z-index: 5;
        }
        .proj-featured:hover .proj-scan,
        .proj-card:hover .proj-scan {
          animation: scan-sweep 1.8s ease-in-out infinite;
        }

        /* ── Regular Card Grid ──────────────────────────────────── */
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2px;
        }

        .proj-card {
          background: var(--carbon);
          border: 1px solid var(--rule);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          transform-style: preserve-3d;
          will-change: transform;
          opacity: 0;
          /* base transform handled by JS tilt */
        }
        .proj-card--visible {
          animation: card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: var(--card-delay, 0ms);
        }
        .proj-card:hover {
          border-color: var(--red);
          background: rgba(232,0,45,0.02);
          box-shadow: 0 0 0 1px rgba(232,0,45,0.1), 0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03);
        }

        /* Thin red bar on left edge on hover */
        .proj-card::after {
          content: '';
          position: absolute;
          left: 0; top: 10%; bottom: 10%;
          width: 0;
          background: var(--red);
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
          z-index: 6;
        }
        .proj-card:hover::after { width: 2px; }

        /* ── Footer bar ─────────────────────────────────────────── */
        .proj-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid var(--rule);
          animation: counter-up 0.5s ease both;
          animation-play-state: paused;
          transition: border-color 0.4s;
        }
        .sec-visible .proj-footer {
          animation-play-state: running;
          animation-delay: 0.8s;
        }
        .proj-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--silver3);
          transition: color 0.25s;
        }
        .proj-count:hover { color: var(--silver2); }
        .proj-count span {
          color: var(--red);
          transition: text-shadow 0.3s;
        }
        .proj-count:hover span { text-shadow: 0 0 12px rgba(232,0,45,0.6); }
        .proj-sector-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--silver3);
          position: relative;
        }
        .proj-sector-tag::before {
          content: '';
          display: inline-block;
          width: 4px; height: 4px;
          background: var(--red);
          margin-right: 8px;
          vertical-align: middle;
          animation: border-pulse 2s ease-in-out infinite;
        }

        /* ── Responsive ─────────────────────────────────────────── */
        @media (max-width: 900px) {
          .proj-featured { grid-template-columns: 1fr; }
          .proj-featured-left {
            border-right: none;
            border-bottom: 1px solid var(--rule);
            padding: 28px;
          }
          .proj-featured-right { padding: 28px; }
          .proj-title { font-size: 1.75rem; }
        }
        @media (max-width: 640px) {
          .proj-card { padding: 24px 20px; }
          .proj-grid { grid-template-columns: 1fr; }
        }

        /* Match contact heading underline gap */
        .proj-header-fix .sec-bar {
          bottom: -4px !important;
        }

        .proj-header-fix h2 > span {
          line-height: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.1ms !important; }
        }
      `}</style>

      <SectionBg mousePos={mousePos} ghostNum="05" redGlowPos="top-right" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1080 }}>
        <div className="proj-header-fix">
          <SectionHeader
            sectorLabel="Sector 05 - Fastest Laps"
            title={[<GlitchWord key="selected">Selected</GlitchWord>, 'Projects', '']}
            subtitle="Precision-engineered builds — each one a lap record in its own right."
          />
        </div>

        {/* ─────────────────────────────────── Featured Project ─────────────────────────────────── */}
        {featured && (
          <div
            className="sec-d3 proj-featured"
            ref={featRef}
            onMouseMove={featMove}
            onMouseLeave={featLeave}
          >
            <div className="proj-scan" />
            <div className="proj-corner" />
            <div className="proj-noise" />

            {/* Left */}
            <div className="proj-featured-left">
              <GlitchNum>{featured.num}</GlitchNum>
              <h3 className="proj-title">{featured.title}</h3>
              <p className="proj-desc">{featured.desc}</p>

              {featured.stats && (
                <div className="proj-stats">
                  {featured.stats.map((s) => (
                    <span key={s} className="proj-stat">{s}</span>
                  ))}
                </div>
              )}

              <div className="proj-tags">
                {featured.tags.map((tag, i) => (
                  <AnimTag key={tag} delay={i * 50}>{tag}</AnimTag>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="proj-featured-right">
              <div className="proj-meta-block">
                {featured.year && (
                  <div className="proj-meta-row">
                    <div className="proj-meta-label">Year</div>
                    <div className="proj-meta-value">{featured.year}</div>
                  </div>
                )}
                {featured.type && (
                  <div className="proj-meta-row">
                    <div className="proj-meta-label">Type</div>
                    <div className="proj-meta-value">{featured.type}</div>
                  </div>
                )}
                {featured.role && (
                  <div className="proj-meta-row">
                    <div className="proj-meta-label">Role</div>
                    <div className="proj-meta-value">{featured.role}</div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
                <div className="proj-badge-row">
                  <span className="proj-featured-badge">▲ Featured</span>
                </div>
                <ProjectLinks github={featured.github} live={featured.live} />
              </div>
            </div>
          </div>
        )}

        {/* ── Rest of Projects ─────────────────────────────────── */}
        <div className="sec-d4 proj-grid">
          {rest.map((project, i) => (
            <ProjectCard key={project.num} project={project} index={i} />
          ))}
        </div>

        {/* ── Footer bar ───────────────────────────────────────── */}
        <div className="sec-d5 proj-footer">
          <span className="proj-count">
            <span>{projects.length}</span> total projects
          </span>
          <span className="proj-sector-tag">Sector 03 / End</span>
        </div>
      </div>
    </section>
  )
}