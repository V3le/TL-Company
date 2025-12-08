<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include_once '../config/database.php';
include_once '../models/User.php';

if(isset($_SESSION['user_id'])) {
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);
    
    $user->id = $_SESSION['user_id'];
    
    if($user->getUserById()) {
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "user" => array(
                "id" => $user->id,
                "username" => $user->username,
                "email" => $user->email,
                "first_name" => $user->first_name,
                "last_name" => $user->last_name,
                "middle_name" => $user->middle_name,
                "phone" => $user->phone,
                "city" => $user->city,
                "birth_date" => $user->birth_date
            )
        ));
    } else {
        session_destroy();
        http_response_code(401);
        echo json_encode(array("success" => false, "message" => "Сессия истекла"));
    }
} else {
    http_response_code(401);
    echo json_encode(array("success" => false, "message" => "Не авторизован"));
}
?>
