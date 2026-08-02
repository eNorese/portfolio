import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// ── Config (server-only env vars — nunca expuestas al cliente) ──────────
const RESEND_API_KEY = process.env.RESEND_API_KEY
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'enzo.norese@gmail.com'
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>'

// Instancia reutilizable entre invocaciones (se crea una vez por módulo).
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

// ── Límites de entrada (anti-abuso) ─────────────────────────────────────
const MAX = { name: 100, email: 254, message: 5000 } as const
const MAX_BODY_BYTES = 20_000 // corta payloads gigantes antes de parsear

// ── Helpers ─────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Escapa HTML para evitar inyección en el cuerpo del correo. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Verificación de origen (CSRF-lite): solo aceptamos POST del mismo host.
 * Si el header `Origin` viene presente y su host no coincide con el `Host`
 * de la request, se rechaza. Funciona en producción, previews y localhost
 * sin allowlist fija. Si no hay `Origin` (algunos clientes lo omiten), se
 * deja pasar y las demás validaciones hacen su trabajo.
 */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    const host = request.headers.get('host')
    return Boolean(host) && new URL(origin).host === host
  } catch {
    return false
  }
}

type ContactPayload = {
  name?: unknown
  email?: unknown
  message?: unknown
  website?: unknown // honeypot — un humano nunca lo llena
}

// ── Handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  if (!resend) {
    console.error('[contact] RESEND_API_KEY no está configurada')
    return NextResponse.json(
      { error: 'El servicio de correo no está configurado.' },
      { status: 500 }
    )
  }

  // 1. Verificación de origen (anti-CSRF / anti-POST cross-site)
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 })
  }

  // 2. Enforce Content-Type: application/json
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Content-Type no soportado.' }, { status: 415 })
  }

  // 3. Corta payloads gigantes antes de leerlos (según Content-Length)
  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload demasiado grande.' }, { status: 413 })
  }

  let body: ContactPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido.' }, { status: 400 })
  }

  // 4. Honeypot: si el campo trampa viene relleno, es un bot.
  //    Respondemos 200 OK silencioso (sin enviar) para no dar feedback al bot.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  // 5. Normaliza y valida en el servidor (no se confía en el cliente)
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  // Mínimos
  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json({ error: 'Datos del formulario inválidos.' }, { status: 422 })
  }
  // Máximos (evita emails gigantes / abuso de cuota)
  if (name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) {
    return NextResponse.json({ error: 'Datos del formulario demasiado largos.' }, { status: 422 })
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email, // responder directamente al remitente del formulario
    subject: `Nuevo mensaje de ${name} — Portfolio`,
    html: `
      <div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="margin: 0 0 16px;">Nuevo mensaje desde el portfolio</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mensaje:</strong></p>
        <p style="white-space: pre-wrap; padding: 12px 16px; background: #f1f5f9; border-radius: 8px;">${escapeHtml(message)}</p>
      </div>
    `,
  })

  if (error) {
    console.error('[contact] Error de Resend:', error)
    return NextResponse.json({ error: 'No se pudo enviar el mensaje.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
