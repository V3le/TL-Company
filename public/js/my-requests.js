// Проверка авторизации при загрузке страницы
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check-session.php', {
            credentials: 'include'
        });
        
        // Если статус не 200, значит не авторизован
        if (!response.ok) {
            console.log('Не авторизован, перенаправление...');
            window.location.href = 'index.html';
            return;
        }
        
        const data = await response.json();
        
        if (!data.success) {
            console.log('Сессия недействительна, перенаправление...');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        window.location.href = 'index.html';
    }
}

// Загрузка заявок
async function loadRequests() {
    try {
        console.log('Загрузка заявок...');
        const response = await fetch('/api/user/get-requests.php', {
            credentials: 'include'
        });
        
        console.log('Статус ответа:', response.status);
        
        if (response.status === 401) {
            console.log('401 - не авторизован');
            window.location.href = 'index.html';
            return;
        }
        
        const data = await response.json();
        console.log('Получены данные:', data);
        
        displayOrders(data.orders);
        displayContacts(data.contacts);
        
    } catch (error) {
        console.error('Ошибка загрузки заявок:', error);
        showError('orders-list', 'Ошибка загрузки данных: ' + error.message);
        showError('contacts-list', 'Ошибка загрузки данных: ' + error.message);
    }
}

// Отображение заявок на перевозку
function displayOrders(orders) {
    const container = document.getElementById('orders-list');
    
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3 class="empty-state-title">У вас пока нет заявок</h3>
                <p class="empty-state-text">Создайте первую заявку на перевозку груза</p>
                <a href="index.html" class="empty-state-btn">Оставить заявку</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="request-card">
            <div class="request-header">
                <span class="request-id">Заявка #${order.id}</span>
                <span class="request-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="request-body">
                <div class="request-field">
                    <span class="field-label">Маршрут:</span>
                    <div class="route">
                        <span class="field-value">${order.city_from}</span>
                        <span class="route-arrow">→</span>
                        <span class="field-value">${order.city_to}</span>
                    </div>
                </div>
                <div class="request-field">
                    <span class="field-label">Описание груза:</span>
                    <span class="field-value">${order.cargo_description}</span>
                </div>
                <div class="request-field">
                    <span class="field-label">Контакты:</span>
                    <span class="field-value">${order.name}, ${order.phone}</span>
                </div>
            </div>
            <div class="request-footer">
                <div class="request-date">
                    <span>Создано: ${formatDate(order.created_at)}</span>
                    ${order.updated_at !== order.created_at ? `<span>Обновлено: ${formatDate(order.updated_at)}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Отображение обращений
function displayContacts(contacts) {
    const container = document.getElementById('contacts-list');
    
    if (!contacts || contacts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <h3 class="empty-state-title">У вас пока нет обращений</h3>
                <p class="empty-state-text">Свяжитесь с нами через форму обратной связи</p>
                <a href="index.html" class="empty-state-btn">Написать нам</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = contacts.map(contact => `
        <div class="request-card">
            <div class="request-header">
                <span class="request-id">Обращение #${contact.id}</span>
                <span class="request-status status-${contact.status}">${getStatusText(contact.status)}</span>
            </div>
            <div class="request-body">
                <div class="request-field">
                    <span class="field-label">Сообщение:</span>
                    <span class="field-value">${contact.message}</span>
                </div>
                <div class="request-field">
                    <span class="field-label">Контакты:</span>
                    <span class="field-value">${contact.name}, ${contact.phone}</span>
                </div>
                ${contact.email ? `
                <div class="request-field">
                    <span class="field-label">Email:</span>
                    <span class="field-value">${contact.email}</span>
                </div>
                ` : ''}
            </div>
            <div class="request-footer">
                <div class="request-date">
                    <span>Создано: ${formatDate(contact.created_at)}</span>
                    ${contact.updated_at !== contact.created_at ? `<span>Обновлено: ${formatDate(contact.updated_at)}</span>` : ''}
                </div>
                <button class="btn-chat" onclick="openChat(${contact.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Открыть чат
                </button>
            </div>
        </div>
    `).join('');
}

// Получение текста статуса
function getStatusText(status) {
    const statuses = {
        'new': 'Новая',
        'in_progress': 'В работе',
        'completed': 'Завершена',
        'cancelled': 'Отменена',
        'closed': 'Закрыто'
    };
    return statuses[status] || status;
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('ru-RU', options);
}

// Показать ошибку
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="error-message">${message}</div>`;
}

// Переключение табов
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Убираем активный класс со всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке и контенту
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Переключение секций
function initSections() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.content-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = item.dataset.section;
            
            // Убираем активный класс со всех пунктов меню
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
            
            // Скрываем все секции
            sections.forEach(section => section.classList.remove('active'));
            
            // Показываем нужную секцию
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Загрузка данных пользователя в форму профиля
async function loadUserProfile() {
    try {
        const response = await fetch('/api/auth/check-session.php', {
            credentials: 'include'
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        if (!data.success || !data.user) return;
        
        const user = data.user;
        
        // Обновляем боковое меню
        const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || user.username[0]);
        document.getElementById('sidebarAvatar').textContent = initials.toUpperCase();
        document.getElementById('sidebarUserName').textContent = user.first_name 
            ? `${user.first_name} ${user.last_name || ''}`.trim() 
            : user.username;
        document.getElementById('sidebarUserEmail').textContent = user.email;
        
        // Заполняем форму профиля
        document.getElementById('lastName').value = user.last_name || '';
        document.getElementById('firstName').value = user.first_name || '';
        document.getElementById('middleName').value = user.middle_name || '';
        document.getElementById('birthDate').value = user.birth_date || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('city').value = user.city || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('username').value = user.username || '';
        
    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
    }
}

// Обработка формы профиля
function initProfileForm() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProfile();
        });
    }
    
    const contactForm = document.getElementById('profileContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProfile();
        });
    }
    
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await changePassword();
        });
    }
}

// Сохранение профиля
async function saveProfile() {
    try {
        const profileData = {
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            middle_name: document.getElementById('middleName').value,
            birth_date: document.getElementById('birthDate').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value,
            email: document.getElementById('email').value
        };
        
        const response = await fetch('/api/user/update-profile.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Профиль успешно обновлен', 'success');
            await loadUserProfile(); // Перезагружаем данные
        } else {
            showNotification(data.message || 'Ошибка сохранения', 'error');
        }
        
    } catch (error) {
        console.error('Ошибка сохранения профиля:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Смена пароля
async function changePassword() {
    try {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            showNotification('Пароли не совпадают', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification('Пароль должен быть не менее 6 символов', 'error');
            return;
        }
        
        const response = await fetch('/api/user/change-password.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Пароль успешно изменен', 'success');
            document.getElementById('passwordForm').reset();
        } else {
            showNotification(data.message || 'Ошибка изменения пароля', 'error');
        }
        
    } catch (error) {
        console.error('Ошибка смены пароля:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Функция showNotification теперь определена в toast.js

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Страница личного кабинета загружена');
    await checkAuth();
    console.log('Проверка авторизации пройдена');
    
    initSections();
    initTabs();
    initProfileForm();
    
    await loadUserProfile();
    loadRequests();
});


// Переменные для чата
let currentContactId = null;
let chatUpdateInterval = null;

// Открытие чата
async function openChat(contactId) {
    currentContactId = contactId;
    
    // Скрываем список заявок
    document.getElementById('requests-list-view').style.display = 'none';
    
    // Показываем чат
    document.getElementById('chat-view').style.display = 'block';
    
    document.getElementById('chatContactId').textContent = contactId;
    
    // Загружаем информацию об обращении
    await loadContactInfo(contactId);
    
    await loadChatMessages();
    
    // Автообновление сообщений каждые 5 секунд
    chatUpdateInterval = setInterval(loadChatMessages, 5000);
}

// Закрытие чата
function closeChat() {
    // Показываем список заявок
    document.getElementById('requests-list-view').style.display = 'block';
    
    // Скрываем чат
    document.getElementById('chat-view').style.display = 'none';
    
    currentContactId = null;
    
    if (chatUpdateInterval) {
        clearInterval(chatUpdateInterval);
        chatUpdateInterval = null;
    }
}

// Загрузка информации об обращении
async function loadContactInfo(contactId) {
    try {
        const response = await fetch('/api/user/get-requests.php', {
            credentials: 'include'
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        const contact = data.contacts.find(c => c.id == contactId);
        
        if (contact) {
            // Обновляем заголовок чата
            const chatTitle = document.querySelector('.chat-info .chat-title');
            if (chatTitle) {
                // Берем первые 50 символов сообщения как заголовок
                const title = contact.message.length > 50 
                    ? contact.message.substring(0, 50) + '...' 
                    : contact.message;
                chatTitle.innerHTML = `<span style="font-weight: 400; color: #666;">Обращение #${contactId}:</span> ${escapeHtml(title)}`;
            }
            
            // Обновляем статус
            const statusElement = document.getElementById('chatStatus');
            if (statusElement) {
                statusElement.textContent = getStatusText(contact.status);
                statusElement.className = 'chat-status status-' + contact.status;
            }
            
            // Блокируем ввод если обращение закрыто
            const chatInput = document.getElementById('chatInput');
            const sendBtn = document.querySelector('.chat-send-btn');
            
            if (contact.status === 'closed') {
                if (chatInput) {
                    chatInput.disabled = true;
                    chatInput.placeholder = 'Обращение закрыто. Отправка сообщений невозможна.';
                }
                if (sendBtn) {
                    sendBtn.disabled = true;
                    sendBtn.style.opacity = '0.5';
                    sendBtn.style.cursor = 'not-allowed';
                }
            } else {
                if (chatInput) {
                    chatInput.disabled = false;
                    chatInput.placeholder = 'Введите сообщение...';
                }
                if (sendBtn) {
                    sendBtn.disabled = false;
                    sendBtn.style.opacity = '1';
                    sendBtn.style.cursor = 'pointer';
                }
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки информации об обращении:', error);
    }
}

// Загрузка сообщений чата
async function loadChatMessages() {
    if (!currentContactId) return;
    
    try {
        const response = await fetch(`/api/contacts/get-messages.php?contact_id=${currentContactId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки сообщений');
        }
        
        const data = await response.json();
        displayChatMessages(data.messages);
        
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
        document.getElementById('chatMessages').innerHTML = `
            <div class="chat-error">Ошибка загрузки сообщений</div>
        `;
    }
}

// Отображение сообщений
function displayChatMessages(messages) {
    const container = document.getElementById('chatMessages');
    
    if (!messages || messages.length === 0) {
        container.innerHTML = `
            <div class="chat-empty">Нет сообщений</div>
        `;
        return;
    }
    
    const scrollAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
    
    container.innerHTML = messages.map(msg => {
        const isUser = msg.sender_type === 'user';
        const time = new Date(msg.created_at).toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `
            <div class="chat-message ${isUser ? 'chat-message-user' : 'chat-message-admin'}" 
                 data-message-id="${msg.id}"
                 ${isUser ? 'oncontextmenu="showMessageContextMenu(event, ' + msg.id + ')"' : ''}>
                <div class="message-sender">${isUser ? 'Вы' : 'A2B Company'}</div>
                <div class="message-text" id="message-text-${msg.id}">${escapeHtml(msg.message)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    }).join('');
    
    // Прокручиваем вниз если были внизу или это первая загрузка
    if (scrollAtBottom || messages.length <= 10) {
        container.scrollTop = container.scrollHeight;
    }
}

// Отправка сообщения
async function sendMessage() {
    if (!currentContactId) return;
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    try {
        const response = await fetch('/api/contacts/send-message.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact_id: currentContactId,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            input.value = '';
            input.style.height = 'auto';
            await loadChatMessages();
        } else {
            showNotification(data.message || 'Ошибка отправки', 'error');
        }
        
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Автоматическое изменение высоты textarea
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
        
        // Отправка по Enter (без Shift)
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}




// Показать контекстное меню
function showMessageContextMenu(event, messageId) {
    event.preventDefault();
    
    // Удаляем старое меню если есть
    const oldMenu = document.getElementById('message-context-menu');
    if (oldMenu) {
        oldMenu.remove();
    }
    
    // Создаем новое меню
    const menu = document.createElement('div');
    menu.id = 'message-context-menu';
    menu.className = 'context-menu';
    menu.innerHTML = `
        <div class="context-menu-item" onclick="editMessage(${messageId})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Редактировать
        </div>
        <div class="context-menu-item delete" onclick="deleteMessage(${messageId})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Удалить
        </div>
    `;
    
    // Позиционируем меню
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';
    
    document.body.appendChild(menu);
    
    // Закрытие меню при клике вне его
    setTimeout(() => {
        document.addEventListener('click', closeContextMenu);
    }, 0);
}

// Закрыть контекстное меню
function closeContextMenu() {
    const menu = document.getElementById('message-context-menu');
    if (menu) {
        menu.remove();
    }
    document.removeEventListener('click', closeContextMenu);
}

// Редактирование сообщения
function editMessage(messageId) {
    closeContextMenu();
    
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    const textElement = document.getElementById(`message-text-${messageId}`);
    const currentText = textElement.textContent;
    
    // Создаем форму редактирования
    const editForm = document.createElement('div');
    editForm.className = 'message-edit-form';
    editForm.innerHTML = `
        <textarea class="edit-textarea" id="edit-textarea-${messageId}">${currentText}</textarea>
        <div class="edit-actions">
            <button class="btn-edit-save" onclick="saveEditMessage(${messageId})">Сохранить</button>
            <button class="btn-edit-cancel" onclick="cancelEditMessage(${messageId})">Отмена</button>
        </div>
    `;
    
    // Заменяем содержимое сообщения на форму
    textElement.replaceWith(editForm);
    
    // Фокус на textarea
    document.getElementById(`edit-textarea-${messageId}`).focus();
}

// Сохранение отредактированного сообщения
async function saveEditMessage(messageId) {
    const textarea = document.getElementById(`edit-textarea-${messageId}`);
    const newText = textarea.value.trim();
    
    if (!newText) {
        showNotification('Сообщение не может быть пустым', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/contacts/edit-message.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message_id: messageId,
                message: newText
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Сообщение обновлено', 'success');
            await loadChatMessages();
        } else {
            showNotification(data.message || 'Ошибка обновления', 'error');
        }
        
    } catch (error) {
        console.error('Ошибка редактирования:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Отмена редактирования
function cancelEditMessage(messageId) {
    loadChatMessages();
}

// Удаление сообщения
async function deleteMessage(messageId) {
    closeContextMenu();
    
    if (!confirm('Вы уверены, что хотите удалить это сообщение?')) {
        return;
    }
    
    try {
        const response = await fetch('/api/contacts/delete-message.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message_id: messageId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Сообщение удалено', 'success');
            await loadChatMessages();
        } else {
            showNotification(data.message || 'Ошибка удаления', 'error');
        }
        
    } catch (error) {
        console.error('Ошибка удаления:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}
