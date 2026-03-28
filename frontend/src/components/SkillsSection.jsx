import { useState } from 'react'
import { SectionStyles, SectionBg, SectionHeader, useMouseParallax, useReveal } from './SectionShared'

const techStack = [
  { name: 'HTML5', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'JavaScript', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'React', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Next.js', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Tailwind', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Framer Motion', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg'},
  { name: 'Vite', cat: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
  { name: 'Node.js', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Express', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'Python', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Java', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'C++', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { name: 'C', cat: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg'  },
  { name: 'MongoDB', cat: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'PostgreSQL', cat: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'MySQL', cat: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'Git', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Figma', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'VSCode', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  { name: 'Postman', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
  { name: 'Canva', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
  { name: 'NPM', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg' },
  { name: 'AWS', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg'},
  {name: 'Azure', cat: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg'},
  { name: 'Google Colab', cat: 'tools', icon: 'https://cdn.simpleicons.org/googlecolab/f9ab00' },
]

const categories = [
  { id: 'all', label: 'All Systems', color: '#E8002D' },
  { id: 'frontend', label: 'Frontend', color: '#38bdf8' },
  { id: 'backend', label: 'Backend', color: '#34d399' },
  { id: 'database', label: 'Database', color: '#fbbf24' },
  { id: 'tools', label: 'Tools', color: '#a78bfa' },
]

export default function SkillsSection() {
  const [sectionRef, visible] = useReveal()
  const mousePos = useMouseParallax()
  const [active, setActive] = useState('all')
  const filtered = active === 'all' ? techStack : techStack.filter((item) => item.cat === active)

  return (
    <section id="tech" ref={sectionRef} className={`port-section${visible ? ' sec-visible' : ''}`} aria-label="Tech stack">
      <SectionStyles />
      <style>{`
        .ts-filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 48px; }
        .ts-filter-btn {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.12em;
          text-transform: uppercase; padding: 7px 16px; border: 1px solid var(--silver3);
          background: transparent; color: var(--silver3); cursor: pointer;
          clip-path: polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%); transition: all 0.2s;
        }
        .ts-filter-btn:hover { border-color: var(--red); color: var(--red); }
        .ts-filter-btn.active { background: var(--red); color: #fff; border-color: var(--red); }

        .ts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 2px; }
        .ts-card {
          background: var(--carbon); border: 1px solid var(--rule); padding: 24px 16px;
          display: flex; flex-direction: column; align-items: center; gap: 12px; position: relative;
          overflow: hidden; transition: border-color 0.25s, background 0.25s, transform 0.2s;
        }
        .ts-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(232,0,45,0.05) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .ts-card:hover { border-color: var(--red); background: rgba(232,0,45,0.04); transform: translateY(-2px); }
        .ts-card:hover::before { opacity: 1; }
        .ts-card:hover .ts-name { color: #fff; }
        .ts-card:hover .ts-icon { transform: scale(1.12); }

        .ts-card[data-cat="frontend"]:hover { border-color: #38bdf8; background: rgba(56,189,248,0.04); }
        .ts-card[data-cat="frontend"]:hover .ts-name { color: #38bdf8; }
        .ts-card[data-cat="backend"]:hover { border-color: #34d399; background: rgba(52,211,153,0.04); }
        .ts-card[data-cat="backend"]:hover .ts-name { color: #34d399; }
        .ts-card[data-cat="database"]:hover { border-color: #fbbf24; background: rgba(251,191,36,0.04); }
        .ts-card[data-cat="database"]:hover .ts-name { color: #fbbf24; }
        .ts-card[data-cat="tools"]:hover { border-color: #a78bfa; background: rgba(167,139,250,0.04); }
        .ts-card[data-cat="tools"]:hover .ts-name { color: #a78bfa; }

        .ts-icon { width: 40px; height: 40px; object-fit: contain; transition: transform 0.25s; position: relative; z-index: 1; }
        .ts-name {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--silver3); text-align: center; transition: color 0.25s;
          position: relative; z-index: 1;
        }

        .ts-bottom {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--rule);
        }
        .ts-count {
          font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--silver3);
        }
        .ts-count span { color: var(--red); }
        .ts-legend { display: flex; gap: 20px; }
        .ts-legend-item {
          display: flex; align-items: center; gap: 6px; font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--silver3);
        }
        .ts-legend-dot { width: 6px; height: 6px; border-radius: 50%; }

        @media (max-width: 768px) {
          .ts-grid { grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); }
          .ts-legend { display: none; }
        }
      `}</style>

      <SectionBg mousePos={mousePos} ghostNum="04" redGlowPos="bottom-left" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1080 }}>
        <SectionHeader
          sectorLabel="Sector 04 - Technical Specs"
          title={['Technologies', 'I Work', 'With']}
          subtitle="Every tool chosen deliberately - performance, DX, and longevity over trend."
        />

        <div className="sec-d3 ts-filter-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`ts-filter-btn${active === cat.id ? ' active' : ''}`}
              style={active === cat.id ? {
                background: cat.id === 'all' ? 'var(--red)' : cat.color,
                borderColor: cat.id === 'all' ? 'var(--red)' : cat.color,
              } : {}}
              onClick={() => setActive(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="sec-d4 ts-grid">
          {filtered.map((tech) => (
            <div key={tech.name} className="ts-card" data-cat={tech.cat}>
              <img className="ts-icon" src={tech.icon} alt={tech.name} />
              <span className="ts-name">{tech.name}</span>
            </div>
          ))}
        </div>

        <div className="sec-d5 ts-bottom">
          <span className="ts-count"><span>{filtered.length}</span> / {techStack.length} technologies</span>
          <div className="ts-legend">
            {categories.slice(1).map((cat) => (
              <div key={cat.id} className="ts-legend-item">
                <div className="ts-legend-dot" style={{ background: cat.color }} />
                {cat.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
