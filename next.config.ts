import type { NextConfig } from 'next'

// Cabeceras de seguridad aplicadas a todas las rutas.
// (CSP se omite por ahora: requiere nonce/allowlist por los scripts inline
//  de anti-flash, JSON-LD y GA — se añadiría aparte en modo Report-Only.)
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Tailwind generates a small stylesheet, so inlining removes a render-blocking round trip.
    inlineCss: true,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
