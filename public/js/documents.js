// Переключение между документами

document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.documents-menu-item');
    const documentCards = document.querySelectorAll('.document-card');
    const sidebar = document.querySelector('.documents-sidebar');
    const pageTitle = document.querySelector('.page-title');
    
    // Функция для управления drawer меню на мобильных
    function initMobileDrawer() {
        if (window.innerWidth <= 768 && sidebar && pageTitle) {
            // Создаем overlay если его нет
            let overlay = document.querySelector('.documents-drawer-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'documents-drawer-overlay';
                document.body.appendChild(overlay);
            }
            
            // Клик по заголовку для открытия/закрытия
            pageTitle.addEventListener('click', function(e) {
                e.stopPropagation();
                const isActive = sidebar.classList.toggle('active');
                overlay.classList.toggle('active', isActive);
                document.body.style.overflow = isActive ? 'hidden' : '';
            });
            
            // Закрытие drawer при выборе документа
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    if (window.innerWidth <= 768) {
                        setTimeout(() => {
                            sidebar.classList.remove('active');
                            overlay.classList.remove('active');
                            document.body.style.overflow = '';
                        }, 300);
                    }
                });
            });
            
            // Закрытие при клике на overlay
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
    
    // Инициализация drawer
    initMobileDrawer();
    
    // Переинициализация при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
                const overlay = document.querySelector('.documents-drawer-overlay');
                if (overlay) {
                    overlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // Обработка клика по пункту меню
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const docId = this.getAttribute('data-doc');
            
            // Убираем активный класс со всех пунктов меню
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            
            // Добавляем активный класс к текущему пункту
            this.classList.add('active');
            
            // Скрываем все документы
            documentCards.forEach(card => {
                card.classList.remove('active');
            });
            
            // Показываем выбранный документ
            const targetDoc = document.getElementById(docId);
            if (targetDoc) {
                targetDoc.classList.add('active');
                
                // Небольшая задержка для прокрутки после отображения
                setTimeout(() => {
                    scrollToElement(targetDoc);
                }, 50);
            }
        });
    });

    // Функция для прокрутки к элементу с учетом header
    function scrollToElement(element) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 100;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 100; 
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Функция для активации документа по хэшу
    function activateDocumentByHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetMenuItem = document.querySelector(`[data-doc="${hash}"]`);
            if (targetMenuItem) {
                // Убираем активный класс со всех пунктов меню
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove('active');
                });
                
                // Добавляем активный класс к целевому пункту
                targetMenuItem.classList.add('active');
                
                // Скрываем все документы
                documentCards.forEach(card => {
                    card.classList.remove('active');
                });
                
                // Показываем выбранный документ
                const targetDoc = document.getElementById(hash);
                if (targetDoc) {
                    targetDoc.classList.add('active');
                    
                    // Небольшая задержка для прокрутки после загрузки и отображения
                    setTimeout(() => {
                        scrollToElement(targetDoc);
                    }, 150);
                }
            }
        }
    }
    
    // Обработка хэша в URL при загрузке страницы
    activateDocumentByHash();
    
    // Обработка изменения хэша (например, при использовании кнопки "Назад")
    window.addEventListener('hashchange', activateDocumentByHash);

    // Обновление хэша при переключении документов
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const docId = this.getAttribute('data-doc');
            window.location.hash = docId;
        });
    });
});


function downloadRequisites() {
    const requisitesText = `
РЕКВИЗИТЫ КОМПАНИИ
ООО "A2B"

═══════════════════════════════════════════════════════════

ОБЩАЯ ИНФОРМАЦИЯ
═══════════════════════════════════════════════════════════

Полное наименование:
    Общество с ограниченной ответственностью "A2B"

Сокращенное наименование:
    ООО "A2B"

ИНН:                7729123456
КПП:                772901001
ОГРН:               1127746123456
ОКПО:               12345678

═══════════════════════════════════════════════════════════

ЮРИДИЧЕСКИЙ АДРЕС
═══════════════════════════════════════════════════════════

119454, г. Москва, пр-т Вернадского д.29, БЦ «Лето», офис 804Б

═══════════════════════════════════════════════════════════

БАНКОВСКИЕ РЕКВИЗИТЫ
═══════════════════════════════════════════════════════════

Расчетный счет:     40702810400000123456
Банк:               ПАО "Сбербанк России"
Корр. счет:         30101810400000000225
БИК:                044525225

═══════════════════════════════════════════════════════════

КОНТАКТНАЯ ИНФОРМАЦИЯ
═══════════════════════════════════════════════════════════

Телефон:            +7 (499) 460-17-40
Email:              a2b@mail.ru
Сайт:               a2b-logistics.ru

═══════════════════════════════════════════════════════════

РУКОВОДСТВО
═══════════════════════════════════════════════════════════

Генеральный директор:   Адоньев Никита Дмитриевич
Действует на основании: Устава

═══════════════════════════════════════════════════════════

Документ актуален на: ${new Date().toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
})}
`;


    const blob = new Blob([requisitesText], { type: 'text/plain;charset=utf-8' });
    

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Реквизиты_A2B.txt';
    

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    

    URL.revokeObjectURL(link.href);
    

    if (typeof showToast === 'function') {
        showToast('Реквизиты успешно скачаны', 'success');
    }
}
