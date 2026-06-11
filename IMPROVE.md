# IMPROVE.md — Performance & Seguridad del Portfolio de Enzo Norese

> Auditoría de **rendimiento (performance)** y **seguridad (security)** del sitio `https://enorese.dev`.
> Complementa a [OPTIMIZATION.md](OPTIMIZATION.md) (que cubre SEO/AIO). Aquí el foco es: hacer el sitio rápido, robusto y resistente a abuso — empezando por blindar el formulario de contacto.
>
> Fecha de auditoría: 2026-06-10 · Stack: Next.js 15 (App Router), React 19, Resend, Three.js.

---

## 0. TL;DR — Veredicto

El código base es **limpio y con buenas prácticas** (validación server-side, `escapeHtml` en el correo, `poweredByHeader: false`, env vars server-only, imports dinámicos, lazy Three.js). Buen punto de partida.

Pero hay **superficie de abuso y endurecimiento pendiente**, sobre todo en el endpoint público de correo:

- 🔴 **El formulario de contacto no tiene CAPTCHA, ni rate limiting, ni honeypot.** Hoy cualquiera puede automatizar POSTs a `/api/contact` y agotar tu cuota de Resend / llenarte el inbox de spam. **Es el riesgo #1.**
- 🔴 **No hay cabeceras de seguridad** (CSP, HSTS, X-Frame-Options, etc.) en `next.config.ts`.
- 🟡 **Sin límite de longitud máxima** en los campos del formulario (server) → payloads gigantes.
- 🟡 **Animaciones del Hero** corren múltiples loops `requestAnimationFrame` sin respetar `prefers-reduced-motion` ni pausarse fuera de viewport → consumo de batería/CPU en móvil.

Ninguno es catastrófico hoy, pero resolverlos lleva el sitio de "bien hecho" a "production-grade".

---

## 1. Lo que está BIEN ✅

| Área | Detalle |
|------|---------|
| **Validación server-side** | [route.ts:42-48](src/app/api/contact/route.ts) revalida en el servidor sin confiar en el cliente. |
| **Anti-XSS en el correo** | `escapeHtml()` escapa el contenido antes de inyectarlo en el HTML del email. |
| **Secrets server-only** | `RESEND_API_KEY` y emails viven en env vars del servidor, nunca en el bundle cliente. |
| **`poweredByHeader: false`** | [next.config.ts:5](next.config.ts) oculta el header `X-Powered-By`. |
| **`reactStrictMode: true`** | Detección temprana de side-effects. |
| **Imports dinámicos** | Secciones cargadas con `dynamic()`; Three.js sólo se carga en el easter egg. |
| **Fuentes optimizadas** | `next/font` (Inter self-hosted, `display: swap`) → sin FOIT ni request externo. |
| **Anti-flash de tema** | Script inline evita parpadeo (mejora CLS percibido). |
| **`replyTo` correcto** | El correo usa `replyTo` del remitente, evitando suplantación del `from`. |

---

## 2. SEGURIDAD 🔒

### 2.1 🔴 Blindar el formulario de contacto (`/api/contact`)

Es un endpoint **público, sin autenticación, que cuesta dinero** (cada envío consume cuota de Resend). Hoy no tiene ninguna defensa anti-bot. Capas recomendadas, de menor a mayor esfuerzo (idealmente **todas**, son complementarias):

#### a) Honeypot (5 min, gratis) — primera línea
- Añadir un campo oculto (`type="text"` con `display:none` / `aria-hidden` / `tabindex=-1`, p.ej. `name="website"`) que un humano nunca llena.
- En el servidor: si viene relleno → descartar silenciosamente con `200 OK` (no le des feedback al bot).
- Atrapa la mayoría de bots tontos sin fricción para el usuario.

#### b) CAPTCHA / verificación humana — defensa real
- **Recomendado: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)** — gratis, sin puzzles molestos, privacy-friendly (no rastrea como reCAPTCHA), y se integra fácil con Next.js.
- Alternativas: hCaptcha (similar) o reCAPTCHA v3 (invisible, score-based, pero de Google y peor en privacidad).
- Flujo: el widget genera un token en el cliente → se envía en el body → el servidor lo valida contra el endpoint de verificación de Turnstile **antes** de llamar a Resend. Si falla → `403`.
- Variables nuevas: `TURNSTILE_SECRET_KEY` (server) y `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (cliente).

#### c) Rate limiting — anti-flood
- Limitar por IP, p.ej. **3 envíos / 10 min**. Sin esto, aun con CAPTCHA un atacante con tokens válidos podría insistir.
- Opciones en Vercel/serverless: **[Upstash Redis + `@upstash/ratelimit`](https://github.com/upstash/ratelimit)** (gratis, edge-friendly) es lo estándar. Para algo más simple, un Map en memoria **no sirve** en serverless (cada invocación es efímera) → usar Upstash o el KV de Vercel.
- Obtener IP desde el header `x-forwarded-for` en la Request.

#### d) Verificación de origen (CSRF-lite)
- El handler acepta POST desde cualquier origen. Verificar que el header `Origin`/`Referer` coincida con `https://enorese.dev` y rechazar el resto. Defensa barata contra POSTs cross-site.

### 2.2 🟡 Límite de longitud máxima (server)
- [route.ts:46](src/app/api/contact/route.ts) sólo valida mínimos (`name >= 2`, `message >= 10`). **No hay máximo.** Alguien puede enviar un `message` de 10 MB → emails gigantes, abuso de cuota, posible DoS.
- Añadir topes: `name <= 100`, `email <= 254` (RFC), `message <= 5000`. También limitar el tamaño total del body.
- En el cliente, añadir `maxLength` a los `<input>`/`<textarea>` de [Contact.tsx](src/components/Contact.tsx) (UX, no seguridad).

### 2.3 🟡 Cabeceras de seguridad HTTP
`next.config.ts` no define `headers()`. Añadir cabeceras de hardening (aplican a todas las rutas):

| Header | Valor sugerido | Protege contra |
|--------|----------------|----------------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Downgrade a HTTP |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `X-Frame-Options` | `DENY` | Clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Fuga de URLs |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Acceso a APIs del navegador |
| `Content-Security-Policy` | (ver nota) | XSS / inyección |

- **Nota sobre CSP:** hay dos `dangerouslySetInnerHTML` con scripts inline en [layout.tsx](src/app/layout.tsx) (anti-flash + JSON-LD). Una CSP estricta requiere `nonce` o `hash` para permitirlos. Empezar con CSP en modo `Report-Only` para no romper nada, luego endurecer.

### 2.4 🟢 Robustez del endpoint (menor)
- **Validación de email más estricta:** la regex actual acepta direcciones técnicamente inválidas; opcionalmente rechazar dominios desechables (mailinator, etc.).
- **No filtrar detalles de error:** los mensajes de error al cliente ya son genéricos ✅; mantener así (no exponer trazas de Resend).
- **`Content-Type` enforcement:** rechazar requests que no sean `application/json`.
- Instanciar `new Resend()` fuera del handler (módulo) para reutilizar entre invocaciones — menor, pero limpio.

### 2.5 🟢 Dependencias
- Correr `npm audit` periódicamente y habilitar **Dependabot** en el repo. Three.js, drei y fiber evolucionan rápido.
- Three `0.170` está algo atrás respecto a las últimas; revisar changelog antes de subir (a veces hay breaking changes en geometrías).

---

## 3. PERFORMANCE ⚡

### 3.1 🟡 Animaciones del Hero — respetar `prefers-reduced-motion` y pausar fuera de viewport
[Hero.tsx](src/components/Hero.tsx) corre **dos loops `requestAnimationFrame` permanentes** (spotlight lerp + canvas de code-rain/stars/shooting-stars), además de ~26 "data pixels" animados.

- **`prefers-reduced-motion`:** hoy no se respeta. Usuarios con esa preferencia (y muchos móviles en ahorro de batería) deberían ver una versión estática. Es accesibilidad **y** performance.
- **Pausar fuera de viewport:** cuando el Hero no está visible (scrolleaste a otra sección), el canvas sigue dibujando. Usar `IntersectionObserver` para `cancelAnimationFrame` cuando no es visible, y `document.visibilitychange` para pausar al cambiar de pestaña.
- **Impacto:** reduce consumo de CPU/GPU/batería notablemente en móvil, mejora INP y el Lighthouse Performance score.

### 3.2 🟡 Peso del bundle (Three.js / drei / fiber)
- `three` + `@react-three/drei` + `@react-three/fiber` son **dependencias muy pesadas** (drei especialmente). Sólo se usan en el easter egg del cubo Rubik.
- **Verificar con `@next/bundle-analyzer`** que NO entran en el bundle inicial (el `dynamic()` debería garantizarlo, pero conviene confirmar el chunk).
- Añadir a `next.config.ts`: `experimental.optimizePackageImports: ['@react-three/drei']` para mejor tree-shaking.
- `drei` importa muchísimo; importar sólo los helpers usados (named imports puntuales) en `RubikScene.tsx`.

### 3.3 🟢 Configuración de Next.js
Ampliar `next.config.ts` (hoy mínimo):
- `compress: true` (default, confirmar).
- `images` con `formats: ['image/avif','image/webp']` para cuando agregues OG image / CV preview / foto.
- Considerar `output: 'standalone'` sólo si dejas Vercel (en Vercel no hace falta).

### 3.4 🟢 Caching de assets estáticos
- Vercel ya sirve `public/` con buen cache, pero conviene cabeceras explícitas `Cache-Control: public, max-age=31536000, immutable` para assets versionados (fuentes, futuras imágenes).
- `llms.txt`, `robots.txt`, `sitemap.xml`: cache moderado (`max-age=3600`).

### 3.5 🟢 Core Web Vitals — ya monitoreados
- `@vercel/speed-insights` ya está integrado ✅. Revisar el dashboard tras los cambios y vigilar **LCP** (el Hero), **CLS** (cubierto por anti-flash) e **INP** (afectado por los loops RAF → ver 3.1).
- El canvas no debería contar como LCP, pero confirmar que el LCP real es el texto del Hero y que su fuente carga rápido.

---

## 4. Plan de acción priorizado

### 🔴 Sprint 1 — Blindar el formulario (riesgo #1)
1. **Honeypot** en [Contact.tsx](src/components/Contact.tsx) + chequeo en [route.ts](src/app/api/contact/route.ts).
2. **Cloudflare Turnstile** (widget cliente + verificación server antes de Resend).
3. **Rate limiting** por IP con Upstash Redis (3/10 min).
4. **Límite de longitud máxima** + `Content-Type` + verificación de `Origin` en el handler.

### 🟡 Sprint 2 — Hardening global
5. **Cabeceras de seguridad** en `next.config.ts` (empezar CSP en `Report-Only`).
6. `maxLength` en los inputs del formulario.
7. **`prefers-reduced-motion`** + pausa por `IntersectionObserver`/`visibilitychange` en el Hero.

### 🟢 Sprint 3 — Performance fina y mantenimiento
8. `@next/bundle-analyzer` + `optimizePackageImports` para drei; confirmar que Three no está en el bundle inicial.
9. Cabeceras de `Cache-Control` para estáticos.
10. `npm audit` + habilitar Dependabot.
11. Instanciar `Resend` a nivel de módulo; validación de email reforzada.

---

## 5. Checklist rápido

```
Seguridad — Formulario
[ ] Honeypot field + descarte silencioso
[ ] CAPTCHA (Cloudflare Turnstile) verificado en server
[ ] Rate limiting por IP (Upstash/Vercel KV)
[ ] Verificación de Origin/Referer
[ ] Límite de longitud máxima (name/email/message)
[ ] Enforce Content-Type: application/json

Seguridad — Global
[ ] HSTS / X-Frame-Options / X-Content-Type-Options
[ ] Referrer-Policy / Permissions-Policy
[ ] CSP (Report-Only → enforce)
[ ] npm audit + Dependabot

Performance
[ ] prefers-reduced-motion respetado en Hero
[ ] RAF pausado fuera de viewport / pestaña oculta
[ ] bundle-analyzer: Three.js fuera del bundle inicial
[ ] optimizePackageImports para drei
[ ] Cache-Control para estáticos
[ ] Revisar Core Web Vitals post-cambios
```

---

*Documento generado como auditoría inicial. El Sprint 1 (formulario) es el de mayor retorno: cierra la única superficie de abuso real y de costo directo del sitio.*
