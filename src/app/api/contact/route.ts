import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// ── Config (server-only env vars — nunca expuestas al cliente) ──────────
const RESEND_API_KEY = process.env.RESEND_API_KEY
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'enzo.norese@gmail.com'
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>'

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

type ContactPayload = { name?: unknown; email?: unknown; message?: unknown }

// ── Handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  if (!RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY no está configurada')
    return NextResponse.json(
      { error: 'El servicio de correo no está configurado.' },
      { status: 500 }
    )
  }

  let body: ContactPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido.' }, { status: 400 })
  }

  // Normaliza y valida en el servidor (no se confía en el cliente)
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json({ error: 'Datos del formulario inválidos.' }, { status: 422 })
  }

  const resend = new Resend(RESEND_API_KEY)

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
