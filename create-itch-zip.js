const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const BUILD_PATH = process.argv[2] || path.join(__dirname, '../hero/build');
const OUTPUT_ZIP = path.join(__dirname, 'new-hero-itch-io.zip');
const PACKAGE_DIR = path.join(__dirname, 'itch-io-package');

console.log('🎮 Preparando archivo ZIP para itch.io...\n');

// Verificar si existe el directorio de build
if (!fs.existsSync(BUILD_PATH)) {
  console.error('❌ ERROR: No se encontró el directorio de build.');
  console.error(`   Ruta buscada: ${BUILD_PATH}`);
  console.error('\n💡 Opciones:');
  console.error('   1. Ejecuta: npm run build en el proyecto New H.E.R.O.');
  console.error('   2. O especifica la ruta: node create-itch-zip.js "ruta/al/build"');
  process.exit(1);
}

// Verificar que existe index.html
const indexPath = path.join(BUILD_PATH, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ ERROR: No se encontró index.html en el directorio de build.');
  console.error(`   Ruta buscada: ${indexPath}`);
  console.error('\n💡 Asegúrate de que el build se haya completado correctamente.');
  process.exit(1);
}

console.log('✅ Directorio de build encontrado:', BUILD_PATH);
console.log('✅ index.html encontrado\n');

// Intentar crear ZIP usando comandos del sistema
const isWindows = process.platform === 'win32';
let zipCommand = '';

if (isWindows) {
  // Windows: usar PowerShell Compress-Archive
  console.log('📦 Creando ZIP con PowerShell...');
  const buildDir = BUILD_PATH.replace(/\\/g, '/');
  const outputDir = path.dirname(OUTPUT_ZIP).replace(/\\/g, '/');
  const zipName = path.basename(OUTPUT_ZIP);
  
  try {
    execSync(
      `powershell -Command "Compress-Archive -Path '${buildDir}\\*' -DestinationPath '${outputDir}\\${zipName}' -Force"`,
      { stdio: 'inherit' }
    );
    console.log('\n✨ ¡Archivo ZIP creado exitosamente!');
    console.log(`📁 Ubicación: ${OUTPUT_ZIP}`);
    console.log('\n📤 Ahora puedes subir este archivo a itch.io');
    console.log('   Ve a tu proyecto en itch.io y sube: new-hero-itch-io.zip');
  } catch (error) {
    console.error('❌ Error al crear ZIP con PowerShell.');
    console.log('\n💡 INSTRUCCIONES MANUALES:');
    console.log('   1. Abre el explorador de archivos');
    console.log(`   2. Ve a: ${BUILD_PATH}`);
    console.log('   3. Selecciona todos los archivos (Ctrl+A)');
    console.log('   4. Clic derecho > Enviar a > Carpeta comprimida (ZIP)');
    console.log(`   5. Renombra el archivo a: new-hero-itch-io.zip`);
    console.log(`   6. Muévelo a: ${path.dirname(OUTPUT_ZIP)}`);
  }
} else {
  // Linux/Mac: usar zip command
  console.log('📦 Creando ZIP...');
  try {
    const buildDir = path.basename(BUILD_PATH);
    const parentDir = path.dirname(BUILD_PATH);
    process.chdir(parentDir);
    execSync(`zip -r "${OUTPUT_ZIP}" "${buildDir}"/*`, { stdio: 'inherit' });
    console.log('\n✨ ¡Archivo ZIP creado exitosamente!');
    console.log(`📁 Ubicación: ${OUTPUT_ZIP}`);
    console.log('\n📤 Ahora puedes subir este archivo a itch.io');
    console.log('   Ve a tu proyecto en itch.io y sube: new-hero-itch-io.zip');
  } catch (error) {
    console.error('❌ Error al crear ZIP.');
    console.log('\n💡 INSTRUCCIONES MANUALES:');
    console.log(`   1. Ve a: ${BUILD_PATH}`);
    console.log('   2. Selecciona todos los archivos');
    console.log('   3. Crea un archivo ZIP');
    console.log(`   4. Nombre: new-hero-itch-io.zip`);
  }
}

