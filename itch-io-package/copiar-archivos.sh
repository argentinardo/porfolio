#!/bin/bash

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
