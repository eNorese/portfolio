# OPTIMIZATION.md — SEO & AIO del Portfolio de Enzo Norese

> Auditoría del estado actual de **SEO** (Search Engine Optimization) y **AIO** (Artificial Intelligence Optimization / GEO — Generative Engine Optimization) del sitio `https://enorese.dev`.
> Objetivo: que el sitio sea altamente indexable por buscadores y altamente *citable/legible* por motores generativos (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews).
>
> Fecha de auditoría: 2026-06-10 · Stack: Next.js 15 (App Router), React 19, single-page.

---

## 0. TL;DR — Veredicto

El sitio tiene una **base sólida** (metadata rica, JSON-LD `Person`, `llms.txt`, sitemap, robots, SpeedInsights). Está por encima del portfolio promedio.

De los **3 problemas críticos** originales, **2 ya están resueltos**:

1. ✅ **`<html lang>` ahora refleja el idioma real** (`/es` → `lang="es"`, `/en` → `lang="en"`), server-side. *Resuelto.*
2. ✅ **Internacionalización con routing por locale (Opción A).** Existen dos URLs reales e indexables (`/es` y `/en`), cada una en un solo idioma, con `hreflang` (es/en/x-default) y `canonical` por locale. El inglés ya es visible para Google y crawlers de IA. *Resuelto.*
3. 🔴 **No hay imagen Open Graph ni favicon/iconos.** Al compartir el sitio en LinkedIn/X/WhatsApp no aparece preview visual, y no hay identidad en la pestaña del navegador ni en resultados. *Pendiente.*

Con el punto 3 resuelto, el sitio queda redondo en los críticos.

---

## 1. Lo que está BIEN ✅

| Área | Estado | Detalle |
|------|--------|---------|
| **Metadata base** | ✅ Sólido | `title`, `description` keyword-rich, `keywords`, `authors`, `robots`, `canonical` definidos en [layout.tsx](src/app/layout.tsx). |
| **Open Graph (texto)** | ✅ Parcial | `title`, `description`, `type`, `url`, `locale` presentes. Falta solo la imagen. |
| **JSON-LD `Person`** | ✅ Muy bueno | Schema.org bien formado: `jobTitle`, `worksFor`, `address`, `sameAs`, `knowsAbout`. Excelente para AIO. |
| **`llms.txt`** | ✅ Presente | [public/llms.txt](public/llms.txt) bien estructurado (Quién soy / Stack / Experiencia / Contacto). Pocos sitios lo tienen. |
| **`robots.txt`** | ✅ Correcto | `Allow: /` + referencia al sitemap. No bloquea crawlers de IA. |
| **`sitemap.xml`** | ✅ Existe | Válido, aunque mínimo (ver mejoras). |
| **Renderizado SSR** | ✅ Bueno | Los `dynamic()` en [page.tsx](src/app/page.tsx) **no** usan `{ ssr: false }`, así que el contenido (en español) sí se renderiza en el servidor y es crawleable. |
| **Performance** | ✅ Bueno | `@vercel/speed-insights`, `font-display: swap`, `dns-prefetch`/`preconnect`, imports dinámicos, lazy Three.js. |
| **Semántica HTML** | ✅ Bueno | `<main>`, secciones con IDs de ancla, jerarquía clara. |
| **Calidad de contenido** | ✅ Alto | Texto denso en entidades técnicas reales (Azure, serverless, ERP, multi-modelo IA) — ideal para extracción por LLMs. |
| **Paridad ES/EN** | ✅ Mayormente | Las traducciones son paralelas y de alta calidad (con una excepción, ver §4). |

---

## 2. Lo CRÍTICO 🔴 (resolver primero)

### 2.1 Mismatch `lang` ↔ idioma renderizado — ✅ RESUELTO
- **Era:** el layout declaraba `<html lang="en">` mientras el contenido por defecto era `es`.
- **Solución aplicada:** el `lang` se deriva del segmento de ruta `[lang]` en [layout.tsx](src/app/[lang]/layout.tsx) (`/es` → `lang="es"`, `/en` → `lang="en"`), server-side. El [LanguageContext](src/contexts/LanguageContext.tsx) además sincroniza `document.documentElement.lang` tras la navegación de cliente.

### 2.2 i18n → el inglés no existe para SEO/AIO — ✅ RESUELTO (Opción A)
- **Era:** todo el contenido se traducía vía Context en el cliente; el HTML inicial solo contenía el español. El inglés era invisible para Googlebot, GPTBot, ClaudeBot, etc.
- **Solución aplicada (Opción A — routing por locale):**
  - Estructura `app/[lang]/` con `generateStaticParams` para `['es','en']` y `dynamicParams = false` → dos URLs reales e indexables, prerenderizadas como HTML estático (SSG): **`/es`** y **`/en`**, cada una en un solo idioma.
  - `generateMetadata` por locale: `title`/`description` localizados, `metadataBase`, `canonical` por URL, y `alternates.languages` con **`hreflang`** `es` / `en` / `x-default`.
  - [middleware.ts](src/middleware.ts) redirige `/` (y rutas sin locale) al idioma del `Accept-Language` (o `es` por defecto).
  - [sitemap.ts](src/app/sitemap.ts) dinámico con ambas URLs y `xhtml:link` `hreflang`.
  - El toggle de idioma del Navbar ahora **navega** entre `/es` ⇄ `/en` (conservando el hash de sección), en vez de cambiar estado de cliente.
  - *Nota:* esto reemplazó el `SeoContentMirror` (Opción B) que se había aplicado antes; ya no es necesario y fue eliminado.

### 2.3 Sin imagen Open Graph ni iconos
- **Problema:** No existe `og:image`, el `twitter.card` es `summary` (sin imagen grande), y no hay `favicon.ico`, `icon`, `apple-touch-icon` ni `manifest` (confirmado: `src/app/` y `public/` no los contienen).
- **Impacto:** Compartir el sitio en LinkedIn/X/WhatsApp/Slack genera una preview **sin imagen** → mucho menos clickeable. Sin favicon, cero identidad visual en pestañas y resultados.
- **Acción:**
  - Añadir **`app/opengraph-image.tsx`** (Next.js lo genera dinámico, 1200×630) o un PNG estático en `public/`. Referenciarlo en `openGraph.images`.
  - Cambiar `twitter.card` a `summary_large_image` y añadir `twitter.creator: '@enorese'` (la cuenta X existe en social.json).
  - Añadir **`app/icon.png`** / `app/favicon.ico` + `app/apple-icon.png`. La marca "eNorese." (punto indigo) da una identidad obvia para el icono.
  - Añadir **`app/manifest.ts`** (PWA básico: name, theme_color con el accent indigo, icons).

---

## 3. Lo IMPORTANTE 🟡 (alto retorno, esfuerzo medio)

### 3.1 `metadataBase` ausente — ✅ RESUELTO
- Añadido `metadataBase: new URL('https://enorese.dev')` en `generateMetadata` de [layout.tsx](src/app/[lang]/layout.tsx) (necesario además para que los `hreflang` relativos resuelvan a absolutos).

### 3.2 Enriquecer el JSON-LD
El `Person` actual es bueno; para maximizar AIO conviene:
- Añadir `image` (la futura OG/foto), `description`, `nationality` (`{"@type":"Country","name":"Chile"}`), `knowsLanguage: ["es","en"]`.
- Añadir `alumniOf` (formación: Ingeniería en Informática).
- Considerar un grafo con **`WebSite`** + **`ProfilePage`** además de `Person` (`@graph`), para que los motores entiendan que la página *es* el perfil de la persona.
- Las URLs de `sameAs` deberían incluir también la cuenta de **X** (`https://x.com/enorese`), hoy solo están LinkedIn y GitHub.

### 3.3 `sitemap.xml` mínimo — ✅ RESUELTO
- Migrado a [app/sitemap.ts](src/app/sitemap.ts) dinámico: `lastmod` automático y las dos URLs (`/es`, `/en`) con anotaciones `xhtml:link` de `hreflang`. Se eliminó el `public/sitemap.xml` estático.
- *Pendiente menor:* el JSON-LD aún podría enriquecerse parcialmente (`knowsLanguage` ya se añadió; ver 3.2 para el resto).

### 3.4 `viewport` / `themeColor` (Next 15)
- Next.js 15 recomienda exportar `viewport` por separado (`export const viewport: Viewport = { themeColor: ... }`). Hoy no existe. Añadir mejora el theming móvil (barra de direcciones) y silencia advertencias.

### 3.5 Heading semántico verificable
- Confirmar que existe **un solo `<h1>`** (el nombre/título del Hero) y que el resto de secciones usan `<h2>`. Vital para SEO. Revisar que `section_title` de cada sección renderice como `<h2>` real, no como `<div>` estilizado.

---

## 4. Pulido de idiomas (ES / EN) 🟢

La paridad es **alta**, pero hay puntos a corregir:

### 4.1 `bio_2` desbalanceado entre idiomas ⚠️
En [en.json:23](src/i18n/en.json) el `about.bio_2` es **mucho más rico** que en [es.json:23](src/i18n/es.json):
- **EN:** menciona "ERP migration with zero data loss and zero downtime", el "Digital 24/7 Recruiter", el pipeline en cascada multi-modelo (Claude, GPT-4o, Gemini), y "Cyber Day".
- **ES:** genérico ("Con experiencia en sistemas de reclutamiento, migración de ERP e integración de modelos de IA...").

→ **El español pierde las métricas y entidades más potentes** (justo lo que LLMs y reclutadores citan). Como el español es el idioma por defecto e indexado, **esto es el contenido que realmente ve Google hoy.** Igualar la riqueza del ES al del EN (zero data loss/downtime, "Reclutador Digital 24/7", Cyber Day) es de **alto impacto** y bajo esfuerzo.

### 4.2 `humans.txt` desactualizado
[public/humans.txt](public/humans.txt) dice `Technology: React, TypeScript, Vite, Vercel`. El proyecto ya **no usa Vite** (migró a Next.js 15). Corregir a `Next.js, React, TypeScript, Tailwind, Vercel`.

### 4.3 Placeholders del formulario
Los placeholders en `es.json` siguen en inglés (`"John Doe"`, `"john@example.com"`). Menor, pero para coherencia localizar a `"Juan Pérez"` / `"juan@ejemplo.com"`.

### 4.4 Consistencia de `locale` OG
`openGraph.locale` es `es_CL`. Correcto para el default español — pero al introducir EN, añadir `openGraph.alternateLocale: ['en_US']`.

---

## 5. AIO — Optimización para motores de IA 🤖

El sitio ya parte bien (JSON-LD + llms.txt + contenido denso). Para llevarlo a "potente":

### 5.1 `llms.txt` — ampliar
- Hoy está **solo en español**. Añadir una sección en inglés o un `llms.txt` que cubra ambos, ya que muchos LLMs operan en inglés.
- Considerar un **`llms-full.txt`** con el contenido completo (bio extendida, los 6 proyectos, las 3 experiencias) para que los modelos tengan la versión larga sin depender del render.
- Enlazar secciones con URLs ancladas (`https://enorese.dev/#proyectos`, etc.) siguiendo mejor la spec de llms.txt (lista de links con descripción).

### 5.2 Crawlers de IA explícitos en `robots.txt`
- Hoy `User-agent: *  Allow: /` ya los permite implícitamente — **bien si quieres ser citado**. Para hacerlo explícito y a prueba de futuro, listar `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot` con `Allow: /`.
- (Decisión consciente: permitirlos = más probabilidad de ser citado/recomendado por IA. Para un portfolio que busca visibilidad, **conviene permitirlos**.)

### 5.3 Contenido estilo Q&A / FAQ
- Los motores generativos citan mejor el contenido que responde preguntas directas ("¿Qué hace Enzo Norese?", "¿En qué se especializa?"). Considerar añadir un bloque **FAQ con `FAQPage` JSON-LD** (aunque sea oculto/secundario) con 3-4 preguntas-respuesta. Muy alto retorno para AIO y para Google "People Also Ask".

### 5.4 Exponer ambos idiomas (cruce con 2.2)
- Igual que para Google, los crawlers de IA solo ven el HTML inicial → solo el español. Resolver §2.2 también potencia el AIO en inglés.

---

## 6. Plan de acción priorizado

### 🔴 Sprint 1 — Críticos (máximo impacto)
1. ✅ ~~Corregir `<html lang>` para reflejar el idioma real.~~ *Hecho (routing por locale).*
2. ✅ ~~Añadir `metadataBase`.~~ *Hecho.*
3. Crear `app/opengraph-image.tsx` + cambiar `twitter.card` a `summary_large_image` + `twitter.creator`.
4. Añadir `app/icon`, `apple-icon`, `favicon` y `app/manifest.ts`.
5. **Igualar `about.bio_2` en español** a la riqueza del inglés (§4.1).

### 🟡 Sprint 2 — Internacionalización real
6. ✅ ~~Estrategia i18n (Opción A, `app/[lang]`) con `hreflang`.~~ *Hecho.*
7. ✅ ~~Migrar `sitemap.xml` → `app/sitemap.ts` con ambas URLs + `hreflang`.~~ *Hecho.*

### 🟢 Sprint 3 — Pulido y AIO avanzado
8. Enriquecer JSON-LD (`@graph` con `WebSite`+`ProfilePage`, `image`, `knowsLanguage`, `sameAs` con X).
9. Añadir `viewport`/`themeColor`.
10. Ampliar `llms.txt` (bilingüe / `llms-full.txt`) y robots con crawlers de IA explícitos.
11. Añadir bloque FAQ + `FAQPage` JSON-LD.
12. Corregir `humans.txt` (Vite → Next.js) y localizar placeholders del formulario.
13. Verificar jerarquía `<h1>`/`<h2>` única y semántica.

---

## 7. Checklist rápido

```
SEO Técnico
[x] <html lang> coincide con idioma renderizado
[x] metadataBase definido
[ ] og:image (1200×630) presente
[ ] twitter:card = summary_large_image + creator
[ ] favicon / icon / apple-icon / manifest
[x] hreflang para ES y EN
[x] sitemap dinámico con ambas URLs
[ ] un solo <h1>, secciones en <h2>
[ ] viewport/themeColor export

i18n / Contenido
[x] inglés presente en HTML inicial (URLs /es y /en indexables)
[ ] about.bio_2 ES igualado a EN
[ ] humans.txt actualizado (Next.js)
[ ] placeholders de formulario localizados

AIO
[ ] JSON-LD enriquecido (@graph, knowsLanguage, sameAs completo)
[ ] llms.txt bilingüe / llms-full.txt
[ ] crawlers de IA explícitos en robots.txt
[ ] bloque FAQ + FAQPage schema
```

---

*Documento generado como auditoría inicial. Cada ítem es accionable de forma independiente; el orden por sprints maximiza impacto/esfuerzo.*
