export const portfolioSections = {
  navbar: true,
  hero: true,
  about: true,
  services: true,
  experience: true,
  skills: true,
  successStories: true,
  projects: true,
  faq: true,
  contact: true,
  footer: true,
  floatingWhatsApp: true,
  easterEgg: true,
  rubikCube: true,
} as const

export const navSections = [
  { key: 'projects', id: 'proyectos', href: '#proyectos' },
  { key: 'experience', id: 'experiencia', href: '#experiencia' },
  { key: 'services', id: 'servicios', href: '#servicios' },
  { key: 'about', id: 'sobre-mi', href: '#sobre-mi' },
  { key: 'contact', id: 'contacto', href: '#contacto' },
] as const

export const enabledNavSections = navSections.filter(
  ({ key }) => portfolioSections[key]
)
