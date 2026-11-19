import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath))

const checks = []
function check(category, points, label, passed, detail = '') {
  checks.push({ category, points, label, passed: Boolean(passed), detail })
}

function jsonLdGraphs(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => {
      try { return JSON.parse(match[1]) } catch { return null }
    })
    .filter(Boolean)
}

const locales = {
  es: {
    url: 'https://www.enorese.com/es',
    marker: 'Problemas reales, decisiones técnicas e impacto.',
    language: 'es',
  },
  en: {
    url: 'https://www.enorese.com/en',
    marker: 'Real problems, engineering decisions, and impact.',
    language: 'en',
  },
}

const robots = exists('public/robots.txt') ? read('public/robots.txt') : ''
const sitemap = exists('.next/server/app/sitemap.xml.body')
  ? read('.next/server/app/sitemap.xml.body')
  : ''

check('Crawl access', 3, 'robots.txt exists', robots.length > 0)
check('Crawl access', 3, 'General crawlers are allowed', /User-agent:\s*\*[\s\S]*?Allow:\s*\//i.test(robots))
check('Crawl access', 2, 'Sitemap is declared in robots.txt', /Sitemap:\s*https:\/\/www\.enorese\.com\/sitemap\.xml/i.test(robots))

const aiBots = ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended']
for (const bot of aiBots) {
  check('Crawl access', 1.5, `${bot} is explicitly allowed`, new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?Allow:\\s*\\/`, 'i').test(robots))
}

check('Crawl access', 2, 'Built sitemap exists', sitemap.startsWith('<?xml'))
check('Crawl access', 2, 'Sitemap date is stable and explicit', /<lastmod>2026-11-18T03:00:00\.000Z<\/lastmod>/.test(sitemap))
for (const { url } of Object.values(locales)) {
  check('Crawl access', 1.5, `Sitemap contains ${url}`, sitemap.includes(`<loc>${url}</loc>`))
}
check('Crawl access', 2, 'Sitemap declares reciprocal language alternates', sitemap.includes('hreflang="es"') && sitemap.includes('hreflang="en"') && sitemap.includes('hreflang="x-default"'))

let primaryGraph = null
for (const [locale, config] of Object.entries(locales)) {
  const relativeHtml = `.next/server/app/${locale}.html`
  const html = exists(relativeHtml) ? read(relativeHtml) : ''
  const canonical = `<link rel="canonical" href="${config.url}"`
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length
  const h2Count = (html.match(/<h2(?:\s|>)/gi) || []).length

  check('Indexable HTML', 2, `/${locale} is prerendered as HTML`, html.length > 50000, `${html.length} chars`)
  check('Indexable HTML', 1.5, `/${locale} has a localized title`, new RegExp(`<title>[^<]{20,}`).test(html))
  check('Indexable HTML', 1.5, `/${locale} has a substantial description`, /<meta name="description" content="[^"]{120,}"/.test(html))
  check('Indexable HTML', 1.5, `/${locale} has the correct canonical`, html.includes(canonical))
  check('Indexable HTML', 1.5, `/${locale} is index/follow`, /<meta name="robots" content="index, follow"/.test(html))
  check('Indexable HTML', 1.5, `/${locale} declares es/en/x-default`, ['es', 'en', 'x-default'].every((lang) => html.includes(`hrefLang="${lang}"`)))
  check('Indexable HTML', 1.5, `/${locale} has exactly one H1`, h1Count === 1, `${h1Count} found`)
  check('Indexable HTML', 1, `/${locale} has a useful heading hierarchy`, h2Count >= 6, `${h2Count} H2s`)
  check('Indexable HTML', 2, `/${locale} exposes core content without client interaction`, html.includes(config.marker))
  check('Indexable HTML', 1, `/${locale} declares the correct document language`, html.includes(`<html lang="${config.language}"`))

  const graphs = jsonLdGraphs(html)
  const graph = graphs.find((item) => Array.isArray(item?.['@graph']))
  primaryGraph ??= graph
  const types = new Set(graph?.['@graph']?.map((item) => item['@type']) || [])
  check('Structured data', 1.5, `/${locale} JSON-LD parses`, Boolean(graph))
  for (const type of ['Person', 'WebSite', 'ProfilePage', 'FAQPage']) {
    check('Structured data', 1, `/${locale} includes ${type}`, types.has(type))
  }
}

const person = primaryGraph?.['@graph']?.find((item) => item['@type'] === 'Person')
check('Structured data', 1.5, 'Person has a stable @id', person?.['@id'] === 'https://www.enorese.com/#person')
check('Structured data', 1.5, 'Person includes full-name alias for entity resolution', person?.alternateName === 'Enzo Norese Rivera')
check('Structured data', 1.5, 'Person links authoritative profiles', Array.isArray(person?.sameAs) && person.sameAs.length >= 3)
check('Structured data', 1.5, 'Person declares expertise', Array.isArray(person?.knowsAbout) && person.knowsAbout.length >= 8)
check('Structured data', 1, 'Person declares services offered', Array.isArray(person?.makesOffer) && person.makesOffer.length >= 4)

const llms = exists('public/llms.txt') ? read('public/llms.txt') : ''
const llmsFull = exists('public/llms-full.txt') ? read('public/llms-full.txt') : ''
check('AI-readable context', 2, 'llms.txt exists and is substantial', llms.length >= 1500, `${llms.length} chars`)
check('AI-readable context', 2, 'llms.txt links both localized pages', llms.includes('/es') && llms.includes('/en'))
check('AI-readable context', 2, 'llms.txt links the full reference', llms.includes('/llms-full.txt'))
check('AI-readable context', 2, 'llms-full.txt contains detailed experience and projects', llmsFull.length >= 4000 && llmsFull.includes('## Professional experience') && llmsFull.includes('## Projects'))
check('AI-readable context', 2, 'llms-full.txt has a precise freshness date', /Last updated:\s*\d{4}-\d{2}-\d{2}/.test(llmsFull))
check('AI-readable context', 2, 'AI context uses a consistent entity name', llmsFull.includes('Enzo Norese Rivera'))

const total = checks.reduce((sum, item) => sum + item.points, 0)
const earned = checks.reduce((sum, item) => sum + (item.passed ? item.points : 0), 0)
const score = Math.round((earned / total) * 100)

const grouped = new Map()
for (const item of checks) {
  if (!grouped.has(item.category)) grouped.set(item.category, [])
  grouped.get(item.category).push(item)
}

for (const [category, items] of grouped) {
  const categoryTotal = items.reduce((sum, item) => sum + item.points, 0)
  const categoryEarned = items.reduce((sum, item) => sum + (item.passed ? item.points : 0), 0)
  console.log(`\n${category}: ${Math.round((categoryEarned / categoryTotal) * 100)}/100`)
  for (const item of items) {
    console.log(`  ${item.passed ? 'PASS' : 'FAIL'}  ${item.label}${item.detail ? ` (${item.detail})` : ''}`)
  }
}

console.log(`\nDiscoverability score: ${score}/100 (${earned}/${total} weighted points)`)
console.log('This score measures technical readiness, not actual inclusion or citation by a search engine or LLM.')

if (checks.some((item) => !item.passed)) process.exitCode = 1
