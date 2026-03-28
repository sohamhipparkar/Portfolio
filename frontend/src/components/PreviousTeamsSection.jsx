import { SectionStyles, SectionBg, SectionHeader, useMouseParallax, useReveal } from './SectionShared'

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

export default function PreviousTeamsSection() {
  const [sectionRef, visible] = useReveal()
  const mousePos = useMouseParallax()

  return (
    <section id="work" ref={sectionRef} className={`port-section${visible ? ' sec-visible' : ''}`} aria-label="Work experience">
      <SectionStyles />
      <style>{`
        .tl-wrapper { position: relative; padding-left: 48px; }
        .tl-wrapper::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(to bottom, var(--red), var(--red-dim) 70%, transparent);
        }

        .tl-item { position: relative; margin-bottom: 0; padding: 0 0 56px 0; }
        .tl-item:last-child { padding-bottom: 0; }

        .tl-link {
          display: block;
          color: inherit;
          text-decoration: none;
          cursor: pointer;
        }

        .tl-node {
          position: absolute; left: -57px; top: 6px; width: 18px; height: 18px;
          border: 2px solid var(--red); background: var(--ink);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.2s;
          clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
        }
        .tl-item:hover .tl-node { background: var(--red); transform: scale(1.2); }

        .tl-node-inner {
          width: 6px; height: 6px; background: var(--red);
          clip-path: polygon(2px 0%, 100% 0%, calc(100% - 2px) 100%, 0% 100%);
          transition: background 0.2s;
        }
        .tl-item:hover .tl-node-inner { background: #fff; }

        .tl-tick {
          position: absolute; left: -48px; top: 14px; width: 48px; height: 1px;
          background: linear-gradient(to right, transparent, var(--silver3));
          opacity: 0; transition: opacity 0.2s;
        }
        .tl-item:hover .tl-tick { opacity: 1; }

        .tl-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 24px; margin-bottom: 8px;
        }
        .tl-company {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-style: italic;
          font-size: 1.8rem; text-transform: uppercase; color: #fff; line-height: 1;
          margin-bottom: 4px; transition: color 0.2s;
        }
        .tl-item:hover .tl-company { color: var(--red); }

        .tl-role {
          font-family: 'Share Tech Mono', monospace; font-size: 0.62rem;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 2px;
        }

        .tl-badge {
          font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.14em;
          text-transform: uppercase; padding: 5px 14px;
          border: 1px solid var(--silver3); color: var(--silver3);
          white-space: nowrap; flex-shrink: 0;
          clip-path: polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%);
          transition: border-color 0.2s, color 0.2s;
          align-self: flex-start; margin-top: 4px;
        }
        .tl-item:hover .tl-badge { border-color: var(--red); color: var(--red); }

        .tl-desc {
          font-family: 'Barlow Condensed', sans-serif; font-size: 1rem;
          font-weight: 400; line-height: 1.75; color: var(--silver2);
          max-width: 600px; margin-bottom: 16px; margin-top: 10px;
        }

        .tl-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .tl-pill {
          font-family: 'Share Tech Mono', monospace; font-size: 0.56rem; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 10px;
          background: rgba(232,0,45,0.08); border: 1px solid rgba(232,0,45,0.2);
          color: rgba(232,0,45,0.7);
          clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
        }

        .tl-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tl-tag {
          font-family: 'Share Tech Mono', monospace; font-size: 0.56rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--silver3); border: 1px solid var(--silver3);
          padding: 3px 9px; clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
          transition: border-color 0.2s, color 0.2s;
        }
        .tl-item:hover .tl-tag { border-color: rgba(232,0,45,0.3); color: var(--silver2); }

        .tl-sep {
          position: absolute; left: 0; right: 0; bottom: 28px; height: 1px;
          background: linear-gradient(90deg, var(--rule2) 0%, transparent 100%);
        }
        .tl-item:last-child .tl-sep { display: none; }

        @media (max-width: 768px) {
          .tl-wrapper { padding-left: 32px; }
          .tl-node { left: -41px; }
          .tl-header { flex-direction: column; gap: 8px; }
        }
      `}</style>

      <SectionBg mousePos={mousePos} ghostNum="03" redGlowPos="top-right" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1080 }}>
        <SectionHeader
          sectorLabel="Sector 03 - Race History"
          title={['Previous', 'Teams', '']}
          subtitle="Roles where speed, craft, and ownership were non-negotiable."
        />

        <div className="sec-d3 tl-wrapper">
          {jobs.map((job) => (
            <div key={`${job.company}-${job.period}`} className="tl-item">
              <a href={job.link} target="_blank" rel="noreferrer" className="tl-link" aria-label={`Open ${job.company}`}>
                <div className="tl-node"><div className="tl-node-inner" /></div>
                <div className="tl-tick" />

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
