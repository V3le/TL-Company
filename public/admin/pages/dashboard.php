<?php
require_once '../config/session.php';
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

// Последние заявки
$query = "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5";
$stmt = $db->prepare($query);
$stmt->execute();
$recent_orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Последние обращения
$query = "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5";
$stmt = $db->prepare($query);
$stmt->execute();
$recent_contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A2B - Админ-панель</title>
    <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include '../includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include '../includes/header.php'; ?>
            
            <div class="admin-content">
                <!-- Приветствие -->
                <div class="dashboard-welcome">
                    <div class="welcome-content">
                        <h1>Добро пожаловать, <?php echo htmlspecialchars($_SESSION['admin_username']); ?>!</h1>
                        <p>Панель управления A2B Logistics</p>
                    </div>
                    <div class="welcome-date">
                        <?php 
                        $months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
                        $days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
                        echo $days[date('w')] . ', ' . date('j') . ' ' . $months[date('n')-1] . ' ' . date('Y');
                        ?>
                    </div>
                </div>

                <!-- Основная статистика -->
                <div class="dashboard-stats">
                    <div class="stat-card-new primary">
                        <div class="stat-header">
                            <div class="stat-icon-new">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="1" y="3" width="15" height="13"></rect>
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                </svg>
                            </div>
                            <span class="stat-label-new">Заявки на перевозку</span>
                        </div>
                        <div class="stat-body">
                            <div class="stat-value-new"><?php echo $orders_count; ?></div>
                            <?php if ($new_orders > 0): ?>
                            <div class="stat-badge new">+<?php echo $new_orders; ?> новых</div>
                            <?php endif; ?>
                        </div>
                        <a href="orders.php" class="stat-link-new">
                            Перейти к заявкам
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>

                    <div class="stat-card-new secondary">
                        <div class="stat-header">
                            <div class="stat-icon-new">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <span class="stat-label-new">Обращения клиентов</span>
                        </div>
                        <div class="stat-body">
                            <div class="stat-value-new"><?php echo $contacts_count; ?></div>
                            <?php if ($new_contacts > 0): ?>
                            <div class="stat-badge new">+<?php echo $new_contacts; ?> новых</div>
                            <?php endif; ?>
                        </div>
                        <a href="contacts.php" class="stat-link-new">
                            Перейти к обращениям
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>

                    <div class="stat-card-new tertiary">
                        <div class="stat-header">
                            <div class="stat-icon-new">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                </svg>
                            </div>
                            <span class="stat-label-new">Благодарственные письма</span>
                        </div>
                        <div class="stat-body">
                            <div class="stat-value-new"><?php echo $testimonials_count; ?></div>
                        </div>
                        <a href="testimonials.php" class="stat-link-new">
                            Управление письмами
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Быстрые действия -->
                <div class="quick-actions">
                    <h2 class="section-title">Быстрые действия</h2>
                    <div class="actions-grid">
                        <a href="orders.php?status=new" class="action-card">
                            <div class="action-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </div>
                            <div class="action-info">
                                <h3>Новые заявки</h3>
                                <p>Просмотреть необработанные заявки</p>
                            </div>
                        </a>

                        <a href="contacts.php?status=new" class="action-card">
                            <div class="action-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                            <div class="action-info">
                                <h3>Новые обращения</h3>
                                <p>Ответить на вопросы клиентов</p>
                            </div>
                        </a>

                        <a href="orders.php?status=in_progress" class="action-card">
                            <div class="action-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div class="action-info">
                                <h3>Заявки в работе</h3>
                                <p>Отслеживать текущие перевозки</p>
                            </div>
                        </a>

                        <a href="testimonials.php" class="action-card">
                            <div class="action-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                            </div>
                            <div class="action-info">
                                <h3>Отзывы</h3>
                                <p>Управление благодарственными письмами</p>
                            </div>
                        </a>
                    </div>
                </div>

                <!-- Последняя активность -->
                <div class="recent-activity">
                    <div class="activity-section">
                        <div class="activity-header">
                            <h2 class="section-title">Последние заявки</h2>
                            <a href="orders.php" class="view-all-link">Смотреть все →</a>
                        </div>
                        <div class="activity-list">
                            <?php if (count($recent_orders) > 0): ?>
                                <?php foreach ($recent_orders as $order): ?>
                                <a href="order-view.php?id=<?php echo $order['id']; ?>" class="activity-item">
                                    <div class="activity-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="1" y="3" width="15" height="13"></rect>
                                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                        </svg>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-title"><?php echo htmlspecialchars($order['name']); ?></div>
                                        <div class="activity-subtitle">
                                            <?php echo htmlspecialchars($order['city_from']); ?> → <?php echo htmlspecialchars($order['city_to']); ?>
                                        </div>
                                    </div>
                                    <div class="activity-meta">
                                        <?php
                                        $status_labels = [
                                            'new' => 'Новая',
                                            'in_progress' => 'В работе',
                                            'completed' => 'Завершена',
                                            'cancelled' => 'Отменена'
                                        ];
                                        ?>
                                        <span class="activity-status status-<?php echo $order['status']; ?>">
                                            <?php echo $status_labels[$order['status']]; ?>
                                        </span>
                                        <span class="activity-time"><?php echo date('d.m.Y', strtotime($order['created_at'])); ?></span>
                                    </div>
                                </a>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <div class="activity-empty">Заявок пока нет</div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="activity-section">
                        <div class="activity-header">
                            <h2 class="section-title">Последние обращения</h2>
                            <a href="contacts.php" class="view-all-link">Смотреть все →</a>
                        </div>
                        <div class="activity-list">
                            <?php if (count($recent_contacts) > 0): ?>
                                <?php foreach ($recent_contacts as $contact): ?>
                                <a href="contact-view.php?id=<?php echo $contact['id']; ?>" class="activity-item">
                                    <div class="activity-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-title"><?php echo htmlspecialchars($contact['name']); ?></div>
                                        <div class="activity-subtitle">
                                            <?php echo mb_substr(htmlspecialchars($contact['message']), 0, 50); ?>...
                                        </div>
                                    </div>
                                    <div class="activity-meta">
                                        <?php
                                        $status_labels = [
                                            'new' => 'Новое',
                                            'in_progress' => 'В работе',
                                            'completed' => 'Завершено',
                                            'cancelled' => 'Отменено',
                                            'closed' => 'Закрыто'
                                        ];
                                        ?>
                                        <span class="activity-status status-<?php echo $contact['status']; ?>">
                                            <?php echo $status_labels[$contact['status']]; ?>
                                        </span>
                                        <span class="activity-time"><?php echo date('d.m.Y', strtotime($contact['created_at'])); ?></span>
                                    </div>
                                </a>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <div class="activity-empty">Обращений пока нет</div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
