import dynamic from 'next/dynamic'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { MotionOrchestrator } from '@/components/MotionOrchestrator'
import { DeferredExperiences } from '@/components/DeferredExperiences'
import { portfolioSections } from '@/config/sections'

const About = dynamic(() => import('@/components/About').then(m => ({ default: m.About })))
const Services = dynamic(() => import('@/components/Services').then(m => ({ default: m.Services })))
const Experience = dynamic(() => import('@/components/Experience').then(m => ({ default: m.Experience })))
const Skills = dynamic(() => import('@/components/Skills').then(m => ({ default: m.Skills })))
const Projects = dynamic(() => import('@/components/Projects').then(m => ({ default: m.Projects })))
const FAQ = dynamic(() => import('@/components/FAQ').then(m => ({ default: m.FAQ })))
const Contact = dynamic(() => import('@/components/Contact').then(m => ({ default: m.Contact })))
const Footer = dynamic(() => import('@/components/Footer').then(m => ({ default: m.Footer })))
const FloatingWhatsApp = dynamic(() => import('@/components/FloatingWhatsApp').then(m => ({ default: m.FloatingWhatsApp })))

export default function Home() {
  return (
    <main className="site-canvas">
      <MotionOrchestrator />
      {portfolioSections.navbar && <Navbar />}
      {portfolioSections.hero && <Hero />}
      {portfolioSections.about && <About />}
      {portfolioSections.projects && <Projects />}
      {portfolioSections.services && <Services />}
      {portfolioSections.experience && <Experience />}
      {portfolioSections.skills && <Skills />}
      {portfolioSections.faq && <FAQ />}
      {portfolioSections.contact && <Contact />}
      {portfolioSections.footer && <Footer />}
      {portfolioSections.floatingWhatsApp && <FloatingWhatsApp />}
      {(portfolioSections.easterEgg || portfolioSections.rubikCube) && <DeferredExperiences />}
    </main>
  )
}
