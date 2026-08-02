import { NextRequest, NextResponse } from 'next/server'

const LOCALES = ['es', 'en'] as const

type Locale = (typeof LOCALES)[number]

// Foco hispanohablante (LatAm + España): el español es el idioma por defecto.
// Solo se sirve inglés a quien lo prefiere explícitamente en su navegador.
const FALLBACK_LOCALE: Locale = 'es'

/**
 * Detecta el idioma a partir del header `Accept-Language`.
 * Parsea las preferencias con su factor de calidad (`q`) y elige el primer
 * idioma soportado (es/en) según prioridad real del navegador. Si el visitante
 * no prefiere ninguno de los dos, cae a español (audiencia objetivo: LatAm/España).
 *
 * Ej.: "fr-FR,fr;q=0.9,en;q=0.8,es;q=0.5" → en (prefiere inglés sobre español).
 * Ej.: "de-DE,de"                          → es (no prefiere inglés → español por defecto).
 */
function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return FALLBACK_LOCALE

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return {
        lang: tag.split('-')[0].toLowerCase(),
        q: q ? parseFloat(q) : 1,
      }
    })
    .filter((item) => item.lang)
    .sort((a, b) => b.q - a.q)

  for (const { lang } of ranked) {
    if ((LOCALES as readonly string[]).includes(lang)) return lang as Locale
  }
  return FALLBACK_LOCALE
}

/**
 * Routing por idioma (Opción A): toda página vive bajo `/es` o `/en`.
 * Las rutas sin locale se redirigen al idioma preferido del navegador
 * (o al por defecto). Los assets, la API y los archivos con extensión
 * (robots.txt, sitemap.xml, llms.txt…) quedan excluidos por el matcher.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (hasLocale) return NextResponse.next()

  const locale = detectLocale(request.headers.get('accept-language'))

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Excluye API, internos de Next y cualquier archivo con extensión.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
