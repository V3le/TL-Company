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

if(empty($data->contact_id) || empty($data->message)) {
    http_response_code(400);
    echo json_encode(array("message" => "Заполните все поля"));
    exit();
}

$contact_id = intval($data->contact_id);

try {
    // Проверяем, что обращение принадлежит пользователю и не закрыто
    $check_query = "SELECT id, status FROM contacts WHERE id = :contact_id AND user_id = :user_id";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":contact_id", $contact_id);
    $check_stmt->bindParam(":user_id", $user_id);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(array("success" => false, "message" => "Доступ запрещен"));
        exit();
    }
    
    $contact = $check_stmt->fetch(PDO::FETCH_ASSOC);
    
    // Проверяем, не закрыто ли обращение
    if($contact['status'] === 'closed') {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Обращение закрыто. Отправка сообщений невозможна."));
        exit();
    }
    
    // Добавляем сообщение
    $query = "INSERT INTO contact_messages (contact_id, sender_type, sender_id, message) 
              VALUES (:contact_id, 'user', :user_id, :message)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":contact_id", $contact_id);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->bindParam(":message", $data->message);
    
    if($stmt->execute()) {
        // Обновляем статус обращения на "в работе" если было "новое"
        $update_query = "UPDATE contacts SET status = 'in_progress' WHERE id = :contact_id AND status = 'new'";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(":contact_id", $contact_id);
        $update_stmt->execute();
        
        http_response_code(201);
        echo json_encode(array(
            "success" => true,
            "message" => "Сообщение отправлено",
            "id" => $db->lastInsertId()
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Ошибка отправки"));
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Ошибка: " . $e->getMessage()));
}
?>
