<?php
session_start();

header("Access-Control-Allow-Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../../../api/config/database.php';

// Проверяем авторизацию админа
if(!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(array("message" => "Необходима авторизация администратора"));
    exit();
}

$database = new Database();
$db = $database->getConnection();

// Получаем ID обращения из параметров
$contact_id = isset($_GET['contact_id']) ? intval($_GET['contact_id']) : 0;

if(!$contact_id) {
    http_response_code(400);
    echo json_encode(array("message" => "Не указан ID обращения"));
    exit();
}

try {
    // Проверяем, что обращение существует
    $check_query = "SELECT id FROM contacts WHERE id = :contact_id";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":contact_id", $contact_id);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(array("message" => "Обращение не найдено"));
        exit();
    }
    
    // Получаем сообщения
    $query = "SELECT id, sender_type, message, is_read, created_at 
              FROM contact_messages 
              WHERE contact_id = :contact_id 
              ORDER BY created_at ASC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":contact_id", $contact_id);
    $stmt->execute();
    
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Помечаем сообщения от пользователя как прочитанные
    $update_query = "UPDATE contact_messages 
                     SET is_read = 1 
                     WHERE contact_id = :contact_id 
                     AND sender_type = 'user' 
                     AND is_read = 0";
    $update_stmt = $db->prepare($update_query);
    $update_stmt->bindParam(":contact_id", $contact_id);
    $update_stmt->execute();
    
    http_response_code(200);
    echo json_encode(array("messages" => $messages));
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Ошибка: " . $e->getMessage()));
}
?>
