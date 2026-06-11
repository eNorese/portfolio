import { NextRequest, NextResponse } from 'next/server'

const LOCALES = ['es', 'en'] as const
const DEFAULT_LOCALE = 'es'

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

  const accept = request.headers.get('accept-language')?.toLowerCase() ?? ''
  const locale = accept.startsWith('en') ? 'en' : DEFAULT_LOCALE

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Excluye API, internos de Next y cualquier archivo con extensión.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
