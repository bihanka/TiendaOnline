@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   INSTALANDO closet ONLINE
echo ========================================
echo.
call npm install
if errorlevel 1 (
  echo.
  echo ERROR: No se pudo instalar. Instala Node.js desde https://nodejs.org
  pause
  exit /b 1
)
echo.
echo LISTO! Ahora haz doble clic en INICIAR.bat
echo.
pause
