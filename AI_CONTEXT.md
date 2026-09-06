# Portfolio de Enzo Norese

## Arquitectura

- Next.js 15 App Router, React 19, TypeScript y Tailwind CSS 3.
- Rutas estáticas `/es` y `/en`; `src/middleware.ts` detecta el idioma para rutas sin prefijo.
- Contenido traducido en `src/i18n/es.json` y `en.json`, consumido con `useLanguage()`.
- `src/app/[lang]/layout.tsx` conserva metadata localizada, JSON-LD, fuentes, analytics opcional y providers.
- Formulario: `POST /api/contact` con Resend; configuración en `.env.example`.
- Redes y WhatsApp configurados en `src/config/social.json`.

## Dirección visual — septiembre de 2026

Diseño editorial de fondo carbón, acento lima, tipografía Inter y el nombre Enzo Norese como protagonista de la portada. Los temas claro, bosque, océano y medianoche usan el mismo sistema de variables semánticas:
`--page`, `--surface`, `--card`, `--ink`, `--muted`, `--line`, `--button`, `--button-text`, `--error` y `--accent`.
`--accent` conserva el formato R G B para las utilidades de Tailwind.

Estilos en `src/app/globals.css`, organizados por componente y breakpoints. El layout usa `.shell` y `.portfolio-section`; `PortfolioUI.tsx` contiene `SectionHeading` y el icono `Arrow`.

## Recorrido y componentes

1. **Hero**: nombre y trayectoria personal, CTA a proyectos, contacto, redes y stack. HeroSky dibuja estrellas, lluvia de código y meteoros; las órbitas SVG también se animan.
2. **Projects**: tres casos destacados con navegación directa: ATS (cuatro fases), Cyber + formularios (cinco frentes) y SAC + encuestas (cuatro frentes), seguidos de los seis proyectos existentes con filtros. FeaturedProject comparte la presentación y mantiene IDs independientes. CyberJourney ilustra canales, postulación reutilizable y conexión al ATS; SACJourney representa la atención por bot, derivación condicional a un agente, SLA, encuestas y sincronización. ATS y Cyber pertenecen a TeamWork y están relacionados por enlaces en ambos sentidos. Los casos parten de los relatos de Enzo; los diagramas son conceptuales. No confundirlos con el agente de reclutamiento con IA ni inventar métricas.
3. **About**: presentación, filosofía y estadísticas originales.
4. **Experience**: historial profesional con fechas, descripciones y tecnologías.
5. **Services**: servicios existentes en una retícula compacta.
6. **Skills**: tecnologías agrupadas por especialidad.
7. **FAQ**: desplegables nativos `details/summary`, disponibles desde el HTML inicial.
8. **Contact**: email y WhatsApp directos; formulario con etiquetas persistentes, validación asociada a campos, foco al primer error y estados anunciados.
9. **Footer**: redes y enlace para volver al inicio.

Navbar fijo con enlaces principales, idioma y selector nativo de tema. Menú móvil con Escape, devolución de foco al botón y cierre al navegar o pasar a escritorio. El enlace para saltar al contenido apunta al único `main`.

## Convenciones

- Todo texto editorial nuevo se agrega a ambos JSON, bajo `design`; los casos están bajo `teamwork` (ATS), `cyber` (captación) y `sac` (atención y encuestas).
- Conservar anclas: `home`, `proyectos`, `sobre-mi`, `experiencia`, `servicios`, `habilidades`, `faq`, `contacto`.
- `src/config/sections.ts` controla las secciones y la navegación. WhatsApp flotante está desactivado; sigue disponible en Contact.
- Las vistas de proyectos son **ilustraciones conceptuales**, no capturas de aplicaciones reales.
- Los enlaces de demo/código originales apuntaban a `#` y estaban deshabilitados. La UI muestra información del proyecto y contacto; no ofrece destinos ficticios.
- Se retiró el enlace a `/cv.pdf` porque ese archivo no existe en `public`.
- MotionProvider centraliza movimiento, respeta cambios en `prefers-reduced-motion` y recuerda la pausa manual en localStorage (`portfolio-motion`).
- HeroSky limita dibujo a 30 fps y DPR a 1.75, reduce partículas en móvil y pausa el bucle al ocultar la pestaña o salir del hero. Limpia listeners y observers.
- MotionEffects añade entradas al scroll solo después de hidratar y solo fuera del viewport, stagger, progreso de lectura e iluminación/inclinación al mover el cursor. Admite filtros y desplegables sin ocultar el contenido SSR. El hover no se aplica a eventos táctiles.
- Con el movimiento pausado, todo el contenido queda visible y sin animaciones. Los efectos no agregan dependencias.
- Los easter eggs y la lógica del cubo siguen en sus componentes originales; cinco clics en el logo disparan el evento existente.
- El formulario impide envíos duplicados durante una solicitud, tiene timeout de 15 segundos y conserva el texto ante errores. El envío real requiere las variables Resend.

## Validación

```sh
npm run dev
npm run build
npm run lint
npx tsc --noEmit
node scripts/test-rubik-logic.mjs
```

ESLint está configurado en `.eslintrc.json` y usa la CLI directamente, sin el comando deprecado `next lint`.

Revisión del rediseño:
- Compilación de producción y comprobación TypeScript.
- ESLint con cero advertencias.
- 50 comprobaciones existentes de la lógica del cubo.
- Navegador: español/inglés, 320/390/768/1024/1440 px, filtros, desplegables, navegación, temas y validación del formulario.
- No se envían correos reales durante las pruebas de UI.

## Hechos confirmados del caso Cyber

- La empresa es TeamWork; el ATS es el mismo del primer caso.
- Mismo stack del primer proyecto. Se confirmó rate limiting en el servidor para los envíos abusivos.
- Validación documental mediante librerías OCR, Azure Document Intelligence para ID y modelos de visión de OpenAI, como alternativas de fallback. No se ha especificado un orden fijo ni umbrales de confianza.
- Formularios configurables, recuperación de datos para nuevas ofertas, identificación del origen y QR para ferias laborales.
- Sistema en evolución. No se han proporcionado métricas, detalles del algoritmo de rate limiting ni resultados SEO medidos.

## Hechos confirmados del caso SAC

- Enzo participó en la planificación de arquitectura y desarrollo; no atribuirle autoría exclusiva.
- Bot por WhatsApp, derivación a tickets con número de caso y agente, medición de tiempos para evaluar SLA.
- Encuestas de satisfacción de atención y experiencia laboral: reclutamiento, contratación y offboarding.
- Mismo stack del primer caso. Sincronización diaria de grandes volúmenes desde fuentes corporativas, con timers, lotes, actualizaciones incrementales, colas, reintentos y colas poison.
- No se han especificado fuentes concretas, proveedor de colas, política de reintentos, métricas de volumen ni resultados cuantificados de SLA. Tampoco se confirmó IA en el bot.
