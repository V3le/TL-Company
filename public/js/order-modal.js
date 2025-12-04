
class OrderModal {
    constructor() {
        console.log('OrderModal: Инициализация...');
        this.modal = null;
        this.form = null;
        this.init();
    }

    init() {
        console.log('OrderModal: Создание модального окна...');
        this.createModal();
        this.attachEventListeners();
        console.log('OrderModal: Готово! Modal:', this.modal);
    }

    createModal() {
        const modalHTML = `
            <div id="orderModal" class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-header">
                        <h2>Оставить заявку</h2>
                        <button type="button" class="modal-close" aria-label="Закрыть">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="orderForm" novalidate>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="orderName">Ваше имя <span class="required">*</span></label>
                                    <input type="text" id="orderName" name="name" required placeholder="Иван Иванов">
                                </div>
                                <div class="form-group">
                                    <label for="orderPhone">Телефон <span class="required">*</span></label>
                                    <input type="tel" id="orderPhone" name="phone" required placeholder="+7 (999) 123-45-67">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="cargoDescription">Наименование груза <span class="required">*</span></label>
                                <textarea id="cargoDescription" name="cargo_description" required placeholder="Опишите ваш груз: тип, вес, габариты, особенности..."></textarea>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cityFrom"><span class="required"></span></label>
                                    <div class="city-input-wrapper">
                                        <span class="city-label">Откуда</span>
                                        <input type="text" id="cityFrom" name="city_from" required placeholder="Начните вводить город..." autocomplete="off">
                                        <div id="cityFromSuggestions" class="city-suggestions"></div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="cityTo"><span class="required"></span></label>
                                    <div class="city-input-wrapper">
                                        <span class="city-label">Куда</span>
                                        <input type="text" id="cityTo" name="city_to" required placeholder="Начните вводить город..." autocomplete="off">
                                        <div id="cityToSuggestions" class="city-suggestions"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="privacy-checkbox">
                                <input type="checkbox" id="privacyAgree" required>
                                <label for="privacyAgree">
                                    Согласен на <a href="documents.html#consent" target="_blank">обработку персональных данных</a>
                                </label>
                            </div>

                            <button type="submit" class="btn-submit">Отправить заявку</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('orderModal');
        this.form = document.getElementById('orderForm');
    }

    attachEventListeners() {
        // Используем делегирование событий для кнопок (включая динамически загруженные)
        const self = this;
        
        // Удаляем старый обработчик если есть
        if (window.orderModalClickHandler) {
            document.removeEventListener('click', window.orderModalClickHandler);
        }
        
        // Создаем новый обработчик
        window.orderModalClickHandler = function(e) {
            // Проверяем клик по кнопке или ссылке
            const target = e.target.closest('button, a');
            if (target) {
                const text = target.textContent.trim();
                
                console.log('Клик по элементу:', text, target.className, target.id);
                
                // Пропускаем кнопку из калькулятора - она обрабатывается отдельно
                if (target.id === 'orderFromCalc') {
                    console.log('Кнопка из калькулятора - пропускаем');
                    return;
                }
                
                // Открываем модалку если текст содержит "Оставить заявку"
                if (text.includes('Оставить заявку') || 
                    text.includes('Отправить груз')) {
                    console.log('Открываем модальное окно');
                    e.preventDefault();
                    e.stopPropagation();
                    self.open();
                }
            }
        };
        
        document.addEventListener('click', window.orderModalClickHandler, true);

        // Закрытие модального окна
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.close());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });


        this.setupCityAutocomplete('cityFrom', 'cityFromSuggestions');
        this.setupCityAutocomplete('cityTo', 'cityToSuggestions');

        // Валидация имени - только буквы
        const nameInput = document.getElementById('orderName');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^а-яА-ЯёЁa-zA-Z\s\-]/g, '');
            });
        }

        // Маска для телефона
        const phoneInput = document.getElementById('orderPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    if (value[0] === '8') {
                        value = '7' + value.slice(1);
                    }
                    
                    let formattedValue = '+';
                    if (value.length > 0) formattedValue += value.substring(0, 1);
                    if (value.length > 1) formattedValue += ' (' + value.substring(1, 4);
                    if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
                    if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
                    if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
                    
                    e.target.value = formattedValue;
                }
            });
            
            phoneInput.addEventListener('keypress', (e) => {
                if (!/[\d\+\(\)\-\s]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault();
                }
            });
        }

        // Отправка формы
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    setupCityAutocomplete(inputId, suggestionsId) {
        const input = document.getElementById(inputId);
        const suggestions = document.getElementById(suggestionsId);

        input.addEventListener('input', () => {
            const value = input.value.trim().toLowerCase();
            
            if (value.length < 2) {
                suggestions.classList.remove('active');
                return;
            }

            const filtered = (window.russianCities || []).filter(city => 
                city.toLowerCase().includes(value)
            ).slice(0, 10);

            if (filtered.length > 0) {
                suggestions.innerHTML = filtered.map(city => 
                    `<div class="city-suggestion-item" data-city="${city}">${city}</div>`
                ).join('');
                suggestions.classList.add('active');

                // Обработка клика по подсказке
                suggestions.querySelectorAll('.city-suggestion-item').forEach(item => {
                    item.addEventListener('click', () => {
                        input.value = item.dataset.city;
                        suggestions.classList.remove('active');
                    });
                });
            } else {
                suggestions.classList.remove('active');
            }
        });

        // Закрытие подсказок при клике вне
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !suggestions.contains(e.target)) {
                suggestions.classList.remove('active');
            }
        });
    }

    async submitForm() {
        const formData = {
            name: document.getElementById('orderName').value,
            phone: document.getElementById('orderPhone').value,
            cargo_description: document.getElementById('cargoDescription').value,
            city_from: document.getElementById('cityFrom').value,
            city_to: document.getElementById('cityTo').value,
            privacy: document.getElementById('privacyAgree').checked
        };

        // Валидация
        const validationError = this.validateForm(formData);
        if (validationError) {
            this.showFormAlert(validationError, 'error');
            return;
        }

        this.removeFormAlert();

        const submitBtn = this.form.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        try {
            const response = await fetch('/api/orders/create.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                this.removeFormAlert();
                toast.success('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                this.form.reset();
                setTimeout(() => {
                    this.close();
                }, 2000);
            } else {
                this.showFormAlert(data.message || 'Произошла ошибка при отправке заявки', 'error');
            }
        } catch (error) {
            this.showFormAlert('Ошибка соединения с сервером. Проверьте подключение к интернету.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        }
    }

    validateForm(data) {
        // Проверка имени
        if (!data.name || !data.name.trim()) {
            return 'Пожалуйста, введите ваше имя';
        }
        
        if (!/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(data.name.trim())) {
            return 'Имя должно содержать только буквы';
        }
        
        if (data.name.trim().length < 2) {
            return 'Имя должно содержать минимум 2 символа';
        }

        // Проверка телефона
        if (!data.phone || !data.phone.trim()) {
            return 'Пожалуйста, введите номер телефона';
        }
        
        const phoneDigits = data.phone.replace(/\D/g, '');
        if (phoneDigits.length !== 11) {
            return 'Номер телефона должен содержать 11 цифр';
        }
        
        if (phoneDigits[0] !== '7' && phoneDigits[0] !== '8') {
            return 'Номер телефона должен начинаться с +7 или 8';
        }

        // Проверка описания груза
        if (!data.cargo_description || !data.cargo_description.trim()) {
            return 'Пожалуйста, опишите ваш груз';
        }
        
        if (data.cargo_description.trim().length < 10) {
            return 'Описание груза должно содержать минимум 10 символов';
        }

        // Проверка городов
        if (!data.city_from || !data.city_from.trim()) {
            return 'Пожалуйста, укажите город отправления';
        }
        
        if (!data.city_to || !data.city_to.trim()) {
            return 'Пожалуйста, укажите город назначения';
        }

        // Проверка согласия
        if (!data.privacy) {
            return 'Необходимо согласие с политикой обработки персональных данных';
        }

        return null;
    }

    showFormAlert(message, type) {
        this.removeFormAlert();
        
        const alert = document.createElement('div');
        alert.className = `form-alert ${type}`;
        alert.textContent = message;
        
        this.form.insertBefore(alert, this.form.firstChild);
        
        alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    removeFormAlert() {
        const existingAlert = this.form.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
    }

    open() {
        console.log('Метод open() вызван, modal:', this.modal);
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Модальное окно открыто');
            
            // Проверяем, есть ли данные из калькулятора с небольшой задержкой
            setTimeout(() => {
                // Автозаполнение данными пользователя
                const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
                if (currentUser) {
                    const fullName = [currentUser.last_name, currentUser.first_name, currentUser.middle_name]
                        .filter(Boolean)
                        .join(' ');
                    
                    const orderName = document.getElementById('orderName');
                    const orderPhone = document.getElementById('orderPhone');
                    
                    if (orderName && !orderName.value) orderName.value = fullName;
                    if (orderPhone && !orderPhone.value && currentUser.phone) orderPhone.value = currentUser.phone;
                }
                
                // Заполнение данными из калькулятора
                if (window.calculatorData) {
                    console.log('Заполняем данные из калькулятора:', window.calculatorData);
                    
                    const cityFromInput = document.getElementById('cityFrom');
                    const cityToInput = document.getElementById('cityTo');
                    
                    if (cityFromInput && window.calculatorData.cityFrom) {
                        cityFromInput.value = window.calculatorData.cityFrom;
                        console.log('cityFrom заполнен:', cityFromInput.value);
                    }
                    if (cityToInput && window.calculatorData.cityTo) {
                        cityToInput.value = window.calculatorData.cityTo;
                        console.log('cityTo заполнен:', cityToInput.value);
                    }
                    
                    // Очищаем данные после использования
                    window.calculatorData = null;
                } else {
                    console.log('window.calculatorData не найден');
                }
            }, 50);
        } else {
            console.error('Модальное окно не найдено!');
        }
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.form.reset();
        this.removeFormAlert();
    }
}

// Глобальная функция для открытия модального окна
function openOrderModal() {
    console.log('openOrderModal вызвана');
    if (!window.orderModalInstance) {
        console.log('Создаем новый экземпляр OrderModal');
        window.orderModalInstance = new OrderModal();
    }
    window.orderModalInstance.open();
}

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.orderModalInstance = new OrderModal();
    });
} else {
    window.orderModalInstance = new OrderModal();
}
