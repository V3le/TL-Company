// Toast Notification System

class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.init();
    }

    init() {
        // Создаем контейнер для toast-уведомлений
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 2000) {
        const toast = this.createToast(message, type, duration);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Показываем toast с небольшой задержкой для анимации
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Запускаем прогресс-бар
        if (duration > 0) {
            this.startProgress(toast, duration);
        }

        // Автоматически скрываем toast
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    }

    createToast(message, type, duration) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = this.getIcon(type);
        const title = this.getTitle(type);

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Закрыть">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
            ${duration > 0 ? '<div class="toast-progress"></div>' : ''}
        `;

        // Обработчик закрытия
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hide(toast);
        });

        return toast;
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '!',
            info: 'i'
        };
        return icons[type] || icons.info;
    }

    getTitle(type) {
        const titles = {
            success: 'Успешно',
            error: 'Ошибка',
            warning: 'Внимание',
            info: 'Информация'
        };
        return titles[type] || titles.info;
    }

    startProgress(toast, duration) {
        const progressBar = toast.querySelector('.toast-progress');
        if (!progressBar) return;

        progressBar.style.width = '100%';
        progressBar.style.transition = `width ${duration}ms linear`;

        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 10);
    }

    hide(toast) {
        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 400);
    }

    // Вспомогательные методы для быстрого вызова
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 4500) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }

    // Очистить все уведомления
    clearAll() {
        this.toasts.forEach(toast => this.hide(toast));
    }
}

// Создаем глобальный экземпляр
const toast = new ToastManager();

// Делаем доступным глобально
window.toast = toast;

// Совместимость со старой функцией showNotification
window.showNotification = function(message, type = 'success') {
    toast.show(message, type);
};
