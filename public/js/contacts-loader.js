// Загрузка секции контактов
async function loadContacts() {
    try {
        const response = await fetch('components/contacts.html?v=' + Date.now());
        if (!response.ok) {
            throw new Error('Не удалось загрузить секцию контактов');
        }
        const html = await response.text();
        
        const contactsPlaceholder = document.getElementById('contacts-placeholder');
        
        if (contactsPlaceholder) {
            contactsPlaceholder.outerHTML = html.trim();
            
            // После загрузки инициализируем обработчик формы
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    initContactForm();
                    resolve();
                });
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки секции контактов:', error);
    }
}

// Инициализация формы контактов
function initContactForm() {

    highlightCurrentDay();
}

// Функция для выделения текущего дня недели
function highlightCurrentDay() {
    const today = new Date().getDay(); // 0 = воскресенье, 1 = понедельник, и т.д.
    const scheduleDays = document.querySelectorAll('.schedule-day');
    
    console.log('Выделение текущего дня недели. Сегодня:', today);
    console.log('Найдено дней:', scheduleDays.length);
    
    scheduleDays.forEach(day => {
        const dayNumber = parseInt(day.getAttribute('data-day'));
        console.log('Проверка дня:', dayNumber, 'Сегодня:', today, 'Совпадает:', dayNumber === today);
        if (dayNumber === today) {
            day.classList.add('active');
            console.log('День', dayNumber, 'выделен как активный');
        }
    });
}

// Функция для прокрутки к заголовку "Связаться с нами", если есть якорь в URL
function scrollToContactsIfNeeded() {
    if (window.location.hash === '#contacts') {
        // Небольшая задержка, чтобы секция успела загрузиться
        setTimeout(() => {
            // Ищем заголовок "Связаться с нами"
            const contactsTitle = Array.from(document.querySelectorAll('h2')).find(
                h2 => h2.textContent.trim() === 'Связаться с нами'
            );
            
            if (contactsTitle) {
                contactsTitle.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 500);
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadContacts().then(() => {
            scrollToContactsIfNeeded();
        });
    });
} else {
    loadContacts().then(() => {
        scrollToContactsIfNeeded();
    });
}
