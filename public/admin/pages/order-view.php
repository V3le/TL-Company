<?php
require_once '../config/session.php';
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
    $query = "UPDATE orders SET status = :status WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $new_status);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        $success_message = "Статус успешно обновлен";
    }
}

// Получение заявки
$query = "SELECT * FROM orders WHERE id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $id);
$stmt->execute();
$order = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$order) {
    header('Location: orders.php');
    exit;
}

$status_labels = [
    'new' => ['Новая', 'status-new'],
    'in_progress' => ['В работе', 'status-progress'],
    'completed' => ['Завершена', 'status-completed'],
    'cancelled' => ['Отменена', 'status-cancelled']
];
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Заявка #<?php echo $order['id']; ?> - Админ-панель</title>
    <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include '../includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include '../includes/header.php'; ?>
            
            <div class="admin-content">
                <div class="content-header">
                    <h1 class="page-title">Заявка #<?php echo $order['id']; ?></h1>
                    <a href="orders.php" class="btn btn-secondary">← Назад к списку</a>
                </div>

                <?php if (isset($success_message)): ?>
                <div class="alert alert-success"><?php echo $success_message; ?></div>
                <?php endif; ?>

                <div class="contact-detail">
                    <div class="detail-card">
                        <h3>Информация о клиенте</h3>
                        <div class="detail-row">
                            <div class="detail-label">Имя:</div>
                            <div class="detail-value"><?php echo htmlspecialchars($order['name']); ?></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Телефон:</div>
                            <div class="detail-value">
                                <a href="tel:<?php echo htmlspecialchars($order['phone']); ?>">
                                    <?php echo htmlspecialchars($order['phone']); ?>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="detail-card">
                        <h3>Маршрут</h3>
                        <div class="detail-row">
                            <div class="detail-label">Откуда:</div>
                            <div class="detail-value"><strong><?php echo htmlspecialchars($order['city_from']); ?></strong></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Куда:</div>
                            <div class="detail-value"><strong><?php echo htmlspecialchars($order['city_to']); ?></strong></div>
                        </div>
                    </div>

                    <div class="detail-card">
                        <h3>Описание груза</h3>
                        <div class="message-content">
                            <?php echo nl2br(htmlspecialchars($order['cargo_description'])); ?>
                        </div>
                    </div>

                    <div class="detail-card">
                        <h3>Статус заявки</h3>
                        <div class="detail-row">
                            <div class="detail-label">Текущий статус:</div>
                            <div class="detail-value">
                                <span class="status <?php echo $status_labels[$order['status']][1]; ?>">
                                    <?php echo $status_labels[$order['status']][0]; ?>
                                </span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Дата создания:</div>
                            <div class="detail-value"><?php echo date('d.m.Y H:i', strtotime($order['created_at'])); ?></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Последнее обновление:</div>
                            <div class="detail-value"><?php echo date('d.m.Y H:i', strtotime($order['updated_at'])); ?></div>
                        </div>
                        
                        <form method="POST" class="status-form">
                            <select name="status" class="status-select">
                                <option value="new" <?php echo $order['status'] == 'new' ? 'selected' : ''; ?>>Новая</option>
                                <option value="in_progress" <?php echo $order['status'] == 'in_progress' ? 'selected' : ''; ?>>В работе</option>
                                <option value="completed" <?php echo $order['status'] == 'completed' ? 'selected' : ''; ?>>Завершена</option>
                                <option value="cancelled" <?php echo $order['status'] == 'cancelled' ? 'selected' : ''; ?>>Отменена</option>
                            </select>
                            <button type="submit" class="btn btn-primary">Обновить статус</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
