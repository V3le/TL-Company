-- Используем существующую базу данных tl_web
USE tl_web;

-- Таблица благодарственных писем
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL COMMENT 'Название компании',
    author_name VARCHAR(255) COMMENT 'ФИО автора письма',
    content TEXT NOT NULL COMMENT 'Текст благодарственного письма',
    image_path VARCHAR(500) COMMENT 'Путь к фото письма',
    is_active TINYINT(1) DEFAULT 1 COMMENT 'Активно/неактивно',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата обновления',
    INDEX idx_created_at (created_at),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица администраторов
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Логин',
    password VARCHAR(255) NOT NULL COMMENT 'Хеш пароля',
    email VARCHAR(100) COMMENT 'Email',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица обращений
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Имя',
    phone VARCHAR(50) NOT NULL COMMENT 'Телефон',
    email VARCHAR(255) COMMENT 'Email',
    message TEXT NOT NULL COMMENT 'Сообщение',
    status ENUM('new', 'in_progress', 'completed', 'cancelled') DEFAULT 'new' COMMENT 'Статус обращения',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата обновления',
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Создаем администратора по умолчанию (логин: admin, пароль: admin123)
INSERT INTO admins (username, password, email) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@tlweb.ru');
