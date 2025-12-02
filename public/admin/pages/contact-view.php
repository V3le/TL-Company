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
                        <?php if($contact['status'] !== 'closed'): ?>
                        <form method="POST" class="status-form">
                            <select name="status" class="status-select">
                                <option value="new" <?php echo $contact['status'] == 'new' ? 'selected' : ''; ?>>Новое</option>
                                <option value="in_progress" <?php echo $contact['status'] == 'in_progress' ? 'selected' : ''; ?>>В работе</option>
                                <option value="completed" <?php echo $contact['status'] == 'completed' ? 'selected' : ''; ?>>Завершено</option>
                                <option value="cancelled" <?php echo $contact['status'] == 'cancelled' ? 'selected' : ''; ?>>Отменено</option>
                            </select>
                            <button type="submit" class="btn btn-primary">Сохранить</button>
                        </form>
                        <form method="POST" style="margin-top: 16px;">
                            <input type="hidden" name="status" value="closed">
                            <button type="submit" class="btn btn-danger" onclick="return confirm('Вы уверены? После закрытия обращения отправка сообщений будет невозможна.')" style="display: inline-flex; align-items: center; gap: 8px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                Закрыть обращение
                            </button>
                        </form>
                        <?php else: ?>
                        <div class="alert alert-warning">
                            <strong>Обращение закрыто</strong><br>
                            Отправка сообщений невозможна. Обращение находится в архиве.
                        </div>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Чат с клиентом -->
                    <div class="detail-card chat-card">
                        <h3>Переписка с клиентом</h3>
                        <div class="chat-container">
                            <div class="chat-messages" id="chatMessages">
                                <div class="chat-loading">Загрузка сообщений...</div>
                            </div>
                            
                            <div class="chat-input-container">
                                <textarea 
                                    id="chatInput" 
                                    class="chat-input" 
                                    placeholder="Введите ответ клиенту..."
                                    rows="3"
                                ></textarea>
                                <button class="btn btn-primary" onclick="sendMessage()">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="22" y1="2" x2="11" y2="13"/>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                    </svg>
                                    Отправить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        const contactId = <?php echo $id; ?>;
        let chatUpdateInterval = null;
        
        // Загрузка сообщений
        async function loadMessages() {
            try {
                const response = await fetch(`../api/get-messages.php?contact_id=${contactId}`, {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Ошибка загрузки');
                }
                
                const data = await response.json();
                displayMessages(data.messages);
                
            } catch (error) {
                console.error('Ошибка:', error);
                document.getElementById('chatMessages').innerHTML = '<div class="chat-error">Ошибка загрузки сообщений</div>';
            }
        }
        
        // Отображение сообщений
        function displayMessages(messages) {
            const container = document.getElementById('chatMessages');
            
            if (!messages || messages.length === 0) {
                container.innerHTML = '<div class="chat-empty">Нет сообщений</div>';
                return;
            }
            
            const scrollAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
            
            container.innerHTML = messages.map(msg => {
                const isAdmin = msg.sender_type === 'admin';
                const time = new Date(msg.created_at).toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                return `
                    <div class="chat-message ${isAdmin ? 'chat-message-admin' : 'chat-message-user'}">
                        <div class="message-sender">${isAdmin ? 'Вы (A2B Company)' : 'Клиент'}</div>
                        <div class="message-text">${escapeHtml(msg.message)}</div>
                        <div class="message-time">${time}</div>
                    </div>
                `;
            }).join('');
            
            if (scrollAtBottom || messages.length <= 10) {
                container.scrollTop = container.scrollHeight;
            }
        }
        
        // Отправка сообщения
        async function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            try {
                const response = await fetch('../api/send-message.php', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contact_id: contactId,
                        message: message
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    input.value = '';
                    await loadMessages();
                } else {
                    alert(data.message || 'Ошибка отправки');
                }
                
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка соединения с сервером');
            }
        }
        
        // Экранирование HTML
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // Отправка по Enter
        document.addEventListener('DOMContentLoaded', () => {
            const input = document.getElementById('chatInput');
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            // Загружаем сообщения
            loadMessages();
            
            // Автообновление каждые 5 секунд
            chatUpdateInterval = setInterval(loadMessages, 5000);
        });
    </script>
</body>
</html>
