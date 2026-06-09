# Plan de implementación — Easter egg "Rubik"

## Objetivo

Agregar un segundo easter egg al portafolio: al ejecutar el comando `rubik` dentro de la
terminal interactiva (`EasterEgg.tsx`), se cierra la terminal y se abre un modal con un
**cubo Rubik 3×3 interactivo en 3D**. El comando es secreto: no aparece en `help` ni en el
autocompletado. La pista para descubrirlo es un **archivo oculto `.rubik`** dentro de la
terminal, visible solo con `ls -a` / `ls -la`, cuyo contenido (`cat .rubik`) explica cómo
abrir el easter egg.

## Cadena de descubrimiento (UX)

1. El usuario abre la terminal (5 clics en el logo del navbar — ya implementado).
2. Ejecuta `ls -a` (o `ls -la`) y ve el archivo oculto `.rubik` además de los archivos normales.
3. Ejecuta `cat .rubik` → mensaje tipo: *"¿Encontraste este archivo? Ejecuta `rubik` para ver qué pasa…"*
4. Ejecuta `rubik` → la terminal imprime una línea de "lanzamiento", se cierra, y se abre el modal del cubo.
5. Dentro del modal: arrastrar para orbitar el cubo, botones/clic para girar caras, **Scramble para desordenarlo e intentar armarlo**, reset, contador de movimientos y detección de "resuelto" con celebración.

## Arquitectura

Se replica el patrón existente terminal ⇄ navbar:

- La terminal **despacha un `CustomEvent('enorese:rubik')`** en `window` cuando se ejecuta `rubik`, y se cierra a sí misma (`setActive(false)`). Cerrarla evita conflictos de `Escape`, scroll-lock y z-index entre los dos modales.
- Un nuevo componente **`RubikCube.tsx`** escucha ese evento y se monta como modal independiente (mismo patrón que `EasterEgg` escuchando `enorese:easter-egg`).
- Se agrega `rubikCube: true` a `portfolioSections` en `src/config/sections.ts` y se monta con `dynamic()` en `page.tsx`, igual que el resto de secciones.
- **Sin dependencias nuevas**: el cubo se renderiza con CSS 3D transforms (`transform-style: preserve-3d`, `rotateX/Y/Z`), que es suficiente para un 3×3 y mantiene el bundle liviano (no Three.js).

## Cambios por archivo

### 1. `src/config/sections.ts`

```ts
export const portfolioSections = {
  // ...existente
  easterEgg: true,
  rubikCube: true,   // ← nuevo
} as const
```

### 2. `src/app/page.tsx`

```tsx
const RubikCube = dynamic(() => import('@/components/RubikCube').then(m => ({ default: m.RubikCube })))
// ...
{portfolioSections.rubikCube && <RubikCube />}
```

### 3. `src/components/EasterEgg.tsx`

**a) Archivo oculto.** Agregar `.rubik` al record `FILES`:

```ts
'.rubik': [
  { text: '╭──────────────────────────────────────╮', cls: 'text-purple-400' },
  { text: '│  You found a hidden file. Nice. 🕵️  │', cls: 'text-purple-400' },
  { text: '╰──────────────────────────────────────╯', cls: 'text-purple-400' },
  { text: '' },
  { text: 'There is more than one easter egg here.',  cls: 'text-gray-300' },
  { text: 'Try running:',                              cls: 'text-gray-300' },
  { text: '' },
  { text: '    rubik',                                 cls: 'text-yellow-400' },
],
```

**b) `ls` con flag `-a`.** Hoy `ls` solo distingue el flag `l`. Detectar también `a`:

```ts
const showAll = args.some(a => a.startsWith('-') && a.includes('a'))
```

- `ls -a`  → listado corto incluyendo `.`, `..` y `.rubik` (color `text-purple-400` para que destaque sutilmente).
- `ls -la` → al listado largo existente se le agrega la fila:
  `-rw------- 1 enzo enzo   66 Apr 14 2025 .rubik` (también en púrpura).
- `ls` sin `-a` NO muestra `.rubik` (comportamiento Unix real — esa es la gracia).

**c) Comando `rubik`.** Extender el tipo de retorno de `run()` con `rubik?: boolean` y agregar el case:

```ts
case 'rubik':
  return {
    output: [
      { text: 'Initializing cube engine…', cls: 'text-purple-400' },
      { text: '🧩 Launching Rubik mode',   cls: 'text-purple-400' },
    ],
    rubik: true,
  }
```

En `handleKeyDown` (rama `Enter`), manejar el flag: registrar el comando en el historial,
mostrar el output ~600 ms (setTimeout) para que se lea la línea de lanzamiento, luego
`window.dispatchEvent(new CustomEvent('enorese:rubik'))` y `setActive(false)`.

**d) Mantenerlo secreto.**
- NO agregar `rubik` a `ALL_COMMANDS` (sin tab-complete del comando) ni al output de `help`.
- En `ARG_COMPLETIONS.cat` / `ls`, incluir `.rubik` **solo si el prefijo escrito empieza con `.`**
  (así `cat <Tab>` no lo delata, pero `cat .<Tab>` sí completa — coherente con bash real).
  Implementación: filtrar `FILE_COMPLETIONS` ocultando entradas que empiezan con `.` salvo que
  `argPrefix.startsWith('.')`.

### 4. `src/components/RubikCube.tsx` (nuevo, `'use client'`)

#### Estado y modelo de datos

Modelo de **stickers por cara** (más simple de validar que cubelets con orientación):

```ts
type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B'
type CubeState = Record<Face, string[]>  // 9 colores por cara, índices 0-8 (fila por fila)
```

- Colores como tokens (`'white' | 'yellow' | 'red' | 'orange' | 'green' | 'blue'`) mapeados a clases/hex.
- Un módulo puro de lógica (funciones `rotateFace(state, face, direction): CubeState`) con las
  6 permutaciones de quarter-turn (rotación de los 9 stickers de la cara + ciclo de los 12
  stickers adyacentes). Son tablas de permutación fijas: tediosas pero triviales de testear.
- `isSolved(state)`: cada cara tiene sus 9 stickers iguales.
- `scramble()`: 20–25 movimientos aleatorios aplicados al estado (guardar la secuencia no es necesario).

#### Estética — plástico brillante (glossy)

El cubo debe verse como un cubo Rubik físico de plástico pulido, no como cuadrados planos:

- **Cuerpo negro del cubo**: cada cubelet tiene fondo `#0a0a0a`–`#1a1a1a` con `border-radius` ~10%
  (las esquinas redondeadas del plástico) y un borde interior sutil
  (`box-shadow: inset 0 0 2px rgba(255,255,255,0.08)`).
- **Stickers con profundidad**: cada sticker es un `<div>` inset (~88% del tamaño de la carita,
  centrado, `border-radius: 12%`) cuyo color base se enriquece con un
  `linear-gradient(135deg, <color claro> 0%, <color> 45%, <color oscuro> 100%)` — simula la
  curvatura del plástico atrapando la luz desde arriba-izquierda.
- **Brillo especular**: overlay `radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.55), transparent 45%)`
  sobre cada sticker (un pseudo-elemento o `<span>` con `pointer-events: none`) — el "destello"
  característico del plástico brillante. Como la fuente de luz queda fija respecto a la pantalla
  mientras el cubo rota, el efecto se percibe como reflejo real al orbitar.
- **Definición de colores**: paleta clásica con variante clara/oscura por color para los gradientes,
  p. ej. rojo `#ff5b52 / #e0201b / #a01511`, verde `#5fd068 / #16a34a / #0d6b30`, etc.
  Centralizada en un mapa `STICKER_COLORS: Record<Color, { light, base, dark }>`.
- **Sombra de contacto**: bajo el cubo, un `<div>` elíptico con `radial-gradient` oscuro y `blur`,
  que escala levemente según `rx` (al inclinar el cubo la sombra se estira) — ancla el cubo al
  "suelo" del modal.
- **Luz ambiental del modal**: glow púrpura tenue detrás del cubo
  (`box-shadow: 0 0 80px rgba(168,85,247,0.08)`) para diferenciarlo del verde de la terminal
  manteniendo la misma familia visual.
- Todo con CSS puro (gradientes + box-shadows); sin imágenes ni filtros costosos, así las
  rotaciones se mantienen a 60 fps.

#### Render 3D (CSS puro)

- Contenedor con `perspective: 1000px`; dentro, un `<div>` "cubo" con
  `transform-style: preserve-3d` y `transform: rotateX(rx) rotateY(ry)` controlado por estado.
- **27 cubelets** posicionados con `translate3d` (tamaño ~`56px` por cubelet, gap 2px); cada
  cubelet pinta hasta 3 caritas visibles según su posición. Las caritas leen su color del
  `CubeState`. Alternativa más simple si el mapeo cubelet→sticker se complica: renderizar
  **6 planos de 9 stickers** posicionados como caras del cubo (suficiente visualmente, ya que
  las animaciones de giro se hacen con un overlay — ver abajo).
- **Animación de giro de cara**: al girar, envolver los 9 cubelets de esa capa en un grupo con
  `transition: transform 250ms` rotando ±90°; al terminar (`onTransitionEnd` o timeout),
  aplicar la permutación al estado y resetear el transform del grupo. Bloquear inputs durante
  la animación (flag `isAnimating`).

#### Interacción

- **Orbitar la vista**: **Alt + arrastrar** (en cualquier parte del stage) → actualizar `rx/ry`
  (con `setPointerCapture`). Arrastrar el fondo sin Alt también orbita (fallback para touch,
  donde no existe Alt). Limitar `rx` a ±90° para no "voltear" el cubo.
- **Girar capas con el cursor**: arrastrar un sticker **sin Alt** gira su capa. El vector de
  arrastre en pantalla se lleva al espacio local del cubo con la inversa de la rotación de
  vista; el eje de giro es `ω = n × d` (normal del sticker × dirección de arrastre), ajustado
  al eje dominante, y la capa es la coordenada del cubelet en ese eje (incluye slices medios).
  Un giro por gesto, con umbral de ~14 px.
- **Girar caras (alternativa)**: barra de botones `U U' D D' L L' R R' F F' B B'` (notación
  estándar) + atajos de teclado (tecla = giro horario, Shift+tecla = antihorario).
- **Modo desafío (Scramble)**: botón `Scramble` prominente que desordena el cubo con una
  secuencia animada rápida (~8 giros visibles a ~80 ms + el resto aplicado instantáneo, para
  que se "vea" el desorden sin esperar 25 animaciones). Al hacer scramble se activa el modo
  desafío: el contador de movimientos se resetea a 0 y empieza un cronómetro discreto.
  Al resolverlo → banner "🎉 Solved in N moves — M:SS!" con un pulso de glow sobre el cubo.
  `Reset` restaura el cubo resuelto y sale del modo desafío.
- **Cierre**: `Escape`, clic en backdrop, y botón rojo de "window chrome" (reusar el mismo
  chrome estético del terminal: 3 dots + título `rubik — 3×3`, para que se sientan familia).

#### Comportamiento de modal (copiar del terminal)

- `useEffect` escuchando `enorese:rubik` para abrir y resetear estado.
- Scroll-lock en `body` mientras está activo.
- `z-[9999]`, backdrop `rgba(0,0,0,0.82)` + blur — mismos valores que la terminal.
- `role="dialog"` `aria-modal="true"` `aria-label="Rubik cube easter egg"`.

## Orden de implementación

1. **Lógica pura del cubo** (`rotateFace`, `isSolved`, `scramble`) — sin UI, fácil de verificar
   en aislamiento (p. ej. 4 giros iguales = identidad; scramble + secuencia inversa = resuelto).
2. **`RubikCube.tsx`**: modal + render estático del cubo resuelto con el acabado glossy
   (gradientes, especular, sombra de contacto) + orbitar con drag.
3. Giros de cara con animación + botones + teclado + modo desafío
   (scramble animado / reset / contador / cronómetro / solved).
4. **Integración**: `sections.ts`, `page.tsx`, evento `enorese:rubik`.
5. **Terminal**: comando `rubik`, archivo `.rubik`, `ls -a`, tab-completion condicional.
6. Pulido responsive (en móvil el cubo escala con `clamp()`; botones de giro en grid táctil).

## Criterios de aceptación

- [x] `ls` NO muestra `.rubik`; `ls -a` y `ls -la` SÍ lo muestran.
- [x] `cat .rubik` muestra la pista que menciona el comando `rubik`.
- [x] `rubik` no aparece en `help` ni se autocompleta con Tab (pero `cat .<Tab>` completa `.rubik`).
- [x] Ejecutar `rubik` imprime la línea de lanzamiento, cierra la terminal y abre el modal del cubo.
- [x] El cubo se puede orbitar con drag (mouse y touch) y girar caras con botones y teclado.
- [x] El cubo tiene acabado de plástico brillante: stickers con gradiente, destello especular,
      esquinas redondeadas y sombra de contacto (no cuadrados planos de color sólido).
- [x] `Scramble` desordena el cubo con animación visible y activa el modo desafío
      (contador en 0 + cronómetro); `Reset` restaura el cubo resuelto.
- [x] Resolver el cubo tras un scramble muestra el banner con movimientos y tiempo.
- [x] `Escape` / clic fuera / botón rojo cierran el modal y restauran el scroll del body.
- [x] Sin dependencias nuevas en `package.json`; el componente carga con `dynamic()` (no afecta el bundle inicial).
- [x] `rubikCube: false` en `sections.ts` desactiva todo (el comando `rubik` puede seguir existiendo en la terminal, pero el modal no se monta — opcional: condicionar también el case del comando leyendo el flag).

## Revisión post-implementación (lo que quedó distinto al plan)

1. **Render con Three.js, no CSS**: para lograr plástico realista se migró a
   `three` + `@react-three/fiber` + `@react-three/drei`. Materiales `MeshPhysicalMaterial`
   con clearcoat (stickers roughness 0.16 / clearcoat 1; cuerpo negro roughness 0.32),
   geometría `RoundedBoxGeometry` compartida, entorno procedural con `Lightformer`
   (sin fetch de HDR externo) y `ContactShadows`. La escena (`src/components/rubik/RubikScene.tsx`)
   se carga con `React.lazy` solo al abrir el easter egg — el bundle inicial no crece.
2. **Giro que sigue al cursor**: arrastrar un sticker rota la capa 1:1 con el cursor
   (~110 px = 90°). Si se suelta a mitad de giro, **la capa queda donde se dejó** (como un
   cubo físico); solo ajusta si queda a <10° de un cuarto. Cruzar 90° consolida el cuarto
   en el estado lógico y permite seguir girando en el mismo gesto. Mientras una capa está
   desalineada, girar otra capa o usar botones primero la alinea al cuarto más cercano
   (un cubo real bloquea los otros ejes).
3. **Picking manual**: la detección del sticker bajo el cursor usa un `THREE.Raycaster`
   propio (NDC desde el rect del contenedor) en vez del sistema de eventos de R3F —
   determinista y testeable con eventos sintéticos.
4. **React 19**: Next 15 App Router usa su React vendoreado (19) ignorando el de
   node_modules; se alineó `package.json` a react 19 + fiber 9 + drei 10.
5. La lógica pura vive en `src/components/rubik/logic.ts` y se testea directo con
   `node --experimental-strip-types scripts/test-rubik-logic.mjs`.

## Riesgos / notas

- **Permutaciones de stickers**: es el punto más propenso a errores. Mitigación: definir las 6
  tablas con comentarios de orientación y verificar con la propiedad "4 giros = identidad".
- **Doble modal**: la terminal se cierra antes de abrir el cubo, así que nunca conviven dos
  scroll-locks ni dos listeners de `Escape`.
- **El listener de `Escape` de la terminal es global** (`window`): verificar que al cerrar la
  terminal se desregistra (ya ocurre — el efecto no depende de `active`, pero `setActive(false)`
  es idempotente, así que no hay conflicto real).
- **Móvil**: la terminal ya es difícil de usar en móvil (requiere teclado); el cubo en cambio sí
  debe funcionar bien con touch — los pointer events cubren ambos casos.
