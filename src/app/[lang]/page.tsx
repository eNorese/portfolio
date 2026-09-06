import dynamic from 'next/dynamic'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { portfolioSections } from '@/config/sections'
import { MotionProvider } from '@/components/MotionProvider'
import { MotionEffects } from '@/components/MotionEffects'

const About = dynamic(() =>
  import('@/components/About').then((m) => ({ default: m.About })),
)
const Services = dynamic(() =>
  import('@/components/Services').then((m) => ({ default: m.Services })),
)
const Experience = dynamic(() =>
  import('@/components/Experience').then((m) => ({ default: m.Experience })),
)
const Skills = dynamic(() =>
  import('@/components/Skills').then((m) => ({ default: m.Skills })),
)
const Projects = dynamic(() =>
  import('@/components/Projects').then((m) => ({ default: m.Projects })),
)
const FAQ = dynamic(() =>
  import('@/components/FAQ').then((m) => ({ default: m.FAQ })),
)
const Contact = dynamic(() =>
  import('@/components/Contact').then((m) => ({ default: m.Contact })),
)
const Footer = dynamic(() =>
  import('@/components/Footer').then((m) => ({ default: m.Footer })),
)
const FloatingWhatsApp = dynamic(() =>
  import('@/components/FloatingWhatsApp').then((m) => ({
    default: m.FloatingWhatsApp,
  })),
)
const EasterEgg = dynamic(() =>
  import('@/components/EasterEgg').then((m) => ({ default: m.EasterEgg })),
)
const RubikCube = dynamic(() =>
  import('@/components/RubikCube').then((m) => ({ default: m.RubikCube })),
)

export default function Home() {
  return (
    <MotionProvider>
      <MotionEffects />
      {portfolioSections.navbar && <Navbar />}
      <main id="main-content" tabIndex={-1}>
        {portfolioSections.hero && <Hero />}
        {portfolioSections.projects && <Projects />}
        {portfolioSections.about && <About />}
        {portfolioSections.experience && <Experience />}
        {portfolioSections.services && <Services />}
        {portfolioSections.skills && <Skills />}
        {portfolioSections.faq && <FAQ />}
        {portfolioSections.contact && <Contact />}
      </main>
      {portfolioSections.footer && <Footer />}
      {portfolioSections.floatingWhatsApp && <FloatingWhatsApp />}
      {portfolioSections.easterEgg && <EasterEgg />}
      {portfolioSections.rubikCube && <RubikCube />}
    </MotionProvider>
  )
}
