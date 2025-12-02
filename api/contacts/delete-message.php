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

if(empty($data->message_id)) {
    http_response_code(400);
    echo json_encode(array("message" => "Не указан ID сообщения"));
    exit();
}

$message_id = intval($data->message_id);

try {
    // Проверяем, что сообщение принадлежит пользователю
    $check_query = "SELECT cm.id, c.user_id 
                    FROM contact_messages cm
                    JOIN contacts c ON cm.contact_id = c.id
                    WHERE cm.id = :message_id 
                    AND cm.sender_type = 'user'
                    AND c.user_id = :user_id";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":message_id", $message_id);
    $check_stmt->bindParam(":user_id", $user_id);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(array("message" => "Доступ запрещен"));
        exit();
    }
    
    // Удаляем сообщение
    $query = "DELETE FROM contact_messages WHERE id = :message_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":message_id", $message_id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "message" => "Сообщение удалено"
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Ошибка удаления"));
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Ошибка: " . $e->getMessage()));
}
?>
