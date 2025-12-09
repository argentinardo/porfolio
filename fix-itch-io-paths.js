const fs = require('fs');
const path = require('path');

// Configuración
const BUILD_PATH = process.argv[2] || path.join(__dirname, '../hero/build');

console.log('🔧 Corrigiendo rutas para itch.io...\n');

// Verificar que existe el directorio de build
if (!fs.existsSync(BUILD_PATH)) {
  console.error('❌ ERROR: No se encontró el directorio de build.');
  console.error(`   Ruta buscada: ${BUILD_PATH}`);
  console.error('\n💡 Ejecuta: npm run build en el proyecto New H.E.R.O.');
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

// Función para corregir rutas en un archivo
function fixPathsInFile(filePath, relativePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Patrones de rutas absolutas que necesitan ser corregidas
    const patterns = [
      // Rutas absolutas en atributos HTML (href, src, action, etc.)
      { 
        regex: /(href|src|action|data-src|data-href|data-url|data-background)=["']\/([^"']+)["']/gi,
        replacement: (match, attr, path) => {
          modified = true;
          // Evitar corregir URLs completas
          if (path.startsWith('http') || path.startsWith('//')) {
            return match;
          }
          return `${attr}="./${path}"`;
        }
      },
      // Rutas absolutas en JavaScript (fetch, import, require, etc.)
      {
        regex: /(fetch|import|require|load|src)\s*\(\s*["']\/([^"']+)["']\s*\)/gi,
        replacement: (match, func, path) => {
          modified = true;
          if (path.startsWith('http') || path.startsWith('//')) {
            return match;
          }
          return `${func}("./${path}")`;
        }
      },
      // Rutas en strings de JavaScript (más general)
      {
        regex: /(["'])\/([a-zA-Z0-9_\-./]+\.(js|css|json|png|jpg|jpeg|gif|svg|mp3|wav|ogg|ttf|woff|woff2|eot))["']/g,
        replacement: (match, quote, path) => {
          modified = true;
          return `${quote}./${path}${quote}`;
        }
      },
      // Rutas en CSS (@import, url())
      {
        regex: /url\s*\(\s*["']?\/([^"')]+)["']?\s*\)/gi,
        replacement: (match, path) => {
          modified = true;
          if (path.startsWith('http') || path.startsWith('//')) {
            return match;
          }
          return `url("./${path}")`;
        }
      },
      {
        regex: /@import\s+["']\/([^"']+)["']/gi,
        replacement: (match, path) => {
          modified = true;
          if (path.startsWith('http') || path.startsWith('//')) {
            return match;
          }
          return `@import "./${path}"`;
        }
      },
      // Base tag
      {
        regex: /<base\s+href=["']\/["']/gi,
        replacement: () => {
          modified = true;
          return '<base href="./">';
        }
      },
      // Rutas en JSON (menos común pero posible)
      {
        regex: /"\/\/([^"]+)"/g,
        replacement: (match, path) => {
          // Solo si parece una ruta de archivo, no una URL
          if (!path.startsWith('http') && path.includes('.')) {
            modified = true;
            return `"./${path}"`;
          }
          return match;
        }
      }
    ];

    // Aplicar todas las correcciones
    patterns.forEach(({ regex, replacement }) => {
      if (typeof replacement === 'function') {
        content = content.replace(regex, replacement);
      } else {
        content = content.replace(regex, replacement);
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`   ⚠️  Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función recursiva para procesar todos los archivos
function processDirectory(dir, relativePath = '') {
  const files = fs.readdirSync(dir);
  let totalFixed = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Ignorar node_modules y otros directorios innecesarios
      if (file !== 'node_modules' && file !== '.git') {
        totalFixed += processDirectory(filePath, path.join(relativePath, file));
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      // Procesar solo archivos HTML, JS, CSS, JSON
      if (['.html', '.js', '.css', '.json'].includes(ext)) {
        const fixed = fixPathsInFile(filePath, relativePath);
        if (fixed) {
          console.log(`   ✅ Corregido: ${path.join(relativePath, file)}`);
          totalFixed++;
        }
      }
    }
  });

  return totalFixed;
}

console.log('📝 Procesando archivos...\n');

// Procesar index.html primero
console.log('🔍 Procesando index.html...');
const indexFixed = fixPathsInFile(indexPath, '');
if (indexFixed) {
  console.log('   ✅ index.html corregido\n');
} else {
  console.log('   ℹ️  index.html no necesitaba correcciones\n');
}

// Procesar todos los archivos en el directorio build
console.log('🔍 Procesando archivos en el directorio build...');
const totalFixed = processDirectory(BUILD_PATH);

console.log(`\n✨ Proceso completado!`);
console.log(`📊 Total de archivos corregidos: ${totalFixed + (indexFixed ? 1 : 0)}`);

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Verifica que el juego funcione localmente con un servidor HTTP');
console.log('2. Crea el archivo ZIP con todos los archivos del build');
console.log('3. Sube el ZIP a itch.io');
console.log('\n💡 Nota: Si algunos archivos aún tienen problemas,');
console.log('   puede ser necesario corregirlos manualmente en el código fuente.');

