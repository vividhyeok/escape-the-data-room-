@echo off
setlocal
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

echo Starting Escape the Data Room - normal play mode...
echo.
echo Normal play mode does not preload solved code drafts.
echo Open the Vite URL shown below after the server is ready.
echo For a clean playtest run: run_test.bat
echo For a presentation demo run: run_demo.bat
echo.
call npm run dev
