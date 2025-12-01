// Кастомные подсказки валидации
document.addEventListener('DOMContentLoaded', function() {
    // Отключаем стандартные подсказки браузера
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.setAttribute('novalidate', 'novalidate');
        
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            // Удаляем подсказку при вводе
            input.addEventListener('input', function() {
                removeTooltip(this);
                this.classList.remove('has-error');
            });
            
            // Показываем подсказку при потере фокуса
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
        
        // Валидация при отправке формы
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Фокус на первом невалидном поле
                const firstInvalid = form.querySelector('.has-error');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    });
});

function validateInput(input) {
    removeTooltip(input);
    
    if (!input.validity.valid) {
        input.classList.add('has-error');
        showTooltip(input, getValidationMessage(input));
        return false;
    } else {
        input.classList.remove('has-error');
        return true;
    }
}

function getValidationMessage(input) {
    if (input.validity.valueMissing) {
        return 'Заполните это поле';
    }
    if (input.validity.typeMismatch) {
        if (input.type === 'email') {
            return 'Введите корректный email';
        }
        if (input.type === 'tel') {
            return 'Введите корректный телефон';
        }
    }
    if (input.validity.patternMismatch) {
        return 'Неверный формат';
    }
    if (input.validity.tooShort) {
        return `Минимум ${input.minLength} символов`;
    }
    if (input.validity.tooLong) {
        return `Максимум ${input.maxLength} символов`;
    }
    return 'Проверьте правильность заполнения';
}

function showTooltip(input, message) {
    const wrapper = input.closest('.form-group') || input.parentElement;
    
    // Проверяем, нет ли уже подсказки
    if (wrapper.querySelector('.custom-validation-tooltip')) {
        return;
    }
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-validation-tooltip error';
    tooltip.textContent = message;
    
    // Делаем wrapper относительным для позиционирования
    wrapper.style.position = 'relative';
    wrapper.appendChild(tooltip);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        removeTooltip(input);
    }, 5000);
}

function removeTooltip(input) {
    const wrapper = input.closest('.form-group') || input.parentElement;
    const tooltip = wrapper.querySelector('.custom-validation-tooltip');
    
    if (tooltip) {
        tooltip.style.animation = 'tooltipFadeOut 0.3s ease';
        setTimeout(() => {
            tooltip.remove();
        }, 300);
    }
}

// Добавляем анимацию исчезновения
const style = document.createElement('style');
style.textContent = `
    @keyframes tooltipFadeOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
        }
    }
`;
document.head.appendChild(style);
