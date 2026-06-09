/* Pure Rubik's cube state logic — no rendering concerns.
   Model space: x → right, y → up, z → toward viewer (matches three.js). */

export type Vec3     = [number, number, number]
export type Dir      = 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz'
export type ColorKey = 'white' | 'yellow' | 'red' | 'orange' | 'green' | 'blue'
export type Stickers = Partial<Record<Dir, ColorKey>>
export type Cubelet  = { pos: Vec3; stickers: Stickers }
export type MoveKey  = 'U' | "U'" | 'D' | "D'" | 'L' | "L'" | 'R' | "R'" | 'F' | "F'" | 'B' | "B'"

/* axis: which pos component selects the layer (0 allows middle slices via
   sticker drags). dir: right-hand-rule sign of the quarter turn about +axis. */
export type MoveSpec = { axis: 0 | 1 | 2; layer: 1 | 0 | -1; dir: 1 | -1 }

export const DIR_VECS: Record<Dir, Vec3> = {
  px: [1, 0, 0], nx: [-1, 0, 0],
  py: [0, 1, 0], ny: [0, -1, 0],
  pz: [0, 0, 1], nz: [0, 0, -1],
}

function vecToDir([x, y, z]: Vec3): Dir {
  if (x === 1) return 'px'
  if (x === -1) return 'nx'
  if (y === 1) return 'py'
  if (y === -1) return 'ny'
  return z === 1 ? 'pz' : 'nz'
}

type Rot = (v: Vec3) => Vec3
/* Right-hand-rule quarter turns about each +axis (and their inverses) */
const rotXp: Rot = ([x, y, z]) => [x, -z, y]
const rotXn: Rot = ([x, y, z]) => [x, z, -y]
const rotYp: Rot = ([x, y, z]) => [z, y, -x]
const rotYn: Rot = ([x, y, z]) => [-z, y, x]
const rotZp: Rot = ([x, y, z]) => [-y, x, z]
const rotZn: Rot = ([x, y, z]) => [y, -x, z]

const ROTS: Record<0 | 1 | 2, Record<1 | -1, Rot>> = {
  0: { 1: rotXp, [-1]: rotXn },
  1: { 1: rotYp, [-1]: rotYn },
  2: { 1: rotZp, [-1]: rotZn },
}

export const MOVES: Record<MoveKey, MoveSpec> = {
  'R':  { axis: 0, layer: 1,  dir: -1 },
  "R'": { axis: 0, layer: 1,  dir: 1 },
  'L':  { axis: 0, layer: -1, dir: 1 },
  "L'": { axis: 0, layer: -1, dir: -1 },
  'U':  { axis: 1, layer: 1,  dir: -1 },
  "U'": { axis: 1, layer: 1,  dir: 1 },
  'D':  { axis: 1, layer: -1, dir: 1 },
  "D'": { axis: 1, layer: -1, dir: -1 },
  'F':  { axis: 2, layer: 1,  dir: -1 },
  "F'": { axis: 2, layer: 1,  dir: 1 },
  'B':  { axis: 2, layer: -1, dir: 1 },
  "B'": { axis: 2, layer: -1, dir: -1 },
}

export const MOVE_ORDER: MoveKey[] = ['U', 'D', 'L', 'R', 'F', 'B', "U'", "D'", "L'", "R'", "F'", "B'"]

export function makeSolvedCube(): Cubelet[] {
  const cubelets: Cubelet[] = []
  for (const x of [-1, 0, 1]) for (const y of [-1, 0, 1]) for (const z of [-1, 0, 1]) {
    if (x === 0 && y === 0 && z === 0) continue
    const stickers: Stickers = {}
    if (x === 1)  stickers.px = 'red'
    if (x === -1) stickers.nx = 'orange'
    if (y === 1)  stickers.py = 'white'
    if (y === -1) stickers.ny = 'yellow'
    if (z === 1)  stickers.pz = 'green'
    if (z === -1) stickers.nz = 'blue'
    cubelets.push({ pos: [x, y, z], stickers })
  }
  return cubelets
}

export function applyMove(cube: Cubelet[], spec: MoveSpec): Cubelet[] {
  const rot = ROTS[spec.axis][spec.dir]
  return cube.map(c => {
    if (c.pos[spec.axis] !== spec.layer) return c
    const stickers: Stickers = {}
    for (const [dir, color] of Object.entries(c.stickers) as [Dir, ColorKey][]) {
      stickers[vecToDir(rot(DIR_VECS[dir]))] = color
    }
    return { pos: rot(c.pos), stickers }
  })
}

export function isSolved(cube: Cubelet[]): boolean {
  const seen: Stickers = {}
  for (const c of cube) {
    for (const [dir, color] of Object.entries(c.stickers) as [Dir, ColorKey][]) {
      if (seen[dir] === undefined) seen[dir] = color
      else if (seen[dir] !== color) return false
    }
  }
  return true
}

const FACES = ['U', 'D', 'L', 'R', 'F', 'B'] as const

export function scrambleSequence(n = 22): MoveKey[] {
  const seq: MoveKey[] = []
  let last = ''
  for (let i = 0; i < n; i++) {
    let face: string
    do { face = FACES[Math.floor(Math.random() * FACES.length)] } while (face === last)
    last = face
    seq.push((Math.random() < 0.5 ? face : face + "'") as MoveKey)
  }
  return seq
}

/* Classic Rubik's brand palette */
export const STICKER_COLORS: Record<ColorKey, string> = {
  white:  '#f4f4f8',
  yellow: '#ffd500',
  red:    '#c41e3a',
  orange: '#ff5800',
  green:  '#009b48',
  blue:   '#0051ba',
}

export function fmtTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
