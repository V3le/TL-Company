@echo off
cd /d "%~dp0"

REM Добавляем Node.js в PATH ПЕРВЫМ делом
set "PATH=C:\Program Files\nodejs;%PATH%"

chcp 65001 >nul 2>&1
title TL Web - Live Server

echo.
echo ========================================
echo   Запуск сервера с автообновлением
echo ========================================
echo.

REM Проверка Node.js с прямым вызовом
if exist "C:\Program Files\nodejs\node.exe" (
    echo [OK] Node.js найден в: C:\Program Files\nodejs
    "C:\Program Files\nodejs\node.exe" --version
    echo.
) else (
    echo [ОШИБКА] Node.js не найден в: C:\Program Files\nodejs
    echo.
    echo Установите Node.js с https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Проверка npx
if exist "C:\Program Files\nodejs\npx.cmd" (
    echo [OK] npx найден
    echo.
) else (
    echo [ОШИБКА] npx не найден!
    echo.
    pause
    exit /b 1
)

REM Проверка папки public
if not exist "public" (
    echo [ОШИБКА] Папка public не найдена!
    echo Текущая директория: %CD%
    echo.
    pause
    exit /b 1
)

echo [OK] Папка public найдена
echo Переход в папку public...
cd public

echo.
echo ========================================
echo Сервер: http://localhost:8000
echo Автообновление: ВКЛЮЧЕНО
echo Остановка: Ctrl+C
echo ========================================
echo.

REM Запуск сервера через npx
"C:\Program Files\nodejs\npx.cmd" --yes live-server --port=8000 --open=/ --wait=100

echo.
echo ========================================
echo Сервер остановлен
echo ========================================
cd ..
pause
