const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const PORT = 3000;
const BUILD_PATH = process.argv[2] || path.join(__dirname, '../hero/build');

console.log('🎮 Iniciando servidor local para New H.E.R.O...\n');

// Verificar que existe el directorio de build
if (!fs.existsSync(BUILD_PATH)) {
  console.error('❌ ERROR: No se encontró el directorio de build.');
  console.error(`   Ruta buscada: ${BUILD_PATH}`);
  console.error('\n💡 Opciones:');
  console.error('   1. Ejecuta: npm run build en el proyecto New H.E.R.O.');
  console.error('   2. O especifica la ruta: node serve-game.js "ruta/al/build"');
  process.exit(1);
}

// Verificar que existe index.html
const indexPath = path.join(BUILD_PATH, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ ERROR: No se encontró index.html en el directorio de build.');
  console.error(`   Ruta buscada: ${indexPath}`);
  process.exit(1);
}

console.log('✅ Directorio de build encontrado:', BUILD_PATH);
console.log('✅ index.html encontrado\n');

// Crear servidor HTTP simple
const server = http.createServer((req, res) => {
  // Obtener la ruta del archivo solicitado
  let filePath = path.join(BUILD_PATH, req.url === '/' ? 'index.html' : req.url);
  
  // Limpiar la ruta para seguridad
  filePath = path.normalize(filePath);
  
  // Verificar que el archivo esté dentro del directorio de build
  if (!filePath.startsWith(path.resolve(BUILD_PATH))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Leer el archivo
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Si no se encuentra, intentar servir index.html (para SPA)
        if (req.url !== '/index.html') {
          fs.readFile(indexPath, (err, data) => {
            if (err) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('404 Not Found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(data);
            }
          });
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        }
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      // Determinar el tipo de contenido
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.ttf': 'font/ttf',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.eot': 'application/vnd.ms-fontobject',
      };
      
      const contentType = contentTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log('✨ Servidor iniciado exitosamente!');
  console.log(`\n🌐 Abre tu navegador en:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`\n📁 Sirviendo archivos desde: ${BUILD_PATH}`);
  console.log(`\n⏹️  Presiona Ctrl+C para detener el servidor\n`);
  
  // Intentar abrir el navegador automáticamente
  const isWindows = process.platform === 'win32';
  const isMac = process.platform === 'darwin';
  
  try {
    if (isWindows) {
      execSync(`start http://localhost:${PORT}`, { stdio: 'ignore' });
    } else if (isMac) {
      execSync(`open http://localhost:${PORT}`, { stdio: 'ignore' });
    } else {
      execSync(`xdg-open http://localhost:${PORT}`, { stdio: 'ignore' });
    }
  } catch (e) {
    // Ignorar si no se puede abrir el navegador
  }
});

// Manejar cierre del servidor
process.on('SIGINT', () => {
  console.log('\n\n🛑 Deteniendo servidor...');
  server.close(() => {
    console.log('✅ Servidor detenido.');
    process.exit(0);
  });
});









