# MEJORAS_IMPLEMENTADAS.md — Bitácora de mejoras del portfolio

> Registro de las mejoras **implementadas** en el código (no propuestas) durante la sesión de reenfoque profesional del portfolio `enorese.dev`.
> Enfoque de la sesión: hacer el sitio **más profesional y orientado a captar clientes** que quieren automatizar soluciones, además de blindarlo y pulirlo.
> Complementa a [ESTRATEGIA_LATAM.md](ESTRATEGIA_LATAM.md) y [DINAMISMO_Y_CONTENIDO.md](DINAMISMO_Y_CONTENIDO.md) (estrategia) e [IMPROVE.md](IMPROVE.md)/[OPTIMIZATION.md](OPTIMIZATION.md) (auditorías).
>
> Fecha: 2026-08-02 · Todo commiteado en `main`, **sin desplegar** (el deploy queda a cargo de Enzo).

---

## 0. Resumen ejecutivo

En esta tanda se implementaron **6 bloques de mejoras**, cada uno en su propio commit:

| # | Commit | Foco | Riesgo |
|---|--------|------|--------|
| 1 | `feat(i18n/seo)` | Reenfoque a audiencia hispanohablante (Fase 0 LatAm) | Nulo |
| 2 | `feat(security)` | Blindaje del formulario de contacto | Bajo |
| 3 | `feat(services)` | **Sección de Servicios + CTAs de conversión** (captar clientes) | Bajo |
| 4 | `perf(a11y)` | `prefers-reduced-motion` + pausa de animaciones | Bajo |
| 5 | `feat(seo)` | Servicios como `makesOffer` en JSON-LD | Nulo |
| 6 | `docs` | Esta documentación | Nulo |

Todo verificado con `next build` (SSG de `/es` y `/en` correcta) y `tsc --noEmit` sin errores.

---

## 1. Reenfoque a audiencia hispanohablante (Fase 0 LatAm)

**Por qué:** el sitio recibía tráfico mayoritariamente anglo/europeo porque su configuración trataba el inglés como idioma por defecto. Detalle completo en [ESTRATEGIA_LATAM.md](ESTRATEGIA_LATAM.md).

**Qué se hizo:**
- `middleware.ts`: `FALLBACK_LOCALE` `'en'` → **`'es'`**.
- `x-default` hreflang: `/en` → **`/es`** (en [layout.tsx](src/app/[lang]/layout.tsx) y [sitemap.ts](src/app/sitemap.ts)).
- Keywords y descripción ES con señal LatAm; `areaServed` (Chile, Perú, Argentina, México, España, Latinoamérica) en el JSON-LD.
- `og:alternateLocale` regional (`es_ES`, `es_MX`, `es_AR`, `es_PE`).
- `about.bio_2` ES igualado a la riqueza del inglés (migración ERP zero-downtime, Reclutador 24/7, pipeline multi-modelo).

---

## 2. Blindaje del formulario de contacto (seguridad)

**Por qué:** era el **riesgo #1** de [IMPROVE.md](IMPROVE.md): endpoint público, sin autenticación y que **cuesta dinero** (cuota de Resend), sin ninguna defensa anti-bot.

**Qué se hizo** — [`src/app/api/contact/route.ts`](src/app/api/contact/route.ts) + [`Contact.tsx`](src/components/Contact.tsx):
- **Honeypot**: campo oculto `website`; si viene relleno → `200 OK` silencioso sin enviar (no da feedback al bot).
- **Límites de longitud** server-side (`name ≤ 100`, `email ≤ 254`, `message ≤ 5000`) + corte por `Content-Length` (`> 20 KB` → 413).
- **Enforce `Content-Type: application/json`** (415 en otro caso).
- **Verificación de origen (CSRF-lite)**: rechaza POST cross-site comparando `Origin` con `Host` (funciona en prod, previews y localhost sin allowlist fija).
- **Instancia de Resend a nivel de módulo** (reutilizada entre invocaciones).
- Cliente: input honeypot + `maxLength` en los campos.

**Pendiente (requiere cuentas/API keys externas):** Cloudflare Turnstile (CAPTCHA) y rate limiting por IP con Upstash/Vercel KV. Son las capas que faltan para "production-grade" completo; se dejaron fuera porque necesitan credenciales. Ver §7.

---

## 3. ⭐ Sección de Servicios + CTAs de conversión (captar clientes)

**Por qué:** el sitio estaba planteado como portfolio de **búsqueda de empleo** ("Abierto a oportunidades", enfoque a reclutadores). Para **captar clientes** que quieren automatizar procesos, faltaba lo esencial: **decir qué puedes construir para su negocio** y empujar a la acción.

**Qué se hizo:**
- **Nuevo componente [`Services.tsx`](src/components/Services.tsx)** (bilingüe), insertado tras "Sobre mí" (sección **02**), con 6 servicios orientados a beneficio de negocio:
  1. Automatización de procesos con IA
  2. Agentes y asistentes con IA
  3. Arquitectura backend & cloud
  4. Integración de sistemas y APIs
  5. Migración a la nube sin downtime
  6. Consultoría y revisión de arquitectura
- **Copy de conversión**: enfocado en resultados (ahorro de tiempo, menos errores, escala), anclado en trabajo real (migración ERP zero-downtime, Reclutador 24/7). Cada tarjeta con icono propio y animación de reveal escalonado.
- **Banda CTA de cierre**: *"¿Tienes un proceso que podrías automatizar?"* → botón **"Hablemos de tu proyecto"** que lleva al contacto.
- **Hero**: se corrigieron **anclas rotas** (los CTAs apuntaban a `#projects`/`#contact`, que no existen; las secciones son `#servicios`/`#contacto`) y el CTA primario ahora dice **"Automatiza tu negocio"** → Servicios.
- Cableado en [`sections.ts`](src/config/sections.ts) (feature flag + nav), [`page.tsx`](src/app/[lang]/page.tsx) y navbar (automático). Renumeración de secciones siguientes (Experiencia 03 … Contacto 07).

**Impacto:** el visitante que llega ahora ve, arriba del todo, **qué problema le resuelves** y un camino claro a contactarte. Es el cambio de mayor impacto comercial de la sesión.

---

## 4. Accesibilidad y rendimiento (`prefers-reduced-motion`)

**Por qué:** pendiente de [IMPROVE.md §3.1](IMPROVE.md). El Hero corría loops de animación permanentes sin respetar la preferencia de menos movimiento ni pausarse fuera de viewport → consumo de batería/CPU en móvil y problema de accesibilidad.

**Qué se hizo** — [`globals.css`](src/app/globals.css) + [`Hero.tsx`](src/components/Hero.tsx):
- **Reset CSS de reduced-motion**: neutraliza keyframes y transiciones (side lights, data pixels, breathing, pulso de WhatsApp) cuando el usuario pide menos movimiento.
- **Hero (JS)**: bajo reduced-motion se omiten los data pixels y el spotlight del cursor, y el canvas dibuja **un solo frame estático** en vez de animar.
- **Pausa por rendimiento**: el loop del canvas se detiene cuando la **pestaña está oculta** (`visibilitychange`) y cuando el **Hero sale del viewport** (`IntersectionObserver`). Mejora INP y ahorra batería.

---

## 5. Servicios en el SEO estructurado (`makesOffer`)

**Por qué:** para que buscadores y motores de IA entiendan que ofreces servicios concretos a clientes (no solo que "sabes" tecnologías).

**Qué se hizo** — [`layout.tsx`](src/app/[lang]/layout.tsx): se añadió `makesOffer` (array de `Offer` → `Service`, localizado) al `Person` del grafo JSON-LD, derivado de los mismos 6 servicios. Refuerza la captación de clientes en búsquedas con intención comercial ("automatización de procesos", "desarrollo backend freelance", etc.).

---

## 6. Bugs corregidos de paso

- **Anclas rotas del Hero** (`#projects`/`#contact` → `#servicios`/`#contacto`): los botones principales del Hero no llevaban a ninguna parte. Corregido.

---

## 7. Pendientes que necesitan TU información o credenciales

Esto **no** se pudo/ debió implementar sin datos que solo tú tienes. Cuando los tengas, se integran rápido:

### Necesitan tu contenido
- **CV en PDF**: el Hero y "Sobre mí" enlazan a `/cv.pdf`, pero **ese archivo no existe** en `public/` → hoy el botón "Descargar CV" da 404. Sube tu CV como `public/cv.pdf`.
- **Links reales de proyectos**: los 6 proyectos tienen `live`/`code` con `#` y `disabled` (sin demo ni repo público). Cuando quieras exponer alguno, pásame la URL.
- **Testimonios / logos de clientes**: prueba social real (LinkedIn, empresas) para reforzar credibilidad. *No se inventaron* — requieren tu material auténtico.
- **Casos de estudio long-form**: Reclutador 24/7 y migración ERP merecen su página (problema → arquitectura → resultados). Necesito los detalles/números que puedas compartir.
- **Precios / rate card**: para el estimador o la ficha de servicios, si decides publicarlos (CLP/USD).

### Necesitan cuentas/API keys externas
- **Cloudflare Turnstile** (CAPTCHA): `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- **Rate limiting** con Upstash Redis / Vercel KV: URL + token del store.
- (Ambos completan el blindaje del formulario iniciado en §2.)

---

## 8. Próximos pasos recomendados (sin bloquear)

En orden de impacto para captar clientes, del roadmap de [DINAMISMO_Y_CONTENIDO.md](DINAMISMO_Y_CONTENIDO.md):

1. **Subir `cv.pdf`** y activar links reales de 1-2 proyectos estrella (quick win de credibilidad).
2. **Blog MDX en español** — el motor de descubrimiento LatAm + frescura (sin base de datos).
3. **Completar el blindaje** del formulario (Turnstile + rate limit) cuando tengas las keys.
4. **Casos de estudio** del Reclutador 24/7 y la migración ERP.
5. **Reserva de llamada** (Cal.com) para pasar de "escríbeme" a "agenda 15 min".

---

## 9. Verificación

```
✓ next build            → SSG de /es y /en correcta, sin errores
✓ tsc --noEmit          → sin errores de tipos
✓ Render en dev server  → Servicios: 6 tarjetas + banda CTA; nav con "Servicios";
                          CTAs del Hero corregidos ("Automatiza tu negocio" → #servicios)
✓ Commits               → 6 commits atómicos en main, en inglés, sin push (sin deploy)
```

---

*Bitácora de lo implementado. Los `[ ]` de la §7 son lo único que queda del alcance de esta sesión, y dependen de material tuyo o de credenciales externas. Nada fue desplegado: el push a producción queda en tus manos.*
