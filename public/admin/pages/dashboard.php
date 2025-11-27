<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: ../auth/login.php');
    exit;
}

include_once '../../../api/config/database.php';

$database = new Database();
$db = $database->getConnection();

// Проверяем существование таблицы contacts
try {
    $query = "SELECT COUNT(*) as total FROM contacts";
    $stmt = $db->prepare($query);
    $stmt->execute();
} catch(PDOException $e) {
    header('Location: ../auth/setup.php');
    exit;
}

// Получаем статистику
$query = "SELECT COUNT(*) as total FROM testimonials";
$stmt = $db->prepare($query);
$stmt->execute();
$testimonials_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

$query = "SELECT COUNT(*) as total FROM contacts";
$stmt = $db->prepare($query);
$stmt->execute();
$contacts_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

$query = "SELECT COUNT(*) as total FROM contacts WHERE status = 'new'";
$stmt = $db->prepare($query);
$stmt->execute();
$new_contacts = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Статистика по заявкам
$query = "SELECT COUNT(*) as total FROM orders";
$stmt = $db->prepare($query);
$stmt->execute();
$orders_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

$query = "SELECT COUNT(*) as total FROM orders WHERE status = 'new'";
$stmt = $db->prepare($query);
$stmt->execute();
$new_orders = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель - TL Web</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include '../includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include '../includes/header.php'; ?>
            
            <div class="admin-content">
                <h1 class="page-title">Панель управления</h1>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-info">
                            <div class="stat-value"><?php echo $testimonials_count; ?></div>
                            <div class="stat-label">Благодарственных писем</div>
                        </div>
                        <a href="testimonials.php" class="stat-link">Перейти →</a>
                    </div>
                    
                    <div class="stat-card highlight">
                        <div class="stat-icon">🚚</div>
                        <div class="stat-info">
                            <div class="stat-value"><?php echo $orders_count; ?></div>
                            <div class="stat-label">Всего заявок</div>
                        </div>
                        <a href="orders.php" class="stat-link">Перейти →</a>
                    </div>
                    
                    <div class="stat-card highlight">
                        <div class="stat-icon">🔔</div>
                        <div class="stat-info">
                            <div class="stat-value"><?php echo $new_orders; ?></div>
                            <div class="stat-label">Новых заявок</div>
                        </div>
                        <a href="orders.php?status=new" class="stat-link">Перейти →</a>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">✉️</div>
                        <div class="stat-info">
                            <div class="stat-value"><?php echo $contacts_count; ?></div>
                            <div class="stat-label">Всего обращений</div>
                        </div>
                        <a href="contacts.php" class="stat-link">Перейти →</a>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">📬</div>
                        <div class="stat-info">
                            <div class="stat-value"><?php echo $new_contacts; ?></div>
                            <div class="stat-label">Новых обращений</div>
                        </div>
                        <a href="contacts.php?status=new" class="stat-link">Перейти →</a>
                    </div>
                </div>
                
                <div class="welcome-section">
                    <h2>Добро пожаловать, <?php echo htmlspecialchars($_SESSION['admin_username']); ?>!</h2>
                    <p>Выберите раздел для управления контентом сайта</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
