import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-white dark:bg-gray-950">
      <p className="text-5xl font-bold text-accent">404</p>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        Page not found · Página no encontrada
      </h1>
      <Link
        href="/es"
        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium transition-transform hover:scale-105"
      >
        ← Volver al inicio
      </Link>
    </main>
  )
}
