# ESTRATEGIA_LATAM.md — Reenfoque del portfolio hacia Latinoamérica y España

> Plan estratégico para que `https://enorese.dev` deje de atraer mayoritariamente público anglo/europeo y llegue **con fuerza al mundo hispanohablante**: Chile, Perú, Argentina, Uruguay, México, España y el resto de LatAm.
> Complementa a [OPTIMIZATION.md](OPTIMIZATION.md) (SEO/AIO), [IMPROVE.md](IMPROVE.md) (performance/seguridad), [WEB_IMPROVE.md](WEB_IMPROVE.md) (features) y [TEXT_IMPROVE.md](TEXT_IMPROVE.md) (copy). El detalle de dinamismo/movimiento vive en [DINAMISMO_Y_CONTENIDO.md](DINAMISMO_Y_CONTENIDO.md).
>
> Fecha: 2026-08-01 · Stack: Next.js 15 (App Router), React 19, i18n por routing `/es` `/en`.

---

## 0. TL;DR — El diagnóstico incómodo pero claro

El sitio **no está roto ni "apunta al inglés por accidente"**. Está técnicamente bien hecho y es bilingüe de verdad (URLs `/es` y `/en` indexables, `hreflang`, JSON-LD, `llms.txt`). El problema es más sutil y por eso más importante:

> **La propia configuración del sitio fue diseñada para tratar el inglés como el idioma "por defecto del mundo", y eso está sesgando activamente el descubrimiento hacia público anglo/europeo.**

Tres decisiones concretas, todas visibles en el código, lo causan:

| # | Señal en el código | Efecto |
|---|--------------------|--------|
| 1 | [`middleware.ts:9`](src/middleware.ts) → `FALLBACK_LOCALE = 'en'` con el comentario literal *"Solo los hispanohablantes ven español"* | Cualquier visitante que **no** declare español explícitamente cae en inglés. |
| 2 | [`layout.tsx:163`](src/app/[lang]/layout.tsx) y [`sitemap.ts:11`](src/app/sitemap.ts) → `x-default` → **`/en`** | Le dices a Google/Bing/IA que la versión **canónica para audiencia no identificada es la inglesa**. El `x-default` es la carta de presentación del sitio ante buscadores. |
| 3 | Señales geográficas ancladas solo a Chile-capital: `og:locale` = `es_CL` únicamente, keywords ES con "Santiago Chile" y nada de Perú/Argentina/México/España, JSON-LD `addressCountry: CL` sin `areaServed` | El sitio "existe" para Santiago, pero es geográficamente invisible para Lima, Buenos Aires, Madrid, CDMX. |

**Matiz crucial (no te confundas de palanca):** un visitante en Chile con navegador en español **ya recibe `/es` correctamente** — el *routing en runtime funciona*. Por eso el problema **no** es "a los latinos les sale inglés". El problema es de **descubrimiento**: quién encuentra el sitio en Google y motores de IA. Y ahí las tres señales de arriba trabajan en tu contra.

La buena noticia: **el 80 % del arreglo es configuración y contenido, no arquitectura.** Cambios de horas, cero riesgo, reversibles. La otra mitad de tu intuición —"el sitio se siente congelado"— se resuelve con **un motor de contenido en español** (blog/notas técnicas) que es, a la vez, la mejor máquina de descubrimiento para LatAm. Ese doble propósito es el hilo conductor de este plan.

---

## 1. Por qué llega público anglo/europeo (análisis de causa raíz)

### 1.1 El `x-default` es el mensaje principal a los buscadores
`hreflang="x-default"` le indica a Google qué URL mostrar cuando **no puede determinar** el idioma/región del buscador. Hoy apunta a `/en` en dos lugares ([layout.tsx:163](src/app/[lang]/layout.tsx), [sitemap.ts:11](src/app/sitemap.ts)). Traducción: *"si tienes dudas, muestra inglés"*. Para un ingeniero chileno que quiere primar LatAm, esto está al revés.

### 1.2 El fallback de runtime refuerza el sesgo
[`middleware.ts`](src/middleware.ts) sirve inglés a todo `Accept-Language` que no priorice `es`. Un visitante en Brasil (`pt`), Alemania (`de`) o Francia (`fr`) → **inglés**. No es que "elija" inglés: se lo imponemos. Esto no daña a los hispanohablantes (que sí reciben `/es`), pero **cimenta la identidad inglesa del sitio** ante todo el tráfico ambiguo, y esa identidad es la que Google aprende.

### 1.3 Las keywords y el geo-targeting son demasiado estrechos
En [`layout.tsx:37-40`](src/app/[lang]/layout.tsx) las keywords en español son genéricas + "Santiago Chile". No hay términos que un reclutador o cliente busque en **Lima, Buenos Aires, Montevideo, Ciudad de México o Madrid**. El JSON-LD ([layout.tsx:83](src/app/[lang]/layout.tsx)) declara `addressCountry: CL` pero **sin `areaServed`**, así que a ojos de la IA y de Google, tu "mercado" es un punto en el mapa, no una región.

### 1.4 El contenido español es más pobre que el inglés (paradoja)
Ya documentado en [OPTIMIZATION.md §4.1](OPTIMIZATION.md): `about.bio_2` en español es **genérico**, mientras el inglés tiene las métricas potentes ("zero data loss / zero downtime", "Reclutador Digital 24/7", "Cyber Day"). Es decir: **el idioma que quieres potenciar es el que tiene el copy más débil.** Para LatAm esto es doblemente costoso porque es justo el texto que Google indexa y que la IA cita en español.

### 1.5 Validación antes de actuar (tienes los datos)
Tienes GA4 integrado ([layout.tsx:197-217](src/app/[lang]/layout.tsx)) y Speed Insights. **Antes y después** de aplicar cambios, revisa en GA4:
- **Countries / Regions** → confirma el % LatAm vs. anglo/europeo actual (línea base).
- **Landing page** `/es` vs `/en` → cuánto tráfico entra por cada idioma.
- **Acquisition → Organic Search** por país → dónde ya rankeas.

Esto convierte el plan en algo medible, no en fe. (No tengo acceso a tu GA; este paso lo haces tú y define la métrica de éxito.)

---

## 2. Palancas de reenfoque — ordenadas por impacto / esfuerzo

### 🟢 FASE 0 — Reconfiguración (horas, riesgo casi nulo, todo reversible)

Estos cambios no tocan arquitectura ni añaden superficie de ataque. Son la mayor relación impacto/esfuerzo del plan.

#### 2.1 Invertir el `x-default` → `/es` ⭐ *el cambio más simbólico y de más peso SEO*
Cambiar en **ambos** archivos:
- [`layout.tsx:163`](src/app/[lang]/layout.tsx): `'x-default': 'https://enorese.dev/es'`
- [`sitemap.ts:11`](src/app/sitemap.ts): `'x-default': LANGS.es`

Con esto el sitio le dice a los buscadores: *"mi versión por defecto es la española"*. Es la declaración de identidad que hoy falta.

#### 2.2 Cambiar el fallback de runtime a español (con matiz)
En [`middleware.ts:9`](src/middleware.ts): `FALLBACK_LOCALE: Locale = 'es'` y actualizar el comentario.
- **A favor:** alinea la identidad del sitio con el español; un visitante ambiguo ve la versión que quieres primar.
- **Trade-off honesto:** un visitante que **no** habla ni español ni inglés (p.ej. navegador solo en alemán) verá español en vez de inglés. Dado que tu objetivo es LatAm/España y que el inglés es *segundo idioma universal*, el costo es bajo. **Decisión recomendada: cambiar a `es`.** Si prefieres conservar UX para el tráfico internacional no-hispano, deja `en` aquí pero **igual invierte el `x-default` (2.1)** — el `x-default` pesa más para descubrimiento que el fallback de runtime.

#### 2.3 Ampliar keywords y descripción con señal LatAm + España
En [`layout.tsx:37-40`](src/app/[lang]/layout.tsx), enriquecer `KEYWORDS.es` y `DESCRIPTIONS.es` con:
- Términos de rol en español regional: `desarrollador backend`, `ingeniero de software`, `arquitecto de soluciones cloud`, `programador backend`, `freelance` / `remoto LatAm`.
- Señal geográfica amplia: en vez de solo "Santiago Chile", incluir `Latinoamérica`, `remoto`, y —si aplica a tu oferta— `Chile · Perú · Argentina · España`. (No sobre-optimices con 20 ciudades; 2-3 señales regionales + "remoto" bastan.)
- La descripción ES debería decir explícitamente algo como *"disponible para proyectos en Latinoamérica y España, remoto"* si eso es cierto para ti.

#### 2.4 Enriquecer el JSON-LD con alcance regional
En [`buildJsonLd` (layout.tsx:65-130)](src/app/[lang]/layout.tsx), al `Person` añadir:
```jsonc
"areaServed": [
  { "@type": "Country", "name": "Chile" },
  { "@type": "Country", "name": "Perú" },
  { "@type": "Country", "name": "Argentina" },
  { "@type": "Country", "name": "España" },
  { "@type": "Place", "name": "Latinoamérica" }
]
```
Esto le dice a Google y a los motores de IA **a qué mercado sirves**, no solo dónde vives. Alto retorno para AIO en español.

#### 2.5 `og:locale` con alternlos regionales
En [`layout.tsx:171-172`](src/app/[lang]/layout.tsx) el `og:locale` ES es solo `es_CL`. Añadir `alternateLocale` para que las previews sociales y los agregadores reconozcan tu alcance: `['es_ES', 'es_MX', 'es_AR', 'en_US']`. Menor, pero coherente.

#### 2.6 Igualar la riqueza del copy español al inglés ⭐ *pendiente crítico ya identificado*
Aplicar de una vez [OPTIMIZATION.md §4.1](OPTIMIZATION.md) / backlog de [TEXT_IMPROVE.md](TEXT_IMPROVE.md):
- **`about.bio_2` ES** → subir a la riqueza del EN (zero data loss/downtime, "Reclutador Digital 24/7", pipeline multi-modelo, Cyber Day). Es el texto que Google indexa **en el idioma que quieres potenciar**.
- Localizar placeholders del formulario que sigan en inglés (`John Doe` → `Juan Pérez`, etc.).
- Revisar que todo el contenido español "suene chileno/neutro-LatAm" y no a traducción del inglés.

#### 2.7 Search Console: fija el targeting y sube el sitemap
- Verifica el dominio en **Google Search Console** (y Bing Webmaster).
- Envía `https://enorese.dev/sitemap.xml`.
- Revisa **Rendimiento → por país** para ver dónde apareces y con qué queries. Es tu radar de progreso LatAm.
- (Nota: el "International Targeting" a nivel país de GSC está deprecado para sitios multi-idioma con `hreflang` correcto; tu palanca real es el `hreflang` + contenido, ya cubiertos.)

> **Salida de la Fase 0:** el sitio pasa de "declararse internacional/inglés por defecto" a "declararse hispanohablante con alcance LatAm+España", con el copy español a la altura. Sin escribir features nuevas.

---

### 🔵 FASE 1 — El motor de descubrimiento en español (días, riesgo bajo)

Aquí resolvemos **las dos intuiciones a la vez**: "llegar a LatAm" y "que el sitio no se sienta congelado". La herramienta es un **blog / notas técnicas en español (lideradas por ES), bilingüe**, sin base de datos.

- **Por qué esto y no otra cosa:** un portfolio estático rankea por un puñado de keywords fijas. Un blog genera **decenas de páginas nuevas indexables en español**, cada una apuntando a una consulta real de LatAm ("cómo validar RUT en TypeScript", "Azure Functions serverless para pymes", "migrar ERP sin downtime"). Es contenido fresco → Google lo premia → y es **el activo que más te acerca a Perú/Argentina/México/España** de forma orgánica, gratuita y sostenida.
- **Por qué es seguro/rápido:** MDX = posts en el repo, versionados en git, **sin base de datos, sin endpoint público nuevo, cero superficie de ataque adicional**. Encaja perfecto con tu routing `/es` `/en` ya existente.
- El diseño técnico completo (MDX, RSS, OG dinámica, integración con `sitemap`/`llms.txt`, TOC, reading time) está en **[DINAMISMO_Y_CONTENIDO.md §2](DINAMISMO_Y_CONTENIDO.md)**.

Complementos de "señales de vida" de bajo costo (también en el doc de dinamismo): página `/now`, `/changelog` del sitio, y micro-animaciones respetando `prefers-reduced-motion`.

---

### 🟡 FASE 2 — Blindaje antes de crecer (paralelo, obligatorio si añades dinámica con datos)

Tu objetivo incluye *"lo más seguro posible"*. El **riesgo #1 documentado sigue abierto**: el formulario de contacto no tiene honeypot, CAPTCHA ni rate limiting ([IMPROVE.md §2.1](IMPROVE.md), Sprint 1 aún sin marcar). Antes de sumar cualquier feature con base de datos (comentarios, guestbook, real-time), **hay que cerrar esto**, porque cada endpoint público nuevo multiplica la superficie de abuso.

Orden recomendado (de [IMPROVE.md](IMPROVE.md)):
1. Honeypot + descarte silencioso.
2. Cloudflare Turnstile (verificación server antes de Resend).
3. Rate limiting por IP (Upstash/Vercel KV).
4. Límite de longitud máxima + enforce `Content-Type` + verificación de `Origin`.
5. CSP en `Report-Only` → enforce.

> Regla: **no abrir features con DB hasta cerrar el Sprint 1 de seguridad.** Así "dinámico" nunca compite con "seguro".

---

### 🟣 FASE 3 — Dinamismo con datos (solo cuando aporte, no por moda)

Cuándo vale la pena una base de datos y qué construir primero está en **[DINAMISMO_Y_CONTENIDO.md §3-4](DINAMISMO_Y_CONTENIDO.md)**. Regla general: **el blog MDX (Fase 1) cubre el 90 % del "movimiento" percibido sin DB.** La DB se justifica solo cuando quieras *interacción persistente* (comentarios, guestbook, leaderboard del cubo, presencia en vivo con SignalR). Cada una añade superficie → va después de la Fase 2.

---

## 3. Roadmap consolidado (impacto vs. esfuerzo vs. riesgo)

| Prioridad | Acción | Esfuerzo | Riesgo | Impacto LatAm | Impacto "movimiento" |
|-----------|--------|----------|--------|:-------------:|:--------------------:|
| **P0** | `x-default → /es` (layout + sitemap) | 10 min | Nulo | 🔥🔥🔥 | — |
| **P0** | Fallback runtime → `es` | 5 min | Nulo | 🔥🔥 | — |
| **P0** | Keywords/description ES con señal LatAm | 30 min | Nulo | 🔥🔥🔥 | — |
| **P0** | `areaServed` en JSON-LD | 20 min | Nulo | 🔥🔥 | — |
| **P0** | `bio_2` ES a la par del EN + placeholders | 1 h | Nulo | 🔥🔥🔥 | — |
| **P0** | `og:alternateLocale` regional | 10 min | Nulo | 🔥 | — |
| **P0** | GA4 línea base + GSC + sitemap | 1 h | Nulo | 🔥 (medición) | — |
| **P1** | Blog MDX bilingüe (ES-led) + RSS + OG dinámica | 2-4 días | Bajo | 🔥🔥🔥 | 🔥🔥🔥 |
| **P1** | `/now` + `/changelog` + micro-motion | 1 día | Bajo | 🔥 | 🔥🔥 |
| **P2** | Blindar formulario (honeypot→Turnstile→rate limit) | 1-2 días | Bajo | — | 🛡️ habilitador |
| **P3** | Features con DB (comentarios, guestbook, SignalR) | variable | Medio | 🔥 | 🔥🔥 |

**Camino recomendado:** P0 completo en una tarde → medir → P1 (blog) como proyecto de la semana → P2 en paralelo → P3 solo lo que de verdad quieras mantener vivo.

---

## 4. Cómo mediremos el éxito (KPIs)

1. **% de sesiones desde LatAm+España** (GA4, Countries) — el número norte. Objetivo: invertir la mayoría anglo/europea en 2-3 meses.
2. **Sesiones orgánicas a `/es`** vs `/en` (GA4 Landing page + Acquisition).
3. **Impresiones/clics por país en GSC** — aparición de Perú, Argentina, México, España, Colombia.
4. **Páginas indexadas** (GSC Coverage) — debe crecer con cada post del blog.
5. **Consultas por leads** (mensajes del formulario / WhatsApp) con origen LatAm.
6. **Citas en motores de IA** en español (busca "Enzo Norese" en ChatGPT/Perplexity/Claude en español y verifica que respondan con tu info).

---

## 5. Estado de los pendientes heredados (consolidado)

Cierre de lo que ya estaba anotado en los otros docs y que este plan activa:

```
De OPTIMIZATION.md
[ ] about.bio_2 ES igualado a EN            → P0 (§2.6) — CRÍTICO para español
[ ] placeholders de formulario localizados  → P0 (§2.6)
[~] og:locale alternateLocale               → P0 (§2.5) — ampliar a regional

De IMPROVE.md (seguridad — riesgo #1, aún abierto)
[ ] Honeypot + CAPTCHA + rate limiting form → P2 (§Fase 2)
[ ] CSP Report-Only → enforce               → P2
[ ] prefers-reduced-motion en Hero          → P1 (parte de micro-motion) 

NUEVO — reenfoque LatAm (este documento)
[ ] x-default → /es (layout + sitemap)      → P0
[ ] FALLBACK_LOCALE → es                     → P0
[ ] keywords/description ES con señal LatAm → P0
[ ] areaServed en JSON-LD                    → P0
[ ] Blog MDX ES-led (motor de descubrimiento)→ P1  (ver DINAMISMO_Y_CONTENIDO.md)
[ ] GA4 línea base + GSC targeting          → P0
```

---

## 6. La idea en una frase

> **El sitio ya sabe hablar español; lo que falta es que se *presente* como hispanohablante ante el mundo (Fase 0) y que *tenga algo nuevo que decir* en español cada mes (Fase 1).** Lo primero se arregla en una tarde de configuración; lo segundo es el blog, que resuelve de un golpe tanto "llegar a LatAm" como "que no se sienta congelado".

---

*Documento estratégico. La Fase 0 es pura configuración/contenido (horas, reversible) y debería aplicarse ya. El detalle de implementación del dinamismo y la decisión sobre base de datos están en [DINAMISMO_Y_CONTENIDO.md](DINAMISMO_Y_CONTENIDO.md).*
