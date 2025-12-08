// Система авторизации и регистрации
let registrationData = {};

// Глобальная функция для открытия модального окна авторизации
function openAuthModal() {
    console.log('openAuthModal вызвана');
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Модальное окно авторизации открыто');
    } else {
        console.error('Модальное окно авторизации не найдено!');
    }
}

// Флаг инициализации модального окна
let authModalInitialized = false;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js: DOMContentLoaded');
    checkUserSession();
    
    // Ждем загрузки модального окна
    const initAuth = () => {
        // Предотвращаем повторную инициализацию
        if (authModalInitialized) {
            console.log('Auth.js: Модальное окно уже инициализировано');
            return;
        }
        
        console.log('Auth.js: Инициализация модального окна');
        const modal = document.getElementById('authModal');
        console.log('Auth.js: Модальное окно найдено:', !!modal);
        
        if (modal) {
            authModalInitialized = true;
            initAuthModal();
            initPasswordToggle();
            initPasswordStrength();
            initFormValidation();
        }
    };
    
    // Пробуем несколько раз с увеличивающейся задержкой
    setTimeout(() => {
        if (document.getElementById('authModal')) {
            console.log('Auth.js: Модальное окно найдено сразу');
            initAuth();
        }
    }, 100);
    
    setTimeout(() => {
        if (document.getElementById('authModal')) {
            console.log('Auth.js: Модальное окно найдено через 300ms');
            initAuth();
        }
    }, 300);
    
    setTimeout(() => {
        if (document.getElementById('authModal')) {
            console.log('Auth.js: Модальное окно найдено через 600ms');
            initAuth();
        }
    }, 600);
    
    // Ждем события загрузки модального окна
    window.addEventListener('authModalLoaded', () => {
        console.log('Auth.js: Получено событие authModalLoaded');
        initAuth();
    });
});

// Проверка сессии пользователя
async function checkUserSession() {
    try {
        const response = await fetch('/api/auth/check-session.php', {
            credentials: 'include' // Важно для отправки cookies
        });
        const data = await response.json();
        
        if (data.success) {
            updateUserUI(data.user);
        } else {
            // Если сессия истекла, очищаем localStorage
            localStorage.removeItem('currentUser');
            updateUserUI(null);
        }
    } catch (error) {
        console.error('Ошибка проверки сессии:', error);
        localStorage.removeItem('currentUser');
        updateUserUI(null);
    }
}

// Периодическая проверка сессии (каждые 5 минут)
setInterval(checkUserSession, 5 * 60 * 1000);

// Обновление UI пользователя
function updateUserUI(user) {
    const userIconWrapper = document.querySelector('.user-icon-wrapper');
    
    if (!userIconWrapper) {
        console.error('user-icon-wrapper не найден!');
        return;
    }
    
    if (user) {
        // Сохраняем данные пользователя в localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Пользователь авторизован
        const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || user.username[0]);
        userIconWrapper.innerHTML = `
            <button class="user-btn user-btn-logged" onclick="toggleUserDropdown()">
                <span class="user-initials">${initials.toUpperCase()}</span>
            </button>
            <div class="user-dropdown" id="userDropdown">
                <div class="user-dropdown-item" style="font-weight: 600; pointer-events: none;">
                    ${user.first_name || user.username}
                </div>
                <div class="user-dropdown-divider"></div>
                <a href="my-requests.html" class="user-dropdown-item">Личный кабинет</a>
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
            <button class="user-btn" onclick="openAuthModal()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>
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
        const response = await fetch('/api/auth/logout.php', {
            credentials: 'include' // Важно для cookies
        });
        const data = await response.json();
        
        if (data.success) {
            localStorage.removeItem('currentUser');
            updateUserUI(null);
            showNotification('Вы успешно вышли из системы', 'success');
            
            // Перенаправляем на главную, если находимся в личном кабинете
            if (window.location.pathname.includes('my-requests')) {
                window.location.href = '/';
            }
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
    console.log('openAuthModal вызвана');
    
    // Проверяем, залогинен ли пользователь
    const currentUser = getCurrentUser();
    if (currentUser) {
        console.log('Пользователь уже залогинен, модалка не открывается');
        return;
    }
    
    const modal = document.getElementById('authModal');
    console.log('Модальное окно:', modal);
    
    if (!modal) {
        console.error('Модальное окно авторизации не найдено!');
        console.log('Доступные элементы с id:', 
            Array.from(document.querySelectorAll('[id]')).map(el => el.id)
        );
        return;
    }
    
    console.log('Открываем модальное окно');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Делаем функцию глобально доступной
window.openAuthModal = openAuthModal;
console.log('window.openAuthModal установлена:', typeof window.openAuthModal);

// Закрытие модального окна
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) {
        console.error('Модальное окно авторизации не найдено!');
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

// Флаг для предотвращения двойной отправки
let isLoggingIn = false;

// Обработка входа
async function handleLogin(e) {
    e.preventDefault();
    
    // Предотвращаем двойную отправку
    if (isLoggingIn) {
        console.log('Вход уже выполняется, пропускаем');
        return;
    }
    
    const login = document.getElementById('loginInput').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    if (!login || !password) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    isLoggingIn = true;
    
    try {
        const response = await fetch('/api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Важно для cookies
            body: JSON.stringify({ login, password, remember_me: rememberMe })
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
    } finally {
        isLoggingIn = false;
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
            credentials: 'include', // Важно для cookies
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
    const modal = document.getElementById('authModal');
    if (!modal) return;
    
    // Функция для добавления глазика к полю
    const addToggleButton = (input) => {
        const inputGroup = input.closest('.auth-input-group');
        if (!inputGroup) return;
        
        // Проверяем, не добавлена ли уже кнопка
        if (inputGroup.querySelector('.auth-toggle-password')) return;
        
        // Помечаем поле как обработанное
        input.dataset.toggleAdded = 'true';
        
        // Создаем кнопку
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'auth-toggle-password';
        toggleBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>`;
        

        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>`;
            } else {
                input.type = 'password';
                this.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>`;
            }
        });
        
        inputGroup.appendChild(toggleBtn);
    };
    

    modal.querySelectorAll('input[type="password"]').forEach(addToggleButton);
    

    const observer = new MutationObserver(() => {
        modal.querySelectorAll('input[type="password"]:not([data-toggle-added])').forEach(addToggleButton);
    });
    
    observer.observe(modal, { childList: true, subtree: true });
}

// Функция проверки совпадения паролей
function checkPasswordMatch() {
    const passwordInput = document.getElementById('regPassword');
    const confirmInput = document.getElementById('regPasswordConfirm');
    
    if (!passwordInput || !confirmInput) return;
    
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
    // Если поле подтверждения пустое - убираем все индикаторы
    if (!confirm || confirm.length === 0) {
        confirmInput.classList.remove('success', 'error');
        hideValidationMessage('passwordMatchValidation');
        return;
    }
    
    // Если пароли совпадают 
    if (password === confirm) {
        confirmInput.classList.remove('error');
        confirmInput.classList.add('success');
        hideValidationMessage('passwordMatchValidation');
    } 
    // Если не совпадают 
    else {
        confirmInput.classList.remove('success');
        confirmInput.classList.add('error');
        showValidationMessage('passwordMatchValidation', 'Пароли не совпадают');
    }
}

// Инициализация индикатора надёжности пароля
function initPasswordStrength() {
    setTimeout(() => {
        const passwordInput = document.getElementById('regPassword');
        const confirmGroup = document.getElementById('confirmPasswordGroup');
        const passwordMatchValidation = document.getElementById('passwordMatchValidation');
        const strengthBlock = document.querySelector('.password-strength');
        
        if (!passwordInput) return;
        

        if (confirmGroup) confirmGroup.style.display = 'none';
        if (passwordMatchValidation) passwordMatchValidation.style.display = 'none';
        if (strengthBlock) strengthBlock.style.display = 'none';
        

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthFill = document.getElementById('passwordStrengthFill');
            const strengthText = document.getElementById('passwordStrengthText');
            const passwordConfirmInput = document.getElementById('regPasswordConfirm');
            

            if (password.length > 0) {
                if (confirmGroup) confirmGroup.style.display = 'block';
                if (passwordMatchValidation) passwordMatchValidation.style.display = 'block';
                if (strengthBlock) strengthBlock.style.display = 'block';
                
              
                setTimeout(() => {
                    const confirmInput = document.getElementById('regPasswordConfirm');
                    if (confirmInput && !confirmInput.dataset.listenerAdded) {
                        confirmInput.dataset.listenerAdded = 'true';
                        confirmInput.addEventListener('input', checkPasswordMatch);
             
                        checkPasswordMatch();
                    }
                }, 100);
            } else {
                if (confirmGroup) confirmGroup.style.display = 'none';
                if (passwordMatchValidation) passwordMatchValidation.style.display = 'none';
                if (strengthBlock) strengthBlock.style.display = 'none';
                if (passwordConfirmInput) {
                    passwordConfirmInput.value = '';
                    passwordConfirmInput.classList.remove('success', 'error');
                }
                return;
            }
            
            
            checkPasswordMatch();
            
            // Расчет надёжности пароля
            let strength = 0;
            
            if (password.length >= 6) strength++;
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            if (/\d/.test(password)) strength++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
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
    setTimeout(() => {
        // Валидация имени
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
        element.style.display = 'block';
    }
}

// Скрыть сообщение валидации
function hideValidationMessage(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove('show');
        element.style.display = 'none';
    }
}

// Проверка валидности email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



// глобальные функции
window.openAuthModal = openAuthModal;
window.switchToLogin = switchToLogin;
window.switchToRegister = switchToRegister;
window.backToStep1 = backToStep1;
window.logout = logout;
window.toggleUserDropdown = toggleUserDropdown;
window.getCurrentUser = getCurrentUser;
window.autofillForms = autofillForms;


// Делаем функции глобально доступными
window.toggleUserDropdown = toggleUserDropdown;
window.switchToLogin = switchToLogin;
window.switchToRegister = switchToRegister;
window.closeAuthModal = closeAuthModal;



