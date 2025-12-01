// Contact Form Handler
document.addEventListener('DOMContentLoaded', () => {
    // Выделяем текущий день недели
    highlightCurrentDay();
    
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.btn-submit');
    
    // Маска для телефона (определяем раньше)
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
    }
    
    // Автозаполнение формы данными пользователя
    setTimeout(() => {
        const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
        if (currentUser) {
            const fullName = [currentUser.last_name, currentUser.first_name, currentUser.middle_name]
                .filter(Boolean)
                .join(' ');
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            
            if (nameInput && !nameInput.value) nameInput.value = fullName;
            if (emailInput && !emailInput.value && currentUser.email) emailInput.value = currentUser.email;
            
            // Для телефона используем уже отформатированное значение
            if (phoneInput && !phoneInput.value && currentUser.phone) {
                phoneInput.value = currentUser.phone;
            }
        }
    }, 500);
    
    // Функция для выделения текущего дня недели
    function highlightCurrentDay() {
        const today = new Date().getDay(); // 0 = Воскресенье, 1 = Понедельник, и т.д.
        const scheduleDays = document.querySelectorAll('.schedule-day');
        
        scheduleDays.forEach(day => {
            const dayNumber = parseInt(day.getAttribute('data-day'));
            if (dayNumber === today) {
                day.classList.add('active');
            }
        });
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            message: formData.get('message'),
            privacy: formData.get('privacy')
        };
        
        // Валидация
        if (!validateForm(data)) {
            return;
        }
        
        // Отключаем кнопку
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляем...';
        
        try {
            // Отправка на сервер
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
                showMessage('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                form.reset();
            } else {
                showMessage(result.message || 'Произошла ошибка при отправке.', 'error');
            }
            
        } catch (error) {
            console.error('Ошибка:', error);
            showMessage('Произошла ошибка при отправке. Попробуйте еще раз.', 'error');
        } finally {
            // Включаем кнопку обратно
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить';
        }
    });
    
    // Валидация формы
    function validateForm(data) {
        // Удаляем предыдущие сообщения об ошибках
        removeMessage();
        
        if (!data.name.trim()) {
            showMessage('Пожалуйста, введите ваше имя', 'error');
            return false;
        }
        
        if (!data.phone.trim()) {
            showMessage('Пожалуйста, введите номер телефона', 'error');
            return false;
        }
        
        if (!data.privacy) {
            showMessage('Необходимо согласие с политикой обработки данных', 'error');
            return false;
        }
        
        // Валидация email (если заполнен)
        if (data.email && !isValidEmail(data.email)) {
            showMessage('Пожалуйста, введите корректный email', 'error');
            return false;
        }
        
        return true;
    }
    
    // Проверка email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Показать сообщение
    function showMessage(text, type) {
        removeMessage();
        
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        
        form.insertBefore(message, form.firstChild);
        
        // Автоматически скрыть через 5 секунд
        setTimeout(() => {
            removeMessage();
        }, 5000);
    }
    
    // Удалить сообщение
    function removeMessage() {
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
});
