<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/Testimonial.php';

$database = new Database();
$db = $database->getConnection();

$testimonial = new Testimonial($db);

$testimonial->id = $_POST['id'] ?? 0;
$testimonial->company_name = $_POST['company_name'] ?? '';
$testimonial->author_name = $_POST['author_name'] ?? '';
$testimonial->content = $_POST['content'] ?? '';
$testimonial->is_active = isset($_POST['is_active']) ? 1 : 0;

// Получаем текущие данные
$testimonial->readOne();
$current_image = $testimonial->image_path;

// Загрузка нового фото
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $upload_dir = '../../public/images/testimonials/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $file_name = uniqid() . '.' . $file_extension;
    $upload_path = $upload_dir . $file_name;
    
    if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
        // Удаляем старое фото
        if ($current_image && file_exists('../../' . $current_image)) {
            unlink('../../' . $current_image);
        }
        $testimonial->image_path = 'public/images/testimonials/' . $file_name;
    }
} else {
    $testimonial->image_path = $current_image;
}

if($testimonial->update()) {
    http_response_code(200);
    echo json_encode(array("message" => "Письмо обновлено."));
} else {
    http_response_code(503);
    echo json_encode(array("message" => "Не удалось обновить письмо."));
}
?>
