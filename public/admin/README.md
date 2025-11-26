# Структура админ-панели

## 📁 Организация файлов

```
public/admin/
├── auth/                        # 🔐 Авторизация и настройка
│   ├── login.php               # Страница входа
│   ├── logout.php              # Выход из системы
│   └── setup.php               # Первоначальная настройка БД
│
├── pages/                       # 📄 Основные страницы
│   ├── dashboard.php           # Главная панель управления
│   ├── testimonials.php        # Управление благодарственными письмами
│   ├── contacts.php            # Список обращений
│   └── contact-view.php        # Просмотр обращения
│
├── api/                         # ⚙️ Внутренние API операции
│   └── testimonial-delete.php  # Удаление письма
│
├── includes/                    # 🧩 Общие компоненты
│   ├── header.php              # Шапка админки
│   └── sidebar.php             # Боковое меню
│
├── css/                         # 🎨 Стили
│   └── admin.css               # Основные стили админки
│
├── js/                          # 💻 JavaScript
│   └── testimonials.js         # Функционал для писем
│
├── index.php                    # Перенаправление на login
├── README.md                    # Этот файл
└── STRUCTURE.md                 # Детальное описание изменений
```

## 🚀 Доступ

- **URL**: `http://localhost:8000/admin/`
- **Логин**: `admin`
- **Пароль**: `admin123`

## ✨ Функционал

1. **Авторизация** - защищенный вход в систему
2. **Dashboard** - статистика и быстрый доступ к разделам
3. **Благодарственные письма** - CRUD операции с модальными окнами
4. **Обращения** - просмотр и управление статусами заявок

## 🔗 Основные маршруты

| Раздел | URL |
|--------|-----|
| Вход | `/admin/auth/login.php` |
| Главная | `/admin/pages/dashboard.php` |
| Письма | `/admin/pages/testimonials.php` |
| Обращения | `/admin/pages/contacts.php` |

## 🗑️ Удаленные файлы

Тестовые и устаревшие файлы были удалены:
- `test-php.php`, `test-data.php`
- `testimonials-simple.php`
- `add.php`, `edit.php`, `delete.php`
- `testimonial-add.php`, `testimonial-edit.php`, `testimonial-delete.php`

Все операции теперь выполняются через модальные окна и API.
