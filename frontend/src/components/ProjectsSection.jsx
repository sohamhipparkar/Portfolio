import { ArrowUpRight } from 'lucide-react'

export default function ProjectsSection({ projects }) {
  const featured = projects.find((project) => project.featured)
  const rest = projects.filter((project) => !project.featured)

  return (
    <section id="projects" className="section">
      <div className="sec-label">03 - Fastest Laps</div>
      <h2 className="sec-title">Selected<br />Projects</h2>
      <div className="proj-grid">
        <div className="proj-card-wide">
          <div className="proj-wide-left">
            <div className="proj-num">{featured.num}</div>
            <h3 className="proj-title">{featured.title}</h3>
            <p className="proj-desc">{featured.desc}</p>
            <div className="proj-tags">
              {featured.tags.map((tag) => (
                <span key={tag} className="proj-tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="proj-wide-right">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <a href="#" className="proj-link">View Project <ArrowUpRight size={13} className="proj-arrow" /></a>
              <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.58rem', letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase' }}>▲ Featured</span>
            </div>
          </div>
        </div>

        {rest.map((project) => (
          <div key={project.num} className="proj-card">
            <div className="proj-num">{project.num}</div>
            <h3 className="proj-title">{project.title}</h3>
            <p className="proj-desc">{project.desc}</p>
            <div className="proj-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="proj-tag">{tag}</span>
              ))}
            </div>
            <a href="#" className="proj-link">View Project <ArrowUpRight size={13} className="proj-arrow" /></a>
          </div>
        ))}
      </div>
    </section>
  )
}
