<?php
require_once '../config/session.php';
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: ../auth/login.php');
    exit;
}

include_once '../../../api/config/database.php';
include_once '../../../api/models/Testimonial.php';

$id = $_GET['id'] ?? 0;

if ($id > 0) {
    $database = new Database();
    $db = $database->getConnection();
    $testimonial = new Testimonial($db);
    
    // Получаем путь к изображению перед удалением
    $query = "SELECT image_path FROM testimonials WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Удаляем запись
    $query = "DELETE FROM testimonials WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        // Удаляем файл изображения если он существует
        if ($row && $row['image_path'] && file_exists('../../../' . $row['image_path'])) {
            unlink('../../../' . $row['image_path']);
        }
    }
}

header('Location: ../pages/testimonials.php');
exit;
?>

