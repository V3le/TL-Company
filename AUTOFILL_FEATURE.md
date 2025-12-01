# Автозаполнение форм данными пользователя

## Описание

После авторизации/регистрации данные пользователя автоматически заполняются во всех формах на сайте:
- Форма контактов (главная страница)
- Модальное окно заказа
- Любые другие формы с соответствующими полями

## Какие данные автозаполняются

1. **ФИО** - полное имя (Фамилия Имя Отчество)
2. **Телефон** - номер телефона пользователя
3. **Email** - электронная почта

## Как это работает

### 1. Сохранение данных при авторизации

При успешной авторизации или регистрации данные пользователя сохраняются в `localStorage`:

```javascript
localStorage.setItem('currentUser', JSON.stringify(user));
```

### 2. Автозаполнение форм

Функция `autofillForms(user)` автоматически вызывается при:
- Авторизации пользователя
- Регистрации нового пользователя
- Загрузке страницы (если пользователь уже авторизован)

### 3. Получение данных пользователя

Для получения данных текущего пользователя используйте:

```javascript
const currentUser = window.getCurrentUser();
if (currentUser) {
    // Пользователь авторизован
    console.log(currentUser.first_name, currentUser.last_name);
}
```

## Интеграция в новые формы

Чтобы добавить автозаполнение в новую форму:

### Вариант 1: Автоматическое (при загрузке страницы)

Используйте стандартные ID для полей:
- `name` или `orderName` - для имени
- `phone` или `orderPhone` - для телефона
- `email` или `orderEmail` - для email

Автозаполнение произойдет автоматически при загрузке страницы.

### Вариант 2: Ручное (при открытии модального окна)

```javascript
function openMyModal() {
    // Открываем модальное окно
    modal.classList.add('active');
    
    // Автозаполнение данными пользователя
    const currentUser = window.getCurrentUser();
    if (currentUser) {
        const fullName = [currentUser.last_name, currentUser.first_name, currentUser.middle_name]
            .filter(Boolean)
            .join(' ');
        
        document.getElementById('myName').value = fullName;
        document.getElementById('myPhone').value = currentUser.phone || '';
        document.getElementById('myEmail').value = currentUser.email || '';
    }
}
```

## Примеры использования

### Форма контактов (contacts.js)

```javascript
setTimeout(() => {
    const currentUser = window.getCurrentUser();
    if (currentUser) {
        const fullName = [currentUser.last_name, currentUser.first_name, currentUser.middle_name]
            .filter(Boolean)
            .join(' ');
        
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        
        if (nameInput && !nameInput.value) nameInput.value = fullName;
        if (phoneInput && !phoneInput.value && currentUser.phone) phoneInput.value = currentUser.phone;
        if (emailInput && !emailInput.value && currentUser.email) emailInput.value = currentUser.email;
    }
}, 500);
```

### Модальное окно заказа (order-modal.js)

```javascript
open() {
    modal.classList.add('active');
    
    setTimeout(() => {
        const currentUser = window.getCurrentUser();
        if (currentUser) {
            const fullName = [currentUser.last_name, currentUser.first_name, currentUser.middle_name]
                .filter(Boolean)
                .join(' ');
            
            const orderName = document.getElementById('orderName');
            const orderPhone = document.getElementById('orderPhone');
            
            if (orderName && !orderName.value) orderName.value = fullName;
            if (orderPhone && !orderPhone.value && currentUser.phone) orderPhone.value = currentUser.phone;
        }
    }, 50);
}
```

## Структура данных пользователя

```javascript
{
    id: 1,
    username: "user123",
    email: "user@example.com",
    first_name: "Иван",
    last_name: "Иванов",
    middle_name: "Иванович",
    phone: "+7 (999) 123-45-67",
    city: "Москва"
}
```

## Очистка данных при выходе

При выходе из системы данные автоматически удаляются:

```javascript
localStorage.removeItem('currentUser');
```

## Проверка работы

1. Зарегистрируйтесь или войдите в систему
2. Откройте форму контактов или модальное окно заказа
3. Поля должны быть автоматически заполнены вашими данными
4. Выйдите из системы - поля должны очиститься

## Обновленные файлы

✅ `public/js/auth.js` - добавлены функции автозаполнения
✅ `public/js/order-modal.js` - автозаполнение в модальном окне
✅ `public/js/contacts.js` - автозаполнение в форме контактов
