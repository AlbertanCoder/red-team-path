@echo off
rem Stops Microsoft's AI Red Teaming labs and hands their memory back.
setlocal
title Stop Microsoft's AI red teaming labs
cd /d "%USERPROFILE%\ms-airt-labs"
set "DOCKER=%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe"

"%DOCKER%" info >nul 2>&1
if errorlevel 1 (
  echo.
  echo  Docker Desktop is not running, so no lab is running either. Nothing to stop.
  echo.
  pause
  exit /b 0
)

echo.
echo  Stopping the labs deletes every lab chat.
echo  If you won a lab and have not downloaded its chat yet, close this window,
echo  download the chat in the lab, then run this again. The app needs that file as proof.
echo.
pause
echo.
echo  Stopping the labs...
"%DOCKER%" compose -f docker-compose-openai.yaml down
echo.
echo  The labs are stopped, and their chats are gone.
echo  To free the most memory, also quit Docker Desktop: right-click the whale icon near the clock and choose Quit.
echo.
pause
