// Загрузка хедера
async function loadHeader() {
    try {
        // Добавляем timestamp для обхода кеша
        const response = await fetch('components/header.html?v=' + Date.now());
        if (!response.ok) {
            throw new Error('Не удалось загрузить хедер');
        }
        const html = await response.text();
        console.log('Загружен HTML, длина:', html.length);
        console.log('Количество nav-item в HTML:', (html.match(/class="nav-item/g) || []).length);
        
        const headerPlaceholder = document.getElementById('header-placeholder');
        
        if (headerPlaceholder) {
            // Просто заменяем placeholder на загруженный HTML
            headerPlaceholder.outerHTML = html.trim();
            // Инициализируем функционал после обновления DOM
            requestAnimationFrame(() => {
                const navItems = document.querySelectorAll('.nav-item');
                console.log('Элементов nav-item в DOM:', navItems.length);
                initHeader();
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки хедера:', error);
    }
}

// Загрузка модального окна авторизации
async function loadAuthModal() {
    try {
        const response = await fetch('components/auth-modal.html?v=' + Date.now());
        if (!response.ok) {
            throw new Error('Не удалось загрузить модальное окно авторизации');
        }
        const html = await response.text();
        const authModalPlaceholder = document.getElementById('auth-modal-placeholder');
        
        if (authModalPlaceholder) {
            authModalPlaceholder.outerHTML = html.trim();
            // Отправляем событие что модальное окно загружено
            window.dispatchEvent(new Event('authModalLoaded'));
        }
    } catch (error) {
        console.error('Ошибка загрузки модального окна авторизации:', error);
    }
}

// Флаг для отслеживания инициализации
let headerInitialized = false;

// Инициализация функционала хедера
function initHeader() {
    if (headerInitialized) return;
    headerInitialized = true;

    // Закрытие dropdown при клике вне меню
    document.addEventListener('click', function(event) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                }
            }
        });
    });

    // Предотвращение закрытия при клике внутри dropdown
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Обработчики для кнопок в хедере
    const callButton = document.querySelector('.btn-outline');
    const orderButton = document.querySelector('.btn-solid');
    const userIcon = document.querySelector('.user-icon');
    
    console.log('Найдены элементы:', {
        callButton: !!callButton,
        orderButton: !!orderButton,
        userIcon: !!userIcon
    });
    
    if (callButton) {
        callButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по кнопке "Заказать звонок"');
            window.location.href = 'tel:+74994601740';
        });
    }
    
    if (orderButton) {
        orderButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по кнопке "Оставить заявку"');
            // Открываем модальное окно заказа
            if (typeof openOrderModal === 'function') {
                openOrderModal();
            } else {
                console.error('Функция openOrderModal не найдена!');
            }
        });
    }
    
    if (userIcon) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по иконке пользователя');
            // Открываем модальное окно авторизации
            if (typeof openAuthModal === 'function') {
                openAuthModal();
            } else {
                console.error('Функция openAuthModal не найдена!');
            }
        });
    }
}

// Загружаем хедер и модальное окно при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadHeader();
        loadAuthModal();
        checkLogo();
    });
} else {
    loadHeader();
    loadAuthModal();
    setTimeout(checkLogo, 500);
}

// Проверка загрузки логотипа
function checkLogo() {
    const logoImg = document.querySelector('.logo-img');
    const logoFallback = document.querySelector('.logo-text-fallback');
    
    if (logoImg && logoFallback) {
        logoImg.addEventListener('error', function() {
            console.error('Логотип не загрузился, показываем текст');
            logoImg.style.display = 'none';
            logoFallback.style.display = 'block';
        });
        
        // Проверяем загрузился ли уже
        if (!logoImg.complete || logoImg.naturalHeight === 0) {
            console.warn('Логотип не загружен, показываем текст');
            logoImg.style.display = 'none';
            logoFallback.style.display = 'block';
        }
    }
}

