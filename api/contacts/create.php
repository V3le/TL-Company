<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->phone) && !empty($data->message)) {
    $query = "INSERT INTO contacts (name, phone, email, message) VALUES (:name, :phone, :email, :message)";
    $stmt = $db->prepare($query);
    
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
