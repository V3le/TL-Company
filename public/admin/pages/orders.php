<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: ../auth/login.php');
    exit;
}

include_once '../../../api/config/database.php';

$database = new Database();
$db = $database->getConnection();

// Фильтр по статусу
$status_filter = $_GET['status'] ?? '';
$query = "SELECT * FROM orders";
if ($status_filter) {
    $query .= " WHERE status = :status";
}
$query .= " ORDER BY created_at DESC";

$stmt = $db->prepare($query);
if ($status_filter) {
    $stmt->bindParam(':status', $status_filter);
}
$stmt->execute();
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
$count = count($orders);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Заявки - Админ-панель</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include '../includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include '../includes/header.php'; ?>
            
            <div class="admin-content">
                <div class="content-header">
                    <h1 class="page-title">Заявки на перевозку</h1>
                </div>
                
                <div class="filters">
                    <a href="orders.php" class="filter-btn <?php echo !$status_filter ? 'active' : ''; ?>">Все</a>
                    <a href="orders.php?status=new" class="filter-btn <?php echo $status_filter == 'new' ? 'active' : ''; ?>">Новые</a>
                    <a href="orders.php?status=in_progress" class="filter-btn <?php echo $status_filter == 'in_progress' ? 'active' : ''; ?>">В работе</a>
                    <a href="orders.php?status=completed" class="filter-btn <?php echo $status_filter == 'completed' ? 'active' : ''; ?>">Завершенные</a>
                    <a href="orders.php?status=cancelled" class="filter-btn <?php echo $status_filter == 'cancelled' ? 'active' : ''; ?>">Отмененные</a>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Телефон</th>
                            <th>Маршрут</th>
                            <th>Груз</th>
                            <th>Статус</th>
                            <th>Дата</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($orders as $row): ?>
                        <tr>
                            <td><?php echo $row['id']; ?></td>
                            <td><?php echo htmlspecialchars($row['name']); ?></td>
                            <td><a href="tel:<?php echo htmlspecialchars($row['phone']); ?>"><?php echo htmlspecialchars($row['phone']); ?></a></td>
                            <td>
                                <strong><?php echo htmlspecialchars($row['city_from']); ?></strong> 
                                → 
                                <strong><?php echo htmlspecialchars($row['city_to']); ?></strong>
                            </td>
                            <td class="text-preview"><?php echo mb_substr(htmlspecialchars($row['cargo_description']), 0, 40); ?>...</td>
                            <td>
                                <?php
                                $status_labels = [
                                    'new' => ['Новая', 'status-new'],
                                    'in_progress' => ['В работе', 'status-progress'],
                                    'completed' => ['Завершена', 'status-completed'],
                                    'cancelled' => ['Отменена', 'status-cancelled']
                                ];
                                $status_info = $status_labels[$row['status']];
                                ?>
                                <span class="status <?php echo $status_info[1]; ?>">
                                    <?php echo $status_info[0]; ?>
                                </span>
                            </td>
                            <td><?php echo date('d.m.Y H:i', strtotime($row['created_at'])); ?></td>
                            <td class="actions">
                                <a href="order-view.php?id=<?php echo $row['id']; ?>" class="btn btn-view">👁️ Просмотр</a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if ($count == 0): ?>
                        <tr>
                            <td colspan="8" style="text-align: center; padding: 40px; color: #666;">
                                <?php if ($status_filter): ?>
                                    Нет заявок с таким статусом
                                <?php else: ?>
                                    Заявок пока нет
                                <?php endif; ?>
                            </td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
                
                <?php if ($count > 0): ?>
                <p style="margin-top: 16px; color: #666;">Всего заявок: <?php echo $count; ?></p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>
