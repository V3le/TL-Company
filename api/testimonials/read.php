<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/Testimonial.php';

$database = new Database();
$db = $database->getConnection();

$testimonial = new Testimonial($db);
$stmt = $testimonial->read();
$num = $stmt->rowCount();

if($num > 0) {
    $testimonials_arr = array();
    $testimonials_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $testimonial_item = array(
            "id" => $id,
            "company_name" => $company_name,
            "author_name" => $author_name,
            "content" => html_entity_decode($content),
            "image_path" => $image_path,
            "created_at" => $created_at
        );
        array_push($testimonials_arr["records"], $testimonial_item);
    }

    http_response_code(200);
    echo json_encode($testimonials_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Благодарственные письма не найдены."));
}
?>
