<?php
// Разрешаем отправку cookies
header("Access-Control-Allow-Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->username) && !empty($data->email) && !empty($data->password)) {
    
    $user->username = htmlspecialchars(strip_tags($data->username));
    $user->email = htmlspecialchars(strip_tags($data->email));
    
    // Проверка существования username
    if($user->usernameExists()) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Этот логин уже занят"));
        exit();
    }
    
    // Проверка существования email
    if($user->emailExists()) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Этот email уже используется"));
        exit();
    }
    
    $user->password = $data->password;
    $user->first_name = isset($data->first_name) ? htmlspecialchars(strip_tags($data->first_name)) : null;
    $user->last_name = isset($data->last_name) ? htmlspecialchars(strip_tags($data->last_name)) : null;
    $user->middle_name = isset($data->middle_name) ? htmlspecialchars(strip_tags($data->middle_name)) : null;
    $user->birth_date = isset($data->birth_date) ? $data->birth_date : null;
    $user->phone = isset($data->phone) ? htmlspecialchars(strip_tags($data->phone)) : null;
    $user->city = isset($data->city) ? htmlspecialchars(strip_tags($data->city)) : null;
    
    if($user->register()) {
        // Устанавливаем длительную сессию по умолчанию при регистрации (30 дней)
        $lifetime = 30 * 24 * 60 * 60;
        ini_set('session.gc_maxlifetime', $lifetime);
        session_set_cookie_params($lifetime);
        
        session_start();
        $_SESSION['user_id'] = $user->id;
        $_SESSION['username'] = $user->username;
        
        // Обновляем время жизни cookie после старта сессии
        setcookie(session_name(), session_id(), time() + $lifetime, '/');
        
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
