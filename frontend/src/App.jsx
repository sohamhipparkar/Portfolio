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
  {
    num: '01',
    featured: true,
    title: 'SoleCraft',
    desc: 'A service-oriented web application to organize the informal cobbler sector, offering digital access to shoe exchange, customization, servicing, reselling, and shopping.',
    tags: ['React', 'Express', 'Node.js', 'MongoDB', 'JWT', 'Tailwind'],
    github: 'https://github.com/sohamhipparkar/SoleCraft', 
    live: 'https://sole-craft.vercel.app/',           
    year: '2025',
    type: 'Full-Stack Web Application',
    role: 'Solo Developer',
    stats: ['60% Service Engagement', '40% Code Maintainability', 'Real Life'],
  },
  {
    num: '02',
    featured: false,
    title: 'JetSetGo',
    desc: 'Flight management system with aircraft status, scheduling, and maintenance tracking.',
    tags: ['React', 'Tailwind', 'React DOM'],
    github: 'https://github.com/sohamhipparkar/JetSetGo',        
    live: 'https://jet-set-go-six.vercel.app/',                                           
  },
  {
    num: '03',
    featured: false,
    title: 'DSA Tracker',
    desc: 'Real-time progress tracker for data structures and algorithms practice, with interactive visualizations.',
    tags: ['React', 'Zustand', 'DnD Kit', 'Node.js'],
    github: 'https://github.com/sohamhipparkar/DSA-Tracker',       
    live: 'https://soham-dsa-tracker.vercel.app/',                
  },
  {
    num: '04',
    featured: false,
    title: 'GlobeMart',
    desc: 'E-commerce platform for global products with localized shopping experience.',
    tags: ['React', 'Tailwind', 'Framer Motion'],
    github: 'https://github.com/sohamhipparkar/GlobeMart',          
    live: 'https://globe-mart-wine.vercel.app/',                     
  },
  {
    num: '05',
    featured: false,
    title: 'Chat App',
    desc: 'Real-time chat application with user authentication, private messaging, and group chats.',
    tags: ['React', 'Tailwind', 'Framer Motion'],
    github: 'https://github.com/sohamhipparkar/Chat',          
    live: null,                     
  },
  {
    num: '06',
    featured: false,
    title: 'Portfolio Website',
    desc: 'Personal portfolio showcasing projects, skills, and experience with a modern F1-inspired design.',
    tags: ['React', 'Tailwind', 'Framer Motion'],
    github: 'https://github.com/sohamhipparkar/Portfolio',          
    live: 'https://soham-hipparkar.vercel.app/',                     
  },
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