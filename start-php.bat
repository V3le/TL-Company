@echo off
cd /d "%~dp0"

chcp 65001 >nul 2>&1
title TL Web - PHP Server

echo.
echo ========================================
echo   Запуск PHP сервера
echo ========================================
echo.

REM Проверка XAMPP PHP
if exist "C:\xampp\php\php.exe" (
    echo [OK] PHP найден в XAMPP: C:\xampp\php
    set "PHP_PATH=C:\xampp\php"
    set "PATH=%PHP_PATH%;%PATH%"
    "C:\xampp\php\php.exe" --version
    echo.
    goto :start_server
)

REM Проверка PHP в PATH
where php >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] PHP найден в PATH
    php --version
    echo.
    goto :start_server
)

REM PHP не найден
echo [ОШИБКА] PHP не найден!
echo.
echo Проверьте установку XAMPP в C:\xampp
echo Или установите PHP и добавьте в PATH
echo.
pause
exit /b 1

:start_server

REM Проверка папки public
if not exist "public" (
    echo [ОШИБКА] Папка public не найдена!
    echo Текущая директория: %CD%
    echo.
    pause
    exit /b 1
)

echo [OK] Папка public найдена
echo.
echo ========================================
echo Сервер запущен на: http://localhost:8000
echo Главная страница: http://localhost:8000/public/
echo Админ-панель: http://localhost:8000/public/admin/login.php
echo API: http://localhost:8000/api/testimonials/read.php
echo Остановка: Ctrl+C
echo ========================================
echo.

REM Запуск PHP сервера из корня проекта (чтобы работали и public и api)
if defined PHP_PATH (
    "%PHP_PATH%\php.exe" -S localhost:8000 -t .
) else (
    php -S localhost:8000 -t .
)

echo.
echo ========================================
echo Сервер остановлен
echo ========================================
pause
