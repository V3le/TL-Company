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
}

// Загружаем хедер и модальное окно при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadHeader();
        loadAuthModal();
    });
} else {
    loadHeader();
    loadAuthModal();
}

