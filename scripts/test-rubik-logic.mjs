// Verification of the real cube logic in src/components/rubik/logic.ts
// Run: node --experimental-strip-types scripts/test-rubik-logic.mjs

import { MOVES, applyMove, isSolved, makeSolvedCube } from '../src/components/rubik/logic.ts'

let failures = 0
function check(name, cond) {
  if (!cond) { failures++; console.error(`FAIL  ${name}`) }
  else console.log(`ok    ${name}`)
}

function canon(cube) {
  return JSON.stringify(
    [...cube]
      .map(c => ({ pos: c.pos, stickers: Object.fromEntries(Object.entries(c.stickers).sort()) }))
      .sort((a, b) => JSON.stringify(a.pos).localeCompare(JSON.stringify(b.pos)))
  )
}

const DIR_AXIS = { px: [1, 0], nx: [-1, 0], py: [1, 1], ny: [-1, 1], pz: [1, 2], nz: [-1, 2] }
function stickersOutward(cube) {
  return cube.every(c =>
    Object.keys(c.stickers).every(dir => {
      const [comp, i] = DIR_AXIS[dir]
      return c.pos[i] === comp
    })
  )
}

const solved = makeSolvedCube()
const KEYS = Object.keys(MOVES)
const inverseSpec = s => ({ ...s, dir: -s.dir })

// 1. Four identical quarter-turns = identity, for every move
for (const k of KEYS) {
  let c = solved
  for (let i = 0; i < 4; i++) c = applyMove(c, MOVES[k])
  check(`4×${k} = identity`, canon(c) === canon(solved))
}

// 2. Move followed by its inverse = identity (from a scrambled position)
let base = solved
for (const k of ['R', 'U', "F'", 'D', "L'", 'B']) base = applyMove(base, MOVES[k])
for (const k of KEYS) {
  const c = applyMove(applyMove(base, MOVES[k]), inverseSpec(MOVES[k]))
  check(`${k} then inverse = identity`, canon(c) === canon(base))
}

// 3. A single move on a solved cube is NOT solved
for (const k of KEYS) {
  check(`${k} on solved cube → not solved`, !isSolved(applyMove(solved, MOVES[k])))
}

// 4. Middle slices (layer 0) also behave: 4× = identity, single slice ≠ solved
for (const axis of [0, 1, 2]) for (const dir of [1, -1]) {
  const spec = { axis, layer: 0, dir }
  let c = solved
  for (let i = 0; i < 4; i++) c = applyMove(c, spec)
  check(`4× slice(axis ${axis}, dir ${dir}) = identity`, canon(c) === canon(solved))
  check(`slice(axis ${axis}, dir ${dir}) ≠ solved`, !isSolved(applyMove(solved, spec)))
}

// 5. Random scramble + reversed inverse sequence = solved, stickers stay outward
let ok5 = true
for (let trial = 0; trial < 50 && ok5; trial++) {
  const seq = Array.from({ length: 25 }, () => MOVES[KEYS[Math.floor(Math.random() * KEYS.length)]])
  let c = solved
  for (const s of seq) c = applyMove(c, s)
  if (!stickersOutward(c)) { ok5 = false; console.error(`FAIL  stickers outward (trial ${trial})`) }
  for (const s of [...seq].reverse().map(inverseSpec)) c = applyMove(c, s)
  if (!isSolved(c)) { ok5 = false; console.error(`FAIL  scramble+inverse (trial ${trial})`) }
}
if (!ok5) failures++
check('50× random scramble + inverse = solved', ok5)

// 6. Sexy move (R U R' U') has order 6
let c6 = solved
for (let i = 0; i < 6; i++) for (const k of ['R', 'U', "R'", "U'"]) c6 = applyMove(c6, MOVES[k])
check("(R U R' U')×6 = identity", canon(c6) === canon(solved))

console.log(failures === 0 ? '\nAll cube-logic checks passed ✔' : `\n${failures} check(s) FAILED ✘`)
process.exit(failures === 0 ? 0 : 1)
