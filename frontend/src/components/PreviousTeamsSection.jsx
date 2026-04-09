import { SectionStyles, SectionBg, SectionHeader, useMouseParallax, useReveal } from './SectionShared'
import { useEffect, useRef, useState } from 'react'

const jobs = [
  {
    company: 'Careasa Healthcare Pvt. Ltd.',
    role: 'Web Development Team Lead',
    period: 'December 2024 - October 2025',
    link: 'https://careasa.com',
    desc: 'Led a cross-functional software team to design, develop, and deploy a responsive web application, managing the full software development lifecycle from planning to deployment.',
    highlights: ['+90% feature stability', '+80% performance', '5 engineers mentored'],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind', 'Sequelize'],
  },
  {
    company: 'Microsoft Learn Student Club (MLSC)',
    role: 'Technical Team Lead',
    period: 'April 2025 - February 2026',
    link: 'https://linkedin.com/company/mlscmitadtu/posts/?feedView=all',
    desc: 'Guided a team of student developers in collaborative technical projects, fostering a shared learning environment focused on practical skill-building.',
    highlights: ['10 aspiring developers', 'lectures conducted', 'shared learning'],
    tech: ['Node.js', 'Express', 'PostgreSQL', 'React', 'Docker'],
  },
  {
    company: 'Association of Computer Engineering Students (ACES)',
    role: 'Technical Team Member',
    period: 'July 2024 - March 2025',
    link: 'https://acesmitadt.com/',
    desc: 'Built custom and as required solutions for the organization website from scratch, contributing to both frontend and backend development while collaborating with a small team.',
    highlights: ['end-to-end development', 'scalable solutions', 'spread knowledge'],
    tech: ['React', 'Node.js', 'MongoDB', 'OAuth'],
  },
]

function useIntersectionReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
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
      className={glitching ? 'tl-glitch-active' : ''}
      style={{ position: 'relative', display: 'inline-block' }}
      data-text={typeof children === 'string' ? children : ''}
    >
      {children}
    </span>
  )
}

export default function PreviousTeamsSection() {
  const [sectionRef, visible] = useReveal()
  const mousePos = useMouseParallax()
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [itemRefs] = useState(() => jobs.map(() => ({ ref: null, visible: false })))
  const [itemVisibility, setItemVisibility] = useState(jobs.map(() => false))

  useEffect(() => {
    const observers = []
    document.querySelectorAll('.tl-item').forEach((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setItemVisibility(prev => {
                const next = [...prev]
                next[i] = true
                return next
              })
            }, i * 120)
            obs.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <section id="work" ref={sectionRef} className={`port-section${visible ? ' sec-visible' : ''}`} aria-label="Work experience">
      <SectionStyles />
      <style>{`
        @keyframes tl-glitch-clip-1 { 0%,100%{clip-path:inset(30% 0 50% 0)} 25%{clip-path:inset(10% 0 60% 0)} 50%{clip-path:inset(50% 0 20% 0)} 75%{clip-path:inset(5% 0 80% 0)} }
        @keyframes tl-glitch-clip-2 { 0%,100%{clip-path:inset(60% 0 10% 0)} 25%{clip-path:inset(80% 0 5% 0)} 50%{clip-path:inset(20% 0 60% 0)} 75%{clip-path:inset(40% 0 30% 0)} }
        @keyframes tl-glitch-x-1    { 0%,100%{transform:translateX(0)} 33%{transform:translateX(-3px)} 66%{transform:translateX(3px)} }
        @keyframes tl-glitch-x-2    { 0%,100%{transform:translateX(0)} 33%{transform:translateX(3px)} 66%{transform:translateX(-3px)} }

        .tl-glitch-active::before,
        .tl-glitch-active::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
        }
        .tl-glitch-active::before {
          color: var(--red);
          opacity: 0.7;
          animation: tl-glitch-clip-1 .15s steps(1) both, tl-glitch-x-1 .15s steps(1) both;
        }
        .tl-glitch-active::after {
          color: rgba(56,189,248,0.9);
          opacity: 0.5;
          animation: tl-glitch-clip-2 .15s steps(1) both, tl-glitch-x-2 .15s steps(1) both;
        }

        /* ── Timeline Shell ── */
        .tl-wrapper {
          position: relative;
          padding-left: 52px;
        }
        .tl-wrapper::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            var(--red) 8%,
            var(--red) 85%,
            transparent 100%
          );
        }

        /* ── Timeline Item ── */
        .tl-item {
          position: relative;
          margin-bottom: 0;
          padding: 0 0 64px 0;
          opacity: 0;
          transform: translateX(-24px);
          transition:
            opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tl-item.tl-item--visible {
          opacity: 1;
          transform: translateX(0);
        }
        .tl-item:last-child { padding-bottom: 0; }

        /* ── Card ── */
        .tl-card {
          position: relative;
          display: block;
          color: inherit;
          text-decoration: none;
          cursor: pointer;
          padding: 28px 32px;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.015);
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          transition:
            border-color 0.35s ease,
            background 0.35s ease,
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s ease;
          overflow: hidden;
        }
        .tl-card:hover {
          border-color: rgba(232,0,45,0.35);
          background: rgba(232,0,45,0.04);
          transform: translateX(8px);
          box-shadow:
            -4px 0 24px rgba(232,0,45,0.12),
            0 8px 32px rgba(0,0,0,0.3);
        }

        /* Scan-line sweep on hover */
        .tl-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(232,0,45,0.06) 50%,
            transparent 70%
          );
          transform: translateX(-100%);
          transition: transform 0.55s ease;
          pointer-events: none;
        }
        .tl-card:hover::before {
          transform: translateX(100%);
        }

        /* Bottom accent bar */
        .tl-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--red), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tl-card:hover::after {
          transform: scaleX(1);
        }

        /* ── Timeline Node ── */
        .tl-node {
          position: absolute;
          left: -61px; top: 34px;
          width: 20px; height: 20px;
          border: 2px solid var(--red);
          background: var(--ink);
          display: flex; align-items: center; justify-content: center;
          clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
          transition:
            background 0.3s ease,
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.3s ease;
          z-index: 2;
        }
        .tl-item:hover .tl-node {
          background: var(--red);
          transform: scale(1.35) rotate(45deg);
          box-shadow: 0 0 12px rgba(232,0,45,0.6);
        }
        .tl-node-inner {
          width: 6px; height: 6px;
          background: var(--red);
          clip-path: polygon(2px 0%, 100% 0%, calc(100% - 2px) 100%, 0% 100%);
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .tl-item:hover .tl-node-inner {
          background: #fff;
          transform: rotate(-45deg);
        }

        /* Pulse ring */
        .tl-node-pulse {
          position: absolute;
          left: -67px; top: 28px;
          width: 32px; height: 32px;
          border: 1px solid rgba(232,0,45,0.4);
          clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 0.3s, transform 0.3s;
        }
        .tl-item:hover .tl-node-pulse {
          opacity: 1;
          transform: scale(1);
          animation: tl-pulse 1.4s ease infinite;
        }
        @keyframes tl-pulse {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.7); }
        }

        /* Connector tick */
        .tl-tick {
          position: absolute;
          left: -52px; top: 43px;
          width: 52px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(232,0,45,0.5));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1) 0.05s;
        }
        .tl-item:hover .tl-tick {
          transform: scaleX(1);
        }

        /* ── Card Header ── */
        .tl-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 10px;
        }
        .tl-company {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900; font-style: italic;
          font-size: 1.85rem; text-transform: uppercase;
          color: #fff; line-height: 1;
          margin-bottom: 6px;
          transition: color 0.25s ease, letter-spacing 0.3s ease;
        }
        .tl-card:hover .tl-company {
          color: var(--red);
          letter-spacing: 0.02em;
        }
        .tl-role {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem; letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--red);
          opacity: 0.85;
          transition: opacity 0.25s;
        }
        .tl-card:hover .tl-role { opacity: 1; }

        /* Period badge */
        .tl-badge {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.56rem; letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 6px 16px;
          border: 1px solid rgba(255,255,255,0.12);
          color: var(--silver3);
          white-space: nowrap; flex-shrink: 0;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
          align-self: flex-start; margin-top: 4px;
          transition:
            border-color 0.3s ease,
            color 0.3s ease,
            background 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .tl-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(232,0,45,0.1);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .tl-card:hover .tl-badge {
          border-color: rgba(232,0,45,0.5);
          color: rgba(232,0,45,0.9);
        }
        .tl-card:hover .tl-badge::before {
          transform: scaleX(1);
        }

        /* ── Description ── */
        .tl-desc {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.02rem;
          font-weight: 400; line-height: 1.75;
          color: var(--silver2);
          max-width: 600px;
          margin-bottom: 18px; margin-top: 12px;
          transition: color 0.3s ease;
        }
        .tl-card:hover .tl-desc { color: rgba(255,255,255,0.7); }

        /* ── Highlight Pills ── */
        .tl-pills {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-bottom: 16px;
        }
        .tl-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.56rem; letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          background: rgba(232,0,45,0.06);
          border: 1px solid rgba(232,0,45,0.18);
          color: rgba(232,0,45,0.65);
          clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
          transition:
            background 0.3s ease,
            border-color 0.3s ease,
            color 0.3s ease,
            transform 0.25s ease;
        }
        .tl-card:hover .tl-pill {
          background: rgba(232,0,45,0.12);
          border-color: rgba(232,0,45,0.35);
          color: rgba(232,0,45,0.9);
        }
        .tl-pill:nth-child(1) { transition-delay: 0.00s; }
        .tl-pill:nth-child(2) { transition-delay: 0.04s; }
        .tl-pill:nth-child(3) { transition-delay: 0.08s; }
        .tl-card:hover .tl-pill:hover { transform: translateY(-2px); }

        /* ── Tech Tags ── */
        .tl-tags {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .tl-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--silver3);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 3px 10px;
          clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
          transition:
            border-color 0.25s ease,
            color 0.25s ease,
            background 0.25s ease,
            transform 0.25s ease;
        }
        .tl-card:hover .tl-tag {
          border-color: rgba(232,0,45,0.22);
          color: var(--silver2);
          background: rgba(232,0,45,0.04);
        }
        .tl-tag:nth-child(1) { transition-delay: 0.00s; }
        .tl-tag:nth-child(2) { transition-delay: 0.03s; }
        .tl-tag:nth-child(3) { transition-delay: 0.06s; }
        .tl-tag:nth-child(4) { transition-delay: 0.09s; }
        .tl-tag:nth-child(5) { transition-delay: 0.12s; }
        .tl-card:hover .tl-tag:hover { transform: translateY(-2px); }

        /* ── Separator ── */
        .tl-sep {
          position: absolute;
          left: 0; right: 0; bottom: 32px;
          height: 1px;
          background: linear-gradient(90deg, var(--rule2) 0%, transparent 60%);
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .tl-item:last-child .tl-sep { display: none; }
        .tl-item:hover .tl-sep { opacity: 0; }

        /* ── External link indicator ── */
        .tl-link-hint {
          position: absolute;
          top: 24px; right: 24px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(232,0,45,0);
          display: flex; align-items: center; gap: 5px;
          transition: color 0.3s ease, transform 0.3s ease;
          pointer-events: none;
        }
        .tl-link-hint::before {
          content: '↗';
          font-size: 0.65rem;
          display: inline-block;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tl-card:hover .tl-link-hint {
          color: rgba(232,0,45,0.6);
        }
        .tl-card:hover .tl-link-hint::before {
          transform: translate(2px, -2px);
        }

        /* ── Red glow stripe on left edge ── */
        .tl-edge-glow {
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 2px;
          background: var(--red);
          opacity: 0;
          filter: blur(3px);
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .tl-card:hover .tl-edge-glow {
          opacity: 0.7;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .tl-wrapper { padding-left: 36px; }
          .tl-node { left: -45px; }
          .tl-node-pulse { left: -51px; }
          .tl-tick { left: -36px; width: 36px; }
          .tl-header { flex-direction: column; gap: 8px; }
          .tl-card { padding: 20px 20px; }
          .tl-card:hover { transform: translateX(4px); }
        }

        /* Match contact heading underline gap */
        .tl-header-fix .sec-bar {
          bottom: -4px !important;
        }

        .tl-header-fix h2 > span {
          line-height: 1;
        }
      `}</style>

      <SectionBg mousePos={mousePos} ghostNum="03" redGlowPos="top-right" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1080 }}>
        <div className="tl-header-fix">
          <SectionHeader
            sectorLabel="Sector 03 - Race History"
            title={[<GlitchWord key="previous">Previous</GlitchWord>, 'Teams', '']}
            subtitle="Roles where speed, craft, and ownership were non-negotiable."
          />
        </div>

        <div className="sec-d3 tl-wrapper">
          {jobs.map((job, i) => (
            <div
              key={`${job.company}-${job.period}`}
              className={`tl-item${itemVisibility[i] ? ' tl-item--visible' : ''}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              {/* Timeline node */}
              <div className="tl-node"><div className="tl-node-inner" /></div>
              <div className="tl-node-pulse" />
              <div className="tl-tick" />

              <a
                href={job.link}
                target="_blank"
                rel="noreferrer"
                className="tl-card"
                aria-label={`Open ${job.company}`}
              >
                <div className="tl-edge-glow" />
                <div className="tl-link-hint">visit</div>

                <div className="tl-header">
                  <div>
                    <div className="tl-company">{job.company}</div>
                    <div className="tl-role">{job.role}</div>
                  </div>
                  <div className="tl-badge">{job.period}</div>
                </div>

                <p className="tl-desc">{job.desc}</p>

                <div className="tl-pills">
                  {job.highlights.map((highlight) => (
                    <span key={`${job.company}-${highlight}`} className="tl-pill">{highlight}</span>
                  ))}
                </div>

                <div className="tl-tags">
                  {job.tech.map((tech) => (
                    <span key={`${job.company}-${tech}`} className="tl-tag">{tech}</span>
                  ))}
                </div>
              </a>

              <div className="tl-sep" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}