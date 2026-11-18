import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const targetUrl = process.env.TARGET_URL || 'http://127.0.0.1:3100/es'
const profile = await mkdtemp(join(tmpdir(), 'portfolio-smoke-'))
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  targetUrl,
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

  await command('Page.navigate', { url: targetUrl })
  await retry(async () => {
    const ready = await evaluate(`document.readyState === "complete" && location.href === ${JSON.stringify(targetUrl)}`)
    if (!ready) throw new Error('Page is still loading')
    return true
  })

  const initialResources = await retry(async () => {
    const resources = await evaluate('performance.getEntriesByType("resource").map((entry) => entry.name)')
    if (!resources.some((url) => url.includes('/_next/static/chunks/app/'))) {
      throw new Error('Initial Next.js resources are not registered yet')
    }
    return resources
  })
  if (initialResources.some((url) => url.includes('googletagmanager.com') || url.includes('/speed-insights/'))) {
    throw new Error('Non-essential telemetry loaded before user engagement')
  }

  await retry(async () => {
    const ready = await evaluate('document.documentElement.dataset.deferredExperiences === "ready"')
    if (!ready) throw new Error('Deferred experience listener is not ready yet')
    return true
  })
  await evaluate('window.dispatchEvent(new CustomEvent("enorese:easter-egg"))')
  await retry(async () => {
    const open = await evaluate('Boolean(document.querySelector("[aria-label=\\"Easter egg terminal\\"]"))')
    if (!open) throw new Error('Deferred terminal is not open yet')
    return true
  })

  const finalResources = await evaluate('performance.getEntriesByType("resource").map((entry) => entry.name)')
  const additionalScripts = finalResources.filter((url) => !initialResources.includes(url) && url.endsWith('.js'))
  if (additionalScripts.length === 0) throw new Error('The terminal opened without a deferred JavaScript request')

  console.log(JSON.stringify({
    status: 'ok',
    initialResourceCount: initialResources.length,
    deferredScripts: additionalScripts.map((url) => new URL(url).pathname),
  }, null, 2))
} finally {
  socket?.close()
  chrome.kill()
  if (chrome.exitCode === null) {
    await new Promise((resolve) => chrome.once('exit', resolve))
  }
  await retry(() => rm(profile, { recursive: true, force: true }), 20)
}
