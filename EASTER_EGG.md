# Easter Egg — Terminal Interactivo

## Cómo activarlo

Haz clic **5 veces seguidas** en el logo `eNorese.` del navbar (tienes 2 segundos entre clics).

## Qué hace

Abre un terminal interactivo estilo Linux con fuente `Consolas` sobre fondo `#0d1117` (estilo GitHub Dark). Arranca con una secuencia de boot y luego muestra el prompt `enzo@portfolio:~$` donde podés tipear comandos reales.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `help` | Lista todos los comandos |
| `ls` | Lista archivos del directorio |
| `ls -la` | Listado detallado con permisos (`skills.sh` aparece en verde como ejecutable) |
| `cat about.txt` | Info personal |
| `cat skills.sh` | Muestra el **código fuente** del script (líneas `echo "..."`) |
| `sh skills.sh` | **Ejecuta** el script y muestra el output con colores por categoría |
| `bash skills.sh` | Igual que `sh skills.sh` |
| `cat contact.txt` | Datos de contacto |
| `print <texto>` | Imprime texto a stdout |
| `echo <texto>` | Igual que print |
| `pwd` | Directorio actual |
| `whoami` | Usuario actual |
| `date` | Fecha y hora reales |
| `uname -a` | Info del sistema (fake) |
| `neofetch` | Box art `eNorese.` + info del sistema |
| `top` | Visor de procesos en vivo (se refresca cada 1s, `q` para salir) |
| `git log` | Commits reales del repo |
| `git status` | Estado del repo |
| `npm run dev` | Simula arranque de Next.js |
| `history` | Historial de la sesión |
| `clear` | Limpia el terminal |
| `exit` | Cierra el terminal |

**Navegación:** `↑` / `↓` para navegar el historial de comandos.

## `skills.sh` — comportamiento dual

```bash
# cat skills.sh → muestra el fuente
#!/bin/bash
# Enzo Norese — Skills
echo "Languages:  TypeScript · JavaScript · C# · Python"
echo "Cloud:      Azure Functions · Storage · DevOps"
...

# sh skills.sh → ejecuta y muestra output con colores
Languages:  TypeScript · JavaScript · C# · Python   ← cyan
Cloud:      Azure Functions · Storage · DevOps       ← blue
Databases:  SQL Server · PostgreSQL · Redis           ← green
Frameworks: Node.js · Express · NestJS · Next.js     ← purple
Tools:      Docker · Kubernetes · Git · CI/CD         ← orange
```

## Console easter egg (bonus)

Los devs que abran DevTools ven un badge `eNorese.` en indigo y el email de contacto.

## Implementación

| Archivo | Rol |
|---|---|
| `src/components/EasterEgg.tsx` | Terminal completo: boot, procesador de comandos, `top` en vivo, historial, hidden input |
| `src/components/Navbar.tsx` | Cuenta 5 clics en el logo → `CustomEvent('enorese:easter-egg')` |
| `src/app/page.tsx` | Monta `<EasterEgg />` |
