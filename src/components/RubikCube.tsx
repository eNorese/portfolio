'use client'

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { MOVES, MOVE_ORDER, fmtTime, scrambleSequence } from '@/components/rubik/logic'
import type { MoveKey } from '@/components/rubik/logic'
import type { RubikSceneHandle } from '@/components/rubik/RubikScene'

/* three.js (~150 kB gz) loads only when the easter egg actually opens */
const RubikScene = lazy(() => import('@/components/rubik/RubikScene'))

export function RubikCube() {
  const [active, setActive]             = useState(false)
  const [scrambling, setScrambling]     = useState(false)
  const [challenge, setChallenge]       = useState(false)
  const [moveCount, setMoveCount]       = useState(0)
  const [elapsed, setElapsed]           = useState(0)
  const [solvedBanner, setSolvedBanner] = useState<{ moves: number; seconds: number } | null>(null)
  const [animating, setAnimating]       = useState(false)

  const sceneRef     = useRef<RubikSceneHandle>(null)
  const busyRef      = useRef(false)
  const challengeRef = useRef(false)
  const movesRef     = useRef(0)
  const startRef     = useRef(0)

  /* Open via terminal command — mounting fresh resets cube and view */
  useEffect(() => {
    const open = () => {
      setScrambling(false)
      setChallenge(false); challengeRef.current = false
      setMoveCount(0); movesRef.current = 0
      setElapsed(0)
      setSolvedBanner(null)
      setAnimating(false)
      busyRef.current = false
      setActive(true)
    }
    window.addEventListener('enorese:rubik', open)
    return () => window.removeEventListener('enorese:rubik', open)
  }, [])

  /* Scroll lock */
  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [active])

  /* Challenge timer */
  useEffect(() => {
    if (!challenge || solvedBanner) return
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 500)
    return () => clearInterval(id)
  }, [challenge, solvedBanner])

  /* One committed quarter turn by the user (drag or button/key) */
  const registerCommit = useCallback((solved: boolean) => {
    movesRef.current += 1
    setMoveCount(movesRef.current)
    if (challengeRef.current && solved) {
      challengeRef.current = false
      setChallenge(false)
      const seconds = Math.floor((Date.now() - startRef.current) / 1000)
      setSolvedBanner({ moves: movesRef.current, seconds })
    }
  }, [])

  const handleUserMove = useCallback((m: MoveKey) => {
    if (busyRef.current || !sceneRef.current) return
    busyRef.current = true
    setAnimating(true)
    sceneRef.current.doMove(MOVES[m], 200).then(solved => {
      busyRef.current = false
      setAnimating(false)
      registerCommit(solved)
    })
  }, [registerCommit])

  const runScramble = useCallback(async () => {
    if (busyRef.current || !sceneRef.current) return
    busyRef.current = true
    setScrambling(true)
    setSolvedBanner(null)
    setChallenge(false); challengeRef.current = false
    for (const key of scrambleSequence()) {
      await sceneRef.current.doMove(MOVES[key], 80)
    }
    busyRef.current = false
    setScrambling(false)
    setChallenge(true); challengeRef.current = true
    setMoveCount(0); movesRef.current = 0
    startRef.current = Date.now()
    setElapsed(0)
  }, [])

  const resetCube = useCallback(() => {
    if (busyRef.current) return
    sceneRef.current?.reset()
    setChallenge(false); challengeRef.current = false
    setMoveCount(0); movesRef.current = 0
    setElapsed(0)
    setSolvedBanner(null)
  }, [])

  /* Keyboard: Escape closes, U/D/L/R/F/B turn faces (Shift = inverse) */
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setActive(false); return }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toUpperCase()
      if (k.length === 1 && 'UDLRFB'.includes(k)) {
        handleUserMove((e.shiftKey ? k + "'" : k) as MoveKey)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, handleUserMove])

  if (!active) return null

  const busy = animating || scrambling

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rubik cube easter egg"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
      onClick={() => setActive(false)}
    >
      <div
        className="bg-[#0d1117] border border-purple-500/20 rounded-xl w-full max-w-md flex flex-col relative select-none"
        style={{
          fontFamily: "'Consolas', 'Cascadia Code', 'Courier New', monospace",
          boxShadow: '0 0 80px rgba(168,85,247,0.08), 0 25px 50px rgba(0,0,0,0.8)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-purple-500/10 shrink-0 bg-[#161b22] rounded-t-xl">
          <button
            onClick={() => setActive(false)}
            aria-label="Close"
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
          />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-[11px] text-purple-400/40 select-none tracking-wide">
            rubik — 3×3
          </span>
        </div>

        {/* Stage */}
        <div className="relative overflow-hidden" style={{ height: 340 }}>
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 45%, rgba(168,85,247,0.10), transparent 60%)' }}
          />
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center text-xs text-purple-300/50">
                loading cube engine…
              </div>
            }
          >
            <RubikScene ref={sceneRef} onDragCommit={registerCommit} lockedRef={busyRef} />
          </Suspense>

          {/* Solved banner */}
          {solvedBanner && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative px-5 py-3 rounded-xl text-center bg-[#0d1117]/90 border border-purple-400/40">
                <div
                  className="absolute inset-0 rounded-xl animate-pulse pointer-events-none"
                  style={{ boxShadow: '0 0 50px rgba(168,85,247,0.45)' }}
                />
                <div className="text-lg">🎉</div>
                <div className="text-sm text-purple-200">
                  Solved in {solvedBanner.moves} moves — {fmtTime(solvedBanner.seconds)}!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="px-4 pb-4 pt-1 space-y-3">
          <div className="grid grid-cols-6 gap-1.5">
            {MOVE_ORDER.map(m => (
              <button
                key={m}
                onClick={() => handleUserMove(m)}
                disabled={busy}
                className="py-1.5 rounded-md text-xs bg-white/5 border border-purple-500/20 text-purple-200 hover:bg-purple-500/15 hover:border-purple-400/40 transition-colors disabled:opacity-40"
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runScramble}
              disabled={busy}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-40"
            >
              Scramble
            </button>
            <button
              onClick={resetCube}
              disabled={busy}
              className="px-3 py-1.5 rounded-md text-xs bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-40"
            >
              Reset
            </button>
            <div className="ml-auto text-[11px] text-gray-400">
              moves {moveCount}
              {(challenge || solvedBanner) && <> · {fmtTime(solvedBanner ? solvedBanner.seconds : elapsed)}</>}
            </div>
          </div>

          <p className="text-[10px] text-gray-600 text-center">
            drag a sticker to turn (it stays where you leave it) · Alt + drag rotates view · U D L R F B · Esc
          </p>
        </div>
      </div>
    </div>
  )
}
