# 🔧 Solución a Errores CORS y Archivos No Encontrados

## ❌ Problema

Estás viendo estos errores porque estás abriendo el juego directamente desde el sistema de archivos (doble clic en `index.html`), lo que usa el protocolo `file://`.

### Errores comunes:
- `Access to font at 'file:///D:/vendor/...' from origin 'null' has been blocked by CORS policy`
- `GET file:///D:/vendor/... net::ERR_FAILED`
- `Failed to register a ServiceWorker: The URL protocol of the current origin ('null') is not supported`

## ✅ Soluciones

### Opción 1: Usar el servidor Node.js (Recomendado)

1. **Ejecuta el servidor:**
   ```bash
   node serve-game.js "ruta/al/build"
   ```
   
   O si el build está en la ubicación por defecto:
   ```bash
   node serve-game.js
   ```

2. **Abre tu navegador en:**
   ```
   http://localhost:3000
   ```

### Opción 2: Usar Python (si tienes Python instalado)

1. **Python 3:**
   ```bash
   cd ruta/al/build
   python -m http.server 8000
   ```

2. **Python 2:**
   ```bash
   cd ruta/al/build
   python -m SimpleHTTPServer 8000
   ```

3. **Abre tu navegador en:**
   ```
   http://localhost:8000
   ```

### Opción 3: Usar un servidor HTTP simple

#### Con PHP (si tienes PHP instalado):
```bash
cd ruta/al/build
php -S localhost:8000
```

#### Con Live Server (extensión de VS Code):
1. Instala la extensión "Live Server" en VS Code
2. Clic derecho en `index.html`
3. Selecciona "Open with Live Server"

### Opción 4: Usar herramientas online

- **Netlify Drop**: Arrastra y suelta la carpeta build en [netlify.com/drop](https://app.netlify.com/drop)
- **Surge.sh**: `surge ruta/al/build`
- **Vercel**: `vercel ruta/al/build`

## 🔍 Verificar el Build

Antes de servir el juego, asegúrate de que:

1. **El build se completó correctamente:**
   ```bash
   cd ruta/al/proyecto-hero
   npm run build
   ```

2. **Verifica la estructura del build:**
   ```
   build/
   ├── index.html          ← Debe estar aquí
   ├── static/
   │   ├── css/
   │   ├── js/
   │   └── media/
   ├── assets/            ← Si los hay
   ├── audio/             ← Si los hay
   └── vendor/            ← Si los hay
   ```

3. **Verifica las rutas en index.html:**
   - Las rutas deben ser relativas: `./static/...` o `static/...`
   - NO deben ser absolutas: `/static/...` o `D:/static/...`

## 🛠️ Corregir Rutas Absolutas

Si el `index.html` tiene rutas absolutas, necesitas corregirlas:

### ❌ Incorrecto:
```html
<link rel="stylesheet" href="/vendor/press-start-2p.css">
<script src="/vendor/tailwindcss-loader.js"></script>
```

### ✅ Correcto:
```html
<link rel="stylesheet" href="./vendor/press-start-2p.css">
<script src="./vendor/tailwindcss-loader.js"></script>
```

O mejor aún, si están en la carpeta `static`:
```html
<link rel="stylesheet" href="./static/css/press-start-2p.css">
<script src="./static/js/tailwindcss-loader.js"></script>
```

## 📝 Notas Importantes

1. **Nunca abras HTML directamente desde el explorador de archivos** si el proyecto usa:
   - Service Workers
   - Fetch API
   - Módulos ES6
   - CORS requests

2. **Siempre usa un servidor HTTP** para desarrollo y pruebas locales.

3. **Para itch.io**, el juego se servirá desde un servidor HTTP, así que estos problemas no ocurrirán.

## 🎮 Para itch.io

Cuando subas el juego a itch.io, estos problemas NO ocurrirán porque:
- itch.io sirve los archivos desde un servidor HTTP
- Las rutas relativas funcionarán correctamente
- El Service Worker funcionará si está configurado correctamente

Solo asegúrate de que:
- Todas las rutas sean relativas
- Todos los assets estén incluidos en el ZIP
- El `index.html` esté en la raíz del ZIP

## 🚀 Comando Rápido

Si estás en el directorio del proyecto New H.E.R.O.:

```bash
# 1. Construir el proyecto
npm run build

# 2. Servir el build (desde este repositorio)
cd ../porfolio-scroll
node serve-game.js "../hero/build"

# 3. Abrir http://localhost:3000 en el navegador
```

¡Listo! El juego debería funcionar sin errores de CORS.









