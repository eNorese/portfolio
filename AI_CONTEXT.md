# AI_CONTEXT.md — Portfolio de Enzo Norese

> Archivo de contexto para asistentes de IA. Describe la arquitectura, convenciones y estado actual del proyecto para acelerar el onboarding en futuras sesiones.

---

## Identidad del proyecto

- **Propietario:** Enzo Norese — Ingeniero en Informática, Backend Developer & Cloud Architect en TeamWork Chile
- **Dominio:** https://enorese.dev
- **Email de contacto:** enzo.norese@gmail.com
- **Marca visual:** "eNorese." (punto en color accent — indigo)
- **Repositorio:** `main` branch

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript 5 |
| Estilos | Tailwind CSS 3 (dark mode via `class`) |
| 3D | Three.js 0.170 + React Three Fiber 9.6 + Drei 10.7 |
| Temas | next-themes 0.4.3 |
| i18n | JSON estático + Context propio |
| Linting | ESLint 8 + next config |
| Deploy | Vercel (implícito por config) |

---

## Estructura de directorios

```
portfolio/
├── public/                  # robots.txt, sitemap.xml, humans.txt, llms.txt
├── scripts/
│   └── test-rubik-logic.mjs # Tests unitarios para la lógica del cubo
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout: metadata, fuentes, providers, script anti-flash
│   │   ├── page.tsx         # Single-page: imports dinámicos + feature flags
│   │   └── globals.css      # Animaciones, temas CSS vars, scrollbar, View Transitions
│   ├── components/
│   │   ├── Navbar.tsx       # Fixed header, IntersectionObserver, easter egg trigger (5 clicks)
│   │   ├── Hero.tsx         # Canvas (code rain, stars), spotlight, side lights, CTAs
│   │   ├── About.tsx        # Bio + stats cards (6+ años, 40+ proyectos...)
│   │   ├── Experience.tsx   # Timeline vertical de empleos
│   │   ├── Skills.tsx       # Grid de tecnologías + success stories
│   │   ├── Projects.tsx     # Cards de proyectos con links live/code
│   │   ├── Contact.tsx      # Panel info + formulario
│   │   ├── Footer.tsx       # Footer simple
│   │   ├── SocialLinks.tsx  # Iconos LinkedIn/GitHub/X desde social.json
│   │   ├── ThemeProvider.tsx # Wrapper next-themes + DarkClassManager
│   │   ├── ThemeSelector.tsx # Dropdown 5 temas con swatches
│   │   ├── FloatingWhatsApp.tsx
│   │   ├── EasterEgg.tsx
│   │   ├── RubikCube.tsx    # Modal easter egg con controles y timer
│   │   └── rubik/
│   │       ├── logic.ts     # Máquina de estados del cubo (sin rendering)
│   │       └── RubikScene.tsx # Canvas Three.js del cubo
│   ├── config/
│   │   ├── sections.ts      # Feature flags de secciones
│   │   └── social.json      # URLs y habilitación de redes sociales
│   ├── contexts/
│   │   └── LanguageContext.tsx # ES/EN toggle, función t() dot-notation
│   └── i18n/
│       ├── en.json          # Textos en inglés (todo el contenido visible)
│       └── es.json          # Textos en español
```

---

## Convenciones clave

### Textos e i18n
- **Todo texto visible** va en `src/i18n/en.json` y `src/i18n/es.json`.
- Los componentes consumen texto vía `const { t } = useLanguage()` con claves dot-notation: `t("hero.title")`.
- Excepción: los nombres de tecnologías en `Skills.tsx` están hardcodeados en el componente (son agnósticos al idioma).

### Temas
- Sistema de 5 temas: `light`, `dark`, `forest`, `ocean`, `midnight`.
- Cada tema define la variable CSS `--accent` en formato `R G B` (sin `rgb()`) para poder usar opacidades con Tailwind: `bg-[rgb(var(--accent)/0.1)]`.
- El color accent se usa como `indigo` en light/dark, `green` en forest, `cyan` en ocean, `purple` en midnight.
- El script anti-flash en `layout.tsx` lee `localStorage.theme` y aplica la clase `dark` antes del primer paint.

### Feature flags
- `src/config/sections.ts` exporta un objeto `portfolioSections` con booleanos.
- `page.tsx` renderiza condicionalmente cada sección según estos flags.
- Para agregar/quitar secciones: modificar solo `sections.ts`.

### Rendimiento
- Navbar y Hero se importan directamente (ruta crítica).
- El resto de secciones usan `dynamic()` de Next.js con `{ ssr: false }` o `{ loading: ... }`.
- Three.js se carga lazy dentro de `RubikCube.tsx`.

### IDs de navegación (para anclas)
```
sobre-mi | experiencia | habilidades | proyectos | contacto
```
Los IDs están definidos en `src/config/sections.ts` dentro del array `navigationSections`.

---

## Sistema de temas (CSS variables)

```css
/* Cada tema en globals.css */
[data-theme="light"]  { --accent: 99 102 241; }   /* indigo-500 */
[data-theme="dark"]   { --accent: 129 140 248; }   /* indigo-400 */
[data-theme="forest"] { --accent: 22 163 74; }     /* green-600 */
[data-theme="ocean"]  { --accent: 6 182 212; }     /* cyan-500 */
[data-theme="midnight"]{ --accent: 167 139 250; }  /* violet-400 */
```

Los temas `forest`, `ocean` y `midnight` también tienen background overrides fuera de `@layer` para mayor especificidad.

---

## Easter egg: Cubo Rubik 3D

- Se activa con **5 clicks en el logo** del Navbar.
- Implementado como modal en `RubikCube.tsx` + `RubikScene.tsx` + `rubik/logic.ts`.
- `logic.ts` es **puro** (sin dependencias de React/Three.js): Vec3 positions, ColorKey stickers, MoveSpec rotation matrices.
- Controles de teclado: `U/D/L/R/F/B` (movimiento), `Shift` (inverso), `Esc` (cerrar).
- Funcionalidades: Scramble, Reset, contador de movimientos, cronómetro, banner de resuelto.

---

## Redes sociales (`src/config/social.json`)

```json
{
  "linkedin": { "enabled": true, "url": "https://linkedin.com/in/enorese" },
  "github":   { "enabled": true, "url": "https://github.com/enorese" },
  "x":        { "enabled": true, "url": "https://x.com/enorese" },
  "whatsapp": { "enabled": true, "number": "+56995897061" }
}
```

Para agregar/deshabilitar una red: solo modificar este JSON.

---

## Metadata y SEO

- Definida en `src/app/layout.tsx`.
- Open Graph: `locale: es_CL`, `url: https://enorese.dev`.
- Schema.org JSON-LD tipo `Person` con `knowsAbout`: Azure, TypeScript, Node.js, etc.
- `public/sitemap.xml` y `public/robots.txt` para crawlers.
- `public/llms.txt` siguiendo la especificación de instrucciones para LLMs.

---

## Comandos útiles

```bash
npm run dev          # Servidor de desarrollo (Next.js)
npm run build        # Build de producción
npm run lint         # ESLint
node scripts/test-rubik-logic.mjs  # Tests del cubo Rubik
```

---

## Notas de contenido

- El contenido de **Experiencia** proviene de LinkedIn real (TeamWork Chile, Prodigio Chile, Solari).
- Las estadísticas en **About** son reales: 6+ años, 40+ proyectos, 30+ tecnologías.
- El **CV** se descarga desde el Hero — el archivo debe estar en `public/` (pendiente confirmar nombre).
- La filosofía personal citada en el About es **"Augmented Engineering" / "Ingeniería Aumentada"**.

---

## Contexto de desarrollo

- Enzo trabaja en certificaciones **AZ-900 / AZ-204** de Microsoft Azure.
- Lidera la migración ERP **Softland → Rex+** en TeamWork Chile.
- Intereses adicionales: drones FPV, DJing, ciberseguridad.
- El portfolio reemplazó un proyecto anterior en **Vite + React** — la reescritura en Next.js fue una decisión deliberada.
