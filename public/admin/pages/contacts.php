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
$query = "SELECT * FROM contacts";
if ($status_filter) {
    $query .= " WHERE status = :status";
}
$query .= " ORDER BY created_at DESC";

$stmt = $db->prepare($query);
if ($status_filter) {
    $stmt->bindParam(':status', $status_filter);
}
$stmt->execute();
$contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
$count = count($contacts);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Обращения - Админ-панель</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include '../includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include '../includes/header.php'; ?>
            
            <div class="admin-content">
                <div class="content-header">
                    <h1 class="page-title">Обращения клиентов</h1>
                </div>
                
                <div class="filters">
                    <a href="contacts.php" class="filter-btn <?php echo !$status_filter ? 'active' : ''; ?>">Все</a>
                    <a href="contacts.php?status=new" class="filter-btn <?php echo $status_filter == 'new' ? 'active' : ''; ?>">Новые</a>
                    <a href="contacts.php?status=in_progress" class="filter-btn <?php echo $status_filter == 'in_progress' ? 'active' : ''; ?>">В работе</a>
                    <a href="contacts.php?status=completed" class="filter-btn <?php echo $status_filter == 'completed' ? 'active' : ''; ?>">Завершенные</a>
                    <a href="contacts.php?status=cancelled" class="filter-btn <?php echo $status_filter == 'cancelled' ? 'active' : ''; ?>">Отмененные</a>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Сообщение</th>
                            <th>Статус</th>
                            <th>Дата</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($contacts as $row): ?>
                        <tr>
                            <td><?php echo $row['id']; ?></td>
                            <td><?php echo htmlspecialchars($row['name']); ?></td>
                            <td><a href="tel:<?php echo htmlspecialchars($row['phone']); ?>"><?php echo htmlspecialchars($row['phone']); ?></a></td>
                            <td><?php echo htmlspecialchars($row['email']); ?></td>
                            <td class="text-preview"><?php echo mb_substr(htmlspecialchars($row['message']), 0, 50); ?>...</td>
                            <td>
                                <?php
                                $status_labels = [
                                    'new' => ['Новое', 'status-new'],
                                    'in_progress' => ['В работе', 'status-progress'],
                                    'completed' => ['Завершено', 'status-completed'],
                                    'cancelled' => ['Отменено', 'status-cancelled']
                                ];
                                $status_info = $status_labels[$row['status']];
                                ?>
                                <span class="status <?php echo $status_info[1]; ?>">
                                    <?php echo $status_info[0]; ?>
                                </span>
                            </td>
                            <td><?php echo date('d.m.Y H:i', strtotime($row['created_at'])); ?></td>
                            <td class="actions">
                                <a href="contact-view.php?id=<?php echo $row['id']; ?>" class="btn btn-view">👁️ Просмотр</a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if ($count == 0): ?>
                        <tr>
                            <td colspan="8" style="text-align: center; padding: 40px; color: #666;">
                                <?php if ($status_filter): ?>
                                    Нет обращений с таким статусом
                                <?php else: ?>
                                    Обращений пока нет
                                <?php endif; ?>
                            </td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
                
                <?php if ($count > 0): ?>
                <p style="margin-top: 16px; color: #666;">Всего обращений: <?php echo $count; ?></p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>
