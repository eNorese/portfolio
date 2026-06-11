# WEB_IMPROVE.md — Mejoras y extensiones del sitio

> Propuestas de **nuevas secciones, features y extensiones** para `https://enorese.dev`.
> Complementa a [OPTIMIZATION.md](OPTIMIZATION.md) (SEO/AIO), [IMPROVE.md](IMPROVE.md) (performance/seguridad) y [VISUAL_IMPROVE.md](VISUAL_IMPROVE.md) (UI/motion).
> Aquí el foco es **qué construir** para que el portfolio deje de "describir" lo que Enzo sabe y empiece a **demostrarlo en vivo** — diferenciándose de la masa de portfolios.
>
> Fecha: 2026-06-10 · Perfil: Backend Developer & Cloud Architect · Filosofía: *Augmented Engineering*.

---

## 0. TL;DR — La gran idea

La mayoría de los portfolios **cuentan**. El de un *Backend & Cloud Architect que integra IA* debería **mostrar**. El sitio ya tiene chispa (easter egg del cubo Rubik, multi-tema, i18n, canvas generativo), pero el contenido sigue siendo estático: tarjetas con tags.

**North Star:** convertir el portfolio en una **prueba viva de sus skills**. Cuatro features lo logran y casi nadie las tiene juntas:

1. 🤖 **"Pregúntale a mi portfolio"** — un chat con IA (Claude, que él ya integra) que responde sobre su experiencia con RAG y citas. *Demuestra exactamente lo que vende.*
2. 🏗️ **Arquitecturas interactivas** — diagramas navegables de sus sistemas reales (Reclutador 24/7, migración ERP) en vez de párrafos.
3. ⌨️ **Modo terminal / command palette (⌘K)** — navegar el sitio escribiendo comandos. On-brand para alguien de backend/CLI.
4. 📊 **Status page de sus propios proyectos** — health checks y latencias reales. Un backend dev mostrando observabilidad de verdad.

Más abajo, las secciones "clásicas" pedidas (blog, cursos) bien resueltas, y un catálogo de ideas ingeniosas ordenadas por impacto/esfuerzo.

---

## 1. Secciones de contenido "clásicas" (pedidas) — pero bien hechas

### 1.1 Blog / "Notas de Ingeniería" 📝
No "un blog más": **build logs y notas técnicas** sobre lo que construye (serverless en Azure, pipelines multi-modelo, validación de RUT, query builders seguros…).
- **Stack:** MDX (`@next/mdx` o Contentlayer) → posts versionados en el repo, con code blocks resaltados, *reading time*, tags, índice (TOC).
- **Bilingüe** (encaja con el routing `/es` `/en` ya implementado) y con **RSS/Atom** + **`/feed`**.
- **Diferenciador AIO:** cada post se añade automáticamente al `sitemap`, genera **OG image dinámica** (`opengraph-image.tsx` por slug) y se expone en `llms.txt`/`llms-full.txt` → citable por buscadores e IA.
- **Toque propio:** botón **"TL;DR con IA"** que resume el post en 3 líneas (coherente con *Augmented Engineering*).

### 1.2 Cursos / "Academia" 🎓
Tiene sentido real: trabaja en **TeamWork Capacitación** y hace certificaciones Azure (AZ-900/AZ-204).
- Catálogo de **cursos/talleres** (p.ej. "Azure Serverless desde cero", "Autenticación con OAuth 2.0/OIDC").
- Ficha por curso: temario, nivel, duración, formato; CTA a lista de espera o pago.
- **Reutiliza su proyecto "Azure Path"** (app de estudio para certificaciones Azure que ya construyó) embebido como demo o como primer curso.
- Estados: "Disponible" / "En preparación" / "Lista de espera" (captura leads vía el form/Resend ya integrado).

### 1.3 Newsletter "Augmented Engineering" ✉️
- Captura de email (reutiliza Resend) → boletín sobre IA aplicada a ingeniería.
- Posiciona su marca personal y construye audiencia. Doble opt-in + honeypot/captcha (ver [IMPROVE.md §2.1](IMPROVE.md)).

---

## 2. Features signature (los grandes diferenciadores) 🚀

### 2.1 🤖 "Pregúntale a mi portfolio" (Enzo-GPT)
**Qué:** un widget de chat que responde preguntas sobre Enzo ("¿tiene experiencia con Azure Service Bus?", "¿qué hizo en la migración ERP?") con **RAG** sobre su CV, proyectos y experiencia, devolviendo respuestas **con citas** a la sección correspondiente.
**Por qué diferencia:** es backend + cloud + integración de IA en un solo gesto — *demuestra el skill exacto que vende*, y encarna *Augmented Engineering*. Un recruiter lo recuerda.
**Cómo:** API route en Next (`/api/chat`) → Claude (Anthropic SDK) con el contenido de `llms-full.txt` como contexto (con **prompt caching** para abaratar). Embeddings opcionales si crece el corpus. Streaming de respuesta.
**Extra:** registrar (anónimo) las preguntas frecuentes → insight de qué buscan los visitantes.

### 2.2 🏗️ Arquitecturas interactivas
**Qué:** en vez de describir el "Reclutador Digital 24/7" o la migración Softland→Rex+ en un párrafo, un **diagrama animado y navegable** (nodos: Azure Functions, Service Bus, SignalR, CosmosDB, Blob…) que se puede explorar; al hacer clic en un nodo, se explica su rol y las decisiones de diseño.
**Por qué diferencia:** muestra **pensamiento arquitectónico** visualmente — justo lo que un rol senior evalúa.
**Cómo:** **React Flow** (`@xyflow/react`) o SVG animado. Encaja con la estética de canvas/glow ya presente.

### 2.3 ⌨️ Modo terminal / Command Palette (⌘K)
**Qué:** un *command palette* (estilo Raycast/Vercel) que abre con `⌘K`/`Ctrl K` para navegar escribiendo: `cd proyectos`, `cat about`, `whoami`, `theme ocean`, `contact`, `download cv`. Opcional: un **modo terminal completo** como "vista alternativa" del portfolio.
**Por qué diferencia:** profundamente *on-brand* para alguien de backend/CLI; es deleite + utilidad + personalidad.
**Cómo:** `cmdk` (la lib de command palette). Bajo costo, alto "wow".

### 2.4 📊 Status page de sus proyectos ("uptime")
**Qué:** una página `/status` con **health checks reales** de sus demos/APIs desplegadas (ping a Azure Functions, latencia, región, cold-start), estilo statuspage.
**Por qué diferencia:** un backend engineer **mostrando observabilidad real**, no afirmándola. Credibilidad instantánea.
**Cómo:** cron de Vercel o Azure que cachea resultados; UI con histórico simple (Vercel KV/Upstash).

### 2.5 🧪 Playground multi-modelo en vivo (EuforIA embebido)
**Qué:** ya construyó **EuforIA** (chat que compara Claude vs GPT-4o vs Gemini). Embeberlo como **demo interactiva**: el visitante escribe un prompt y ve las respuestas lado a lado + costo/latencia por modelo.
**Por qué diferencia:** convierte un "proyecto en una tarjeta" en una **experiencia jugable** que prueba su pipeline en cascada real.
**Cómo:** reusar EuforIA tras un rate-limit y presupuesto tope (proteger la cuota de API).

---

## 3. "Show, don't tell" — features que flexean backend 💪

| Idea | Qué demuestra | Cómo |
|------|---------------|------|
| **Portfolio como API** (`api.enorese.dev`) | Diseño de APIs; meta-flex: el sitio consume su propia API documentada con OpenAPI/Swagger. | Route handlers + `/api/openapi.json` + UI Swagger. |
| **Guestbook en vivo** | Su proyecto "Auth System" hecho realidad: login (GitHub OAuth), persistencia, anti-spam. | Vercel KV/Postgres + OAuth. |
| **Leaderboard del cubo Rubik** | El easter egg ya tiene cronómetro → persistir tiempos y ranking = retención + demo de backend. | KV para scores; ya existe la lógica del cubo. |
| **Snippets/utilidades ejecutables** | Sus "librerías backend TS" (validador de RUT, formateo de teléfono CL) corriendo en el navegador. | WASM/JS sandbox; input → output en vivo. |
| **Métricas de código reales** | Actividad de GitHub, lenguajes, streak, stats de WakaTime. | APIs públicas, cacheadas. |

---

## 4. Lo humano (diferencia por personalidad) 🎛️

Enzo es **DJ, piloto FPV y entusiasta de ciberseguridad**. Casi ningún portfolio técnico muestra al humano completo — eso conecta.

- **"Beyond code" / Más allá del código:** sección con **reel FPV** (video) y **set de DJ** embebido (SoundCloud/Mixcloud). Multidimensional y memorable.
- **"Now" page** (estilo Derek Sivers `/now`): qué está aprendiendo (AZ-204), leyendo, construyendo — señal de actividad y autenticidad.
- **Live "currently":** *now-playing* de Spotify, último commit de GitHub, "coding right now" (WakaTime) → el sitio se siente **vivo**.
- **Ángulo ciberseguridad:**
  - **`/.well-known/security.txt`** (RFC 9116) — gesto de madurez que la gente de seguridad nota.
  - **Mini-CTF oculto**: un flag escondido en el sitio (en headers, en el terminal mode, en el cubo) para que pares de seguridad lo "hackeen". Diferenciador de nicho y muy compartible.

---

## 5. Conversión y credibilidad 🎯

- **Reserva de llamada** (Cal.com embebido) — del "escríbeme" al "agenda 15 min" sin fricción.
- **Certificaciones verificables** (Credly/badges Azure) en vez de imágenes estáticas → confianza real.
- **Case studies long-form** (no solo cards): problema → arquitectura → trade-offs → resultados, para el **Reclutador 24/7** (decenas de miles de postulaciones en Cyber Day, multi-modelo) y la **migración ERP** (zero data loss / zero downtime). Es lo que un rol senior realmente lee.
- **Testimonios** (LinkedIn) con foto y rol.
- **Modo "para reclutadores":** un toggle que reordena el sitio en formato escaneable (stack, disponibilidad, CV, logros) en 10 segundos.

---

## 6. Quick wins (bajo esfuerzo, buen retorno) ⚡

- **`/cv` imprimible** (vista print-friendly del portfolio → PDF generado, no archivo manual).
- **Compartir social** con OG dinámica por sección.
- **PWA instalable** (`manifest.ts` ya recomendado en OPTIMIZATION) → "instalar app".
- **Atajos de teclado** globales (`g p` → proyectos, `t` → tema) — combina con el ⌘K.
- **Página 404 con personalidad** (un mini-juego o el cubo).
- **Easter eggs adicionales** (Konami code, `whoami` en consola del navegador).

---

## 7. Plan priorizado

### 🥇 Fase 1 — Diferenciadores de mayor impacto
1. **"Pregúntale a mi portfolio"** (§2.1) — el feature insignia; encarna su marca.
2. **Command palette ⌘K** (§2.3) — alto "wow", bajo esfuerzo.
3. **Case studies long-form** (§5) — convierte para roles senior.

### 🥈 Fase 2 — Contenido y prueba viva
4. **Blog MDX bilingüe** (§1.1) con RSS + OG dinámica + integración AIO.
5. **Arquitecturas interactivas** (§2.2) para los 2 sistemas estrella.
6. **Status page** (§2.4) y/o **EuforIA embebido** (§2.5).

### 🥉 Fase 3 — Personalidad y extensión
7. **Cursos/Academia** (§1.2) reusando Azure Path.
8. **"Beyond code"** (FPV + DJ) y **/now** (§4).
9. **Leaderboard del cubo**, **guestbook**, **security.txt + mini-CTF** (§3, §4).

---

## 8. Checklist de oportunidades

```
Contenido
[ ] Blog MDX bilingüe (RSS, TOC, reading time, OG dinámica, TL;DR IA)
[ ] Cursos / Academia (reusar Azure Path)
[ ] Newsletter "Augmented Engineering"
[ ] Case studies long-form (Reclutador 24/7, migración ERP)

Signature / IA
[ ] "Pregúntale a mi portfolio" (Claude + RAG + citas)
[ ] Arquitecturas interactivas (React Flow)
[ ] Command palette / modo terminal (⌘K)
[ ] Status page de proyectos (health/latencia real)
[ ] Playground multi-modelo (EuforIA en vivo)

Show-don't-tell backend
[ ] Portfolio como API pública + OpenAPI
[ ] Guestbook (OAuth + DB)
[ ] Leaderboard del cubo Rubik
[ ] Utilidades TS ejecutables (RUT, teléfono CL)
[ ] Métricas GitHub / WakaTime

Humano / nicho
[ ] "Beyond code" (reel FPV + set DJ)
[ ] /now page + live "currently"
[ ] security.txt + mini-CTF oculto

Conversión
[ ] Reserva de llamada (Cal.com)
[ ] Certificaciones verificables (Credly)
[ ] Modo "para reclutadores"
[ ] Testimonios

Quick wins
[ ] CV imprimible (PDF generado)
[ ] PWA instalable
[ ] Atajos de teclado globales
[ ] 404 con personalidad
```

---

# Segunda tanda de propuestas 🌱

> Ideas adicionales que extienden el catálogo anterior. Mismo criterio: anclar todo a su identidad real (backend, cloud, Azure SignalR, IA, seguridad) y diferenciar.

---

## 9. Real-time en vivo — con su stack EXACTO (Azure SignalR) 📡

Enzo lista **Azure SignalR** entre sus skills. El movimiento más potente es **usarlo en el propio portfolio** — demostrar real-time, no describirlo.

- **Presencia en vivo:** "👁️ 3 personas viendo el sitio ahora" vía SignalR. Show-don't-tell puro de su skill estrella.
- **Cursores colaborativos:** ver los cursores de otros visitantes en vivo (estilo Figma/multiplayer). Factor "wow" altísimo + prueba de WebSockets reales.
- **Reacciones efímeras:** visitantes lanzan emojis/likes que todos ven flotar en tiempo real.
- **Notificación en vivo al contactar:** cuando alguien envía el form, push instantáneo (SignalR → su móvil/Slack). Cierra el loop con su propia arquitectura serverless.

*Por qué diferencia:* convierte "sé hacer real-time" en una experiencia que el visitante **siente** al instante.

---

## 10. Transparencia radical 🔍 (raro y memorable)

Casi nadie abre sus números. Hacerlo proyecta confianza de ingeniero senior.

- **Analytics públicos:** dashboard abierto de su tráfico (privacy-first, estilo Plausible) — "no tengo nada que esconder".
- **Web Vitals en vivo (dogfooding):** widget con el **LCP/INP/CLS reales del propio sitio** (ya tiene SpeedInsights integrado) → "me importa la performance; aquí está la prueba en tiempo real".
- **Costo de infra real:** desglose honesto de lo que cuesta correr el sitio (Vercel/Azure/Resend) → educativo, único, muy de cloud architect.
- **Contador de bots bloqueados:** "🛡️ N bots de spam atrapados" por el honeypot/captcha (cruza con [IMPROVE.md §2.1](IMPROVE.md)) → toque de seguridad lúdico.
- **Huella de carbono:** badge de *website carbon* / green hosting (sostenibilidad).
- **Changelog del portfolio (`/changelog`):** tratar el sitio como **producto**, con versionado semántico y release notes. Profundamente developer.

---

## 11. Herramientas interactivas (lead-gen + consultoría) 🛠️

- **Estimador de proyecto:** wizard (tipo de sistema, alcance, plazos) → rango de esfuerzo/precio. Capta leads y muestra criterio de consultoría, no solo código.
- **"Revisa mi código" con IA:** el visitante pega un snippet → el sitio lo revisa **en el estilo de Enzo** (Claude). *Augmented Engineering* aplicado y demostrado en vivo.
- **Rate card / tarifas** con moneda localizada (CLP / USD) — claridad para freelance.
- **Generador de arquitectura:** describes una necesidad ("API serverless con colas") → propone un diagrama base sobre Azure. Mezcla §2.2 con IA.

---

## 12. Memorabilia generativa y gamificación 🎨

- **Arte generativo único por visita:** una pieza sembrada por fecha/visitante (reusa el motor de canvas del Hero), **descargable y compartible** → "tu visita es única". Marketing viral orgánico.
- **Logros del visitante:** desbloquea badges al explorar (encontró el cubo, leyó un case study, usó el terminal ⌘K) → retención y exploración.
- **"Year in code" (wrapped):** recap anual generado desde su actividad de GitHub, formato compartible estilo Spotify Wrapped.
- **Scrubber de carrera:** una línea de tiempo interactiva para "revivir" su trayectoria (electrónica → cloud) con media por etapa.
- **Grafo de conocimiento:** mapa navegable que enlaza **skills ↔ proyectos ↔ experiencia** (visión completa de la carrera, distinto de los diagramas por-sistema de §2.2).

---

## 13. Cultura dev e IndieWeb 🌐

- **`/uses`** (uses.tech): hardware, software, editor, terminal, dotfiles — los devs lo aman y lo enlazan.
- **`/colophon`:** cómo está construido el sitio y por qué (versión pública de `AI_CONTEXT.md`) → transparencia técnica.
- **Comentarios con giscus** (GitHub Discussions) en los posts del blog.
- **Webmentions / IndieWeb / POSSE:** publicar una vez y sindicar a redes; "own your content".
- **Digital garden:** notas interconectadas (estilo Obsidian/Zettelkasten) además del blog lineal.
- **Accessibility statement** + auditoría WCAG visible → señal de oficio y cuidado.

---

## 14. IA aplicada al propio sitio 🧠 (coherencia de marca total)

- **Contacto inteligente:** el form detecta la **intención** (empleo / freelance / colaboración / saludo) con IA y responde/enruta distinto. Su filosofía aplicada a su propia herramienta.
- **Navegación por voz ("talk to my site"):** preguntar en voz alta y que responda (Web Speech API + el chat de §2.1) — accesible y futurista.
- **Personalización geo:** saludo por ciudad/zona horaria y CTA adaptado al visitante.
- **Traducción on-the-fly a más idiomas** (p.ej. **pt-BR** para el mercado brasileño) generada y validada por IA, extendiendo el routing i18n ya implementado.

---

## 15. Checklist — segunda tanda

```
Real-time (SignalR)
[ ] Presencia en vivo ("N viendo ahora")
[ ] Cursores colaborativos
[ ] Reacciones efímeras
[ ] Notificación en vivo al contactar

Transparencia radical
[ ] Analytics públicos
[ ] Web Vitals en vivo (dogfooding)
[ ] Costo de infra real
[ ] Contador de bots bloqueados
[ ] Huella de carbono
[ ] Changelog del portfolio (/changelog)

Herramientas / lead-gen
[ ] Estimador de proyecto
[ ] "Revisa mi código" con IA
[ ] Rate card localizada
[ ] Generador de arquitectura

Memorabilia / gamificación
[ ] Arte generativo único por visita
[ ] Logros del visitante
[ ] "Year in code" (wrapped)
[ ] Scrubber de carrera
[ ] Grafo de conocimiento

Cultura dev / IndieWeb
[ ] /uses
[ ] /colophon
[ ] Comentarios giscus en blog
[ ] Webmentions / POSSE
[ ] Digital garden
[ ] Accessibility statement

IA aplicada al sitio
[ ] Contacto inteligente (intención)
[ ] Navegación por voz
[ ] Personalización geo
[ ] Idiomas extra (pt-BR) por IA
```

---

*Catálogo de propuestas, no implementación. Cada ítem es independiente; las Fases (§7) ordenan por impacto diferenciador sobre esfuerzo. Las apuestas más altas: **§2.1** (un portfolio que responde por sí mismo) y **§9** (real-time con su propio stack SignalR) — ambas convierten skills declarados en experiencias que el visitante siente, que es lo que casi ningún portfolio logra.*
