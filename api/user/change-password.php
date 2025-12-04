<?php
require_once '../config/session.php';

header("Access-Control-Allow-Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../config/database.php';

// Проверяем авторизацию
if(!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("message" => "Необходима авторизация"));
    exit();
}

$database = new Database();
$db = $database->getConnection();
$user_id = $_SESSION['user_id'];

$data = json_decode(file_get_contents("php://input"));

if(empty($data->current_password) || empty($data->new_password)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Заполните все поля"));
    exit();
}

try {
    // Получаем текущий пароль пользователя
    $query = "SELECT password FROM users WHERE id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if(!$user) {
        http_response_code(404);
        echo json_encode(array("success" => false, "message" => "Пользователь не найден"));
        exit();
    }
    
    // Проверяем текущий пароль
    if(!password_verify($data->current_password, $user['password'])) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Неверный текущий пароль"));
        exit();
    }
    
    // Обновляем пароль
    $new_password_hash = password_hash($data->new_password, PASSWORD_DEFAULT);
    
    $update_query = "UPDATE users SET password = :password WHERE id = :user_id";
    $update_stmt = $db->prepare($update_query);
    $update_stmt->bindParam(":password", $new_password_hash);
    $update_stmt->bindParam(":user_id", $user_id);
    
    if($update_stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Пароль успешно изменен"));
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Ошибка изменения пароля"));
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Ошибка: " . $e->getMessage()));
}
?>
