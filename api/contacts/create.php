<?php
session_start();

// Разрешаем отправку cookies
header("Access-Control-Allow-Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->phone) && !empty($data->message)) {
    // Проверяем авторизацию пользователя
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    $query = "INSERT INTO contacts (user_id, name, phone, email, message) VALUES (:user_id, :name, :phone, :email, :message)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":user_id", $user_id);
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":phone", $data->phone);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":message", $data->message);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Обращение отправлено успешно."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Не удалось отправить обращение."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Заполните все обязательные поля."));
}
?>
