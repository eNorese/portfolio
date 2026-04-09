import dynamic from 'next/dynamic'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'

const About = dynamic(() => import('@/components/About').then(m => ({ default: m.About })))
const Experience = dynamic(() => import('@/components/Experience').then(m => ({ default: m.Experience })))
const Skills = dynamic(() => import('@/components/Skills').then(m => ({ default: m.Skills })))
const Projects = dynamic(() => import('@/components/Projects').then(m => ({ default: m.Projects })))
const Contact = dynamic(() => import('@/components/Contact').then(m => ({ default: m.Contact })))
const Footer = dynamic(() => import('@/components/Footer').then(m => ({ default: m.Footer })))
const FloatingWhatsApp = dynamic(() => import('@/components/FloatingWhatsApp').then(m => ({ default: m.FloatingWhatsApp })))

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
