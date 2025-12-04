// Переключение между документами

document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.documents-menu-item');
    const documentCards = document.querySelectorAll('.document-card');

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
                
                // Плавная прокрутка к началу документа
                targetDoc.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

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
                    
                    // Небольшая задержка для плавной прокрутки после загрузки
                    setTimeout(() => {
                        targetDoc.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
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

// Функция для скачивания реквизитов
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

    // Создаем Blob с текстом
    const blob = new Blob([requisitesText], { type: 'text/plain;charset=utf-8' });
    
    // Создаем ссылку для скачивания
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Реквизиты_A2B.txt';
    
    // Добавляем ссылку в документ, кликаем и удаляем
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Освобождаем память
    URL.revokeObjectURL(link.href);
    
    // Показываем уведомление
    if (typeof showToast === 'function') {
        showToast('Реквизиты успешно скачаны', 'success');
    }
}
