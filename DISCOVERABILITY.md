# Medición de indexabilidad y visibilidad en respuestas de IA

Este proyecto mide dos cosas distintas:

1. **Preparación técnica:** si crawlers y sistemas de recuperación pueden acceder, interpretar y atribuir correctamente el contenido.
2. **Resultado externo:** si buscadores y asistentes realmente indexan, muestran y citan el sitio.

Ningún archivo (`llms.txt`, JSON-LD o `robots.txt`) puede garantizar una cita. La autoridad de la entidad, los enlaces externos, la relevancia para cada consulta y las políticas de cada motor también influyen.

## Auditoría técnica reproducible

Ejecutar después de cada cambio relevante:

```bash
npm run audit:discoverability
```

El comando construye el sitio y evalúa el HTML final, no solo el código fuente. Comprueba:

- acceso general y de crawlers de IA actuales;
- sitemap, URLs canónicas, `hreflang` y fecha de modificación estable;
- HTML prerenderizado, metadatos, jerarquía de headings y contenido visible sin JavaScript;
- JSON-LD y resolución de la entidad `Enzo Norese` / `Enzo Norese Rivera`;
- presencia, profundidad y fecha de `llms.txt` y `llms-full.txt`.

La meta del repositorio es **100/100**. El puntaje es una prueba de configuración, no una predicción de ranking.

## Medición real: buscadores

Configurar Google Search Console y Bing Webmaster Tools, enviar `https://www.enorese.com/sitemap.xml` y registrar mensualmente:

- páginas válidas indexadas (`/es` y `/en`);
- impresiones sin marca por consultas relacionadas con Azure, backend, serverless e IA;
- impresiones y posición para `Enzo Norese` y `Enzo Norese Rivera`;
- clics, CTR y países;
- errores de rastreo y de datos estructurados.

Usar inspección de URL sobre ambas rutas después de cambios importantes. Validar el JSON-LD con Rich Results Test y Schema Markup Validator.

## Medición real: motores de respuesta

Una vez al mes, probar en ChatGPT Search, Claude y Perplexity una lista fija, en una sesión nueva y sin proporcionar la URL. Ejemplos:

- `¿Quién es Enzo Norese Rivera?`
- `Desarrolladores backend especializados en Azure en Chile`
- `Arquitectos cloud con experiencia en IA y Azure Functions en Latinoamérica`
- `Consultor para automatización de procesos con IA en Chile`

Guardar por motor y consulta:

- si menciona a Enzo;
- si enlaza o cita `enorese.com`;
- posición de la mención entre las fuentes;
- exactitud de cinco hechos: rol, ubicación, stack, experiencia y proyectos;
- fecha de la prueba.

Métricas recomendadas:

- **Citation rate:** respuestas que enlazan el dominio / respuestas evaluadas.
- **Mention rate:** respuestas que mencionan a Enzo / respuestas evaluadas.
- **Fact accuracy:** hechos correctos / hechos comprobados.
- **Query coverage:** consultas distintas que producen una mención correcta.

Para evitar autoengaño, mantener las mismas consultas durante al menos tres meses y añadir consultas nuevas en un grupo separado.

## Señales que requieren trabajo fuera del código

- Perfiles de LinkedIn, GitHub y X con el mismo nombre, cargo y dominio.
- Enlaces auténticos desde perfiles profesionales, publicaciones técnicas, comunidades y páginas de proyectos.
- Casos de estudio públicos con URLs propias, evidencia verificable y fecha.
- Contenido actualizado que responda consultas específicas de la audiencia objetivo.
- Logs de Vercel/WAF para confirmar solicitudes de `OAI-SearchBot`, `Claude-SearchBot` y `PerplexityBot`.

`llms.txt` se mantiene como ayuda experimental de lectura y descubrimiento. La evidencia principal sigue siendo HTML accesible, contenido útil, datos estructurados coherentes, enlaces externos y medición en las herramientas de cada motor.
