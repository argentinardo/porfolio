# 🎮 Guía para subir New H.E.R.O. a itch.io

Esta guía te ayudará a preparar y subir el juego **New H.E.R.O.** a itch.io.

## 📋 Requisitos previos

1. Tener el proyecto New H.E.R.O. construido y funcionando
2. Tener una cuenta en [itch.io](https://itch.io)
3. Node.js instalado (para ejecutar el script de preparación)

## 🚀 Pasos para preparar el paquete

### Opción 1: Usar el script automático

1. **Ejecuta el script de preparación:**
   ```bash
   node prepare-itch-io.js
   ```

2. **Ve al repositorio del juego New H.E.R.O.:**
   ```bash
   cd ../hero  # o la ruta donde tengas el proyecto
   ```

3. **Construye el proyecto:**
   ```bash
   npm run build
   # o el comando que uses para construir
   ```

4. **Copia los archivos al paquete:**
   - Copia todos los archivos del directorio `build` o `dist` del proyecto
   - Pégarlos en el directorio `itch-io-package` que se creó

5. **Crea el archivo ZIP:**
   - Selecciona todos los archivos dentro de `itch-io-package`
   - Comprímelos en un archivo ZIP
   - Nombre sugerido: `new-hero-itch-io.zip`

### Opción 2: Manual

1. **Construye el proyecto New H.E.R.O.**
   ```bash
   npm run build
   ```

2. **Crea un directorio para el paquete:**
   ```bash
   mkdir itch-io-package
   cd itch-io-package
   ```

3. **Copia los archivos del build:**
   - Copia todos los archivos del directorio `build` o `dist`
   - Asegúrate de que `index.html` esté en la raíz

4. **Verifica la estructura:**
   ```
   itch-io-package/
   ├── index.html          ← Debe estar en la raíz
   ├── static/            ← CSS, JS, imágenes
   │   ├── css/
   │   ├── js/
   │   └── media/
   ├── assets/            ← Otros assets si los hay
   └── ...
   ```

5. **Crea el archivo ZIP:**
   - Comprime todo el contenido del directorio
   - **IMPORTANTE:** No comprimas el directorio, sino su contenido

## 📤 Subir a itch.io

1. **Ve a tu página de itch.io:**
   - Inicia sesión en [itch.io](https://itch.io)
   - Ve a "Create new project" o edita un proyecto existente

2. **Configuración básica:**
   - **Título:** New H.E.R.O.
   - **URL:** new-hero (o el que prefieras)
   - **Descripción:**
     ```
     Recreation of the classic ATARI H.E.R.O. game, developed with TypeScript. 
     Web version and mobile application with modern mechanics and updated design.
     
     🎮 Controls:
     - Arrow keys or WASD: Move character
     - Space: Use jetpack
     - P: Pause game
     - M: Mute/Unmute music
     ```

3. **Subir el archivo:**
   - En la sección "Uploads"
   - Haz clic en "Upload files"
   - Sube el archivo ZIP que creaste
   - Selecciona "HTML" como tipo de proyecto

4. **Configuración del proyecto:**
   - **Kind of project:** HTML
   - **Embed options:** 
     - Width: 800px (o el ancho de tu juego)
     - Height: 600px (o la altura de tu juego)
   - **This game can be played in:** Browser

5. **Etiquetas (tags):**
   - game
   - retro
   - atari
   - platformer
   - html5
   - arcade
   - classic

6. **Precio:**
   - Puedes dejarlo gratis o poner un precio
   - También puedes permitir "Pay what you want"

7. **Capturas de pantalla:**
   - Añade al menos 3-5 capturas de pantalla
   - Tamaño recomendado: 1280x720 o 1920x1080
   - Formato: PNG o JPG

8. **Video (opcional pero recomendado):**
   - Añade un video de gameplay
   - Duración: 30-60 segundos
   - Formato: MP4

9. **Publicar:**
   - Revisa toda la información
   - Haz clic en "Save & view page"
   - Luego en "Publish this project"

## ✅ Verificación

Después de subir, verifica que:

- [ ] El juego se carga correctamente
- [ ] Todos los assets se cargan (imágenes, sonidos, etc.)
- [ ] Los controles funcionan
- [ ] El juego es responsive (si aplica)
- [ ] No hay errores en la consola del navegador

## 🔧 Solución de problemas

### El juego no se carga
- Verifica que `index.html` esté en la raíz del ZIP
- Revisa las rutas de los assets (deben ser relativas)
- Abre la consola del navegador para ver errores

### Los assets no se cargan
- Asegúrate de que todas las rutas sean relativas (./ o sin / al inicio)
- Verifica que todos los archivos estén incluidos en el ZIP
- Revisa que no haya rutas absolutas

### El juego no es responsive
- Ajusta el tamaño del embed en itch.io
- Verifica los estilos CSS del juego
- Considera añadir viewport meta tags

## 📝 Información adicional

- **Repositorio GitHub:** https://github.com/damiannardini/hero
- **Demo en vivo:** https://newhero.netlify.app/
- **Desarrollador:** Damian Nardini

## 🎉 ¡Listo!

Una vez publicado, tu juego estará disponible en:
`https://tu-usuario.itch.io/new-hero`

¡Buena suerte con tu publicación! 🚀









