export const portfolioSections = {
  navbar: true,
  hero: true,
  about: true,
  experience: true,
  skills: true,
  successStories: false,
  projects: true,
  contact: true,
  footer: true,
  floatingWhatsApp: true,
  easterEgg: true,
  rubikCube: true,
} as const

export const navSections = [
  { key: 'about', id: 'sobre-mi', href: '#sobre-mi' },
  { key: 'experience', id: 'experiencia', href: '#experiencia' },
  { key: 'skills', id: 'habilidades', href: '#habilidades' },
  { key: 'projects', id: 'proyectos', href: '#proyectos' },
  { key: 'contact', id: 'contacto', href: '#contacto' },
] as const

export const enabledNavSections = navSections.filter(
  ({ key }) => portfolioSections[key]
)
