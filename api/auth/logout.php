<?php
// Разрешаем отправку cookies
header("Access-Control-Allow-Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

session_start();

// Удаляем cookie сессии
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Очищаем все данные сессии
$_SESSION = array();

// Уничтожаем сессию
session_destroy();

http_response_code(200);
echo json_encode(array("success" => true, "message" => "Выход выполнен успешно"));
?>
