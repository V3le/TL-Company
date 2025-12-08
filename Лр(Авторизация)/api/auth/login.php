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

if(!empty($data->login) && !empty($data->password)) {
    
    $user->username = htmlspecialchars(strip_tags($data->login));
    $user->password = $data->password;
    
    if($user->login()) {
        $remember_me = isset($data->remember_me) && $data->remember_me === true;
        
        if ($remember_me) {
            $lifetime = 30 * 24 * 60 * 60;
        } else {
            $lifetime = 0;
        }
        
        ini_set('session.gc_maxlifetime', $lifetime > 0 ? $lifetime : 86400);
        session_set_cookie_params([
            'lifetime' => $lifetime,
            'path' => '/',
            'domain' => '',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $user->id;
        $_SESSION['username'] = $user->username;
        
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "message" => "Вход выполнен успешно",
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
        http_response_code(401);
        echo json_encode(array("success" => false, "message" => "Неверный логин или пароль"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Заполните все поля"));
}
?>
