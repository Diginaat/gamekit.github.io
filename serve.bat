@echo off
rem Serves the GameKit docs at http://localhost:3000 (works from any folder, also by double-click).
cd /d "%~dp0docs"
start "" http://localhost:3000
python -m http.server 3000
