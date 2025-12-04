// Contact Form Handler - используем делегирование событий
document.addEventListener('submit', async (e) => {
    // Проверяем, что это форма контактов
    if (e.target.id !== 'contactForm') {
        return;
    }
    
    console.log('Форма контактов перехвачена!');
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        message: formData.get('message'),
        privacy: formData.get('privacy')
    };
    
    const validationError = validateForm(data);
    if (validationError) {
        showFormAlert(form, validationError, 'error');
        return;
    }
    
    // Удаляем предыдущие сообщения
    removeFormAlert(form);
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';
    
    try {
        const response = await fetch('../api/contacts/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                phone: data.phone,
                email: data.email,
                message: data.message
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            removeFormAlert(form);
            toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
            form.reset();
        } else {
            showFormAlert(form, result.message || 'Произошла ошибка при отправке. Попробуйте еще раз.');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showFormAlert(form, 'Произошла ошибка при отправке. Проверьте подключение к интернету.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }
});

// Инициализация формы после загрузки
document.addEventListener('DOMContentLoaded', () => {
    initContactFormWhenReady();
});

function initContactFormWhenReady() {
    const form = document.getElementById('contactForm');
    
    if (!form) {
        setTimeout(initContactFormWhenReady, 100);
        return;
    }
    
    if (form.dataset.contactsInitialized) {
        return;
    }
    form.dataset.contactsInitialized = 'true';
    
    highlightCurrentDay();
    
    // Валидация поля имени - только буквы, пробелы и дефисы
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            // Удаляем все цифры и спецсимволы, кроме пробелов, дефисов и букв
            e.target.value = e.target.value.replace(/[^а-яА-ЯёЁa-zA-Z\s\-]/g, '');
        });
    }
    
    // Маска для телефона - только цифры
    const phoneInput = document.getElementById('phone');
    const applyPhoneMask = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value[0] === '8') {
                value = '7' + value.slice(1);
            }
            
            let formattedValue = '+';
            if (value.length > 0) formattedValue += value.substring(0, 1);
            if (value.length > 1) formattedValue += ' (' + value.substring(1, 4);
            if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
            if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
            if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
            
            e.target.value = formattedValue;
        }
    };
    
    if (phoneInput) {
        phoneInput.addEventListener('input', applyPhoneMask);
        // Запрещаем ввод букв
        phoneInput.addEventListener('keypress', (e) => {
            if (!/[\d\+\(\)\-\s]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault();
            }
        });
    }
    
    // Автозаполнение формы данными пользователя
    setTimeout(() => {
        const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
        if (currentUser) {
            const fullName = [currentUser.last_name, currentUser.first_name, currentUser.middle_name]
                .filter(Boolean)
                .join(' ');
            
            if (nameInput && !nameInput.value) nameInput.value = fullName;
            
            const emailInput = document.getElementById('email');
            if (emailInput && !emailInput.value && currentUser.email) emailInput.value = currentUser.email;
            
            if (phoneInput && !phoneInput.value && currentUser.phone) {
                phoneInput.value = currentUser.phone;
            }
        }
    }, 500);
}

// Функция для выделения текущего дня недели
function highlightCurrentDay() {
    const today = new Date().getDay();
    const scheduleDays = document.querySelectorAll('.schedule-day');
    
    scheduleDays.forEach(day => {
        const dayNumber = parseInt(day.getAttribute('data-day'));
        if (dayNumber === today) {
            day.classList.add('active');
        }
    });
}

// Валидация формы - возвращает текст ошибки или null если всё ок
function validateForm(data) {
    // Проверка имени
    if (!data.name || !data.name.trim()) {
        return 'Пожалуйста, введите ваше имя';
    }
    
    // Проверка что имя содержит только буквы
    if (!/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(data.name.trim())) {
        return 'Имя должно содержать только буквы';
    }
    
    // Проверка минимальной длины имени
    if (data.name.trim().length < 2) {
        return 'Имя должно содержать минимум 2 символа';
    }
    
    // Проверка телефона
    if (!data.phone || !data.phone.trim()) {
        return 'Пожалуйста, введите номер телефона';
    }
    
    // Проверка формата телефона (должно быть 11 цифр)
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
        return 'Номер телефона должен содержать 11 цифр';
    }
    
    // Проверка что телефон начинается с 7 или 8
    if (phoneDigits[0] !== '7' && phoneDigits[0] !== '8') {
        return 'Номер телефона должен начинаться с +7 или 8';
    }
    
    // Проверка email (если заполнен)
    if (data.email && data.email.trim()) {
        if (!isValidEmail(data.email.trim())) {
            return 'Пожалуйста, введите корректный email';
        }
    }
    
    // Проверка сообщения (если заполнено)
    if (data.message && data.message.trim() && data.message.trim().length < 10) {
        return 'Сообщение должно содержать минимум 10 символов';
    }
    
    // Проверка согласия с политикой
    if (!data.privacy) {
        return 'Необходимо согласие с политикой обработки персональных данных';
    }
    
    return null; // Всё ок
}

// Проверка email
function isValidEmail(email) {
    // Более строгая проверка email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Показать сообщение в форме
function showFormAlert(form, message, type) {
    removeFormAlert(form);
    
    const alert = document.createElement('div');
    alert.className = `form-alert ${type}`;
    alert.textContent = message;
    
    form.insertBefore(alert, form.firstChild);
    
    // Прокрутить к сообщению
    alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Удалить сообщение из формы
function removeFormAlert(form) {
    const existingAlert = form.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
}

// Функция showNotification теперь определена в toast.js
