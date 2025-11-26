# Новая структура админ-панели

## Изменения

Все файлы реорганизованы по категориям для удобства:

### До:
```
public/admin/
├── login.php
├── logout.php
├── setup.php
├── dashboard.php
├── testimonials.php
├── contacts.php
├── contact-view.php
├── add.php (удален)
├── edit.php (удален)
├── delete.php (удален)
├── test-php.php (удален)
├── test-data.php (удален)
└── ...
```

### После:
```
public/admin/
├── index.php                    # Перенаправление на login
│
├── auth/                        # Авторизация
│   ├── login.php               # Вход
│   ├── logout.php              # Выход
│   └── setup.php               # Настройка БД
│
├── pages/                       # Страницы управления
│   ├── dashboard.php           # Главная
│   ├── testimonials.php        # Письма
│   ├── contacts.php            # Обращения
│   └── contact-view.php        # Просмотр обращения
│
├── api/                         # Внутренние API
│   └── testimonial-delete.php  # Удаление письма
│
├── includes/                    # Компоненты
│   ├── header.php
│   └── sidebar.php
│
├── css/                         # Стили
│   └── admin.css
│
└── js/                          # Скрипты
    └── testimonials.js
```

## Обновленные пути

### Навигация (sidebar.php):
- `/admin/pages/dashboard.php`
- `/admin/pages/testimonials.php`
- `/admin/pages/contacts.php`
- `/admin/auth/logout.php`

### API (testimonials.js):
- `/api/testimonials/read-one.php`
- `/api/testimonials/create.php`
- `/api/testimonials/update.php`

### Внутренние операции:
- `/admin/api/testimonial-delete.php`

### Ресурсы (относительные пути):
- `../css/admin.css`
- `../js/testimonials.js`

## Удаленные файлы

Тестовые и устаревшие файлы удалены:
- test-php.php
- test-data.php
- testimonials-simple.php
- add.php, edit.php, delete.php (заменены модальными окнами)
- testimonial-add.php, testimonial-edit.php, testimonial-delete.php

## Точка входа

Главная страница: `http://localhost:8000/admin/`
Автоматически перенаправляет на `/admin/auth/login.php`
