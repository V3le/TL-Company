<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../config/database.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->username) && !empty($data->email) && !empty($data->password) &&
   !empty($data->first_name) && !empty($data->last_name) && !empty($data->birth_date) &&
   !empty($data->phone) && !empty($data->city)) {
    
    $user->username = htmlspecialchars(strip_tags($data->username));
    $user->email = htmlspecialchars(strip_tags($data->email));
    $user->password = $data->password;
    $user->first_name = htmlspecialchars(strip_tags($data->first_name));
    $user->last_name = htmlspecialchars(strip_tags($data->last_name));
    $user->middle_name = isset($data->middle_name) ? htmlspecialchars(strip_tags($data->middle_name)) : '';
    $user->birth_date = htmlspecialchars(strip_tags($data->birth_date));
    $user->phone = htmlspecialchars(strip_tags($data->phone));
    $user->city = htmlspecialchars(strip_tags($data->city));
    
    if($user->usernameExists()) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Этот логин уже занят"));
        exit;
    }
    
    if($user->emailExists()) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Этот email уже используется"));
        exit;
    }
    
    if($user->register()) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $user->id;
        $_SESSION['username'] = $user->username;
        
        http_response_code(201);
        echo json_encode(array(
            "success" => true,
            "message" => "Регистрация успешна",
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
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Ошибка регистрации"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Заполните все обязательные поля"));
}
?>
