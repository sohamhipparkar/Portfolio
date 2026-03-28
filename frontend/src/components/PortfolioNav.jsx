export default function PortfolioNav({ scrollY, onNavigate, logoImg }) {
  const sections = ['about', 'work', 'projects', 'contact']

  const goHome = (event) => {
    event.preventDefault()
    const homeEl = document.getElementById('home')
    if (homeEl) {
      onNavigate('home')
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className={`f1-nav${scrollY > 60 ? ' scrolled' : ''}`}>
      <a href="#home" onClick={goHome} aria-label="Go to top">
        <img src={logoImg} alt="Logo" className="h-10 w-10 object-contain" />
      </a>

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
