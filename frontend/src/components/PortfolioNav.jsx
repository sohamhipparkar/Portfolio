export default function PortfolioNav({ scrollY, onNavigate, logoImg }) {
  const sections = ['about', 'work', 'projects', 'contact']

  return (
    <nav className={`f1-nav${scrollY > 60 ? ' scrolled' : ''}`}>
      <img src={logoImg} alt="Logo" className="h-10 w-10 object-contain" />

      <ul className="nav-links">
        {sections.map((section) => (
          <li key={section}>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault()
                onNavigate(section)
              }}
            >
              {section}
            </a>
          </li>
        ))}
      </ul>

      <button className="nav-pit" onClick={() => onNavigate('contact')}>Pit Stop -&gt;</button>
    </nav>
  )
}
