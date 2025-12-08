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

    // Обработка dropdown меню для десктопа
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Для десктопа - работает на hover через CSS
        // Для мобильных - работает на клик через класс active
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 992 && menu) {
                // Убираем inline стили чтобы работал CSS hover
                menu.style.opacity = '';
                menu.style.visibility = '';
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 992 && menu) {
                // Убираем inline стили чтобы работал CSS hover
                menu.style.opacity = '';
                menu.style.visibility = '';
            }
        });
    });

    // Обработчики для кнопок в хедере
    const callButton = document.querySelector('.btn-outline');
    const orderButton = document.querySelector('.btn-primary');
    const userBtn = document.querySelector('.user-btn');
    const contactsLink = document.getElementById('contacts-link');
    
    console.log('Найдены элементы:', {
        callButton: !!callButton,
        orderButton: !!orderButton,
        userBtn: !!userBtn,
        contactsLink: !!contactsLink
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
    
    if (userBtn) {
        userBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по кнопке пользователя');
            // Открываем модальное окно авторизации
            if (typeof openAuthModal === 'function') {
                openAuthModal();
            } else {
                console.error('Функция openAuthModal не найдена!');
            }
        });
    }

    // Обработчик для кнопки "Контакты"
    if (contactsLink) {
        contactsLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по кнопке "Контакты"');
            
            // Ищем заголовок "Связаться с нами" на текущей странице
            const contactsTitle = Array.from(document.querySelectorAll('h2')).find(
                h2 => h2.textContent.trim() === 'Связаться с нами'
            );
            
            if (contactsTitle) {
                // Если заголовок найден, плавно прокручиваем к нему
                contactsTitle.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            } else {
                // Если заголовка нет, перенаправляем на главную страницу с якорем
                window.location.href = 'index.html#contacts';
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
    const logoText = document.querySelector('.logo-text');
    
    if (logoImg && logoText) {
        logoImg.addEventListener('error', function() {
            console.error('Логотип не загрузился, показываем текст');
            logoImg.style.display = 'none';
            logoText.style.display = 'block';
        });
        
        // Проверяем загрузился ли уже
        if (!logoImg.complete || logoImg.naturalHeight === 0) {
            console.warn('Логотип не загружен, показываем текст');
            logoImg.style.display = 'none';
            logoText.style.display = 'block';
        }
    }
}



// Флаг инициализации бургер-меню
let burgerInitialized = false;

// Бургер-меню
function initBurgerMenu() {
    if (burgerInitialized) return;
    
    const burgerMenu = document.getElementById('burgerMenu');
    const headerNav = document.getElementById('headerNav');
    
    if (!burgerMenu || !headerNav) return;
    
    burgerInitialized = true;
    
    burgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        headerNav.classList.toggle('active');
        document.body.style.overflow = this.classList.contains('active') ? 'hidden' : '';
    });
    
    // Закрытие меню при клике вне его (только для мобильных)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            if (!e.target.closest('.header-nav') && !e.target.closest('.burger-menu')) {
                burgerMenu.classList.remove('active');
                headerNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Обработка dropdown в мобильном меню
    const dropdowns = document.querySelectorAll('.header-nav .dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        if (!link.dataset.listenerAdded) {
            link.dataset.listenerAdded = 'true';
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Закрываем все другие dropdown
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Переключаем текущий dropdown
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Закрытие меню при клике на обычные ссылки (не dropdown)
    const regularLinks = document.querySelectorAll('.header-nav .nav-item:not(.dropdown) .nav-link, .dropdown-link');
    regularLinks.forEach(link => {
        if (!link.dataset.closeListenerAdded) {
            link.dataset.closeListenerAdded = 'true';
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    burgerMenu.classList.remove('active');
                    headerNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });
    
    // Закрытие меню при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 992) {
                burgerMenu.classList.remove('active');
                headerNav.classList.remove('active');
                document.body.style.overflow = '';
                
                // Убираем inline стили у dropdown меню
                const dropdownMenus = document.querySelectorAll('.dropdown-menu');
                dropdownMenus.forEach(menu => {
                    menu.style.opacity = '';
                    menu.style.visibility = '';
                });
            }
        }, 250);
    });
}

// Инициализация бургер-меню после загрузки header
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initBurgerMenu, 200);
    });
} else {
    setTimeout(initBurgerMenu, 200);
}
