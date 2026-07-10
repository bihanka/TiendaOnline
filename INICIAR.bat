@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist "node_modules\" (
  echo Primero ejecuta INSTALAR.bat
  pause
  exit /b 1
)
echo ========================================
echo   Iniciando tienda closet ONLINE
echo   Abre: http://localhost:5173
echo   Para cerrar: Ctrl+C
echo ========================================
echo.
start http://localhost:5173
call npm run dev
pause
