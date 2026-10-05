@echo off
setlocal
cd /d "%~dp0"
title Memoriam
echo.
echo  ===== MEMORIAM =====
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Get the LTS version from https://nodejs.org then run this again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo First run: installing... this takes a minute or two.
  call npm install
  if errorlevel 1 ( echo Install failed. & pause & exit /b 1 )
)

echo Building the site...
call npm run build
if errorlevel 1 ( echo Build failed. & pause & exit /b 1 )

echo.
echo  On THIS computer open:   http://localhost:3000
echo  On phones (same Wi-Fi / your hotspot) open ONE of these:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do echo      http://%%a:3000
echo  (ignore the spaces before each address)
echo.
echo  Leave this window open. Press Ctrl+C to stop.
echo.
start "" http://localhost:3000
call npx next start -H 0.0.0.0 -p 3000
pause
