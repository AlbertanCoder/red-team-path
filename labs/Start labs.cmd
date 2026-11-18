@echo off
rem Starts Microsoft's AI Red Teaming labs on this PC and opens the labs page in Chrome.
rem Press Enter and all twelve labs start together (about 80 MB each), so you can move between labs on the labs page.
rem It never stops a lab that is already running. Run "Stop labs" when you are finished for the day.
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
echo  All twelve labs start together, so you can move between them on the labs page.
set /p "LAB= Press Enter to start them. (To start only one lab and use less memory, type its number first.) "
set "WHAT="
if "%LAB%"=="" goto :start
if /I "%LAB%"=="A" goto :start
for %%n in (1 2 3 4 5 6 7 8 9 10 11 12) do if "%LAB%"=="%%n" set "WHAT=challenge-home chat-copilot-%%n"
if not defined WHAT (
  echo  That is not a number from 1 to 12. Run "Start labs" again and just press Enter to start them all.
  pause
  exit /b 1
)

:start
echo.
echo  Starting. Labs that are already running are left alone. This takes about half a minute...
"%DOCKER%" compose -f docker-compose-openai.yaml up -d --no-build %WHAT%
if errorlevel 1 (
  echo.
  echo  The labs did not start. Copy the lines above and show them to whoever helps you with this.
  pause
  exit /b 1
)

for /f "tokens=1,* delims==" %%a in ('findstr /B "AUTH_KEY=" .env') do set "AUTH=%%b"
timeout /t 20 /nobreak >nul
rem Open the labs page in Chrome when Chrome is installed, otherwise in the default browser.
set "PAGE=http://localhost:5000/login?auth=%AUTH%"
reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" >nul 2>&1 && goto :chrome
reg query "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" >nul 2>&1 && goto :chrome
start "" "%PAGE%"
goto :opened
:chrome
start "" chrome "%PAGE%"
:opened
echo.
echo  The labs page is opening in your browser. Press Launch next to the lab you want.
echo  To change lab, go back to the labs page and press Launch on another one. You do not need this window again.
echo  A lab says "Loading your challenge" for a few seconds while it starts.
echo  If it never gets past that, your OpenAI key is missing, wrong or out of credit.
echo  When you are finished for the day, run "Stop labs" to give the memory back.
echo.
pause
