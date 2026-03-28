import './App.css'
import IntroSequence from './components/IntroSequence'
import MainPortfolioPage from './components/MainPortfolioPage'
import Hero from './components/Hero'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import PortfolioNav from './components/PortfolioNav'
import PortfolioFooter from './components/PortfolioFooter'
import PortfolioSideElements from './components/PortfolioSideElements'
import PreviousTeamsSection from './components/PreviousTeamsSection'
import SkillsSection from './components/SkillsSection'
import logoImg from './assets/logo.png'
import linkedinIcon from './assets/linkedin.webp'
import mailIcon from './assets/mail.webp'

const githubIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'

const projects = [
  { num: '01', featured: true, title: 'E-Commerce Platform', desc: 'Full-stack shopping experience with dynamic catalogue, cart engine, and Stripe integration. Serves 10k+ daily sessions with sub-200ms TTFB.', tags: ['React', 'Node.js', 'MongoDB', 'Stripe'] },
  { num: '02', featured: false, title: 'AI Chat App', desc: 'Conversational AI platform with context-aware replies and adaptive learning per user session.', tags: ['Python', 'Flask', 'ML'] },
  { num: '03', featured: false, title: 'Task Manager', desc: 'Real-time collaborative task tool with role-based auth and Firebase sync across devices.', tags: ['React', 'Firebase'] },
  { num: '04', featured: false, title: 'This Portfolio', desc: 'F1-themed, built for speed and precision. Every millisecond matters - on track and in the browser.', tags: ['React', 'Tailwind'] },
]

function PortfolioMain() {
  return (
    <MainPortfolioPage
      renderNav={({ scrollY, onNavigate }) => (
        <PortfolioNav scrollY={scrollY} onNavigate={onNavigate} logoImg={logoImg} />
      )}
      renderHero={({ onViewWork, onContact, resumeLink }) => (
        <Hero onViewWork={onViewWork} onContact={onContact} resumeLink={resumeLink} />
      )}
      aboutSection={<AboutSection />}
      workTimelineSection={<PreviousTeamsSection />}
      techStackSection={<SkillsSection />}
      projectsSection={<ProjectsSection projects={projects} />}
      contactSection={<ContactSection mailIcon={mailIcon} githubIcon={githubIcon} linkedinIcon={linkedinIcon} />}
      footerSection={<PortfolioFooter />}
      sideElements={<PortfolioSideElements githubIcon={githubIcon} linkedinIcon={linkedinIcon} mailIcon={mailIcon} />}
    />
  )
}

export default function App() {
  return <IntroSequence MainComponent={PortfolioMain} />
}