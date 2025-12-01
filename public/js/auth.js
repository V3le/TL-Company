// Система авторизации и регистрации
let registrationData = {};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkUserSession();
    // Ждем загрузки модального окна
    setTimeout(() => {
        initAuthModal();
        initPasswordToggle();
        initPasswordStrength();
        initFormValidation();
    }, 200);
});

// Проверка сессии пользователя
async function checkUserSession() {
    try {
        const response = await fetch('/api/auth/check-session.php');
        const data = await response.json();
        
        if (data.success) {
            updateUserUI(data.user);
        } else {
            updateUserUI(null);
        }
    } catch (error) {
        console.error('Ошибка проверки сессии:', error);
        updateUserUI(null);
    }
}

// Обновление UI пользователя
function updateUserUI(user) {
    const userIconWrapper = document.querySelector('.user-icon-wrapper');
    
    if (user) {
        // Сохраняем данные пользователя в localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Пользователь авторизован
        const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || user.username[0]);
        userIconWrapper.innerHTML = `
            <div class="user-icon" onclick="toggleUserDropdown()">
                ${initials.toUpperCase()}
            </div>
            <div class="user-dropdown" id="userDropdown">
                <div class="user-dropdown-item" style="font-weight: 600; pointer-events: none;">
                    ${user.first_name || user.username}
                </div>
                <div class="user-dropdown-divider"></div>
                <a href="#" class="user-dropdown-item">Профиль</a>
                <a href="#" class="user-dropdown-item">Настройки</a>
                <div class="user-dropdown-divider"></div>
                <div class="user-dropdown-item" onclick="logout()">Выйти</div>
            </div>
        `;
        
        // Автозаполнение форм
        autofillForms(user);
    } else {
        // Удаляем данные пользователя из localStorage
        localStorage.removeItem('currentUser');
        
        // Пользователь не авторизован
        userIconWrapper.innerHTML = `
            <div class="user-icon" onclick="openAuthModal()">
                👤
            </div>
        `;
    }
}

// Автозаполнение форм данными пользователя
function autofillForms(user) {
    // Формируем полное имя
    const fullName = [user.last_name, user.first_name, user.middle_name]
        .filter(Boolean)
        .join(' ');
    
    // Автозаполнение формы контактов
    const contactName = document.getElementById('name');
    const contactPhone = document.getElementById('phone');
    const contactEmail = document.getElementById('email');
    
    if (contactName && !contactName.value) contactName.value = fullName;
    if (contactPhone && !contactPhone.value && user.phone) contactPhone.value = user.phone;
    if (contactEmail && !contactEmail.value && user.email) contactEmail.value = user.email;
    
    // Автозаполнение модального окна заказа
    const orderName = document.getElementById('orderName');
    const orderPhone = document.getElementById('orderPhone');
    const orderEmail = document.getElementById('orderEmail');
    
    if (orderName && !orderName.value) orderName.value = fullName;
    if (orderPhone && !orderPhone.value && user.phone) orderPhone.value = user.phone;
    if (orderEmail && !orderEmail.value && user.email) orderEmail.value = user.email;
}

// Получение данных текущего пользователя
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Переключение выпадающего меню пользователя
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
    
    // Закрытие при клике вне меню
    document.addEventListener('click', function closeDropdown(e) {
        if (!e.target.closest('.user-icon-wrapper')) {
            dropdown.classList.remove('active');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

// Выход из системы
async function logout() {
    try {
        const response = await fetch('/api/auth/logout.php');
        const data = await response.json();
        
        if (data.success) {
            updateUserUI(null);
            showNotification('Вы успешно вышли из системы', 'success');
        }
    } catch (error) {
        console.error('Ошибка выхода:', error);
        showNotification('Ошибка при выходе', 'error');
    }
}

// Инициализация модального окна
function initAuthModal() {
    const modal = document.getElementById('authModal');
    
    if (!modal) {
        setTimeout(initAuthModal, 100);
        return;
    }
    
    // Закрытие по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAuthModal();
        }
    });
    
    // Закрытие по кнопке
    const closeBtn = document.querySelector('.auth-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeAuthModal();
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeAuthModal();
        }
    });
    
    // Обработка формы входа
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Обработка формы регистрации - шаг 1
    const regForm1 = document.getElementById('registerFormStep1');
    if (regForm1) {
        regForm1.addEventListener('submit', handleRegisterStep1);
    }
    
    // Обработка формы регистрации - шаг 2
    const regForm2 = document.getElementById('registerFormStep2Element');
    if (regForm2) {
        regForm2.addEventListener('submit', handleRegisterStep2);
    }
}

// Открытие модального окна
function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) {
        return;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) {
        return;
    }
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Сброс форм
    setTimeout(() => {
        switchToLogin();
        resetForms();
    }, 300);
}

// Переключение на форму входа
function switchToLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('registerFormStep2').classList.remove('active');
}

// Переключение на форму регистрации
function switchToRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('registerFormStep2').classList.remove('active');
}

// Переход к шагу 2 регистрации
function goToStep2() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('registerFormStep2').classList.add('active');
}

// Возврат к шагу 1 регистрации
function backToStep1() {
    document.getElementById('registerFormStep2').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
}

// Сброс форм
function resetForms() {
    const loginForm = document.getElementById('loginFormElement');
    const regForm1 = document.getElementById('registerFormStep1');
    const regForm2 = document.getElementById('registerFormStep2Element');
    
    if (loginForm) loginForm.reset();
    if (regForm1) regForm1.reset();
    if (regForm2) regForm2.reset();
    
    registrationData = {};
    
    // Сброс индикаторов валидации
    document.querySelectorAll('.auth-input-group input').forEach(input => {
        input.classList.remove('error', 'success');
    });
    document.querySelectorAll('.auth-validation-message').forEach(msg => {
        msg.classList.remove('show');
    });
    
    // Скрываем поле подтверждения пароля
    const confirmGroup = document.getElementById('confirmPasswordGroup');
    const passwordMatchValidation = document.getElementById('passwordMatchValidation');
    if (confirmGroup) {
        confirmGroup.style.display = 'none';
    }
    if (passwordMatchValidation) {
        passwordMatchValidation.style.display = 'none';
    }
    
    // Сброс индикатора надёжности пароля
    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthText = document.getElementById('passwordStrengthText');
    if (strengthFill) {
        strengthFill.className = 'password-strength-fill';
    }
    if (strengthText) {
        strengthText.textContent = 'Слабый';
        strengthText.className = 'password-strength-text';
    }
}

// Обработка входа
async function handleLogin(e) {
    e.preventDefault();
    
    const login = document.getElementById('loginInput').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!login || !password) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Вход выполнен успешно!', 'success');
            updateUserUI(data.user);
            closeAuthModal();
        } else {
            showNotification(data.message || 'Ошибка входа', 'error');
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Обработка регистрации - шаг 1
async function handleRegisterStep1(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    
    // Валидация
    if (!username || !email || !password || !passwordConfirm) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    if (password !== passwordConfirm) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Пароль должен быть не менее 6 символов', 'error');
        return;
    }
    
    // Проверка существования username
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
        showNotification('Этот логин уже занят', 'error');
        return;
    }
    
    // Проверка существования email
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
        showNotification('Этот email уже используется', 'error');
        return;
    }
    
    // Сохранение данных и переход к шагу 2
    registrationData = { username, email, password };
    goToStep2();
}

// Обработка регистрации - шаг 2
async function handleRegisterStep2(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const middleName = document.getElementById('regMiddleName').value.trim();
    const birthDate = document.getElementById('regBirthDate').value;
    const phone = document.getElementById('regPhone').value.trim();
    const city = document.getElementById('regCity').value.trim();
    
    if (!firstName || !lastName || !birthDate || !phone || !city) {
        showNotification('Заполните все обязательные поля', 'error');
        return;
    }
    
    // Объединение данных
    const userData = {
        ...registrationData,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        birth_date: birthDate,
        phone: phone,
        city: city
    };
    
    try {
        const response = await fetch('/api/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Регистрация успешна! Добро пожаловать!', 'success');
            updateUserUI(data.user);
            closeAuthModal();
        } else {
            showNotification(data.message || 'Ошибка регистрации', 'error');
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Проверка существования username
async function checkUsernameExists(username) {
    try {
        const response = await fetch('/api/auth/check-username.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error('Ошибка проверки username:', error);
        return false;
    }
}

// Проверка существования email
async function checkEmailExists(email) {
    try {
        const response = await fetch('/api/auth/check-email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error('Ошибка проверки email:', error);
        return false;
    }
}

// Инициализация переключателя видимости пароля
function initPasswordToggle() {
    setTimeout(() => {
        document.querySelectorAll('.auth-toggle-password').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const inputGroup = this.closest('.auth-input-group');
                const input = inputGroup.querySelector('input[type="password"], input[type="text"]');
                if (input) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        // Иконка "скрыть" (перечеркнутый глаз)
                        this.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>`;
                    } else {
                        input.type = 'password';
                        // Иконка "показать" (открытый глаз)
                        this.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>`;
                    }
                }
            });
        });
    }, 100);
}

// Инициализация индикатора надёжности пароля
function initPasswordStrength() {
    // Используем setTimeout чтобы дождаться загрузки модального окна
    setTimeout(() => {
        const passwordInput = document.getElementById('regPassword');
        const confirmGroup = document.getElementById('confirmPasswordGroup');
        const passwordMatchValidation = document.getElementById('passwordMatchValidation');
        
        if (!passwordInput) return;
        
        // Скрываем поле подтверждения пароля изначально
        if (confirmGroup) {
            confirmGroup.style.display = 'none';
        }
        if (passwordMatchValidation) {
            passwordMatchValidation.style.display = 'none';
        }
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthFill = document.getElementById('passwordStrengthFill');
            const strengthText = document.getElementById('passwordStrengthText');
            const passwordConfirmInput = document.getElementById('regPasswordConfirm');
            
            // Показываем поле подтверждения только если пароль введён
            if (confirmGroup && passwordMatchValidation) {
                if (password.length > 0) {
                    confirmGroup.style.display = 'block';
                    passwordMatchValidation.style.display = 'block';
                } else {
                    confirmGroup.style.display = 'none';
                    passwordMatchValidation.style.display = 'none';
                    if (passwordConfirmInput) passwordConfirmInput.value = '';
                }
            }
            
            if (!password) {
                if (strengthFill) {
                    strengthFill.className = 'password-strength-fill';
                }
                if (strengthText) {
                    strengthText.textContent = 'Слабый';
                    strengthText.className = 'password-strength-text';
                }
                return;
            }
            
            let strength = 0;
            
            // Длина
            if (password.length >= 6) strength++;
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            
            // Содержит цифры
            if (/\d/.test(password)) strength++;
            
            // Содержит буквы разного регистра
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
            
            // Содержит спецсимволы
            if (/[^a-zA-Z0-9]/.test(password)) strength++;
            
            // Обновление UI
            if (strengthFill && strengthText) {
                if (strength <= 2) {
                    strengthFill.className = 'password-strength-fill weak';
                    strengthText.textContent = 'Слабый';
                    strengthText.className = 'password-strength-text weak';
                } else if (strength <= 4) {
                    strengthFill.className = 'password-strength-fill medium';
                    strengthText.textContent = 'Средний';
                    strengthText.className = 'password-strength-text medium';
                } else {
                    strengthFill.className = 'password-strength-fill strong';
                    strengthText.textContent = 'Надёжный';
                    strengthText.className = 'password-strength-text strong';
                }
            }
        });
    }, 100);
}

// Инициализация валидации форм
function initFormValidation() {
    // Используем setTimeout чтобы дождаться загрузки модального окна
    setTimeout(() => {
        // Валидация username
        const usernameInput = document.getElementById('regUsername');
        if (usernameInput) {
            let usernameTimeout;
            usernameInput.addEventListener('input', function() {
                clearTimeout(usernameTimeout);
                const value = this.value.trim();
                
                if (value.length < 3) {
                    this.classList.remove('success');
                    this.classList.add('error');
                    showValidationMessage('usernameValidation', 'Минимум 3 символа');
                    return;
                }
                
                usernameTimeout = setTimeout(async () => {
                    const exists = await checkUsernameExists(value);
                    if (exists) {
                        this.classList.remove('success');
                        this.classList.add('error');
                        showValidationMessage('usernameValidation', 'Этот логин уже занят');
                    } else {
                        this.classList.remove('error');
                        this.classList.add('success');
                        hideValidationMessage('usernameValidation');
                    }
                }, 500);
            });
        }
        
        // Валидация email
        const emailInput = document.getElementById('regEmail');
        if (emailInput) {
            let emailTimeout;
            emailInput.addEventListener('input', function() {
                clearTimeout(emailTimeout);
                const value = this.value.trim();
                
                if (!value) {
                    this.classList.remove('success', 'error');
                    hideValidationMessage('emailValidation');
                    return;
                }
                
                if (!isValidEmail(value)) {
                    this.classList.remove('success');
                    this.classList.add('error');
                    showValidationMessage('emailValidation', 'Некорректный email');
                    return;
                }
                
                emailTimeout = setTimeout(async () => {
                    const exists = await checkEmailExists(value);
                    if (exists) {
                        this.classList.remove('success');
                        this.classList.add('error');
                        showValidationMessage('emailValidation', 'Этот email уже используется');
                    } else {
                        this.classList.remove('error');
                        this.classList.add('success');
                        hideValidationMessage('emailValidation');
                    }
                }, 500);
            });
        }
        
        // Валидация совпадения паролей
        const passwordConfirmInput = document.getElementById('regPasswordConfirm');
        if (passwordConfirmInput) {
            passwordConfirmInput.addEventListener('input', function() {
                const password = document.getElementById('regPassword').value;
                const confirm = this.value;
                
                if (confirm && password !== confirm) {
                    this.classList.remove('success');
                    this.classList.add('error');
                    showValidationMessage('passwordMatchValidation', 'Пароли не совпадают');
                } else if (confirm) {
                    this.classList.remove('error');
                    this.classList.add('success');
                    hideValidationMessage('passwordMatchValidation');
                }
            });
        }
        
        // Маска для телефона
        const phoneInput = document.getElementById('regPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value[0] !== '7') value = '7' + value;
                    if (value.length > 11) value = value.slice(0, 11);
                    
                    let formatted = '+7';
                    if (value.length > 1) formatted += ' (' + value.slice(1, 4);
                    if (value.length > 4) formatted += ') ' + value.slice(4, 7);
                    if (value.length > 7) formatted += '-' + value.slice(7, 9);
                    if (value.length > 9) formatted += '-' + value.slice(9, 11);
                    
                    this.value = formatted;
                }
            });
        }
    }, 100);
}

// Показать сообщение валидации
function showValidationMessage(id, message) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = message;
        element.classList.add('show');
    }
}

// Скрыть сообщение валидации
function hideValidationMessage(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove('show');
    }
}

// Проверка валидности email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Создание элемента уведомления
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type} auth-notification-show`;
    notification.textContent = message;
    
    // Устанавливаем цвет фона в зависимости от типа
    const bgColor = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3';
    notification.style.background = bgColor;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('auth-notification-show');
        notification.classList.add('auth-notification-hide');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавление стилей для уведомлений
const style = document.createElement('style');
style.textContent = `
    .auth-notification {
        position: fixed;
        bottom: 30px;
        left: 50%;
        padding: 16px 24px;
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        z-index: 10001;
        font-size: 15px;
        font-weight: 500;
        min-width: 300px;
        max-width: 500px;
        text-align: center;
        pointer-events: none;
    }
    
    .auth-notification-show {
        animation: slideInUpNotification 0.3s ease forwards;
    }
    
    .auth-notification-hide {
        animation: slideOutDownNotification 0.3s ease forwards;
    }
    
    @keyframes slideInUpNotification {
        from {
            transform: translate(-50%, 20px);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutDownNotification {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, 20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Делаем функции глобальными для доступа из HTML
window.openAuthModal = openAuthModal;
window.switchToLogin = switchToLogin;
window.switchToRegister = switchToRegister;
window.backToStep1 = backToStep1;
window.logout = logout;
window.toggleUserDropdown = toggleUserDropdown;
window.getCurrentUser = getCurrentUser;
window.autofillForms = autofillForms;
