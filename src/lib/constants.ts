// ============================================================
// PORTFOLIO CONFIGURATION — Enzo Norese
// ============================================================
// Actualiza estas constantes con tu información personal.
// Busca los comentarios "TODO" para los valores que debes cambiar.

// ---- Contacto -----------------------------------------------
// TODO: Reemplaza con tu email real
export const CONTACT_EMAIL = 'enzo@example.com'

// ---- Redes sociales -----------------------------------------
// TODO: Actualiza con tus URLs reales de redes sociales
export const SOCIAL_LINKS = {
  github: '#', // TODO: 'https://github.com/tu-usuario'
  linkedin: '#', // TODO: 'https://linkedin.com/in/tu-perfil'
  instagram: '#', // TODO: 'https://instagram.com/enorese.fpv'
}

// ---- Stack tecnológico --------------------------------------
// Para agregar tecnología: { name, iconKey (react-icons/si name o null), color }
export const STACK = {
  cloud: [
    { name: 'Microsoft Azure', iconKey: null, color: '#0078d4' },
    { name: 'Azure Functions', iconKey: null, color: '#0078d4' },
    { name: 'CosmosDB', iconKey: null, color: '#0078d4' },
    { name: 'Azure DevOps', iconKey: null, color: '#0078d4' },
    { name: 'Azure Blob Storage', iconKey: null, color: '#0078d4' },
    { name: 'Azure Queue Storage', iconKey: null, color: '#0078d4' },
    { name: 'Azure SignalR', iconKey: null, color: '#0078d4' },
    { name: 'Static Web Apps', iconKey: null, color: '#0078d4' },
  ],
  backend: [
    { name: 'Node.js', iconKey: 'SiNodedotjs', color: '#339933' },
    { name: 'TypeScript', iconKey: 'SiTypescript', color: '#3178c6' },
    { name: 'C#', iconKey: 'SiSharp', color: '#239120' },
    { name: '.NET Core', iconKey: 'SiDotnet', color: '#512bd4' },
    { name: 'REST APIs', iconKey: null, color: '#6c757d' },
    { name: 'Microservicios', iconKey: null, color: '#6c757d' },
    { name: 'Serverless', iconKey: null, color: '#7c3aed' },
  ],
  databases: [
    { name: 'SQL Server', iconKey: null, color: '#cc2927' },
    { name: 'PostgreSQL', iconKey: 'SiPostgresql', color: '#4169e1' },
    { name: 'CosmosDB (NoSQL)', iconKey: null, color: '#0078d4' },
    { name: 'T-SQL', iconKey: null, color: '#cc2927' },
  ],
  ai: [
    { name: 'OpenAI / LLMs', iconKey: 'SiOpenai', color: '#412991' },
    { name: 'RAG Architecture', iconKey: null, color: '#7c3aed' },
    { name: 'AI Debugging', iconKey: null, color: '#7c3aed' },
    { name: 'Auto-Documentation', iconKey: null, color: '#7c3aed' },
  ],
  frontend: [
    { name: 'React.js', iconKey: 'SiReact', color: '#61dafb' },
    { name: 'HTML5', iconKey: 'SiHtml5', color: '#e34f26' },
    { name: 'CSS3', iconKey: 'SiCss', color: '#1572b6' },
    { name: 'Tailwind CSS', iconKey: 'SiTailwindcss', color: '#06b6d4' },
  ],
} as const

export type StackCategory = keyof typeof STACK
export type StackItem = { name: string; iconKey: string | null; color: string }
