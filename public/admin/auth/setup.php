<?php
// Скрипт для первоначальной настройки администратора
include_once '../../../api/config/database.php';

$database = new Database();
$db = $database->getConnection();

$message = '';
$error = '';

// Проверяем существование таблицы admins
try {
    $query = "SHOW TABLES LIKE 'admins'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        // Таблица не существует, создаем
        $query = "CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_username (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $db->exec($query);
        $message .= "✓ Таблица admins создана<br>";
    } else {
        $message .= "✓ Таблица admins существует<br>";
    }
    
    // Проверяем существование администратора
    $query = "SELECT COUNT(*) as count FROM admins WHERE username = 'admin'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($row['count'] == 0) {
        // Создаем администратора
        $username = 'admin';
        $password = password_hash('admin123', PASSWORD_DEFAULT);
        $email = 'admin@tlweb.ru';
        
        $query = "INSERT INTO admins (username, password, email) VALUES (:username, :password, :email)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':email', $email);
        
        if ($stmt->execute()) {
            $message .= "✓ Администратор создан<br>";
            $message .= "<br><strong>Данные для входа:</strong><br>";
            $message .= "Логин: <strong>admin</strong><br>";
            $message .= "Пароль: <strong>admin123</strong><br>";
        } else {
            $error = "Ошибка при создании администратора";
        }
    } else {
        $message .= "✓ Администратор уже существует<br>";
        
        // Предлагаем сбросить пароль
        if (isset($_POST['reset_password'])) {
            $password = password_hash('admin123', PASSWORD_DEFAULT);
            $query = "UPDATE admins SET password = :password WHERE username = 'admin'";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':password', $password);
            
            if ($stmt->execute()) {
                $message .= "<br>✓ Пароль сброшен на: <strong>admin123</strong><br>";
            } else {
                $error = "Ошибка при сбросе пароля";
            }
        }
    }
    
    // Проверяем таблицу testimonials
    $query = "SHOW TABLES LIKE 'testimonials'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        $query = "CREATE TABLE IF NOT EXISTS testimonials (
            id INT AUTO_INCREMENT PRIMARY KEY,
            company_name VARCHAR(255) NOT NULL,
            author_name VARCHAR(255),
            content TEXT NOT NULL,
            image_path VARCHAR(500),
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_created_at (created_at),
            INDEX idx_is_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $db->exec($query);
        $message .= "✓ Таблица testimonials создана<br>";
    } else {
        $message .= "✓ Таблица testimonials существует<br>";
    }
    
    // Проверяем таблицу contacts
    $query = "SHOW TABLES LIKE 'contacts'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        $query = "CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            email VARCHAR(255),
            message TEXT NOT NULL,
            status ENUM('new', 'in_progress', 'completed', 'cancelled') DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_status (status),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $db->exec($query);
        $message .= "✓ Таблица contacts создана<br>";
    } else {
        $message .= "✓ Таблица contacts существует<br>";
    }
    
    // Добавляем тестовые данные если таблицы пустые
    $query = "SELECT COUNT(*) as total FROM testimonials";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    if ($count == 0) {
        $query = "INSERT INTO testimonials (company_name, author_name, content, is_active) VALUES
        ('ООО \"Транспорт Плюс\"', 'Иванов И.И.', 'Благодарим за качественную и своевременную доставку груза из Москвы в Владивосток. Все документы оформлены правильно, груз доставлен в срок.', 1),
        ('ЗАО \"Логистика\"', 'Петрова А.С.', 'Отличная работа! Груз доставлен в срок, водитель профессионал. Рекомендуем вашу компанию!', 1),
        ('ИП Сидоров', 'Сидоров П.П.', 'Спасибо за оперативность и профессионализм. Будем обращаться еще!', 1)";
        $db->exec($query);
        $message .= "✓ Добавлены тестовые благодарственные письма<br>";
    }
    
} catch(PDOException $e) {
    $error = "Ошибка базы данных: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Настройка администратора</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body class="login-page">
    <div class="login-container">
        <div class="login-box">
            <h1>Настройка системы</h1>
            
            <?php if ($error): ?>
                <div class="error-message"><?php echo $error; ?></div>
            <?php endif; ?>
            
            <?php if ($message): ?>
                <div class="alert alert-success" style="margin-bottom: 20px;">
                    <?php echo $message; ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="">
                <button type="submit" name="reset_password" class="btn btn-primary btn-block">
                    Сбросить пароль на admin123
                </button>
            </form>
            
            <div style="margin-top: 20px; text-align: center;">
                <a href="login.php" class="btn btn-secondary">Перейти к входу</a>
            </div>
            
            <div class="login-info">
                <p><strong>Информация о подключении:</strong></p>
                <p>База данных: <?php echo $database->db_name ?? 'tl_web'; ?></p>
                <p>Хост: <?php echo $database->host ?? 'localhost'; ?></p>
            </div>
        </div>
    </div>
</body>
</html>
