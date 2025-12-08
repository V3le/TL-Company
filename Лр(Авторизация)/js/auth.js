// Данные регистрации
let registrationData = {};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    checkUserSession();
    initPasswordToggle();
    initPasswordStrength();
    initFormValidation();
    initForms();
});

// Проверка сессии пользователя
async function checkUserSession() {
    try {
        const response = await fetch('./api/auth/check-session.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            showMainUserProfile(data.user);
        } else {
            showNotAuthorized();
        }
    } catch (error) {
        console.error('Ошибка проверки сессии:', error);
        showNotAuthorized();
    }
}

// Показать состояние "не авторизован"
function showNotAuthorized() {
    document.getElementById('notAuthorized').style.display = 'block';
    document.getElementById('authorized').style.display = 'none';
}

// Показать профиль на главной странице
function showMainUserProfile(user) {
    document.getElementById('notAuthorized').style.display = 'none';
    document.getElementById('authorized').style.display = 'block';
    
    // Инициалы
    const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || user.username[0]);
    document.getElementById('mainUserInitials').textContent = initials.toUpperCase();
    
    // Имя
    const fullName = [user.last_name, user.first_name, user.middle_name]
        .filter(Boolean)
        .join(' ') || user.username;
    document.getElementById('mainUserName').textContent = fullName;
    
    // Email
    document.getElementById('mainUserEmail').textContent = user.email || '-';
    
    // Телефон
    document.getElementById('mainUserPhone').textContent = user.phone || '-';
    
    // Город
    document.getElementById('mainUserCity').textContent = user.city || '-';
}

// Инициализация форм
function initForms() {
    // Форма входа
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Форма регистрации - шаг 1
    const regForm1 = document.getElementById('registerFormStep1');
    if (regForm1) {
        regForm1.addEventListener('submit', handleRegisterStep1);
    }
    
    // Форма регистрации - шаг 2
    const regForm2 = document.getElementById('registerFormStep2Element');
    if (regForm2) {
        regForm2.addEventListener('submit', handleRegisterStep2);
    }
}

// Открытие модального окна
function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) {
        console.error('Модальное окно авторизации не найдено!');
        return;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Закрытие по клику на фон
document.addEventListener('click', function(e) {
    const modal = document.getElementById('authModal');
    if (e.target === modal) {
        closeAuthModal();
    }
});

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('authModal');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeAuthModal();
    }
});

// Переключение форм
function switchToLogin() {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('loginForm').classList.add('active');
}

function switchToRegister() {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('registerForm').classList.add('active');
}

function goToStep2() {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('registerFormStep2').classList.add('active');
}

function backToStep1() {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('registerForm').classList.add('active');
}

// Обработка входа
async function handleLogin(e) {
    e.preventDefault();
    
    const login = document.getElementById('loginInput').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    if (!login || !password) {
        showToast('Заполните все поля', 'error');
        return;
    }
    
    try {
        const response = await fetch('./api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ login, password, remember_me: rememberMe })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Вход выполнен успешно!', 'success');
            closeAuthModal();
            setTimeout(() => {
                showMainUserProfile(data.user);
            }, 500);
        } else {
            showToast(data.message || 'Ошибка входа', 'error');
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        showToast('Ошибка соединения с сервером', 'error');
    }
}

// Обработка регистрации - шаг 1
async function handleRegisterStep1(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    
    if (!username || !email || !password || !passwordConfirm) {
        showToast('Заполните все поля', 'error');
        return;
    }
    
    if (password !== passwordConfirm) {
        showToast('Пароли не совпадают', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Пароль должен быть не менее 6 символов', 'error');
        return;
    }
    
    // Проверка существования username
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
        showToast('Этот логин уже занят', 'error');
        return;
    }
    
    // Проверка существования email
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
        showToast('Этот email уже используется', 'error');
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
    const privacy = document.getElementById('regPrivacy').checked;
    
    if (!firstName || !lastName || !birthDate || !phone || !city) {
        showToast('Заполните все обязательные поля', 'error');
        return;
    }
    
    if (!privacy) {
        showToast('Необходимо согласие с политикой обработки данных', 'error');
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
        const response = await fetch('./api/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Регистрация успешна! Добро пожаловать!', 'success');
            closeAuthModal();
            setTimeout(() => {
                showMainUserProfile(data.user);
            }, 500);
        } else {
            showToast(data.message || 'Ошибка регистрации', 'error');
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        showToast('Ошибка соединения с сервером', 'error');
    }
}

// Проверка существования username
async function checkUsernameExists(username) {
    try {
        const response = await fetch('./api/auth/check-username.php', {
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
        const response = await fetch('./api/auth/check-email.php', {
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



// Выход
async function logout() {
    try {
        const response = await fetch('./api/auth/logout.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            showToast('Вы успешно вышли из системы', 'success');
            setTimeout(() => {
                showNotAuthorized();
            }, 1000);
        }
    } catch (error) {
        console.error('Ошибка выхода:', error);
        showToast('Ошибка при выходе', 'error');
    }
}

// Переключение видимости пароля
function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
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
    });
}

// Индикатор надёжности пароля
function initPasswordStrength() {
    const passwordInput = document.getElementById('regPassword');
    const confirmGroup = document.getElementById('confirmPasswordGroup');
    const strengthBlock = document.querySelector('.password-strength');
    
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length > 0) {
            if (confirmGroup) confirmGroup.style.display = 'block';
            if (strengthBlock) strengthBlock.style.display = 'block';
            
            // Расчет надёжности
            let strength = 0;
            
            if (password.length >= 6) strength++;
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            if (/\d/.test(password)) strength++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;
            
            const strengthFill = document.getElementById('passwordStrengthFill');
            const strengthText = document.getElementById('passwordStrengthText');
            
            if (strengthFill && strengthText) {
                if (strength <= 2) {
                    strengthFill.className = 'strength-fill weak';
                    strengthText.textContent = 'Слабый';
                    strengthText.className = 'strength-text weak';
                } else if (strength <= 4) {
                    strengthFill.className = 'strength-fill medium';
                    strengthText.textContent = 'Средний';
                    strengthText.className = 'strength-text medium';
                } else {
                    strengthFill.className = 'strength-fill strong';
                    strengthText.textContent = 'Надёжный';
                    strengthText.className = 'strength-text strong';
                }
            }
        } else {
            if (confirmGroup) confirmGroup.style.display = 'none';
            if (strengthBlock) strengthBlock.style.display = 'none';
        }
    });
    
    // Проверка совпадения паролей
    const confirmInput = document.getElementById('regPasswordConfirm');
    if (confirmInput) {
        confirmInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirm = this.value;
            const validationMsg = document.getElementById('passwordMatchValidation');
            
            if (confirm.length === 0) {
                this.classList.remove('success', 'error');
                if (validationMsg) validationMsg.classList.remove('show');
                return;
            }
            
            if (password === confirm) {
                this.classList.remove('error');
                this.classList.add('success');
                if (validationMsg) validationMsg.classList.remove('show');
            } else {
                this.classList.remove('success');
                this.classList.add('error');
                if (validationMsg) {
                    validationMsg.textContent = 'Пароли не совпадают';
                    validationMsg.classList.add('show');
                }
            }
        });
    }
}

// Валидация форм
function initFormValidation() {
    // Валидация username
    const usernameInput = document.getElementById('regUsername');
    if (usernameInput) {
        let usernameTimeout;
        usernameInput.addEventListener('input', function() {
            clearTimeout(usernameTimeout);
            const value = this.value.trim();
            const validationMsg = document.getElementById('usernameValidation');
            
            if (value.length < 3) {
                this.classList.remove('success');
                this.classList.add('error');
                if (validationMsg) {
                    validationMsg.textContent = 'Минимум 3 символа';
                    validationMsg.classList.add('show');
                }
                return;
            }
            
            usernameTimeout = setTimeout(async () => {
                const exists = await checkUsernameExists(value);
                if (exists) {
                    this.classList.remove('success');
                    this.classList.add('error');
                    if (validationMsg) {
                        validationMsg.textContent = 'Этот логин уже занят';
                        validationMsg.classList.add('show');
                    }
                } else {
                    this.classList.remove('error');
                    this.classList.add('success');
                    if (validationMsg) validationMsg.classList.remove('show');
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
            const validationMsg = document.getElementById('emailValidation');
            
            if (!value) {
                this.classList.remove('success', 'error');
                if (validationMsg) validationMsg.classList.remove('show');
                return;
            }
            
            if (!isValidEmail(value)) {
                this.classList.remove('success');
                this.classList.add('error');
                if (validationMsg) {
                    validationMsg.textContent = 'Некорректный email';
                    validationMsg.classList.add('show');
                }
                return;
            }
            
            emailTimeout = setTimeout(async () => {
                const exists = await checkEmailExists(value);
                if (exists) {
                    this.classList.remove('success');
                    this.classList.add('error');
                    if (validationMsg) {
                        validationMsg.textContent = 'Этот email уже используется';
                        validationMsg.classList.add('show');
                    }
                } else {
                    this.classList.remove('error');
                    this.classList.add('success');
                    if (validationMsg) validationMsg.classList.remove('show');
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
                if (value.length >= 5) formatted += ') ' + value.slice(4, 7);
                if (value.length >= 8) formatted += '-' + value.slice(7, 9);
                if (value.length >= 10) formatted += '-' + value.slice(9, 11);
                
                this.value = formatted;
            }
        });
    }
}

// Проверка email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Toast уведомления
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
