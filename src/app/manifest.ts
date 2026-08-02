import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Enzo Norese — Backend Developer & Cloud Architect',
    short_name: 'eNorese',
    description: 'Backend developer y arquitecto cloud especializado en infraestructura cloud, serverless e inteligencia artificial.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#030712',
    icons: [
      { src: '/icon-180.png', sizes: '180x180', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
