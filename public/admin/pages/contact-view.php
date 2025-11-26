<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: ../auth/login.php');
    exit;
}

include_once '../../../api/config/database.php';

$database = new Database();
$db = $database->getConnection();

$id = $_GET['id'] ?? 0;

// Обновление статуса
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['status'])) {
    $new_status = $_POST['status'];
    $query = "UPDATE contacts SET status = :status WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $new_status);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    header('Location: contact-view.php?id=' . $id . '&updated=1');
    exit;
}

// Получаем обращение
$query = "SELECT * FROM contacts WHERE id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $id);
$stmt->execute();
$contact = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$contact) {
    header('Location: contacts.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Обращение #<?php echo $id; ?> - Админ-панель</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include '../includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include '../includes/header.php'; ?>
            
            <div class="admin-content">
                <div class="content-header">
                    <h1 class="page-title">Обращение #<?php echo $id; ?></h1>
                    <a href="contacts.php" class="btn btn-secondary">← Назад</a>
                </div>
                
                <?php if (isset($_GET['updated'])): ?>
                    <div class="alert alert-success">Статус обновлен!</div>
                <?php endif; ?>
                
                <div class="contact-detail">
                    <div class="detail-card">
                        <h3>Информация о клиенте</h3>
                        <div class="detail-row">
                            <span class="detail-label">Имя:</span>
                            <span class="detail-value"><?php echo htmlspecialchars($contact['name']); ?></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Телефон:</span>
                            <span class="detail-value"><a href="tel:<?php echo htmlspecialchars($contact['phone']); ?>"><?php echo htmlspecialchars($contact['phone']); ?></a></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value"><a href="mailto:<?php echo htmlspecialchars($contact['email']); ?>"><?php echo htmlspecialchars($contact['email']); ?></a></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Дата обращения:</span>
                            <span class="detail-value"><?php echo date('d.m.Y H:i', strtotime($contact['created_at'])); ?></span>
                        </div>
                    </div>
                    
                    <div class="detail-card">
                        <h3>Сообщение</h3>
                        <div class="message-content">
                            <?php echo nl2br(htmlspecialchars($contact['message'])); ?>
                        </div>
                    </div>
                    
                    <div class="detail-card">
                        <h3>Изменить статус</h3>
                        <form method="POST" class="status-form">
                            <select name="status" class="status-select">
                                <option value="new" <?php echo $contact['status'] == 'new' ? 'selected' : ''; ?>>Новое</option>
                                <option value="in_progress" <?php echo $contact['status'] == 'in_progress' ? 'selected' : ''; ?>>В работе</option>
                                <option value="completed" <?php echo $contact['status'] == 'completed' ? 'selected' : ''; ?>>Завершено</option>
                                <option value="cancelled" <?php echo $contact['status'] == 'cancelled' ? 'selected' : ''; ?>>Отменено</option>
                            </select>
                            <button type="submit" class="btn btn-primary">Сохранить</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
