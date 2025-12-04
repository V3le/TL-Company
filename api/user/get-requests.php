<?php
require_once '../config/session.php';

// Разрешаем отправку cookies
header("Access-Control-Allow-Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

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

try {
    // Получаем заявки на перевозку
    $query_orders = "SELECT id, name, phone, cargo_description, city_from, city_to, status, created_at, updated_at 
                     FROM orders 
                     WHERE user_id = :user_id 
                     ORDER BY created_at DESC";
    $stmt_orders = $db->prepare($query_orders);
    $stmt_orders->bindParam(":user_id", $user_id);
    $stmt_orders->execute();
    $orders = $stmt_orders->fetchAll(PDO::FETCH_ASSOC);
    
    // Получаем обращения
    $query_contacts = "SELECT id, name, phone, email, message, status, created_at, updated_at 
                       FROM contacts 
                       WHERE user_id = :user_id 
                       ORDER BY created_at DESC";
    $stmt_contacts = $db->prepare($query_contacts);
    $stmt_contacts->bindParam(":user_id", $user_id);
    $stmt_contacts->execute();
    $contacts = $stmt_contacts->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "orders" => $orders,
        "contacts" => $contacts
    ));
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Ошибка получения данных: " . $e->getMessage()));
}
?>
