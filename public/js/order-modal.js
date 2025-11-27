// Список городов России для автодополнения
const russianCities = [
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
    'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
    'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград',
    'Краснодар', 'Саратов', 'Тюмень', 'Тольятти', 'Ижевск',
    'Барнаул', 'Ульяновск', 'Иркутск', 'Хабаровск', 'Ярославль',
    'Владивосток', 'Махачкала', 'Томск', 'Оренбург', 'Кемерово',
    'Новокузнецк', 'Рязань', 'Астрахань', 'Набережные Челны', 'Пенза',
    'Липецк', 'Тула', 'Киров', 'Чебоксары', 'Калининград',
    'Брянск', 'Курск', 'Иваново', 'Магнитогорск', 'Тверь',
    'Ставрополь', 'Нижний Тагил', 'Белгород', 'Архангельск', 'Владимир',
    'Сочи', 'Курган', 'Смоленск', 'Калуга', 'Чита',
    'Орёл', 'Волжский', 'Череповец', 'Владикавказ', 'Мурманск',
    'Сургут', 'Вологда', 'Саранск', 'Тамбов', 'Стерлитамак',
    'Грозный', 'Якутск', 'Кострома', 'Комсомольск-на-Амуре', 'Петрозаводск',
    'Таганрог', 'Нижневартовск', 'Йошкар-Ола', 'Братск', 'Новороссийск',
    'Дзержинск', 'Шахты', 'Нальчик', 'Орск', 'Сыктывкар',
    'Нижнекамск', 'Ангарск', 'Старый Оскол', 'Великий Новгород', 'Благовещенск',
    'Прокопьевск', 'Бийск', 'Псков', 'Энгельс', 'Рыбинск',
    'Балаково', 'Северодвинск', 'Армавир', 'Подольск', 'Королёв',
    'Южно-Сахалинск', 'Петропавловск-Камчатский', 'Сызрань', 'Норильск', 'Златоуст',
    'Мытищи', 'Люберцы', 'Волгодонск', 'Находка', 'Уссурийск',
    'Березники', 'Салават', 'Электросталь', 'Миасс', 'Рубцовск',
    'Альметьевск', 'Ковров', 'Коломна', 'Майкоп', 'Пятигорск',
    'Одинцово', 'Копейск', 'Хасавюрт', 'Новочеркасск', 'Ачинск',
    'Кисловодск', 'Серпухов', 'Новомосковск', 'Первоуральск', 'Ессентуки',
    'Ставрополь', 'Севастополь', 'Симферополь', 'Керчь', 'Евпатория'
];

class OrderModal {
    constructor() {
        this.modal = null;
        this.form = null;
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div id="orderModal" class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-header">
                        <h2>Оставить заявку</h2>
                        <button type="button" class="modal-close" aria-label="Закрыть">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="alertMessage" class="alert"></div>
                        <form id="orderForm">
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
                                    Согласен на <a href="#" target="_blank">обработку персональных данных</a>
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
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a');
            if (target) {
                const text = target.textContent.trim();
                if (text === 'Оставить заявку' || text.includes('Оставить заявку')) {
                    e.preventDefault();
                    this.open();
                }
            }
        });

        // Закрытие модального окна
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.close());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Автодополнение городов
        this.setupCityAutocomplete('cityFrom', 'cityFromSuggestions');
        this.setupCityAutocomplete('cityTo', 'cityToSuggestions');

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

            const filtered = russianCities.filter(city => 
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
            city_to: document.getElementById('cityTo').value
        };

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
                this.showAlert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                this.form.reset();
                setTimeout(() => {
                    this.close();
                }, 3000);
            } else {
                this.showAlert(data.message || 'Произошла ошибка при отправке заявки', 'error');
            }
        } catch (error) {
            this.showAlert('Ошибка соединения с сервером', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        }
    }

    showAlert(message, type) {
        const alert = document.getElementById('alertMessage');
        alert.textContent = message;
        alert.className = `alert alert-${type} active`;
        
        setTimeout(() => {
            alert.classList.remove('active');
        }, 5000);
    }

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.form.reset();
        document.getElementById('alertMessage').classList.remove('active');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new OrderModal();
});
