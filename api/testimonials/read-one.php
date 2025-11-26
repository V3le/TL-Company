<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/Testimonial.php';

$database = new Database();
$db = $database->getConnection();

$testimonial = new Testimonial($db);
$testimonial->id = $_GET['id'] ?? 0;
$testimonial->readOne();

if($testimonial->company_name) {
    $testimonial_arr = array(
        "id" => $testimonial->id,
        "company_name" => $testimonial->company_name,
        "author_name" => $testimonial->author_name,
        "content" => html_entity_decode($testimonial->content),
        "image_path" => $testimonial->image_path,
        "is_active" => $testimonial->is_active,
        "created_at" => $testimonial->created_at
    );
    
    http_response_code(200);
    echo json_encode($testimonial_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Письмо не найдено."));
}
?>
