-- Таблица пользователей для системы авторизации/регистрации

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT 'Логин',
  `email` varchar(100) NOT NULL COMMENT 'Email',
  `password` varchar(255) NOT NULL COMMENT 'Хеш пароля',
  `first_name` varchar(100) DEFAULT NULL COMMENT 'Имя',
  `last_name` varchar(100) DEFAULT NULL COMMENT 'Фамилия',
  `middle_name` varchar(100) DEFAULT NULL COMMENT 'Отчество',
  `birth_date` date DEFAULT NULL COMMENT 'Дата рождения',
  `phone` varchar(20) DEFAULT NULL COMMENT 'Телефон',
  `city` varchar(100) DEFAULT NULL COMMENT 'Город',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Активен',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Дата регистрации',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Дата обновления',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
