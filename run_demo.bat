@echo off
setlocal
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

echo Starting Escape the Data Room - demo mode...
echo.
echo This mode is for presentation rehearsal.
echo It opens Room 1 with Word Billboard and the Python tool prepared for demonstration.
echo.
call npm run dev -- --port 5173 --open "/?mode=demo"
