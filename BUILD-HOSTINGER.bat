@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   BUILD PARA HOSTINGER - closet ONLINE
echo ========================================
echo.
if not exist "node_modules\" (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 goto error
)
echo Compilando proyecto...
call npm run build
if errorlevel 1 goto error
echo.
echo ========================================
echo   LISTO!
echo.
echo   Sube el CONTENIDO de la carpeta "dist"
echo   a public_html en Hostinger:
echo.
echo     - index.html
echo     - 404.html
echo     - .htaccess
echo     - assets\
echo     - favicon.svg
echo.
echo   Ver DEPLOY-HOSTINGER.txt para detalles
echo ========================================
pause
exit /b 0

:error
echo.
echo ERROR en el build. Revisa los mensajes arriba.
pause
exit /b 1
