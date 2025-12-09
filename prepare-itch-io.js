const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración del juego
const GAME_CONFIG = {
  name: 'New H.E.R.O.',
  version: '1.0.0',
  description: 'Recreation of the classic ATARI H.E.R.O. game, developed with TypeScript',
  author: 'Damian Nardini',
  itchUrl: 'https://damiannardini.itch.io/new-hero'
};

console.log('🎮 Preparando paquete para itch.io...\n');

// Crear directorio para el paquete
const packageDir = path.join(__dirname, 'itch-io-package');
if (fs.existsSync(packageDir)) {
  console.log('📦 Limpiando directorio anterior...');
  fs.rmSync(packageDir, { recursive: true, force: true });
}
fs.mkdirSync(packageDir, { recursive: true });

console.log('✅ Directorio creado:', packageDir);

// Crear archivo README para itch.io
const readmeContent = `# ${GAME_CONFIG.name}

${GAME_CONFIG.description}

## 🎮 Cómo jugar

- **Flechas del teclado** o **WASD**: Mover al personaje
- **Espacio**: Usar el jetpack
- **P**: Pausar el juego
- **M**: Silenciar/Activar música

## 🛠️ Tecnologías

- TypeScript
- JavaScript
- HTML5
- CSS3

## 📱 Plataformas

- Web (HTML5)
- Mobile

## 👨‍💻 Desarrollador

${GAME_CONFIG.author}

## 🔗 Enlaces

- [Demo en vivo](${GAME_CONFIG.itchUrl})
- [GitHub](https://github.com/damiannardini/hero)

## 📝 Notas

Este es un remake del clásico juego H.E.R.O. de ATARI, desarrollado con tecnologías web modernas.

¡Disfruta del juego!
`;

fs.writeFileSync(path.join(packageDir, 'README.txt'), readmeContent);
console.log('✅ README.txt creado');

// Crear archivo .itch.toml para configuración de itch.io
const itchTomlContent = `# Configuración para itch.io
# Este archivo ayuda a itch.io a entender cómo mostrar tu juego

[game]
title = "${GAME_CONFIG.name}"
description = "${GAME_CONFIG.description}"
version = "${GAME_CONFIG.version}"
author = "${GAME_CONFIG.author}"

[build]
# itch.io buscará un archivo index.html en la raíz del ZIP
# Asegúrate de que tu build genere un index.html en la raíz
`;

fs.writeFileSync(path.join(packageDir, '.itch.toml'), itchTomlContent);
console.log('✅ .itch.toml creado');

// Crear instrucciones de uso
const instructionsContent = `INSTRUCCIONES PARA SUBIR A ITCH.IO
=====================================

1. CONSTRUIR EL PROYECTO:
   - Ve al directorio del proyecto New H.E.R.O.
   - Ejecuta: npm run build (o el comando de build que uses)
   - Esto generará los archivos estáticos del juego

2. COPIAR ARCHIVOS AL PAQUETE:
   - Copia todos los archivos del directorio 'build' o 'dist' del proyecto
   - Pégarlos en este directorio (itch-io-package)
   - Asegúrate de que haya un index.html en la raíz

3. VERIFICAR ESTRUCTURA:
   - Debe haber un index.html en la raíz
   - Todos los assets (JS, CSS, imágenes) deben estar incluidos
   - Las rutas deben ser relativas (no absolutas)

4. CREAR ARCHIVO ZIP:
   - Selecciona todos los archivos de este directorio
   - Comprímelos en un archivo ZIP
   - Nombre sugerido: new-hero-itch-io.zip

5. SUBIR A ITCH.IO:
   - Ve a tu página de itch.io
   - Crea un nuevo proyecto o edita uno existente
   - En "Uploads", sube el archivo ZIP
   - Selecciona "HTML" como tipo de proyecto
   - Configura la página del juego con:
     * Título: ${GAME_CONFIG.name}
     * Descripción: ${GAME_CONFIG.description}
     * Etiquetas: game, retro, atari, platformer, html5
   - Guarda y publica

6. CONFIGURACIÓN ADICIONAL:
   - Añade capturas de pantalla
   - Configura el precio (gratis o pago)
   - Añade un video de gameplay si tienes
   - Configura las opciones de descarga

NOTAS IMPORTANTES:
- El archivo index.html debe estar en la raíz del ZIP
- Las rutas deben ser relativas (./ o sin / al inicio)
- Prueba el juego localmente antes de subirlo
- Verifica que todos los assets se carguen correctamente

¡Buena suerte con tu publicación!
`;

fs.writeFileSync(path.join(packageDir, 'INSTRUCCIONES.txt'), instructionsContent);
console.log('✅ INSTRUCCIONES.txt creado');

// Crear script de ayuda para copiar archivos
const copyScript = `@echo off
echo ====================================
echo Script de ayuda para preparar itch.io
echo ====================================
echo.
echo Este script te ayudara a copiar los archivos del build
echo.
echo PASOS:
echo 1. Construye tu proyecto: npm run build
echo 2. Indica la ruta del directorio build/dist
echo 3. Los archivos se copiaran automaticamente
echo.
set /p BUILD_PATH="Ruta del directorio build/dist: "

if exist "%BUILD_PATH%" (
    echo.
    echo Copiando archivos...
    xcopy /E /I /Y "%BUILD_PATH%\\*" "%CD%"
    echo.
    echo ¡Archivos copiados exitosamente!
    echo Ahora puedes crear el archivo ZIP con todos los archivos de este directorio.
) else (
    echo.
    echo ERROR: La ruta no existe: %BUILD_PATH%
    echo Por favor, verifica la ruta e intenta de nuevo.
)

pause
`;

fs.writeFileSync(path.join(packageDir, 'copiar-archivos.bat'), copyScript);
console.log('✅ copiar-archivos.bat creado');

// Crear script bash equivalente
const copyScriptBash = `#!/bin/bash

echo "===================================="
echo "Script de ayuda para preparar itch.io"
echo "===================================="
echo ""
echo "Este script te ayudará a copiar los archivos del build"
echo ""
echo "PASOS:"
echo "1. Construye tu proyecto: npm run build"
echo "2. Indica la ruta del directorio build/dist"
echo "3. Los archivos se copiarán automáticamente"
echo ""
read -p "Ruta del directorio build/dist: " BUILD_PATH

if [ -d "$BUILD_PATH" ]; then
    echo ""
    echo "Copiando archivos..."
    cp -r "$BUILD_PATH"/* .
    echo ""
    echo "¡Archivos copiados exitosamente!"
    echo "Ahora puedes crear el archivo ZIP con todos los archivos de este directorio."
else
    echo ""
    echo "ERROR: La ruta no existe: $BUILD_PATH"
    echo "Por favor, verifica la ruta e intenta de nuevo."
fi
`;

fs.writeFileSync(path.join(packageDir, 'copiar-archivos.sh'), copyScriptBash);
// Hacer el script ejecutable en sistemas Unix
try {
  execSync(`chmod +x "${path.join(packageDir, 'copiar-archivos.sh')}"`);
} catch (e) {
  // Ignorar si no es un sistema Unix
}

console.log('✅ copiar-archivos.sh creado');

console.log('\n✨ ¡Paquete preparado exitosamente!');
console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Ve al repositorio del juego New H.E.R.O.');
console.log('2. Ejecuta el build del proyecto (npm run build)');
console.log('3. Copia los archivos del build al directorio: itch-io-package');
console.log('4. Crea un archivo ZIP con todos los archivos del directorio');
console.log('5. Sube el ZIP a itch.io');
console.log('\n📁 Ubicación del paquete:', packageDir);
console.log('\n💡 Lee el archivo INSTRUCCIONES.txt para más detalles.');









