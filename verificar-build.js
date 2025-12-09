const fs = require('fs');
const path = require('path');

// Configuración
const BUILD_PATH = process.argv[2] || path.join(__dirname, '../hero/build');

console.log('🔍 Verificando estructura del build para itch.io...\n');

// Verificar que existe el directorio de build
if (!fs.existsSync(BUILD_PATH)) {
  console.error('❌ ERROR: No se encontró el directorio de build.');
  console.error(`   Ruta buscada: ${BUILD_PATH}`);
  process.exit(1);
}

// Verificar que existe index.html
const indexPath = path.join(BUILD_PATH, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ ERROR: No se encontró index.html en el directorio de build.');
  process.exit(1);
}

console.log('✅ Directorio de build encontrado:', BUILD_PATH);
console.log('✅ index.html encontrado\n');

// Leer index.html y buscar referencias a archivos
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Extraer todas las rutas de archivos referenciadas
const fileReferences = new Set();

// Patrones para encontrar referencias a archivos
const patterns = [
  /(href|src|action|data-src|data-href)=["']([^"']+)["']/gi,
  /(fetch|import|require|load)\s*\(\s*["']([^"']+)["']\s*\)/gi,
  /url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi,
  /@import\s+["']([^"']+)["']/gi,
];

patterns.forEach(pattern => {
  let match;
  while ((match = pattern.exec(indexContent)) !== null) {
    const filePath = match[2] || match[1];
    // Ignorar URLs completas y rutas que empiezan con http
    if (!filePath.startsWith('http') && !filePath.startsWith('//') && 
        !filePath.startsWith('data:') && !filePath.startsWith('mailto:')) {
      // Limpiar la ruta (remover ./ o / al inicio)
      const cleanPath = filePath.replace(/^\.?\//, '');
      if (cleanPath && !cleanPath.includes('://')) {
        fileReferences.add(cleanPath);
      }
    }
  }
});

// También buscar en archivos JavaScript compilados
function findReferencesInJS(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      findReferencesInJS(filePath);
    } else if (file.endsWith('.js')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Buscar rutas en el código JavaScript
        const jsPatterns = [
          /["']\/([a-zA-Z0-9_\-./]+\.(js|css|json|png|jpg|jpeg|gif|svg|mp3|wav|ogg|ttf|woff|woff2|eot))["']/g,
          /fetch\s*\(\s*["']\/([^"']+)["']/gi,
          /import\s+["']\/([^"']+)["']/gi,
        ];
        
        jsPatterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const filePath = match[1];
            if (!filePath.startsWith('http') && !filePath.startsWith('//')) {
              const cleanPath = filePath.replace(/^\.?\//, '');
              if (cleanPath) {
                fileReferences.add(cleanPath);
              }
            }
          }
        });
      } catch (e) {
        // Ignorar errores de lectura
      }
    }
  });
}

// Buscar en archivos JavaScript
const staticDir = path.join(BUILD_PATH, 'static');
if (fs.existsSync(staticDir)) {
  findReferencesInJS(staticDir);
}

// Verificar qué archivos existen y cuáles faltan
console.log('📋 Archivos referenciados en el código:\n');

const existingFiles = [];
const missingFiles = [];

fileReferences.forEach(ref => {
  const fullPath = path.join(BUILD_PATH, ref);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    existingFiles.push(ref);
  } else {
    missingFiles.push(ref);
  }
});

// Mostrar archivos existentes
if (existingFiles.length > 0) {
  console.log('✅ Archivos encontrados:');
  existingFiles.slice(0, 20).forEach(file => {
    console.log(`   ✓ ${file}`);
  });
  if (existingFiles.length > 20) {
    console.log(`   ... y ${existingFiles.length - 20} más`);
  }
  console.log('');
}

// Mostrar archivos faltantes
if (missingFiles.length > 0) {
  console.log('❌ Archivos NO encontrados (pueden causar errores 403):');
  missingFiles.forEach(file => {
    console.log(`   ✗ ${file}`);
  });
  console.log('');
  console.log('💡 Estos archivos necesitan ser:');
  console.log('   1. Agregados al build, o');
  console.log('   2. Las rutas necesitan ser corregidas en el código fuente');
  console.log('');
} else {
  console.log('✅ Todos los archivos referenciados existen en el build!\n');
}

// Verificar estructura de directorios comunes
console.log('📁 Estructura de directorios en el build:\n');

const commonDirs = ['vendor', 'audio', 'assets', 'static', 'images', 'fonts'];
commonDirs.forEach(dir => {
  const dirPath = path.join(BUILD_PATH, dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    console.log(`   ✓ ${dir}/ (${files.length} archivos)`);
  }
});

// Resumen
console.log('\n📊 Resumen:');
console.log(`   Total de archivos referenciados: ${fileReferences.size}`);
console.log(`   Archivos encontrados: ${existingFiles.length}`);
console.log(`   Archivos faltantes: ${missingFiles.length}`);

if (missingFiles.length > 0) {
  console.log('\n⚠️  ACCIÓN REQUERIDA:');
  console.log('   Corrige las rutas en el código fuente o agrega los archivos faltantes.');
} else {
  console.log('\n✨ El build parece estar completo!');
  console.log('   Asegúrate de ejecutar fix-itch-io-paths.js para corregir las rutas.');
}









