# VISUAL_IMPROVE.md — Propuestas de mejora visual del Portfolio

> Auditoría de **diseño visual y experiencia (UI/motion)** del sitio `https://enorese.dev`.
> Complementa a [OPTIMIZATION.md](OPTIMIZATION.md) (SEO/AIO) e [IMPROVE.md](IMPROVE.md) (performance/seguridad).
> Aquí el foco es estética, jerarquía, personalidad de marca y micro-interacciones — para que el sitio se sienta tan sólido como el trabajo que muestra.
>
> Fecha: 2026-06-10 · Stack visual: Tailwind 3, CSS vars multi-tema, canvas 2D, View Transitions.

---

## 0. TL;DR — Veredicto

El sitio ya tiene un **lenguaje visual fuerte y coherente**: dark-first premium, accent indigo, Hero con code-rain + estrellas + spotlight, timeline animado, cards con tilt 3D, 5 temas, transiciones suaves. Está claramente por encima del portfolio promedio.

Para subir de "muy bueno" a "memorable", los focos son:

1. 🎯 **Personalidad tipográfica.** Todo usa Inter. Una fuente *display* para titulares + una *mono* real para los detalles de código daría carácter inmediato.
2. 🎯 **Profundidad del fondo.** El `gray-950` es plano y los glows grandes pueden mostrar *banding*. Falta grano/vignette/gradiente sutil que dé textura premium.
3. 🎯 **Consistencia de motion.** Solo Experience tiene reveal-on-scroll; About/Skills/Projects/Contact aparecen de golpe. Unificar entradas escalonadas da cohesión.
4. 🎯 **Humanizar y rematar.** Cero imágenes reales (foto, thumbnails de proyectos) y un Footer casi vacío. Falta cierre y cercanía.

Ninguno es un problema — son oportunidades de pulido de alto retorno.

---

## 1. Lo que ya está MUY BIEN ✅

| Elemento | Por qué funciona |
|----------|------------------|
| **Hero generativo** | Code-rain + estrellas + shooting stars + spotlight de cursor + luces laterales "breathing" → identidad propia, no plantilla. |
| **Sistema de 5 temas** | `--accent` como `R G B` permite opacidades; overrides de fondo para forest/ocean/midnight bien resueltos ([globals.css](src/app/globals.css)). |
| **Timeline de Experience** | Línea con relleno y "cometa" guiados por scroll → detalle deluxe. |
| **Project cards** | Tilt 3D con glare radial siguiendo el cursor → tactiles y vivas. |
| **Transiciones** | View Transitions API para tema e idioma con fallback a fade/blur. Muy cuidado. |
| **Detalles finos** | Scrollbar custom, `scroll-margin-top` para anclas, gradientes de fundido entre secciones, contador animado en success stories. |

La base es sólida; lo de abajo es refinamiento, no reconstrucción.

---

## 2. ALTO impacto 🎯

### 2.1 Jerarquía tipográfica con carácter
Hoy **todo** es Inter (`--font-inter`). Funcional pero genérico.
- **Display para titulares:** una grotesk geométrica como **Space Grotesk**, **Sora**, **Clash Display** o **Geist** para el `<h1>` del Hero y los `<h2>` de sección. Da firma visual instantánea.
- **Mono real para detalles:** las "eyebrows" (`01 —`, `font-mono`) y los tags usan el mono por defecto del sistema. Cambiar a **JetBrains Mono** / **Geist Mono** / **Fira Code** refuerza el relato "backend/código".
- **Tipografía fluida:** sustituir los saltos `text-5xl sm:text-6xl lg:text-7xl` por `clamp()` (p.ej. `font-size: clamp(2.5rem, 6vw, 5rem)`) → escalado continuo sin saltos bruscos entre breakpoints.
- Ajustar `letter-spacing`/`line-height` en titulares grandes (un pelín más ceñido).

### 2.2 Profundidad y textura del fondo
El fondo dark es un color plano; los glows radiales grandes tienden a mostrar *banding*.
- **Grano sutil:** overlay de ruido (SVG `feTurbulence` o PNG tileado) a ~3-5% de opacidad → look cinematográfico y mata el banding.
- **Vignette:** `radial-gradient` muy leve oscureciendo bordes para enfocar el centro.
- **Gradiente de base:** en vez de `bg-gray-950` liso, un `radial`/`conic` casi imperceptible (gray-950 → un pelo más azulado hacia el centro).
- **Mesh gradient** suave indigo/violeta detrás del Hero, por debajo del canvas.

### 2.3 Color de marca: segundo accent y gradientes
El canvas ya mezcla indigo (`96,165,250`) y violeta (`167,139,250`), pero el resto del sitio usa un solo `--accent`.
- Definir **`--accent-2`** por tema y usar `linear-gradient` accent→accent-2 en: el nombre del Hero (texto con `background-clip: text`), los números de sección, los bordes de hover de cards.
- **Texto con gradiente** en el `<h1>` (o solo en el apellido) eleva muchísimo el primer impacto.
- Un **gradiente animado** lento en el nombre (en vez de solo glow en hover) lo vuelve un foco vivo.

### 2.4 Sistema unificado de reveal-on-scroll
Solo Experience revela al hacer scroll (`useReveal` con IntersectionObserver). About, Skills, Projects y Contact se renderizan estáticos.
- Extraer `useReveal` a un hook compartido (`src/hooks/useReveal.ts`) y aplicarlo a **todas** las secciones: header fade-up + cards en stagger (delay incremental).
- Da ritmo narrativo y sensación de producto cuidado.
- ⚠️ **Cruzar con [IMPROVE.md §3.1](IMPROVE.md):** respetar `prefers-reduced-motion` (versión estática) — accesibilidad + performance.

### 2.5 Humanizar: foto + imágenes
El sitio es 100% texto + canvas. Falta presencia.
- **Foto de Enzo** (Hero o About) con marco/halo accent y `next/image`. Humaniza, genera confianza, y de paso alimenta el `image` del JSON-LD y la OG image (cierra §2.3/§3.2 de OPTIMIZATION).
- **Thumbnails/mockups de proyectos:** hoy las project cards son solo texto y **todos los links están deshabilitados** (`liveDisabled`/`codeDisabled`). Un preview (captura, mockup o gradiente generativo por proyecto) las hace mucho más creíbles. Si no hay demo, un badge "Próximamente" / "Privado" es más honesto y elegante que un link apagado.

---

## 3. MEDIO impacto 🎬

### 3.1 Re-activar Success Stories (ya están construidas)
`portfolioSections.successStories` está en `false` ([sections.ts](src/config/sections.ts)), pero el componente `StoryCard` con **contador animado** ya existe y luce bien ([Skills.tsx](src/components/Skills.tsx)). Las métricas (3+ modelos IA, 5+ servicios Azure…) son justo lo que un reclutador escanea. Re-activarlas es ganancia visual + contenido gratis.

### 3.2 Skills con logos en vez de texto plano
Los badges de skills son texto. En About ya tienes **SVGs de marca** (Azure, TypeScript…). Reutilizar logos en la grilla de skills (o al hacer hover) sube el nivel percibido y rompe la monotonía de "pills" grises.

### 3.3 Cards: bordes y superficies más ricas
- **Borde con gradiente** en hover (técnica `mask` o `border-image` con accent→accent-2) en vez de solo `border-accent/30`.
- **Inner highlight** (un `inset` blanco a 1px y baja opacidad arriba) da el look "glass" premium consistente.
- Extender una versión **sutil** del tilt 3D de Projects a las stat-cards de About y a las category-cards de Skills (con menos intensidad).

### 3.4 Editorial: numerales fantasma
Los `01 —` … `05 —` son finos. Probar además un **numeral gigante semi-transparente** detrás de cada header de sección (estilo revista) → estructura visual y personalidad sin ruido.

### 3.5 Hero: jerarquía de CTAs y scroll cue
- Asegurar **contraste claro entre CTA primario (relleno accent) y secundario (ghost/outline)** — que no compitan.
- Pulir el indicador de scroll (`scroll-bob` ya existe): un mouse-outline animado o una línea que "respira" hacia abajo.
- **Botones magnéticos** (leve atracción al cursor) en los CTAs → micro-deleite.

### 3.6 Footer con cierre real
[Footer.tsx](src/components/Footer.tsx) es solo copyright. Un buen footer cierra la experiencia:
- Repetir nav + social links + email, un **"back to top"**, y una línea "Diseñado y construido por Enzo Norese · Next.js".
- Opcional: el wordmark "eNorese." grande y tenue como marca de agua.

---

## 4. BAJO impacto / pulido fino ✨

- **`::selection` temático:** hoy es el del navegador. `::selection { background: rgb(var(--accent) / 0.3); }` → coherencia de marca al seleccionar texto.
- **`:focus-visible` con ring accent** en todos los interactivos (links, botones, inputs) → accesibilidad de teclado + se ve intencional. Hoy varios `outline-none` sin reemplazo claro.
- **Estados de carga (skeletons)** para las secciones con `dynamic()` → evita saltos de layout al hidratar.
- **Radio de bordes consistente:** conviven `rounded-md/lg/xl/full`; definir una escala y aplicarla.
- **Consistencia del tema light:** los sitios dark-first suelen descuidar el claro. Verificar que glows, sombras de cards y contraste de texto se sostienen en `light`, `forest`, `ocean`.
- **Línea de acento en el Navbar al hacer scroll** (un hairline gradiente accent) además del blur actual.
- **WhatsApp flotante:** el `whatsapp-pulse` es llamativo; revisar que no compita con los CTAs en móvil (quizá pulse solo 1-2 veces y luego se calme).
- **Cursor personalizado** sutil en el Hero (dot que sigue al mouse) — combina con el spotlight ya existente.

---

## 5. Plan priorizado

### 🎯 Tier 1 — Mayor retorno visual
1. Tipografía: fuente *display* para titulares + *mono* para detalles (§2.1).
2. Texto con gradiente en el nombre del Hero + `--accent-2` (§2.3).
3. Grano + vignette + gradiente de fondo (§2.2).
4. Reveal-on-scroll unificado con `prefers-reduced-motion` (§2.4).

### 🎬 Tier 2 — Contenido y cohesión
5. Foto de Enzo + thumbnails/badges de proyectos (§2.5).
6. Re-activar Success Stories (§3.1) y logos en Skills (§3.2).
7. Bordes/superficies de cards más ricos (§3.3).
8. Footer expandido (§3.6).

### ✨ Tier 3 — Pulido fino
9. `::selection` + `:focus-visible` temáticos (§4).
10. Numerales fantasma (§3.4), CTAs magnéticos y scroll cue (§3.5).
11. Skeletons, escala de radios, QA de temas claros (§4).

---

## 6. Checklist rápido

```
Tipografía
[ ] Fuente display para h1/h2
[ ] Mono real para eyebrows y tags
[ ] Tipografía fluida con clamp()

Color & fondo
[ ] --accent-2 + gradientes de marca
[ ] Nombre del Hero con texto gradiente
[ ] Grano + vignette + gradiente de base

Motion
[ ] useReveal unificado en todas las secciones
[ ] Entradas en stagger
[ ] prefers-reduced-motion respetado

Contenido visual
[ ] Foto de Enzo (Hero/About)
[ ] Thumbnails o badges en proyectos
[ ] Success Stories re-activadas
[ ] Logos en grilla de Skills
[ ] Footer expandido (nav + social + back-to-top)

Pulido
[ ] ::selection temático
[ ] :focus-visible con ring accent
[ ] Skeletons en secciones dynamic()
[ ] Escala de border-radius consistente
[ ] QA visual de temas light/forest/ocean
```

---

*Auditoría visual inicial. Cada ítem es independiente; los Tiers ordenan por impacto percibido sobre esfuerzo. Cruzar el motion con [IMPROVE.md](IMPROVE.md) (reduced-motion) y las imágenes con [OPTIMIZATION.md](OPTIMIZATION.md) (OG image / JSON-LD).*
