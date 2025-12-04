<?php
// Общая настройка сессии для админской панели
// Этот файл должен быть подключен перед любым использованием сессии

// Настройка параметров сессии (30 дней)
$lifetime = 30 * 24 * 60 * 60; // 30 дней в секундах

ini_set('session.gc_maxlifetime', $lifetime);
session_set_cookie_params([
    'lifetime' => $lifetime,
    'path' => '/',
    'domain' => '',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);

// Запускаем сессию
session_start();
?>
