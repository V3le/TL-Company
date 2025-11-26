-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Ноя 26 2025 г., 10:54
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `tl_web`
--

-- --------------------------------------------------------

--
-- Структура таблицы `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL COMMENT 'Логин',
  `password` varchar(255) NOT NULL COMMENT 'Хеш пароля',
  `email` varchar(100) DEFAULT NULL COMMENT 'Email',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'admin', '$2y$10$en6lpI6oNgBmiQkEo3GmOeLCeQqtRs7DB/mruoJWesiPRNKhGfcbe', 'admin@tlweb.ru', '2025-11-26 08:43:32');

-- --------------------------------------------------------

--
-- Структура таблицы `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Имя',
  `phone` varchar(50) NOT NULL COMMENT 'Телефон',
  `email` varchar(255) DEFAULT NULL COMMENT 'Email',
  `message` text NOT NULL COMMENT 'Сообщение',
  `status` enum('new','in_progress','completed','cancelled') DEFAULT 'new' COMMENT 'Статус обращения',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Дата создания',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Дата обновления'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `phone`, `email`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Никита', '+7 (962) 851-52-82', 'nikita-adonev@mail.ru', 'Тест обращения', 'cancelled', '2025-11-26 09:16:02', '2025-11-26 09:27:45'),
(2, 'Никита', '+7 (962) 851-52-82', 'nikita-adonev@mail.ru', 'У меня возник вопрос по поводу доставки в другую страну.', 'in_progress', '2025-11-26 09:27:30', '2025-11-26 09:31:18');

-- --------------------------------------------------------

--
-- Структура таблицы `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL COMMENT 'Название компании',
  `author_name` varchar(255) DEFAULT NULL COMMENT 'ФИО автора письма',
  `content` text NOT NULL COMMENT 'Текст благодарственного письма',
  `image_path` varchar(500) DEFAULT NULL COMMENT 'Путь к фото письма',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Активно/неактивно',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Дата создания',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Дата обновления'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `testimonials`
--

INSERT INTO `testimonials` (`id`, `company_name`, `author_name`, `content`, `image_path`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'ЗАО \"Логистика\"', 'Петрова А.С.', 'Отличная работа! Груз доставлен в срок, водитель профессионал. Рекомендуем вашу компанию!', 'public/images/testimonials/6926c1b8bc197.png', 1, '2025-11-26 08:43:32', '2025-11-26 09:00:40'),
(6, 'ЗАО \"Логистика\"', 'Петрова А.С.', '123', 'public/images/testimonials/6926c5d323b55.jpg', 1, '2025-11-26 09:18:11', '2025-11-26 09:18:11'),
(7, 'ЗАО \"Логистика\"', 'Петрова А.С.', 'Пп', 'public/images/testimonials/6926c82dce1f5.jpg', 1, '2025-11-26 09:28:13', '2025-11-26 09:28:13');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_username` (`username`);

--
-- Индексы таблицы `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Индексы таблицы `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
