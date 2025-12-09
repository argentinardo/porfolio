@echo off
echo ====================================
echo Servidor local para New H.E.R.O.
echo ====================================
echo.

set /p BUILD_PATH="Ruta del directorio build (o presiona Enter para usar la ruta por defecto): "

if "%BUILD_PATH%"=="" (
    set BUILD_PATH=..\hero\build
)

echo.
echo Verificando directorio: %BUILD_PATH%

if not exist "%BUILD_PATH%\index.html" (
    echo.
    echo ERROR: No se encontro index.html en: %BUILD_PATH%
    echo.
    echo Por favor:
    echo 1. Construye el proyecto: npm run build
    echo 2. Verifica la ruta del build
    echo.
    pause
    exit /b 1
)

echo.
echo Iniciando servidor...
echo.
echo El juego se abrira en: http://localhost:3000
echo Presiona Ctrl+C para detener el servidor
echo.

node serve-game.js "%BUILD_PATH%"

pause









