@echo off
chcp 65001 >nul
cd /d "%~dp0"

REM Segun nginx: /bihanka_mungarro/ -> /home/bihanka_mungarro/public/
set SSH_USER=bihanka_mungarro
set SSH_HOST=2.25.174.243
set REMOTE_PATH=/home/bihanka_mungarro/public

echo ========================================
echo   SUBIR closet ONLINE - bihanka_mungarro
echo   http://%SSH_HOST%/bihanka_mungarro/
echo ========================================
echo.

if not exist "node_modules\" (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 goto error
)

echo [1/3] Compilando...
call npm run build
if errorlevel 1 goto error

echo [2/3] Subiendo archivos a %REMOTE_PATH% ...
echo.

scp "dist\index.html" %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/
if errorlevel 1 goto scperror

scp "dist\favicon.svg" %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/
if errorlevel 1 goto scperror

scp -r "dist\assets\*" %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/assets/
if errorlevel 1 goto scperror

echo [3/3] Permisos en servidor...
ssh %SSH_USER%@%SSH_HOST% "mkdir -p %REMOTE_PATH%/assets && chmod 755 %REMOTE_PATH% %REMOTE_PATH%/assets && chmod -R 644 %REMOTE_PATH%/assets/* %REMOTE_PATH%/index.html %REMOTE_PATH%/favicon.svg 2>/dev/null; rm -rf %REMOTE_PATH%/bihanka_mungarro 2>/dev/null; true"

echo.
echo ========================================
echo   LISTO!
echo   Abre: http://%SSH_HOST%/bihanka_mungarro/
echo   Si ves blanco: Ctrl+F5
echo ========================================
pause
exit /b 0

:scperror
echo ERROR al subir por SCP.
pause
exit /b 1

:error
echo ERROR en el build.
pause
exit /b 1
