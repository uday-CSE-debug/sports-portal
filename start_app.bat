@echo off
echo Starting Sports Portal...
echo.
echo ===================================================
echo NOTE: If you see errors about "running scripts is disabled",
echo this script bypasses them by using CMD instead of PowerShell.
echo ===================================================
echo.

echo Starting Backend on Port 5000...
start "Sports Portal Backend" /D "backend" cmd /c "npm.cmd run dev"

echo Starting Frontend...
start "Sports Portal Frontend" /D "frontend" cmd /c "npm.cmd run dev"

echo.
echo ---------------------------------------------------
echo App is starting! 
echo Once likely started, open http://localhost:5173
echo ---------------------------------------------------
pause
