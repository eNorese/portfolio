'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import type { KeyboardEvent as ReactKbdEvent } from 'react'
import { portfolioSections } from '@/config/sections'

/* ── Types ──────────────────────────────────────────────────────────────── */
type Line         = { text: string; cls?: string }
type HistoryEntry = { command: string; output: Line[] }
type TopProcess   = {
  pid: number; cmd: string
  virt: number; res: number; shr: number
  cpuBase: number; memPct: number; timeStr: string; cpuCurrent: number
}
type TopSnapshot  = { time: Date; cpuUser: number; processes: TopProcess[] }

/* ── Static data ─────────────────────────────────────────────────────────── */
const PROMPT = 'enorese@portfolio:~$'

const BOOT: Line[] = [
  { text: 'enorese.sh 1.0.0 — interactive portfolio terminal', cls: 'text-green-400' },
  { text: 'Type "help" to see available commands.', cls: 'text-gray-500' },
]

const NEOFETCH: Line[] = [
  { text: '╔══════════════╗  enorese@portfolio',        cls: 'text-green-400' },
  { text: '║              ║  ──────────────',           cls: 'text-green-400' },
  { text: '║   eNorese.   ║  OS:     PortfolioOS 2025', cls: 'text-green-400' },
  { text: '║              ║  Host:   Vercel Edge',      cls: 'text-green-400' },
  { text: '╚══════════════╝  Kernel: Next.js 15.3',     cls: 'text-green-400' },
  { text: '                  Uptime: always online',     cls: 'text-gray-300' },
  { text: '                  Shell:  enorese.sh 1.0',   cls: 'text-gray-300' },
  { text: '                  DE:     Tailwind CSS v4',   cls: 'text-gray-300' },
  { text: '                  CPU:    Azure Functions',   cls: 'text-gray-300' },
  { text: '                  Memory: heap / heap',       cls: 'text-gray-300' },
]

// cat skills.sh → muestra el código fuente
const SKILLS_SOURCE: Line[] = [
  { text: '#!/bin/bash',                                                cls: 'text-gray-500' },
  { text: '# Enzo Norese — Skills',                                    cls: 'text-gray-500' },
  { text: '' },
  { text: 'echo "Languages:  TypeScript · JavaScript · C# · Python"',  cls: 'text-green-300' },
  { text: 'echo "Cloud:      Azure Functions · Storage · DevOps"',     cls: 'text-green-300' },
  { text: 'echo "Databases:  SQL Server · PostgreSQL · Redis"',        cls: 'text-green-300' },
  { text: 'echo "Frameworks: Node.js · Express · NestJS · Next.js"',  cls: 'text-green-300' },
  { text: 'echo "Tools:      Docker · Kubernetes · Git · CI/CD"',      cls: 'text-green-300' },
]

// sh skills.sh → ejecuta y muestra el output con colores
const SKILLS_RUN: Line[] = [
  { text: 'Languages:  TypeScript · JavaScript · C# · Python',   cls: 'text-cyan-400' },
  { text: 'Cloud:      Azure Functions · Storage · DevOps',       cls: 'text-blue-400' },
  { text: 'Databases:  SQL Server · PostgreSQL · Redis',          cls: 'text-green-400' },
  { text: 'Frameworks: Node.js · Express · NestJS · Next.js',    cls: 'text-purple-400' },
  { text: 'Tools:      Docker · Kubernetes · Git · CI/CD',        cls: 'text-orange-400' },
]

const FILES: Record<string, Line[]> = {
  'about.txt': [
    { text: 'Name:     Enzo Norese',                         cls: 'text-white' },
    { text: 'Role:     Backend Developer & Cloud Architect', cls: 'text-gray-300' },
    { text: 'Company:  TeamWork Chile',                      cls: 'text-gray-300' },
    { text: 'Location: Chile 🇨🇱',                         cls: 'text-gray-300' },
    { text: '' },
    { text: 'Certs:    AZ-900 · AZ-204 (in progress)',       cls: 'text-yellow-400' },
  ],
  'skills.sh':   SKILLS_SOURCE,
  'contact.txt': [
    { text: 'Email:    hello@enorese.dev',       cls: 'text-blue-400' },
    { text: 'GitHub:   github.com/enorese',      cls: 'text-gray-300' },
    { text: 'LinkedIn: linkedin.com/in/enorese', cls: 'text-blue-300' },
  ],
  'cv.pdf': [
    { text: '[binary — use the CV download button on the site]', cls: 'text-yellow-400' },
  ],
  '.rubik': [
    { text: '╭──────────────────────────────────────╮', cls: 'text-purple-400' },
    { text: '│  You found a hidden file. Nice. 🕵️   │', cls: 'text-purple-400' },
    { text: '╰──────────────────────────────────────╯', cls: 'text-purple-400' },
    { text: '' },
    { text: 'There is more than one easter egg here.', cls: 'text-gray-300' },
    { text: 'Try running:',                             cls: 'text-gray-300' },
    { text: '' },
    { text: '    rubik',                                cls: 'text-yellow-400' },
  ],
}

const BASE_PROCS = [
  { pid: 12345, cmd: 'next-server',  virt: 512000, res: 25600, shr: 8192, cpuBase: 2.3, memPct: 0.3, timeStr: '0:00.12' },
  { pid: 12346, cmd: 'node',         virt: 204800, res: 12800, shr: 4096, cpuBase: 0.7, memPct: 0.2, timeStr: '0:00.05' },
  { pid:  1234, cmd: 'azure-fn',     virt: 102400, res:  5120, shr: 2048, cpuBase: 0.0, memPct: 0.1, timeStr: '0:00.01' },
  { pid:   999, cmd: 'postgres',     virt:  65536, res:  3072, shr: 1024, cpuBase: 0.0, memPct: 0.0, timeStr: '0:00.02' },
  { pid:   888, cmd: 'redis-server', virt:  32768, res:  2048, shr:  512, cpuBase: 0.0, memPct: 0.0, timeStr: '0:00.01' },
  { pid:   777, cmd: 'enorese.sh',   virt:  16384, res:  1024, shr:  256, cpuBase: 0.1, memPct: 0.0, timeStr: '0:00.00' },
  { pid:   666, cmd: 'tailwind',     virt:   8192, res:   512, shr:  128, cpuBase: 0.0, memPct: 0.0, timeStr: '0:00.00' },
  { pid:   555, cmd: 'docker',       virt:   4096, res:   256, shr:   64, cpuBase: 0.0, memPct: 0.0, timeStr: '0:00.00' },
]

/* ── top formatter ──────────────────────────────────────────────────────── */
function formatTop(snap: TopSnapshot): Line[] {
  const ts      = snap.time.toLocaleTimeString('en-US', { hour12: false })
  const cpu     = snap.cpuUser
  const idle    = Math.max(0, 100 - cpu - 0.5).toFixed(1)
  const loadAvg = [(cpu / 10).toFixed(2), (cpu / 12).toFixed(2), (cpu / 15).toFixed(2)].join(', ')

  return [
    { text: `top - ${ts} up 42 days,  3:21,  1 user,  load average: ${loadAvg}`, cls: 'text-white' },
    { text: `Tasks:  ${snap.processes.length} total,   1 running,   ${snap.processes.length - 1} sleeping,   0 stopped`, cls: 'text-white' },
    { text: `%Cpu(s): ${cpu.toFixed(1).padStart(4)} us,  0.5 sy,  0.0 ni, ${idle} id,  0.0 wa`, cls: 'text-white' },
    { text: 'MiB Mem :   8192.0 total,   6234.5 free,   1521.3 used,    436.2 buff/cache', cls: 'text-white' },
    { text: 'MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   6432.1 avail Mem', cls: 'text-white' },
    { text: '' },
    { text: '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND', cls: 'text-cyan-400' },
    ...snap.processes.map(p => ({
      text: [
        String(p.pid).padStart(5),
        'enorese'.padEnd(9),
        '20',
        '  0',
        String(p.virt).padStart(7),
        String(p.res).padStart(6),
        String(p.shr).padStart(6),
        p.cpuCurrent > 0.5 ? 'R' : 'S',
        p.cpuCurrent.toFixed(1).padStart(5),
        p.memPct.toFixed(1).padStart(5),
        p.timeStr.padStart(9),
        p.cmd,
      ].join(' '),
      cls: p.cpuCurrent > 1 ? 'text-green-300' : 'text-gray-300',
    })),
    { text: '' },
    { text: "press 'q' to quit", cls: 'text-gray-600' },
  ]
}

/* ── Tab completion ─────────────────────────────────────────────────────── */
const ALL_COMMANDS = [
  'help', 'whoami', 'pwd', 'date', 'echo', 'print', 'uname',
  'ls', 'cat', 'sh', 'bash', 'neofetch', 'top', 'history',
  'git', 'npm', 'sudo', 'ssh', 'clear', 'exit',
]

const FILE_COMPLETIONS = [...Object.keys(FILES), 'projects/']
const SH_COMPLETIONS   = Object.keys(FILES).filter(f => f.endsWith('.sh'))

const ARG_COMPLETIONS: Record<string, string[]> = {
  cat:  FILE_COMPLETIONS,
  ls:   [...FILE_COMPLETIONS, '-l', '-la', '-a'],
  sh:   SH_COMPLETIONS,
  bash: SH_COMPLETIONS,
  git:  ['log', 'status'],
  npm:  ['run', 'install'],
}

function commonPrefix(strs: string[]): string {
  if (!strs.length) return ''
  let prefix = strs[0]
  for (const s of strs.slice(1)) {
    while (!s.startsWith(prefix)) prefix = prefix.slice(0, -1)
    if (!prefix) return ''
  }
  return prefix
}

type TabResult =
  | { kind: 'complete'; value: string }
  | { kind: 'suggest'; value: string; suggestions: string[] }
  | { kind: 'none' }

function tabComplete(input: string): TabResult {
  const endsWithSpace = input.endsWith(' ')
  const parts         = input.trimEnd().split(/\s+/)

  // Completing the first token (the command itself)
  if (parts.length === 1 && !endsWithSpace) {
    const prefix = parts[0]
    if (!prefix) return { kind: 'none' }
    const matches = ALL_COMMANDS.filter(c => c.startsWith(prefix))
    if (!matches.length) return { kind: 'none' }
    if (matches.length === 1) return { kind: 'complete', value: matches[0] + ' ' }
    const cp = commonPrefix(matches)
    if (cp.length > prefix.length) return { kind: 'complete', value: cp }
    return { kind: 'suggest', value: input, suggestions: matches }
  }

  // Completing an argument
  const cmd  = parts[0].toLowerCase()
  const list = ARG_COMPLETIONS[cmd]
  if (!list) return { kind: 'none' }

  const argPrefix = endsWithSpace ? '' : (parts[parts.length - 1] ?? '')
  // Hidden files (dotfiles) only complete once the user has typed the leading dot
  const matches   = list.filter(f =>
    f.startsWith(argPrefix) && (!f.startsWith('.') || argPrefix.startsWith('.'))
  )
  if (!matches.length) return { kind: 'none' }

  const baseParts = parts.slice(0, endsWithSpace ? undefined : -1)
  const base      = baseParts.join(' ')

  if (matches.length === 1) {
    return { kind: 'complete', value: (base + ' ' + matches[0]).trimStart() }
  }

  const cp = commonPrefix(matches)
  if (cp.length > argPrefix.length) {
    return { kind: 'complete', value: (base + ' ' + cp).trimStart() }
  }

  return { kind: 'suggest', value: input, suggestions: matches }
}

/* ── Command processor ──────────────────────────────────────────────────── */
function run(
  raw: string,
  cmdHistory: string[],
): { output: Line[]; clear?: boolean; close?: boolean; topMode?: boolean; rubik?: boolean } {
  const trimmed = raw.trim()
  if (!trimmed) return { output: [] }

  const parts = trimmed.split(/\s+/)
  const cmd   = parts[0].toLowerCase()
  const args  = parts.slice(1)

  switch (cmd) {
    case 'help':
      return { output: [
        { text: 'Available commands:', cls: 'text-white' },
        { text: '' },
        { text: '  ls [-la]            list files',                                           cls: 'text-gray-300' },
        { text: '  cat <file>          show file contents',                                   cls: 'text-gray-300' },
        { text: '  sh <script>         execute a shell script',                               cls: 'text-gray-300' },
        { text: '  print <text>        print text to stdout',                                 cls: 'text-gray-300' },
        { text: '  echo <text>         print text',                                           cls: 'text-gray-300' },
        { text: '  pwd                 print working directory',                              cls: 'text-gray-300' },
        { text: '  whoami              current user',                                         cls: 'text-gray-300' },
        { text: '  date                current date/time',                                    cls: 'text-gray-300' },
        { text: '  uname -a            system info',                                         cls: 'text-gray-300' },
        { text: '  neofetch            fancy system info',                                    cls: 'text-gray-300' },
        { text: '  top                 live process viewer  (q to quit)',                     cls: 'text-gray-300' },
        { text: '  git log             commit history',                                       cls: 'text-gray-300' },
        { text: '  git status          repo status',                                          cls: 'text-gray-300' },
        { text: '  npm run dev         start dev server',                                     cls: 'text-gray-300' },
        { text: '  history             command history',                                      cls: 'text-gray-300' },
        { text: '  clear               clear the screen',                                     cls: 'text-gray-300' },
        { text: '  exit                close terminal',                                       cls: 'text-gray-300' },
        { text: '' },
        { text: '  ↑ / ↓  navigate command history', cls: 'text-gray-500' },
        { text: '  Tab     autocomplete command or filename', cls: 'text-gray-500' },
      ]}

    case 'whoami':
      return { output: [{ text: 'enorese', cls: 'text-white' }] }

    case 'pwd':
      return { output: [{ text: '/home/enorese/portfolio', cls: 'text-white' }] }

    case 'date':
      return { output: [{ text: new Date().toString(), cls: 'text-white' }] }

    case 'echo':
    case 'print':
      return { output: [{ text: args.join(' '), cls: 'text-white' }] }

    case 'uname':
      return { output: [{ text: 'WebOS 2025 portfolio #1 SMP Next.js 15.3 x86_64 GNU/React', cls: 'text-white' }] }

    case 'ls': {
      const isLong  = args.some(a => a.startsWith('-') && a.includes('l'))
      const showAll = args.some(a => a.startsWith('-') && a.includes('a'))
      const target  = args.find(a => !a.startsWith('-'))

      if (target === 'projects' || target === 'projects/') {
        return { output: [{ text: 'erp-migration/   azure-functions/   api-gateway/', cls: 'text-blue-400' }] }
      }
      if (isLong) {
        return { output: [
          { text: 'total 48',                                                          cls: 'text-gray-500' },
          { text: 'drwxr-xr-x 2 enorese enorese 4096 Apr 14 2025 .',                 cls: 'text-gray-500' },
          { text: 'drwxr-xr-x 2 enorese enorese 4096 Apr 14 2025 ..',                cls: 'text-gray-500' },
          ...(showAll
            ? [{ text: '-rw------- 1 enorese enorese   66 Apr 14 2025 .rubik',        cls: 'text-purple-400' }]
            : []),
          { text: '-rw-r--r-- 1 enorese enorese  420 Apr 14 2025 about.txt',         cls: 'text-gray-300' },
          { text: '-rwxr-xr-x 1 enorese enorese  348 Apr 14 2025 skills.sh',         cls: 'text-green-400' },
          { text: '-rw-r--r-- 1 enorese enorese  180 Apr 14 2025 contact.txt',       cls: 'text-gray-300' },
          { text: '-rw-r--r-- 1 enorese enorese 2048 Apr 14 2025 cv.pdf',            cls: 'text-gray-300' },
          { text: 'drwxr-xr-x 3 enorese enorese 4096 Apr 14 2025 projects/',         cls: 'text-blue-400' },
        ]}
      }
      if (showAll) {
        return { output: [{ text: '.   ..   .rubik   about.txt   skills.sh   contact.txt   cv.pdf   projects/', cls: 'text-white' }] }
      }
      return { output: [{ text: 'about.txt   skills.sh   contact.txt   cv.pdf   projects/', cls: 'text-white' }] }
    }

    case 'cat': {
      if (!args[0]) return { output: [{ text: 'cat: missing file operand', cls: 'text-red-400' }] }
      if (args[0] === 'projects' || args[0] === 'projects/') {
        return { output: [{ text: 'cat: projects: Is a directory', cls: 'text-red-400' }] }
      }
      const content = FILES[args[0]]
      if (!content) return { output: [{ text: `cat: ${args[0]}: No such file or directory`, cls: 'text-red-400' }] }
      return { output: content }
    }

    case 'sh':
    case 'bash': {
      if (!args[0]) return { output: [{ text: `${cmd}: missing script operand`, cls: 'text-red-400' }] }
      if (args[0] === 'skills.sh') return { output: SKILLS_RUN }
      return { output: [{ text: `${cmd}: ${args[0]}: No such file or directory`, cls: 'text-red-400' }] }
    }

    case 'neofetch':
      return { output: NEOFETCH }

    // Hidden command — hinted at by `cat .rubik`. Deliberately absent from
    // help and tab completion.
    case 'rubik':
      if (!portfolioSections.rubikCube) {
        return { output: [{ text: `bash: ${cmd}: command not found`, cls: 'text-red-400' }] }
      }
      return {
        output: [
          { text: 'Initializing cube engine…', cls: 'text-purple-400' },
          { text: '🧩 Launching Rubik mode',   cls: 'text-purple-400' },
        ],
        rubik: true,
      }

    case 'top':
      return { output: [], topMode: true }

    case 'history':
      if (!cmdHistory.length) return { output: [{ text: '(empty)', cls: 'text-gray-500' }] }
      return { output: cmdHistory.map((c, i) => ({ text: `  ${String(i + 1).padStart(3)}  ${c}`, cls: 'text-gray-300' })) }

    case 'git':
      if (args[0] === 'log') {
        return { output: [
          { text: 'commit 835c690 (HEAD -> another-try)', cls: 'text-yellow-400' },
          { text: 'Author: Enzo Norese <hello@enorese.dev>',  cls: 'text-gray-300' },
          { text: 'Date:   Mon Apr 14 2025',                  cls: 'text-gray-500' },
          { text: '    feat: add interactive easter egg terminal', cls: 'text-white' },
          { text: '' },
          { text: 'commit 1e4ed32', cls: 'text-yellow-400' },
          { text: '    feat: update Contact and Footer components', cls: 'text-white' },
          { text: '' },
          { text: 'commit 7f91941', cls: 'text-yellow-400' },
          { text: '    feat: optimize components for performance', cls: 'text-white' },
          { text: '' },
          { text: 'commit d2c33b3', cls: 'text-yellow-400' },
          { text: '    feat: implement responsive Navbar', cls: 'text-white' },
        ]}
      }
      if (args[0] === 'status') {
        return { output: [
          { text: 'On branch another-try', cls: 'text-white' },
          { text: 'nothing to commit, working tree clean', cls: 'text-green-400' },
        ]}
      }
      return { output: [{ text: `git: '${args[0]}' is not a git command. See 'git help'.`, cls: 'text-red-400' }] }

    case 'npm':
      if (args[0] === 'run' && args[1] === 'dev') {
        return { output: [
          { text: '> portfolio@0.1.0 dev',               cls: 'text-gray-500' },
          { text: '> next dev',                           cls: 'text-gray-500' },
          { text: '' },
          { text: '  ▲ Next.js 15.3',                    cls: 'text-white' },
          { text: '  - Local:   http://localhost:3000',   cls: 'text-cyan-400' },
          { text: '' },
          { text: ' ✓ Compiled successfully in 420ms',   cls: 'text-green-400' },
        ]}
      }
      if (args[0] === 'install') {
        return { output: [
          { text: 'added 847 packages in 12s',             cls: 'text-white' },
          { text: '247 packages are looking for funding',  cls: 'text-yellow-400' },
        ]}
      }
      return { output: [{ text: `npm: unknown command '${args.join(' ')}'`, cls: 'text-red-400' }] }

    case 'sudo':
      if (args.join(' ').includes('rm -rf')) {
        return { output: [{ text: 'nice try. 😄', cls: 'text-yellow-400' }] }
      }
      return { output: [
        { text: '[sudo] password for enorese:',                                          cls: 'text-white' },
        { text: 'enorese is not in the sudoers file. This incident will be reported.',   cls: 'text-red-400' },
      ]}

    case 'ssh':
      return { output: [{ text: 'ssh: connect to azure.microsoft.com: Permission denied (publickey)', cls: 'text-red-400' }] }

    case 'clear':
      return { output: [], clear: true }

    case 'exit':
      return { output: [], close: true }

    default:
      return { output: [{ text: `bash: ${cmd}: command not found`, cls: 'text-red-400' }] }
  }
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function EasterEgg() {
  const [active, setActive]         = useState(false)
  const [booting, setBooting]       = useState(true)
  const [bootCount, setBootCount]   = useState(0)
  const [entries, setEntries]       = useState<HistoryEntry[]>([])
  const [input, setInput]           = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIdx, setHistIdx]       = useState(-1)
  const [topMode, setTopMode]       = useState(false)
  const [topSnap, setTopSnap]       = useState<TopSnapshot | null>(null)

  const inputRef  = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  /* Console easter egg */
  useEffect(() => {
    console.log(
      '%c eNorese. %c',
      'background:#6366f1;color:#fff;padding:4px 10px;border-radius:4px;font-weight:700;font-size:13px;',
      '',
    )
    console.log('👋 Hey curious dev!\n\nLooking for a backend developer? → hello@enorese.dev')
  }, [])

  /* Trigger from Navbar logo (5 clicks) */
  useEffect(() => {
    const open = () => {
      setActive(true); setBooting(true); setBootCount(0)
      setEntries([]); setInput(''); setCmdHistory([]); setHistIdx(-1)
      setTopMode(false); setTopSnap(null)
    }
    window.addEventListener('enorese:easter-egg', open)
    return () => window.removeEventListener('enorese:easter-egg', open)
  }, [])

  /* Escape to close */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* Boot typewriter */
  useEffect(() => {
    if (!active || !booting) return
    if (bootCount >= BOOT.length) {
      setBooting(false)
      setTimeout(() => inputRef.current?.focus(), 60)
      return
    }
    const id = setTimeout(() => setBootCount(c => c + 1), 140)
    return () => clearTimeout(id)
  }, [active, booting, bootCount])

  /* top — live refresh every second */
  useEffect(() => {
    if (!topMode) { setTopSnap(null); return }
    const tick = () => setTopSnap({
      time: new Date(),
      cpuUser: 1.5 + Math.random() * 2,
      processes: BASE_PROCS.map(p => ({
        ...p,
        cpuCurrent: Math.max(0, p.cpuBase + (Math.random() - 0.5) * 0.8),
      })),
    })
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [topMode])

  /* top — q to exit */
  useEffect(() => {
    if (!topMode) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'q') {
        setTopMode(false)
        setTimeout(() => inputRef.current?.focus(), 60)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [topMode])

  /* Auto-scroll on new output */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries, bootCount])

  /* Scroll lock */
  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [active])

  const focusInput = useCallback(() => inputRef.current?.focus(), [])

  const handleKeyDown = useCallback((e: ReactKbdEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const result = tabComplete(input)
      if (result.kind === 'complete') {
        setInput(result.value)
      } else if (result.kind === 'suggest') {
        setEntries(prev => [...prev, {
          command: input,
          output: [{ text: result.suggestions.join('   '), cls: 'text-gray-500' }],
        }])
      }
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(next)
      setInput(cmdHistory[cmdHistory.length - 1 - next] ?? '')
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : (cmdHistory[cmdHistory.length - 1 - next] ?? ''))
      return
    }

    if (e.key === 'Enter') {
      const result = run(input, cmdHistory)

      if (result.close) { setActive(false); return }
      if (result.clear) { setEntries([]); setInput(''); return }

      const trimmed = input.trim()
      if (trimmed) setCmdHistory(h => [...h, trimmed])
      setHistIdx(-1)

      if (result.rubik) {
        // Show the launch lines briefly, then close the terminal and open the cube
        setEntries(prev => [...prev, { command: input, output: result.output }])
        setInput('')
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('enorese:rubik'))
          setActive(false)
        }, 600)
        return
      }

      if (result.topMode) {
        setEntries(prev => [...prev, { command: input, output: [] }])
        setTopMode(true)
        setInput('')
        return
      }

      setEntries(prev => [...prev, { command: input, output: result.output }])
      setInput('')
    }
  }, [input, cmdHistory, histIdx])

  if (!active) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Easter egg terminal"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
      onClick={() => setActive(false)}
    >
      <div
        className="bg-[#0d1117] border border-green-500/20 rounded-xl w-full max-w-2xl flex flex-col relative"
        style={{
          maxHeight: '78vh',
          fontFamily: "'Consolas', 'Cascadia Code', 'Courier New', monospace",
          fontSize: '13px',
          boxShadow: '0 0 80px rgba(34,197,94,0.06), 0 25px 50px rgba(0,0,0,0.8)',
        }}
        onClick={e => { e.stopPropagation(); if (!topMode) focusInput() }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-green-500/10 shrink-0 bg-[#161b22] rounded-t-xl">
          <button
            onClick={e => { e.stopPropagation(); setActive(false) }}
            aria-label="Close"
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
          />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-[11px] text-green-500/30 select-none tracking-wide">
            enorese.sh — bash — 80×24
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 leading-[1.6]">

          {topMode && topSnap ? (
            /* ── top view ── */
            formatTop(topSnap).map((line, i) => (
              <div key={i} className={line.cls ?? 'text-gray-300'}>
                {line.text || '\u00A0'}
              </div>
            ))
          ) : (
            /* ── normal terminal ── */
            <>
              {/* Boot lines */}
              {BOOT.slice(0, bootCount).map((line, i) => (
                <div key={`b${i}`} className={line.cls ?? 'text-gray-300'}>
                  {line.text || '\u00A0'}
                </div>
              ))}
              {booting && (
                <span className="inline-block w-[7px] h-[13px] bg-green-400 align-middle animate-pulse" />
              )}

              {/* Command history entries */}
              {!booting && entries.map((entry, i) => (
                <div key={i} className="mt-1">
                  <div className="flex gap-2">
                    <span className="text-green-400 shrink-0 select-none">{PROMPT}</span>
                    <span className="text-gray-100 break-all">{entry.command}</span>
                  </div>
                  {entry.output.map((line, j) => (
                    <div key={j} className={line.cls ?? 'text-gray-300'}>
                      {line.text || '\u00A0'}
                    </div>
                  ))}
                </div>
              ))}

              {/* Current prompt + blinking cursor (cursor hugs the last char) */}
              {!booting && (
                <div className="flex gap-2 mt-1 items-center">
                  <span className="text-green-400 shrink-0 select-none">{PROMPT}</span>
                  <span className="text-gray-100 whitespace-pre">
                    {input}
                    <span
                      className="inline-block w-[7px] h-[13px] bg-green-400 align-middle"
                      style={{ animation: 'pulse 1s step-start infinite' }}
                    />
                  </span>
                </div>
              )}
            </>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Hidden input — captures keyboard without rendering */}
        {!booting && !topMode && (
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute top-0 left-0 w-px h-px opacity-0 pointer-events-none"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  )
}
