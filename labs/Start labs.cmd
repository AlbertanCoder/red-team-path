@echo off
rem Starts Microsoft's AI Red Teaming labs on this PC and opens the labs page in Chrome.
rem It starts the labs page plus the lab you pick. Each lab is its own small program (about 50 MB when idle).
rem Type A to start all twelve at once if the computer has memory to spare.
setlocal
title Start Microsoft's AI red teaming labs
cd /d "%USERPROFILE%\ms-airt-labs"
set "DOCKER=%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe"
if not exist "%DOCKER%" set "DOCKER=docker"

findstr /C:"PASTE_YOUR_KEY_HERE" .env >nul
if not errorlevel 1 (
  echo.
  echo  Your OpenAI key is not in the settings file yet.
  echo  1. Open this file in Notepad:  %USERPROFILE%\ms-airt-labs\.env
  echo  2. Replace PASTE_YOUR_KEY_HERE with your key. No spaces, no quotes.
  echo  3. Save, then run "Start labs" again.
  echo.
  pause
  exit /b 1
)

"%DOCKER%" info >nul 2>&1
if errorlevel 1 (
  echo.
  echo  Docker Desktop is not running.
  echo  Open Docker Desktop from the Start menu, wait until it says "Engine running", then run "Start labs" again.
  echo.
  pause
  exit /b 1
)

echo.
set "LAB="
set /p "LAB= Which lab do you want to do? Type a number from 1 to 12 (or A for all twelve) and press Enter: "
set "WHAT="
if /I "%LAB%"=="A" goto :start
for %%n in (1 2 3 4 5 6 7 8 9 10 11 12) do if "%LAB%"=="%%n" set "WHAT=challenge-home chat-copilot-%%n"
if not defined WHAT (
  echo  That is not a number from 1 to 12, or the letter A. Run "Start labs" again.
  pause
  exit /b 1
)

:start
echo.
echo  Stopping any lab that is still running, then starting. This takes about half a minute...
"%DOCKER%" compose -f docker-compose-openai.yaml down >nul 2>&1
"%DOCKER%" compose -f docker-compose-openai.yaml up -d --no-build %WHAT%
if errorlevel 1 (
  echo.
  echo  The labs did not start. Copy the lines above and show them to whoever helps you with this.
  pause
  exit /b 1
)

for /f "tokens=1,* delims==" %%a in ('findstr /B "AUTH_KEY=" .env') do set "AUTH=%%b"
timeout /t 12 /nobreak >nul
start "" "http://localhost:5000/login?auth=%AUTH%"
echo.
echo  The labs page is opening in your browser. Press Launch next to the lab you want.
echo  A lab says "Loading your challenge" for a few seconds while it starts.
echo  If it never gets past that, your OpenAI key is missing, wrong or out of credit.
echo  Labs you did not start will not open until you start them with this same shortcut.
echo  When you are finished, run "Stop labs" to give the memory back.
echo.
pause
