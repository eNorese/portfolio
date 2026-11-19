import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = process.env.TARGET_URL || 'http://127.0.0.1:3100'
const profile = await mkdtemp(join(tmpdir(), 'portfolio-layout-'))
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: 'ignore' })

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function retry(task, attempts = 50) {
  let lastError
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await task()
    } catch (error) {
      lastError = error
      await sleep(100)
    }
  }
  throw lastError
}

let socket
try {
  const [port] = (await retry(() => readFile(join(profile, 'DevToolsActivePort'), 'utf8'))).trim().split('\n')
  const pages = await retry(async () => {
    const response = await fetch(`http://127.0.0.1:${port}/json/list`)
    if (!response.ok) throw new Error(`Chrome debugging endpoint returned ${response.status}`)
    return response.json()
  })
  const page = pages.find((candidate) => candidate.type === 'page')
  if (!page) throw new Error('Chrome did not expose a page target')

  socket = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })

  let sequence = 0
  const pending = new Map()
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (!message.id || !pending.has(message.id)) return
    const { resolve, reject } = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) reject(new Error(message.error.message))
    else resolve(message.result)
  })

  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async (expression) => {
    const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    return result.result.value
  }

  const scenarios = [
    { name: 'mobile-es', width: 390, height: 844, lang: 'es' },
    { name: 'mobile-en', width: 390, height: 844, lang: 'en' },
    { name: 'desktop-es', width: 1440, height: 1000, lang: 'es' },
    { name: 'desktop-en', width: 1440, height: 1000, lang: 'en' },
  ]
  const results = []

  for (const scenario of scenarios) {
    await command('Emulation.setDeviceMetricsOverride', {
      width: scenario.width,
      height: scenario.height,
      deviceScaleFactor: 1,
      mobile: scenario.width < 768,
    })
    const url = `${baseUrl}/${scenario.lang}`
    await command('Page.navigate', { url })
    await retry(async () => {
      const ready = await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)}`)
      if (!ready) throw new Error(`${scenario.name} is still loading`)
      return true
    })

    const metrics = await evaluate(`(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
      h1: document.querySelector('h1')?.textContent?.trim(),
      closedCases: [...document.querySelectorAll('#proyectos details')].every((item) => !item.open),
      headerLinks: document.querySelectorAll('header nav a[href^="#"]').length,
    }))()`)
    if (metrics.content > metrics.viewport) {
      throw new Error(`${scenario.name} has horizontal overflow: ${metrics.content}px > ${metrics.viewport}px`)
    }
    if (!metrics.h1?.includes('Backend Engineer')) throw new Error(`${scenario.name} has an unexpected H1`)
    if (!metrics.closedCases) throw new Error(`${scenario.name} opens a case study by default`)
    if (metrics.headerLinks !== 6) throw new Error(`${scenario.name} has an unexpected header link count`)
    results.push({ name: scenario.name, ...metrics })
  }

  console.log(JSON.stringify({ status: 'ok', results }, null, 2))
} finally {
  socket?.close()
  chrome.kill()
  if (chrome.exitCode === null) {
    await new Promise((resolve) => chrome.once('exit', resolve))
  }
  await retry(() => rm(profile, { recursive: true, force: true }), 20)
}
