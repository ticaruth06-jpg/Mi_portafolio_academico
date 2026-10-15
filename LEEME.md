# Portafolio Académico – Nayeli Quispe Tica (UPLA · U00057H)

## Archivos (deben llamarse EXACTAMENTE así, sin "(1)")
index.html · style.css · script.js · logo-universidad.png · foto-estudiante.png · robot-asistente.png · .nojekyll

## Cómo reemplazar
Repositorio MI-PORTAFOLIO-ACADEMICO → Add file → Upload files → arrastra estos 6 archivos → Commit changes.
La carpeta "entregas" no se toca: todo lo que ya subiste sigue apareciendo. Después recarga con Ctrl+F5.

## Carpetas de tareas
entregas/algoritmo/semana-01/...   entregas/taller/semana-01/...
Dentro: tus archivos, tema.txt (tema de la semana) y enlaces (enlaces.txt, un enlace por línea).

## Cada semana
Tarjeta con el tema y botón "Ver evidencias": se despliega la lista (icono, nombre, tamaño, 👁️ Ver y 📥 Descargar).
"Ver" abre la imagen grande: clic para acercar/alejar, rueda del mouse, arrastrar, ➖ ➕ Normal, flechas, pellizco en el celular.

## Acceso
- Cualquier persona con el enlace (el profesor) ve todo, amplía imágenes y descarga, sin iniciar sesión.
- Iniciar sesión es solo para ti (clave 1234; se cambia en script.js → claveAdministrador). Dentro de cada semana ves:
  ✏️ Guardar tema, ➕ Subir archivos, 🔗 Añadir enlace y 🗑 Descartar en cada archivo/enlace.
- Subir y descartar abren GitHub (ya con tu sesión): confirma con "Commit changes". Al volver, la lista se actualiza sola.

## Íconos junto a "Iniciar sesión"
✉️ Outlook (https://outlook.office.com/mail/) y 🏛️ Intranet UPLA (https://intranet.upla.edu.pe/sesion).
Si quieres cambiar alguna dirección: script.js → CONFIG (outlook, intranet, aulaVirtual) y el mismo enlace en index.html (#qOutlook, #qIntranet).

## Asistente (robot animado abajo a la derecha)
Responde preguntas del portafolio con sus temas y evidencias actuales. También puede consultar Gemini para preguntas abiertas y explicar conceptos.
La conexión es opcional hasta completar la configuración; mientras tanto, funcionan las respuestas del portafolio.

### Activar la IA gratis con Gemini y Cloudflare
1. Crea una clave gratuita en Google AI Studio: https://aistudio.google.com/app/apikey. No la publiques ni la pegues en `script.js`.
2. Instala Node.js si aún no está instalado y abre una terminal en la carpeta `asistente-worker`.
3. Ejecuta `npx wrangler@latest login` y autoriza tu cuenta gratuita de Cloudflare.
4. Ejecuta `npx wrangler@latest secret put GEMINI_API_KEY` y pega la clave cuando se solicite.
5. Publica el servicio con `npx wrangler@latest deploy`. Wrangler mostrará una dirección terminada en `.workers.dev`.
6. Copia esa dirección, añade `/chat` y pégala en `CONFIG.asistenteApi` en `script.js`; por ejemplo: `https://portafolio-asistente.tu-cuenta.workers.dev/chat`.
7. Sube los archivos actualizados a GitHub y recarga el portafolio.

El Worker limita las solicitudes y acepta conexiones desde el dominio de GitHub Pages configurado. Si usas un dominio propio, actualiza `ALLOWED_ORIGIN` en `asistente-worker/wrangler.toml` con el origen de ese dominio y vuelve a desplegar. La clave de Gemini queda guardada como secreto en Cloudflare, nunca en el navegador. Los mensajes y el contexto del portafolio se envían a Google Gemini para generar las respuestas; no incluyas contraseñas ni datos privados en el chat. Google puede aplicar límites, cambiar la disponibilidad del nivel gratuito o sus políticas.
Para agregar respuestas locales nuevas: `script.js` → función `responder()`.
