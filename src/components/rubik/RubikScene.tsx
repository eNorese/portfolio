'use client'

import {
  forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState,
} from 'react'
import type { MutableRefObject, PointerEvent as ReactPointerEvent } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { RoundedBoxGeometry } from 'three-stdlib'
import {
  DIR_VECS, STICKER_COLORS, applyMove, isSolved, makeSolvedCube,
} from './logic'
import type { ColorKey, Cubelet, Dir, MoveSpec, Vec3 } from './logic'

/* ── Tuning ─────────────────────────────────────────────────────────────── */
const SPACING        = 1.03  // cubelet grid pitch
const PX_PER_QUARTER = 110   // drag pixels for a full 90° turn
const SNAP_DEG       = 10    // released this close to a quarter → snap to it
const START_PX       = 8     // drag distance before a gesture commits to a layer

/* A layer mid-turn. angle is in degrees, right-hand rule about +axis.
   target === null → free (follows the cursor / rests where released). */
type Pending = {
  axis: 0 | 1 | 2
  layer: 1 | 0 | -1
  angle: number
  target: number | null
  dur?: number
  fromDrag?: boolean
  onDone?: (solved: boolean) => void
}

type FaceDrag = {
  pos: Vec3; normal: Vec3
  x0: number; y0: number
  started: boolean
  axis: 0 | 1 | 2; sign: 1 | -1
  u: [number, number]   // screen-space unit vector of the gesture
  baseAngle: number
}

export type RubikSceneHandle = {
  doMove: (spec: MoveSpec, dur: number) => Promise<boolean>
  reset: () => void
}

type Props = {
  onDragCommit: (solved: boolean) => void
  lockedRef: MutableRefObject<boolean>
}

const AXES = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, 0, 1),
]

const nearestQuarter = (a: number) =>
  Math.max(-90, Math.min(90, Math.round(a / 90) * 90))

/* Scratch objects reused every frame (no per-frame allocations) */
const tmpQx = new THREE.Quaternion()
const tmpQy = new THREE.Quaternion()
const tmpQ  = new THREE.Quaternion()
const tmpV  = new THREE.Vector3()

function viewQuat(out: THREE.Quaternion, rx: number, ry: number): THREE.Quaternion {
  tmpQx.setFromAxisAngle(AXES[0], THREE.MathUtils.degToRad(rx))
  tmpQy.setFromAxisAngle(AXES[1], THREE.MathUtils.degToRad(ry))
  return out.multiplyQuaternions(tmpQx, tmpQy)
}

/* Sticker orientation per face direction (+z of the geometry → dir) */
const STICKER_QUATS: Record<Dir, THREE.Quaternion> = Object.fromEntries(
  (Object.entries(DIR_VECS) as [Dir, Vec3][]).map(([dir, v]) => [
    dir,
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...v)),
  ]),
) as Record<Dir, THREE.Quaternion>

/* ── Inner rig: meshes + per-frame transforms ───────────────────────────── */
function CubeRig({
  cube, cubeRef, pendingRef, faceDragRef, rotRef, pickRef, setCube,
  onDragCommit, waitersRef,
}: {
  cube: Cubelet[]
  cubeRef: MutableRefObject<Cubelet[]>
  pendingRef: MutableRefObject<Pending | null>
  faceDragRef: MutableRefObject<FaceDrag | null>
  rotRef: MutableRefObject<{ x: number; y: number }>
  pickRef: MutableRefObject<{ camera: THREE.Camera; group: THREE.Group } | null>
  setCube: (c: Cubelet[]) => void
  onDragCommit: (solved: boolean) => void
  waitersRef: MutableRefObject<(() => void)[]>
}) {
  const orbitRef    = useRef<THREE.Group>(null)
  const cubeletRefs = useRef<(THREE.Group | null)[]>([])
  const camera      = useThree(s => s.camera)

  /* Expose camera + scene group so the wrapper div can raycast sticker hits */
  useEffect(() => {
    if (orbitRef.current) pickRef.current = { camera, group: orbitRef.current }
    return () => { pickRef.current = null }
  }, [camera, pickRef])

  /* Shared geometries & materials */
  const bodyGeo = useMemo(() => new RoundedBoxGeometry(0.97, 0.97, 0.97, 4, 0.07), [])
  const stickerGeo = useMemo(() => new RoundedBoxGeometry(0.8, 0.8, 0.05, 3, 0.02), [])
  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0a0a0d', roughness: 0.32, metalness: 0,
    clearcoat: 0.65, clearcoatRoughness: 0.35,
  }), [])
  const stickerMats = useMemo(() => {
    const mats = {} as Record<ColorKey, THREE.MeshPhysicalMaterial>
    for (const [key, color] of Object.entries(STICKER_COLORS) as [ColorKey, string][]) {
      mats[key] = new THREE.MeshPhysicalMaterial({
        color, roughness: 0.16, metalness: 0,
        clearcoat: 1, clearcoatRoughness: 0.07,
      })
    }
    return mats
  }, [])

  useEffect(() => () => {
    bodyGeo.dispose(); stickerGeo.dispose(); bodyMat.dispose()
    Object.values(stickerMats).forEach(m => m.dispose())
  }, [bodyGeo, stickerGeo, bodyMat, stickerMats])

  const commit = useCallback((axis: 0 | 1 | 2, layer: 1 | 0 | -1, dir: 1 | -1): Cubelet[] => {
    const next = applyMove(cubeRef.current, { axis, layer, dir })
    cubeRef.current = next
    setCube(next)
    return next
  }, [cubeRef, setCube])

  const flushWaiters = useCallback(() => {
    const ws = waitersRef.current
    waitersRef.current = []
    ws.forEach(w => w())
  }, [waitersRef])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    if (orbitRef.current) {
      viewQuat(orbitRef.current.quaternion, rotRef.current.x, rotRef.current.y)
    }

    const p = pendingRef.current
    if (p) {
      /* Animate toward a snap/move target */
      if (p.target !== null) {
        const speed = p.dur ? 90000 / p.dur : 480 // deg/s
        const delta = p.target - p.angle
        const step  = Math.sign(delta) * Math.min(Math.abs(delta), speed * dt)
        p.angle += step
        if (Math.abs(p.target - p.angle) < 0.01) {
          p.angle = p.target
          const t = p.target
          pendingRef.current = null
          let solved = false
          if (t !== 0) {
            const next = commit(p.axis, p.layer, t > 0 ? 1 : -1)
            solved = isSolved(next)
            if (p.fromDrag) onDragCommit(solved)
          }
          p.onDone?.(solved)
          flushWaiters()
        }
      } else {
        /* Free drag: commit quarter turns as the cursor crosses them */
        while (p.angle >= 90) {
          const next = commit(p.axis, p.layer, 1)
          p.angle -= 90
          if (faceDragRef.current) faceDragRef.current.baseAngle -= 90
          onDragCommit(Math.abs(p.angle) < 1 && isSolved(next))
        }
        while (p.angle <= -90) {
          const next = commit(p.axis, p.layer, -1)
          p.angle += 90
          if (faceDragRef.current) faceDragRef.current.baseAngle += 90
          onDragCommit(Math.abs(p.angle) < 1 && isSolved(next))
        }
        /* Layer drifted back to aligned and nobody is holding it → settle */
        if (!faceDragRef.current && Math.abs(p.angle) < 0.01) {
          pendingRef.current = null
          flushWaiters()
        }
      }
    }

    /* Place every cubelet; the pending layer gets the extra rotation */
    const pNow = pendingRef.current
    if (pNow) tmpQ.setFromAxisAngle(AXES[pNow.axis], THREE.MathUtils.degToRad(pNow.angle))
    cubeRef.current.forEach((c, i) => {
      const g = cubeletRefs.current[i]
      if (!g) return
      g.position.set(c.pos[0] * SPACING, c.pos[1] * SPACING, c.pos[2] * SPACING)
      if (pNow && c.pos[pNow.axis] === pNow.layer) {
        g.position.applyQuaternion(tmpQ)
        g.quaternion.copy(tmpQ)
      } else {
        g.quaternion.identity()
      }
    })
  })

  return (
    <group ref={orbitRef}>
      {cube.map((c, i) => (
        <group key={i} ref={el => { cubeletRefs.current[i] = el }}>
          <mesh geometry={bodyGeo} material={bodyMat} />
          {(Object.entries(c.stickers) as [Dir, ColorKey][]).map(([dir, color]) => (
            <mesh
              key={dir}
              geometry={stickerGeo}
              material={stickerMats[color]}
              position={tmpV.set(...DIR_VECS[dir]).multiplyScalar(0.5).toArray()}
              quaternion={STICKER_QUATS[dir]}
              userData={{ pos: c.pos, normal: DIR_VECS[dir] }}
            />
          ))}
        </group>
      ))}
    </group>
  )
}

/* ── Scene: canvas, lights, gestures ────────────────────────────────────── */
const RubikScene = forwardRef<RubikSceneHandle, Props>(function RubikScene(
  { onDragCommit, lockedRef }, ref,
) {
  const [cube, setCube] = useState<Cubelet[]>(makeSolvedCube)
  const cubeRef       = useRef(cube)
  const pendingRef    = useRef<Pending | null>(null)
  const faceDragRef   = useRef<FaceDrag | null>(null)
  const orbitDragRef  = useRef<{ x: number; y: number } | null>(null)
  const pickRef       = useRef<{ camera: THREE.Camera; group: THREE.Group } | null>(null)
  const rotRef        = useRef({ x: 25, y: -35 })
  const waitersRef    = useRef<(() => void)[]>([])
  const raycaster     = useRef(new THREE.Raycaster()).current
  const ndc           = useRef(new THREE.Vector2()).current

  const wrapRef = useRef<HTMLDivElement>(null)

  /* Manual raycast — independent from r3f's event system so it also works
     with synthetic pointer events and any browser zoom level */
  const pickSticker = useCallback((clientX: number, clientY: number) => {
    const pick = pickRef.current
    const el   = wrapRef.current
    if (!pick || !el) return null
    const rect = el.getBoundingClientRect()
    ndc.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    )
    raycaster.setFromCamera(ndc, pick.camera)
    const hit = raycaster.intersectObject(pick.group, true)
      .find(h => (h.object.userData as { normal?: Vec3 }).normal)
    return hit ? (hit.object.userData as { pos: Vec3; normal: Vec3 }) : null
  }, [ndc, raycaster])

  const waitAligned = useCallback(() => new Promise<void>(res => {
    const p = pendingRef.current
    if (!p) return res()
    if (p.target === null) p.target = nearestQuarter(p.angle)
    waitersRef.current.push(res)
  }), [])

  useImperativeHandle(ref, () => ({
    doMove: async (spec, dur) => {
      await waitAligned()
      return new Promise<boolean>(res => {
        pendingRef.current = {
          axis: spec.axis, layer: spec.layer,
          angle: 0, target: spec.dir * 90, dur, onDone: res,
        }
      })
    },
    reset: () => {
      pendingRef.current = null
      faceDragRef.current = null
      const next = makeSolvedCube()
      cubeRef.current = next
      setCube(next)
      waitersRef.current.splice(0).forEach(w => w())
    },
  }), [waitAligned])

  /* Debug handle for automated verification */
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    w.__rubik = {
      cube: () => cubeRef.current,
      pending: () => (pendingRef.current ? { ...pendingRef.current, onDone: undefined } : null),
      rot: () => ({ ...rotRef.current }),
      solved: () => isSolved(cubeRef.current),
      pick: (x: number, y: number) => pickSticker(x, y),
      hasPickTargets: () => !!pickRef.current,
    }
    return () => { delete w.__rubik }
  }, [pickSticker])

  /* Pointer interaction:
     - Alt + drag (anywhere) → orbit the whole cube
     - drag starting on a sticker, no Alt → that layer follows the cursor;
       released mid-turn it stays put (snaps only within SNAP_DEG of a quarter)
     - drag on the background, no Alt → orbit (touch fallback) */
  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    const hit = e.altKey ? null : pickSticker(e.clientX, e.clientY)
    if (!e.altKey && hit && !lockedRef.current) {
      faceDragRef.current = {
        pos: hit.pos, normal: hit.normal,
        x0: e.clientX, y0: e.clientY,
        started: false, axis: 0, sign: 1, u: [0, 0], baseAngle: 0,
      }
    } else {
      orbitDragRef.current = { x: e.clientX, y: e.clientY }
    }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* untrusted/stale pointer id */ }
  }, [lockedRef, pickSticker])

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const fd = faceDragRef.current
    if (fd) {
      const dx = e.clientX - fd.x0
      const dy = e.clientY - fd.y0
      if (!fd.started) {
        if (Math.hypot(dx, dy) < START_PX) return
        /* Lock the gesture onto an axis: ω = n × d in cube-local space */
        const dLocal = tmpV.set(dx, -dy, 0).normalize()
          .applyQuaternion(viewQuat(tmpQ, rotRef.current.x, rotRef.current.y).invert())
        const n = new THREE.Vector3(...fd.normal)
        const omega = n.cross(dLocal)
        const comps: [number, number, number] = [omega.x, omega.y, omega.z]
        let axis: 0 | 1 | 2 = 0
        if (Math.abs(comps[1]) > Math.abs(comps[axis])) axis = 1
        if (Math.abs(comps[2]) > Math.abs(comps[axis])) axis = 2
        if (Math.abs(comps[axis]) < 1e-4) { faceDragRef.current = null; return }
        const sign  = comps[axis] > 0 ? 1 : -1
        const layer = fd.pos[axis] as 1 | 0 | -1

        const p = pendingRef.current
        if (p && (p.axis !== axis || p.layer !== layer)) {
          /* Another layer is resting mid-turn — a real cube blocks here.
             Send it to the nearest quarter and ignore this gesture. */
          if (p.target === null) {
            p.target = nearestQuarter(p.angle)
            p.fromDrag = true
          }
          faceDragRef.current = null
          return
        }
        let live = p
        if (live) { live.target = null; live.fromDrag = true }
        else {
          live = { axis, layer, angle: 0, target: null, fromDrag: true }
          pendingRef.current = live
        }

        const len = Math.hypot(dx, dy)
        fd.started = true
        fd.axis = axis
        fd.sign = sign
        fd.u = [dx / len, dy / len]
        fd.baseAngle = live.angle
        return
      }
      /* Layer follows the cursor 1:1 */
      const proj = dx * fd.u[0] + dy * fd.u[1]
      const p = pendingRef.current
      if (p) p.angle = fd.baseAngle + fd.sign * 90 * (proj / PX_PER_QUARTER)
      return
    }

    if (!orbitDragRef.current) return
    const dx = e.clientX - orbitDragRef.current.x
    const dy = e.clientY - orbitDragRef.current.y
    orbitDragRef.current = { x: e.clientX, y: e.clientY }
    rotRef.current = {
      x: Math.max(-90, Math.min(90, rotRef.current.x + dy * 0.45)),
      y: rotRef.current.y + dx * 0.45,
    }
  }, [])

  const endDrag = useCallback(() => {
    orbitDragRef.current = null
    const fd = faceDragRef.current
    faceDragRef.current = null
    const p = pendingRef.current
    if (fd?.started && p && p.target === null) {
      const q = nearestQuarter(p.angle)
      /* Only settle if practically there; otherwise it rests mid-turn */
      if (Math.abs(p.angle - q) < SNAP_DEG) {
        p.target = q
        p.fromDrag = true
      }
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      style={{ touchAction: 'none', cursor: 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 10.5], fov: 32 }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 8, 6]} intensity={0.7} />
        {/* Procedural studio environment — drives the plastic reflections,
            no external HDR fetch */}
        <Environment resolution={256}>
          <group>
            <Lightformer form="rect" intensity={5}   position={[4, 5, 6]}   scale={[5, 5, 1]} />
            <Lightformer form="rect" intensity={2.5} position={[-6, 3, 4]}  scale={[3, 8, 1]} color="#dfe8ff" />
            <Lightformer form="rect" intensity={1.6} position={[0, -5, 5]}  scale={[8, 3, 1]} color="#ffe9d4" />
            <Lightformer form="ring" intensity={3}   position={[0, 7, -5]}  scale={4} color="#e7d8ff" />
          </group>
        </Environment>
        <CubeRig
          cube={cube}
          cubeRef={cubeRef}
          pendingRef={pendingRef}
          faceDragRef={faceDragRef}
          rotRef={rotRef}
          pickRef={pickRef}
          setCube={setCube}
          onDragCommit={onDragCommit}
          waitersRef={waitersRef}
        />
        <ContactShadows position={[0, -2.75, 0]} opacity={0.5} scale={11} blur={2.6} far={4.5} />
      </Canvas>
    </div>
  )
})

export default RubikScene
