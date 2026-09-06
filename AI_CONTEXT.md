# Portfolio de Enzo Norese

## Arquitectura

- Next.js 15 App Router, React 19, TypeScript y Tailwind CSS 3.
- Rutas estáticas `/es` y `/en`; `src/middleware.ts` detecta el idioma para rutas sin prefijo.
- Contenido traducido en `src/i18n/es.json` y `en.json`, consumido con `useLanguage()`.
- `src/app/[lang]/layout.tsx` conserva metadata localizada, JSON-LD, fuentes, analytics opcional y providers.
- Formulario: `POST /api/contact` con Resend; configuración en `.env.example`.
- Redes y WhatsApp configurados en `src/config/social.json`.

## Dirección visual — septiembre de 2026

Diseño editorial de fondo carbón, acento lima, tipografía Inter y acento serif en el titular. Los temas claro, bosque, océano y medianoche usan el mismo sistema de variables semánticas:
`--page`, `--surface`, `--card`, `--ink`, `--muted`, `--line`, `--button`, `--button-text`, `--error` y `--accent`.
`--accent` conserva el formato R G B para las utilidades de Tailwind.

Estilos en `src/app/globals.css`, organizados por componente y breakpoints. El layout usa `.shell` y `.portfolio-section`; `PortfolioUI.tsx` contiene `SectionHeading` y el icono `Arrow`.

## Recorrido y componentes

1. **Hero**: propuesta de valor, CTA a proyectos, contacto, redes y stack. Diagrama de arquitectura SVG; sin bucle de canvas.
2. **Projects**: seis proyectos existentes, filtros por categoría, vistas conceptuales en CSS/SVG y detalles nativos desplegables.
3. **About**: presentación, filosofía y estadísticas originales.
4. **Experience**: historial profesional con fechas, descripciones y tecnologías.
5. **Services**: servicios existentes en una retícula compacta.
6. **Skills**: tecnologías agrupadas por especialidad.
7. **FAQ**: desplegables nativos `details/summary`, disponibles desde el HTML inicial.
8. **Contact**: email y WhatsApp directos; formulario con etiquetas persistentes, validación asociada a campos, foco al primer error y estados anunciados.
9. **Footer**: redes y enlace para volver al inicio.

Navbar fijo con enlaces principales, idioma y selector nativo de tema. Menú móvil con Escape, devolución de foco al botón y cierre al navegar o pasar a escritorio. El enlace para saltar al contenido apunta al único `main`.

## Convenciones

- Todo texto editorial nuevo se agrega a ambos JSON, bajo `design`.
- Conservar anclas: `home`, `proyectos`, `sobre-mi`, `experiencia`, `servicios`, `habilidades`, `faq`, `contacto`.
- `src/config/sections.ts` controla las secciones y la navegación. WhatsApp flotante está desactivado; sigue disponible en Contact.
- Las vistas de proyectos son **ilustraciones conceptuales**, no capturas de aplicaciones reales.
- Los enlaces de demo/código originales apuntaban a `#` y estaban deshabilitados. La UI muestra información del proyecto y contacto; no ofrece destinos ficticios.
- Se retiró el enlace a `/cv.pdf` porque ese archivo no existe en `public`.
- Reducir movimiento respeta `prefers-reduced-motion`; el contenido no depende de animaciones de entrada al viewport.
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
