-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Дек 01 2025 г., 20:48
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
(1, 'admin', '$2y$10$en6lpI6oNgBmiQkEo3GmOeLCeQqtRs7DB/mruoJWesiPRNKhGfcbe', 'admin@tlweb.ru', '2025-11-26 08:43:32'),
(2, '1', '1', NULL, '2025-12-01 15:32:36');

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
(2, 'Никита', '+7 (962) 851-52-82', 'nikita-adonev@mail.ru', 'У меня возник вопрос по поводу доставки в другую страну.', 'in_progress', '2025-11-26 09:27:30', '2025-11-26 09:31:18'),
(3, 'Никита', '+7 (962) 851-52-82', 'nikita-adonev@mail.ru', 'fgfgdfgfdgd', 'new', '2025-11-28 16:55:02', '2025-11-28 16:55:02'),
(4, 'Адоньев Никита Дмитриевич', 'nikita-adonev@mail.ru', '2weyzi2@mail.ru', '123', 'new', '2025-12-01 17:15:58', '2025-12-01 17:15:58');

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Имя клиента',
  `phone` varchar(50) NOT NULL COMMENT 'Телефон',
  `cargo_description` text NOT NULL COMMENT 'Описание груза',
  `city_from` varchar(255) NOT NULL COMMENT 'Город отправления',
  `city_to` varchar(255) NOT NULL COMMENT 'Город назначения',
  `status` enum('new','in_progress','completed','cancelled') DEFAULT 'new' COMMENT 'Статус заявки',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Дата создания',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Дата обновления'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `name`, `phone`, `cargo_description`, `city_from`, `city_to`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Никита', '+79628515282', 'Колёса, 4 шт, вес 130 кг', 'Ставрополь', 'Краснодар', 'in_progress', '2025-11-27 13:39:48', '2025-11-28 16:54:44');

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
(6, 'ЗАО \"Логистика\"', 'Петрова А.С.', '123', 'public/images/testimonials/6926c5d323b55.jpg', 1, '2025-11-26 09:18:11', '2025-11-26 09:18:11'),
(7, 'ЗАО \"Логистика\"', 'Петрова А.С.', 'Пп', 'public/images/testimonials/6926c82dce1f5.jpg', 1, '2025-11-26 09:28:13', '2025-11-26 09:28:13'),
(8, 'ЗАО \"Логистика\"', 'Петрова А.С.', '13', 'public/images/testimonials/6929d3afef4dc.jpg', 1, '2025-11-28 16:54:07', '2025-11-28 16:54:07');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Дата обновления'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `first_name`, `last_name`, `middle_name`, `birth_date`, `phone`, `city`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'nikita', 'nikita-adonev@mail.ru', '$2y$10$tvN9tfhH5u9qkf0lAKQY8OiIrqt6E7JKS0E4SblLwErCMYNjgJMm2', 'Никита', 'Адоньев', 'Дмитриевич', '2005-02-24', '+7 (962) 851-52-82', 'Ставрополь', 1, '2025-12-01 15:10:40', '2025-12-01 15:10:40');

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
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
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
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
