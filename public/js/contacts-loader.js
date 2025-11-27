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
            requestAnimationFrame(() => {
                initContactForm();
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки секции контактов:', error);
    }
}

// Инициализация формы контактов
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form && !form.dataset.initialized) {
        form.dataset.initialized = 'true';
        
        // Здесь можно добавить обработчик отправки формы
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: form.name.value,
                phone: form.phone.value,
                email: form.email.value,
                message: form.message.value
            };
            
            try {
                const response = await fetch('/api/contacts/create.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
                    form.reset();
                } else {
                    alert('Произошла ошибка при отправке сообщения');
                }
            } catch (error) {
                alert('Ошибка соединения с сервером');
            }
        });
    }
}

// Загружаем контакты при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContacts);
} else {
    loadContacts();
}
