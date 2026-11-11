@echo off
setlocal EnableExtensions

rem Always run the builder in a persistent CMD window.
rem This prevents the console from disappearing when npm reports an error.
if /I not "%~1"=="--persistent" (
  start "KashKool v70 Builder" "%ComSpec%" /k ""%~f0" --persistent"
  exit /b 0
)

chcp 65001 >nul
cd /d "%~dp0"
if errorlevel 1 (
  echo [ERROR] Could not open the project folder.
  echo Current folder: %CD%
  pause
  exit /b 1
)

echo ==========================================
echo       KashKool v70 - Windows Builder
echo ==========================================
echo.
echo This window will stay open after the build.
echo A full log will be saved as BUILD_LAST_LOG.txt.
echo.

where powershell.exe >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Windows PowerShell was not found.
  echo This builder requires the Windows PowerShell included with Windows 10/11.
  pause
  exit /b 1
)

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build-windows.ps1"
set "BUILD_EXIT=%ERRORLEVEL%"

echo.
if "%BUILD_EXIT%"=="0" (
  echo ==========================================
  echo BUILD COMPLETED SUCCESSFULLY
  echo Check the dist folder for the Setup and Portable EXE files.
  echo ==========================================
  if exist "%~dp0dist" explorer "%~dp0dist"
) else (
  echo ==========================================
  echo BUILD DID NOT COMPLETE
  echo Do not close this window yet.
  echo Send BUILD_LAST_LOG.txt for diagnosis.
  echo ==========================================
)
echo.
echo Log file: "%~dp0BUILD_LAST_LOG.txt"
echo.
pause
exit /b %BUILD_EXIT%
