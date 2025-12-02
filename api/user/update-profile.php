<?php
session_start();

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

try {
    $query = "UPDATE users SET 
              first_name = :first_name,
              last_name = :last_name,
              middle_name = :middle_name,
              birth_date = :birth_date,
              phone = :phone,
              city = :city,
              email = :email
              WHERE id = :user_id";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":first_name", $data->first_name);
    $stmt->bindParam(":last_name", $data->last_name);
    $stmt->bindParam(":middle_name", $data->middle_name);
    $stmt->bindParam(":birth_date", $data->birth_date);
    $stmt->bindParam(":phone", $data->phone);
    $stmt->bindParam(":city", $data->city);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":user_id", $user_id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Профиль обновлен"));
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Ошибка обновления профиля"));
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Ошибка: " . $e->getMessage()));
}
?>
