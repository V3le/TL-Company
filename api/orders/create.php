<?php
require_once '../config/session.php';

// Разрешаем отправку cookies
header("Access-Control-Allow-Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->phone) && !empty($data->cargo_description) && !empty($data->city_from) && !empty($data->city_to)) {
    // Проверяем авторизацию пользователя
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    $query = "INSERT INTO orders (user_id, name, phone, cargo_description, city_from, city_to) VALUES (:user_id, :name, :phone, :cargo_description, :city_from, :city_to)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":user_id", $user_id);
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":phone", $data->phone);
    $stmt->bindParam(":cargo_description", $data->cargo_description);
    $stmt->bindParam(":city_from", $data->city_from);
    $stmt->bindParam(":city_to", $data->city_to);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Заявка отправлена успешно."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Не удалось отправить заявку."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Заполните все обязательные поля."));
}
?>
