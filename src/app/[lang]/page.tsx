import dynamic from 'next/dynamic'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { portfolioSections } from '@/config/sections'

const About = dynamic(() => import('@/components/About').then(m => ({ default: m.About })))
const Experience = dynamic(() => import('@/components/Experience').then(m => ({ default: m.Experience })))
const Skills = dynamic(() => import('@/components/Skills').then(m => ({ default: m.Skills })))
const Projects = dynamic(() => import('@/components/Projects').then(m => ({ default: m.Projects })))
const Contact = dynamic(() => import('@/components/Contact').then(m => ({ default: m.Contact })))
const Footer = dynamic(() => import('@/components/Footer').then(m => ({ default: m.Footer })))
const FloatingWhatsApp = dynamic(() => import('@/components/FloatingWhatsApp').then(m => ({ default: m.FloatingWhatsApp })))
const EasterEgg = dynamic(() => import('@/components/EasterEgg').then(m => ({ default: m.EasterEgg })))
const RubikCube = dynamic(() => import('@/components/RubikCube').then(m => ({ default: m.RubikCube })))

export default function Home() {
  return (
    <main>
      {portfolioSections.navbar && <Navbar />}
      {portfolioSections.hero && <Hero />}
      {portfolioSections.about && <About />}
      {portfolioSections.experience && <Experience />}
      {portfolioSections.skills && <Skills />}
      {portfolioSections.projects && <Projects />}
      {portfolioSections.contact && <Contact />}
      {portfolioSections.footer && <Footer />}
      {portfolioSections.floatingWhatsApp && <FloatingWhatsApp />}
      {portfolioSections.easterEgg && <EasterEgg />}
      {portfolioSections.rubikCube && <RubikCube />}
    </main>
  )
}
