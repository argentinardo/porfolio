# 🔧 Corregir Rutas para itch.io

## ❌ Problema

El juego está intentando cargar archivos desde rutas absolutas que no funcionan en itch.io:

```
GET https://html-classic.itch.zone/vendor/press-start-2p.css 403 (Forbidden)
GET https://html-classic.itch.zone/audio/toy.mp3 403 (Forbidden)
GET https://html-classic.itch.zone/hero-logo.png 403 (Forbidden)
```

## 🔍 Causa

Las rutas absolutas (que empiezan con `/`) intentan cargar desde la raíz del dominio de itch.io, no desde la carpeta del juego.

### ❌ Incorrecto (Rutas absolutas):
```html
<link rel="stylesheet" href="/vendor/press-start-2p.css">
<script src="/vendor/tailwindcss-loader.js"></script>
<img src="/hero-logo.png">
```

### ✅ Correcto (Rutas relativas):
```html
<link rel="stylesheet" href="./vendor/press-start-2p.css">
<script src="./vendor/tailwindcss-loader.js"></script>
<img src="./hero-logo.png">
```

O mejor aún, si están en subdirectorios:
```html
<link rel="stylesheet" href="./static/css/press-start-2p.css">
<script src="./static/js/tailwindcss-loader.js"></script>
<img src="./assets/hero-logo.png">
```

## 🛠️ Solución Automática

### Paso 1: Ejecutar el script de corrección

```bash
node fix-itch-io-paths.js "ruta/al/build"
```

O si el build está en la ubicación por defecto:
```bash
node fix-itch-io-paths.js
```

Este script:
- Busca todas las rutas absolutas en HTML, JS, CSS y JSON
- Las convierte a rutas relativas
- Guarda los archivos corregidos

### Paso 2: Verificar manualmente

Después de ejecutar el script, verifica que:

1. **index.html** no tenga rutas que empiecen con `/`
2. **Los archivos JavaScript** no tengan rutas absolutas hardcodeadas
3. **Los archivos CSS** no tengan `url(/...)` o `@import "/..."`

### Paso 3: Verificar estructura de archivos

Asegúrate de que todos los archivos necesarios estén en el build:

```
build/
├── index.html
├── vendor/
│   ├── press-start-2p.css
│   ├── press-start-2p.ttf
│   ├── nes.min.css
│   └── tailwindcss-loader.js
├── audio/
│   ├── toy.mp3
│   ├── bomb_boom.mp3
│   └── ... (todos los archivos de audio)
├── hero-logo.png
├── qr.png
├── auth0-config.json
└── static/
    ├── css/
    ├── js/
    └── media/
```

## 🔧 Solución en el Código Fuente (Recomendado)

Para una solución permanente, corrige las rutas en el código fuente del proyecto:

### 1. En index.html (o template HTML)

**Busca y reemplaza:**
```html
<!-- ❌ Antes -->
<link rel="stylesheet" href="/vendor/press-start-2p.css">
<script src="/vendor/tailwindcss-loader.js"></script>

<!-- ✅ Después -->
<link rel="stylesheet" href="./vendor/press-start-2p.css">
<script src="./vendor/tailwindcss-loader.js"></script>
```

### 2. En archivos JavaScript/TypeScript

**Busca y reemplaza:**
```javascript
// ❌ Antes
fetch('/auth0-config.json')
import '/vendor/something.js'
require('/audio/sound.mp3')

// ✅ Después
fetch('./auth0-config.json')
import './vendor/something.js'
require('./audio/sound.mp3')
```

### 3. En archivos de configuración (vite.config.js, webpack.config.js, etc.)

Si usas un bundler, configura las rutas base:

**Vite:**
```javascript
export default {
  base: './', // Rutas relativas
  build: {
    assetsDir: 'assets',
  }
}
```

**Webpack:**
```javascript
module.exports = {
  output: {
    publicPath: './', // Rutas relativas
  }
}
```

**Create React App:**
En `package.json`:
```json
{
  "homepage": "./"
}
```

### 4. En archivos CSS

**Busca y reemplaza:**
```css
/* ❌ Antes */
@import "/vendor/fonts.css";
background-image: url(/images/bg.png);

/* ✅ Después */
@import "./vendor/fonts.css";
background-image: url(./images/bg.png);
```

## 📋 Checklist Antes de Subir a itch.io

- [ ] Todas las rutas en `index.html` son relativas (empiezan con `./` o sin `/`)
- [ ] Los archivos JavaScript no tienen rutas absolutas hardcodeadas
- [ ] Los archivos CSS no tienen `url(/...)` o `@import "/..."`
- [ ] Todos los assets (imágenes, audio, fuentes) están en el build
- [ ] El juego funciona localmente con un servidor HTTP
- [ ] No hay errores 403 en la consola del navegador
- [ ] El Service Worker está configurado correctamente (si lo usas)

## 🧪 Probar Localmente

Después de corregir las rutas, prueba el juego localmente:

```bash
# Opción 1: Usar el servidor Node.js
node serve-game.js "ruta/al/build"

# Opción 2: Usar Python
cd ruta/al/build
python -m http.server 8000
```

Abre `http://localhost:3000` (o `http://localhost:8000`) y verifica:
- No hay errores 403 en la consola
- Todos los assets se cargan correctamente
- El juego funciona sin problemas

## 🚀 Crear el ZIP para itch.io

Una vez que todo funciona localmente:

1. **Ejecuta el script de corrección:**
   ```bash
   node fix-itch-io-paths.js "ruta/al/build"
   ```

2. **Crea el archivo ZIP:**
   ```bash
   node create-itch-zip.js "ruta/al/build"
   ```

3. **O manualmente:**
   - Selecciona todos los archivos del directorio `build`
   - Crea un archivo ZIP
   - **IMPORTANTE:** No comprimas el directorio, sino su contenido

4. **Sube a itch.io:**
   - Ve a tu proyecto en itch.io
   - Sube el archivo ZIP
   - Selecciona "HTML" como tipo de proyecto

## 🔍 Verificar en itch.io

Después de subir, verifica:
- Abre la consola del navegador (F12)
- No debe haber errores 403
- Todos los assets deben cargarse
- El juego debe funcionar correctamente

## 💡 Notas Adicionales

1. **Service Worker**: Si usas Service Worker, asegúrate de que también use rutas relativas
2. **Auth0**: El archivo `auth0-config.json` debe estar en el build si lo necesitas
3. **Assets externos**: Si cargas assets desde CDN, esas URLs pueden quedarse como están
4. **Base tag**: Si tienes `<base href="/">` en el HTML, cámbialo a `<base href="./">` o elimínalo

## 🆘 Si Aún Tienes Problemas

1. **Abre la consola del navegador** en itch.io
2. **Copia todos los errores**
3. **Verifica qué archivos faltan** o tienen rutas incorrectas
4. **Corrige manualmente** esos archivos
5. **Vuelve a crear el ZIP** y sube de nuevo

¡Buena suerte! 🎮









