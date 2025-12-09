@echo off
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
    xcopy /E /I /Y "%BUILD_PATH%\*" "%CD%"
    echo.
    echo ¡Archivos copiados exitosamente!
    echo Ahora puedes crear el archivo ZIP con todos los archivos de este directorio.
) else (
    echo.
    echo ERROR: La ruta no existe: %BUILD_PATH%
    echo Por favor, verifica la ruta e intenta de nuevo.
)

pause
