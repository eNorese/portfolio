# DINAMISMO_Y_CONTENIDO.md — Cómo darle movimiento al portfolio (sin romper lo que funciona)

> Respuesta concreta a la intuición *"el sitio se siente demasiado estático y con el tiempo se queda congelado"*.
> Define **qué construir para que el sitio esté vivo**, en qué orden, y **cuándo (y cuándo NO) hace falta una base de datos**.
> Pieza hermana de [ESTRATEGIA_LATAM.md](ESTRATEGIA_LATAM.md). Cataloga y prioriza ideas de [WEB_IMPROVE.md](WEB_IMPROVE.md) bajo el criterio del usuario: **fácil, rápido y seguro**.
>
> Fecha: 2026-08-01 · Stack: Next.js 15, React 19, Vercel, Resend.

---

## 0. TL;DR — Tres tipos de "movimiento" (no los confundas)

Cuando dices "el sitio se siente congelado", en realidad hay **tres cosas distintas**, y cada una se resuelve diferente:

| Tipo de movimiento | Qué es | Herramienta | ¿Necesita DB? |
|--------------------|--------|-------------|:-------------:|
| **1. Frescura de contenido** | El sitio cambia porque *hay algo nuevo* (posts, notas, changelog). Es lo que Google y los visitantes recurrentes premian. | **Blog MDX** + `/now` + `/changelog` | ❌ No |
| **2. Movimiento visual** | La página *se mueve* (animaciones, transiciones, micro-interacciones). Percepción de "vivo" al entrar. | CSS/Canvas + `prefers-reduced-motion` | ❌ No |
| **3. Interacción con estado** | Los visitantes *dejan huella* (comentarios, likes, presencia en vivo, ranking). Movimiento "social". | DB / KV / real-time | ✅ Sí |

**La trampa a evitar:** creer que "darle vida" = base de datos. **No.** El 90 % de la sensación de sitio-vivo viene de los tipos 1 y 2, que **no necesitan DB y no añaden superficie de ataque**. La DB (tipo 3) es potente pero es la última capa, no la primera — y solo si vas a mantenerla.

> **Recomendación central:** empieza por **contenido fresco (blog)** + **movimiento visual pulido**. Deja la DB para cuando tengas una razón concreta y hayas cerrado la seguridad del formulario ([IMPROVE.md §2.1](IMPROVE.md)).

---

## 1. Movimiento visual — que se sienta vivo al entrar (rápido, sin DB)

El Hero ya tiene canvas generativo (code-rain, estrellas). El problema no es falta de animación, es que **el resto del sitio es estático por comparación** y que las animaciones no respetan accesibilidad ni batería.

- **Micro-interacciones en scroll:** revelar secciones con fade/translate al entrar en viewport (`IntersectionObserver` + CSS). Barato, elegante, alto retorno percibido.
- **Hover states con intención:** cards de proyectos/skills que responden (elevación, glow del `--accent`, borde animado). Ya tienes el sistema de temas con `--accent`; explótalo.
- **Transiciones entre secciones/idioma:** el sitio ya usa View Transitions en `globals.css`; extenderlas al cambio `/es ⇄ /en` y al scroll de anclas.
- **Cuenta las estadísticas:** los números de About (6+ años, 40+ proyectos) animados con count-up al entrar en viewport.
- **⚠️ Accesibilidad y batería (pendiente de [IMPROVE.md §3.1](IMPROVE.md)):** respetar `prefers-reduced-motion` y pausar los loops `requestAnimationFrame` fuera de viewport / pestaña oculta. Esto es **movimiento *y* performance *y* accesibilidad** a la vez. Hazlo junto con lo de arriba.

**Costo:** 1 día. **Riesgo:** nulo. **DB:** no.

---

## 2. Frescura de contenido — el BLOG (la apuesta central) 📝

Este es **el feature más importante de todo el plan**, porque resuelve *simultáneamente*:
- **"Que no se sienta congelado"** → hay contenido nuevo cada semana/mes.
- **"Llegar a LatAm"** ([ESTRATEGIA_LATAM.md](ESTRATEGIA_LATAM.md) Fase 1) → cada post es una página nueva indexable en español apuntando a una query real de LatAm.
- **Tu marca "Augmented Engineering"** → demuestras criterio técnico, no solo lo declaras.

### 2.1 Por qué MDX y no una DB para el blog
- **Sin DB, sin endpoint público, cero superficie de ataque nueva.** Los posts son archivos `.mdx` en el repo, versionados en git.
- **Rápido y estático:** se prerenderizan como HTML (SSG), igual que tus `/es` y `/en` actuales → LCP excelente, coste de infra cero.
- **Encaja con tu i18n:** un post vive en `/es/blog/[slug]` y `/en/blog/[slug]`, reutilizando el routing por locale que ya tienes.

### 2.2 Arquitectura propuesta
```
src/app/[lang]/blog/
├── page.tsx              # Índice: lista de posts del locale, tags, fecha
└── [slug]/
    ├── page.tsx          # Render del post + TOC + reading time
    └── opengraph-image.tsx  # OG dinámica por post (título + tag sobre tu marca)
content/blog/
├── es/
│   ├── validar-rut-typescript.mdx
│   └── azure-functions-serverless-pymes.mdx
└── en/
    └── ...
```
- **Librería:** `@next/mdx` (nativo, mínimo) o **Contentlayer** si quieres frontmatter tipado. Para empezar, `@next/mdx` + `gray-matter` basta.
- **Frontmatter por post:** `title`, `description`, `date`, `tags`, `lang`, `slug`, `readingTime` (calculado).
- **Componentes:** code blocks con resaltado (`rehype-pretty-code` / Shiki), `<TOC>`, tarjeta de autor, "posts relacionados".

### 2.3 Lo que lo hace un motor de descubrimiento (no "un blog más")
- **Integración automática con [`sitemap.ts`](src/app/sitemap.ts):** cada post `.mdx` se añade al sitemap con sus `hreflang`. Modifica el sitemap para iterar sobre los slugs.
- **OG dinámica por post** (`opengraph-image.tsx`): imagen social generada con `next/og` (título del post + tu branding). Esto multiplica el CTR al compartir en LinkedIn/X/WhatsApp — clave para difusión en LatAm.
- **RSS/Atom** en `/feed.xml` (route handler) → suscriptores y agregadores.
- **Alimenta el AIO:** añade los posts a [`llms.txt`](public/llms.txt) / `llms-full.txt` → citables por ChatGPT/Perplexity/Claude en español.
- **Toque de marca:** botón "TL;DR con IA" que resume el post (coherente con Augmented Engineering; ver §3 sobre cuándo esto sí toca API).

### 2.4 Temas de arranque (SEO LatAm de cola larga)
Escribe para lo que un dev/cliente hispanohablante busca en Google — **estos títulos son imanes de tráfico LatAm**:
- *"Cómo validar RUT chileno en TypeScript (con tests)"* — reutiliza tu librería real.
- *"Migrar un ERP sin downtime: la estrategia Softland → Rex+"* — tu case study estrella.
- *"Azure Functions serverless para pymes: cuándo conviene y cuánto cuesta"*.
- *"Pipeline multi-modelo (Claude + GPT + Gemini) en cascada: cómo y por qué"*.
- *"Reclutador Digital 24/7: arquitectura para decenas de miles de postulaciones en Cyber Day"*.

Cada uno es contenido que **solo tú puedes escribir** (experiencia real) → difícil de copiar, alto valor para Google e IA.

**Costo:** 2-4 días la infraestructura + escribir. **Riesgo:** bajo. **DB:** no.

---

## 3. "Señales de vida" de bajo costo (sin DB)

Complementos que hacen sentir el sitio activo con poquísimo esfuerzo:

- **`/now` page** (estilo Derek Sivers): qué estás aprendiendo (AZ-204), construyendo, leyendo. Un archivo que actualizas de vez en cuando → señal de actividad y autenticidad. Bilingüe.
- **`/changelog` del sitio:** trata el portfolio como producto, con release notes ("v2.1 — blog en español", "v2.2 — /now"). Muy developer, y da otra página indexable.
- **GitHub reciente (cacheado):** último commit / lenguaje / streak vía API pública de GitHub, cacheado en build o con `revalidate`. Se siente vivo, sin DB (es *lectura* de una API externa, no estado propio).
- **"TL;DR con IA" del blog / contacto inteligente:** *esto sí toca la API de Claude*, pero **no una base de datos**. Es un route handler `/api/*` con rate-limit y presupuesto tope. Trátalo con el mismo blindaje que el formulario ([Fase 2](ESTRATEGIA_LATAM.md)) porque es un endpoint público que cuesta dinero.

---

## 4. Cuándo SÍ vale una base de datos (tipo 3) — marco de decisión

No añadas DB "para tener DB". Añádela cuando la respuesta a **las tres** sea sí:

1. **¿Requiere estado persistente compartido entre visitantes?** (comentarios, likes, ranking, presencia). Si es solo *tu* contenido → es blog/MDX, no DB.
2. **¿Lo vas a mantener?** Una feature social muerta (guestbook vacío, chat sin uso) resta más de lo que suma.
3. **¿Ya cerraste la seguridad del formulario ([IMPROVE.md §2.1](IMPROVE.md))?** Cada endpoint con escritura a DB es superficie nueva; primero blinda lo que ya existe.

### 4.1 Opciones de datos según necesidad (todas serverless-friendly en Vercel)
| Necesidad | Solución recomendada | Por qué |
|-----------|----------------------|---------|
| Contadores, rate-limit, cache, presencia efímera | **Upstash Redis / Vercel KV** | Edge-friendly, gratis para empezar, TTL nativo. Ya recomendado para rate-limiting. |
| Datos relacionales (comentarios, guestbook con OAuth) | **Vercel Postgres / Neon / Supabase** | SQL serverless; Supabase suma Auth y realtime. |
| Real-time (presencia, cursores, reacciones) | **Azure SignalR** ⭐ | *Es tu skill declarado* → usarlo en tu propio sitio es show-don't-tell puro ([WEB_IMPROVE.md §9](WEB_IMPROVE.md)). |

### 4.2 Candidatos ordenados (si decides entrar a tipo 3)
1. **Leaderboard del cubo Rubik** (KV) — el easter egg ya tiene cronómetro; persistir tiempos = retención + demo de backend. Bajo riesgo, alto encanto.
2. **Presencia en vivo con SignalR** ("👁️ N viendo ahora") — demuestra tu skill estrella en tiempo real. Diferenciador brutal.
3. **Guestbook / comentarios** (Postgres + OAuth GitHub, o `giscus` sobre GitHub Discussions —**este último sin DB propia**). Para el blog, **empieza con giscus**: comentarios reales, cero DB, cero mantenimiento de auth.

> **Atajo inteligente:** para comentarios del blog, **giscus** (usa GitHub Discussions como backend) te da interacción social **sin base de datos propia ni superficie de escritura nueva**. Es el mejor "tipo 3 sin costos de tipo 3".

---

## 5. Ruta recomendada (encaja con el roadmap de ESTRATEGIA_LATAM.md)

```
Semana 1  → Fase 0 de ESTRATEGIA_LATAM (config LatAm) + movimiento visual (§1)
             · Sitio se declara hispanohablante y se siente más vivo al entrar.
Semana 2-3 → Blog MDX ES-led (§2) con RSS + OG dinámica + sitemap/llms
             · Motor de descubrimiento LatAm + frescura de contenido. SIN DB.
Semana 3   → /now + /changelog + GitHub reciente (§3)     [en paralelo]
Semana 4   → Blindar formulario (IMPROVE.md Sprint 1)     ← prerequisito de §6
Después    → Solo si lo vas a mantener: giscus en blog → leaderboard cubo →
             presencia SignalR (§4). Nunca antes de cerrar la seguridad.
```

---

## 6. Regla de oro (para no volver a "congelarse")

> **Movimiento sostenible = un ritmo de publicación, no una feature de una vez.**
> Un blog con 2 posts abandonado se siente *más* muerto que un sitio estático honesto. La verdadera cura contra "congelado" no es la tecnología: es **comprometerte a 1 post en español al mes**. La infraestructura de §2 solo sirve para que ese compromiso sea fácil y de bajo esfuerzo. Elige la cadencia que puedas sostener y deja que el blog —no la base de datos— sea el latido del sitio.

---

## 7. Checklist

```
Movimiento visual (sin DB) — §1
[ ] Reveal on scroll (IntersectionObserver + CSS)
[ ] Hover states con --accent en cards
[ ] Count-up de estadísticas en About
[ ] prefers-reduced-motion + pausa RAF fuera de viewport (IMPROVE.md §3.1)

Contenido fresco (sin DB) — §2, §3   ← PRIORIDAD
[ ] Blog MDX bilingüe (ES-led): [lang]/blog + [slug]
[ ] Frontmatter + reading time + TOC + code highlight
[ ] OG dinámica por post (next/og)
[ ] RSS /feed.xml
[ ] Integrar posts en sitemap.ts + llms.txt
[ ] 3-5 posts semilla con temas LatAm de cola larga
[ ] /now page bilingüe
[ ] /changelog del sitio
[ ] GitHub reciente cacheado

Seguridad (prerequisito de tipo 3) — Fase 2
[ ] Blindar formulario (honeypot → Turnstile → rate limit)

Interacción con estado (con DB / servicio) — §4  ← solo si se mantendrá
[ ] Comentarios blog con giscus (sin DB propia)  ← primero
[ ] Leaderboard cubo Rubik (KV)
[ ] Presencia en vivo (Azure SignalR — tu skill)
```

---

*Prioriza contenido fresco y movimiento visual (sin DB, sin nuevo riesgo) antes que cualquier feature con base de datos. La DB no es lo que hace vivo a un sitio; el ritmo de publicación sí. Ver el roadmap integrado y las palancas de reenfoque LatAm en [ESTRATEGIA_LATAM.md](ESTRATEGIA_LATAM.md).*
