@echo off
setlocal
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

echo Starting Escape the Data Room - playtest mode...
echo.
echo This mode is for actual play testing.
echo It starts from a fresh state and Python Lab opens empty unless the player writes code.
echo.
call npm run dev -- --port 5173 --open "/?mode=test"
