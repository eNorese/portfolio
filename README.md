# Enzo Norese — Portfolio Personal

Portfolio web profesional. Stack: React + TypeScript + Tailwind CSS + Framer Motion.

---

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

---

## 1. Configurar EmailJS (formulario de contacto)

El formulario usa EmailJS para enviar mensajes sin backend propio.

**Pasos:**

1. Crea una cuenta en [emailjs.com](https://www.emailjs.com/)
2. Crea un **Email Service** (Gmail, Outlook, etc.) y copia el `Service ID`
3. Crea un **Email Template** con estas variables:
   - `{{from_name}}` — nombre del remitente
   - `{{from_email}}` — email del remitente
   - `{{subject}}` — asunto
   - `{{message}}` — mensaje
4. Copia el `Template ID` y tu `Public Key`

**Instala el SDK:**
```bash
npm install @emailjs/browser
```

**Activa el envío en** `src/components/Contact.tsx`, reemplaza el bloque comentado:

```tsx
import emailjs from '@emailjs/browser'

// Dentro de handleSubmit, reemplaza el await new Promise(...):
await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  {
    from_name: form.name,
    from_email: form.email,
    subject: form.subject,
    message: form.message,
  },
  'YOUR_PUBLIC_KEY',
)
```

---

## 2. Agregar proyectos

Los proyectos viven en los archivos de traducción `src/i18n/es.json` y `src/i18n/en.json`.

**Para modificar el proyecto principal** (migración ERP), edita la clave `projects.main_project` en ambos archivos.

**Para agregar placeholders** (proyectos próximos), edita el array `projects.placeholders`:

```json
"placeholders": [
  {
    "title": "Nombre del proyecto",
    "description": "Descripción breve.",
    "tags": ["Tag1", "Tag2"]
  }
]
```

**Para mostrar un proyecto real con link a GitHub**, crea un nuevo componente `ProjectCard` en `src/components/Projects.tsx` que reciba `githubUrl` y `liveUrl`.

---

## 3. Actualizar información personal

Toda la información configurable está en `src/lib/constants.ts`:

```ts
// Email de contacto
export const CONTACT_EMAIL = 'tu@email.com'

// Redes sociales
export const SOCIAL_LINKS = {
  github: 'https://github.com/tu-usuario',
  linkedin: 'https://linkedin.com/in/tu-perfil',
  instagram: 'https://instagram.com/tu-perfil',
}
```

El contenido de texto (bio, experiencia, proyectos) está en `src/i18n/es.json` (español) y `src/i18n/en.json` (inglés).

---

## 4. Deploy en Vercel

1. Sube el repositorio a GitHub
2. Ve a [vercel.com](https://vercel.com) → **New Project** → importa el repo
3. Vercel detecta automáticamente que es un proyecto Vite:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Haz clic en **Deploy**

Para actualizaciones futuras, cada `git push` a `main` dispara un deploy automático.

---

## 5. Variables de entorno

Este proyecto **no requiere variables de entorno** por defecto.

Si configuras EmailJS y prefieres no hardcodear las credenciales, puedes usar variables de entorno de Vite:

**`.env.local`** (no se sube a git):
```
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxx
```

En `Contact.tsx`:
```ts
await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  { ... },
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
)
```

En Vercel, agrega las mismas variables en **Project Settings → Environment Variables**.

---

## Estructura del proyecto

```
src/
  components/     # Componentes por sección
  contexts/       # ThemeContext, LanguageContext
  hooks/          # useCursor, useScrollAnimation, useTypewriter
  i18n/           # es.json, en.json — todo el texto visible
  lib/            # constants.ts — URLs y datos de configuración
```
