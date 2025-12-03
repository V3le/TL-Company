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

    // Обработка хэша в URL при загрузке страницы
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetMenuItem = document.querySelector(`[data-doc="${hash}"]`);
        if (targetMenuItem) {
            targetMenuItem.click();
        }
    }

    // Обновление хэша при переключении документов
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const docId = this.getAttribute('data-doc');
            window.location.hash = docId;
        });
    });
});
