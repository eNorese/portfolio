# TEXT_IMPROVE.md — Mejora iterativa de los textos del sitio

> Bitácora viva para refinar el *copy* del portfolio (`src/i18n/es.json` y `src/i18n/en.json`).
> Cada entrada documenta: ubicación, texto actual, qué mejorar, opciones de redacción (ES + EN en paralelo) y la decisión final.
> Regla de oro: **ES y EN siempre se actualizan juntos** (el sitio ya sirve `/es` y `/en` como páginas indexables independientes).

**Estados:** ⏳ En discusión · 🔵 Propuesto · ✅ Aplicado

---

## #1 — Hero · Descripción principal ✅

**Ubicación:** [`es.json` → `hero.description`](src/i18n/es.json) · [`en.json` → `hero.description`](src/i18n/en.json)

### Texto actual
- **ES:** *"Diseño e implemento arquitecturas backend sobre **Microsoft Azure**, integrando **servicios cloud** e inteligencia artificial para resolver problemas reales de negocio. **Referente técnico** con experiencia en sistemas de reclutamiento, migración de ERP e integración de modelos de IA."*
- **EN:** *"I design and implement backend architectures on **Microsoft Azure**, integrating **cloud services** and artificial intelligence to solve real business problems. **Technical lead** with experience in recruitment systems, ERP migration, and AI model integration."*

### Qué mejorar
1. **Desacoplar de "Microsoft Azure"** → posicionarse como cloud-agnóstico ("infraestructura cloud"). Más amplio, no te encasilla en un solo proveedor.
2. **Redundancia de "cloud"**: si la frase empieza con "infraestructura cloud", luego "integrando servicios cloud" repite el término. Hay que cambiar esa segunda mención.
3. **"Referente técnico"** suena a auto-etiqueta y es algo vago. Conviene un término más estándar (*Líder técnico*) o, mejor, **mostrarlo con acción** ("He liderado…") en vez de declararlo.

> ⚖️ **Trade-off a tener presente:** "Microsoft Azure" es una *keyword* fuerte que los reclutadores buscan. Quitarla del Hero no es problema porque Azure **sigue muy presente** en Skills, Experiencia, los `keywords` del metadata y el `knowsAbout` del JSON-LD. El Hero gana amplitud sin perder la señal Azure a nivel global del sitio.

### Opciones de redacción

**Opción A — Cambio mínimo (fiel a tu idea)**
- **ES:** *"Diseño e implemento arquitecturas backend sobre **infraestructura cloud**, integrando **servicios escalables** e inteligencia artificial para resolver problemas reales de negocio. **Líder técnico** con experiencia en sistemas de reclutamiento, migración de ERP e integración de modelos de IA."*
- **EN:** *"I design and implement backend architectures on **cloud infrastructure**, integrating **scalable services** and artificial intelligence to solve real business problems. **Technical lead** with experience in recruitment systems, ERP migration, and AI model integration."*

**Opción B — Sin auto-etiqueta, en modo acción (más seguro/confiado)** ⭐ *recomendada*
- **ES:** *"Diseño e implemento arquitecturas backend sobre **infraestructura cloud**, combinando **servicios serverless** e inteligencia artificial para resolver problemas reales de negocio. **He liderado** sistemas de reclutamiento, migraciones de ERP e integración de modelos de IA."*
- **EN:** *"I design and implement backend architectures on **cloud infrastructure**, combining **serverless services** and artificial intelligence to solve real business problems. **I've led** recruitment systems, ERP migrations, and AI model integration."*

**Opción C — Más conciso y con punch**
- **ES:** *"Diseño e implemento arquitecturas backend sobre **infraestructura cloud**, donde los **servicios distribuidos** y la inteligencia artificial resuelven problemas reales de negocio. **Lidero** soluciones de reclutamiento, migración de ERP e integración de modelos de IA."*
- **EN:** *"I design and implement backend architectures on **cloud infrastructure**, where **distributed services** and artificial intelligence solve real business problems. **I lead** recruitment solutions, ERP migration, and AI model integration."*

### Paleta para mezclar
- **Reemplazo de "servicios cloud"** (elige el matiz que prefieras): `servicios escalables` · `servicios serverless` · `servicios gestionados` · `servicios distribuidos` · `microservicios`.
- **Verbo de apertura del 2º bloque:** `integrando` · `combinando` · `orquestando` · `donde … resuelven`.

### Alternativas a "Referente técnico"
| Alternativa | Tono |
|---|---|
| **He liderado…** / **Lidero…** | Acción concreta, confiado, sin etiquetarse. *(preferido)* |
| **Líder técnico** | Estándar, equivale al "Technical lead" del EN. |
| **Líder técnico y arquitecto de soluciones** | Más completo, algo más largo. |
| ~~Referente técnico~~ | Actual; suena a auto-proclamación y es difuso. |

### ✅ Decisión — APLICADO (Opción A, conservando "Referente técnico")
Razonamiento del cargo: *"referente"* transmite **peso e influencia técnica** ("mis ideas son escuchadas") sin afirmar autoridad jerárquica — matiz que *"líder técnico"* pierde.

- **ES:** *"Diseño e implemento arquitecturas backend sobre infraestructura cloud, integrando servicios escalables e inteligencia artificial para resolver problemas reales de negocio. Referente técnico con experiencia en sistemas de reclutamiento, migración de ERP e integración de modelos de IA."*
- **EN:** *"I design and implement backend architectures on cloud infrastructure, integrating scalable services and artificial intelligence to solve real business problems. **Go-to engineer** with experience in recruitment systems, ERP migration, and AI model integration."*

> 🔎 **Nota EN (resuelta):** elegido **"Go-to engineer"** — lleva *prueba social* implícita ("si todos recurren a él, es porque sabe") y evita la connotación de jefatura de "Technical lead". Es algo más coloquial que el "Referente técnico" en ES, pero esa asimetría de registro es aceptable. *(Pendiente menor: alinear el resto del EN — About/Experience aún dicen "technical lead".)*

---

## #2 — About · bio_1 · verbo "Opero" ✅

**Ubicación:** [`es.json` → `about.bio_1`](src/i18n/es.json)

- **Antes:** *"…arquitectura de soluciones cloud. **Opero como** referente técnico y arquitecto de soluciones — …"*
- **Después:** *"…arquitectura de soluciones cloud. **Me desempeño como** referente técnico y arquitecto de soluciones — …"*

**Motivo:** *"Opero"* suena mecánico/técnico. *"Me desempeño como"* es más natural y profesional.
**Alternativas válidas si se quiere cambiar:** `Ejerzo como` · `Actúo como` · `Trabajo como`.
*(EN `bio_1` dice "I operate as technical lead…" — "operate" es idiomático en inglés, se dejó igual. Avisar si se quiere alinear.)*

---

## #3 — About · bio_3 · "diagnóstico de hardware" ✅

**Ubicación:** [`es.json` → `about.bio_3`](src/i18n/es.json) · [`en.json` → `about.bio_3`](src/i18n/en.json)

- **ES antes:** *"…me otorga una visión amplia que abarca desde **el diagnóstico de hardware** hasta los sistemas distribuidos modernos."*
- **ES después:** *"…me otorga una visión amplia que abarca desde **los fundamentos de bajo nivel** hasta los sistemas distribuidos modernos."*
- **EN antes:** *"…spans from **hardware diagnostics** to modern distributed systems."*
- **EN después:** *"…spans from **low-level fundamentals** to modern distributed systems."*

**Motivo:** *"diagnóstico de hardware"* (verbo de servicio, en presente) podía leerse como oferta de **soporte técnico / reparación de PC**. El objetivo es posicionarse en **software**; la base electrónica aporta *profundidad de ingeniería*, no un servicio. *"Fundamentos de bajo nivel"* mantiene el arco (bajo nivel → distribuido) como narrativa de arquitecto, sin connotación de servicio.
**Alternativa** si se quiere conservar la palabra "hardware" como conocimiento (no servicio): `los fundamentos del hardware` / `hardware fundamentals`.

---

## #4 — Botón flotante de WhatsApp · mensaje precargado ✅

**Ubicación:** [`es.json` / `en.json` → `whatsapp.message`](src/i18n/es.json) · lógica en [FloatingWhatsApp.tsx](src/components/FloatingWhatsApp.tsx)

**Antes:** el botón abría `https://wa.me/<número>` sin mensaje.
**Después:** abre con texto precargado, **localizado al idioma activo** del visitante, vía `?text=${encodeURIComponent(t('whatsapp.message'))}`.

- **ES:** *"¡Hola Enzo! 👋 Vi tu portfolio en enorese.dev y me gustaría conversar contigo."*
- **EN:** *"Hi Enzo! 👋 I saw your portfolio at enorese.dev and I'd love to chat."*

**Motivo:** baja la fricción (el visitante no parte de cero), da contexto del origen (`enorese.dev` → sabes que el lead vino del sitio) y "conversar/chat" abre más conversaciones que pedir un proyecto cerrado.
*(Nota técnica: se reordenaron los hooks de `FloatingWhatsApp` para llamar `useLanguage()` antes del early return — buena higiene de hooks.)*

---

## Backlog — próximos textos a revisar

Candidatos detectados que conviene pulir más adelante (cada uno será su propia entrada):

- **`about.bio_2` ES ⟂ EN desbalanceado** — el EN menciona "zero data loss / zero downtime", el "Digital 24/7 Recruiter" y "Cyber Day"; el ES es genérico. *(Ya señalado en [OPTIMIZATION.md §4.1](OPTIMIZATION.md).)* Igualar la riqueza.
- **Tagline "Ingeniería Aumentada" / "Augmented Engineering"** (`about.bio_3`) — frase de marca fuerte; evaluar darle aún más protagonismo.
- **`hero.greeting` / `hero.title`** — revisar consistencia del título ("Desarrollador Backend & Arquitecto Cloud" vs. el EN "Backend Developer & Cloud Architect").
- **Placeholders del formulario** (`contact.form.placeholder_*`) — en ES siguen en inglés ("John Doe", "john@example.com"). Localizar.
- **`contact.description`** — tono del CTA; ¿más directo?
- **`skills.subtitle` / `projects.subtitle`** — micro-copys de subtítulos, verificar que no suenen genéricos.

---

## Plantilla para nuevas entradas

```markdown
## #N — <Sección> · <Campo> ⏳
**Ubicación:** `es.json → clave` · `en.json → clave`
### Texto actual
- ES: "…"
- EN: "…"
### Qué mejorar
1. …
### Opciones
**Opción A** — ES: "…" / EN: "…"
**Opción B** — ES: "…" / EN: "…"
### ✅ Decisión
Pendiente.
```
