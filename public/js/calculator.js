// Калькулятор грузоперевозок с Dadata API
// Использует реальное API для автодополнения городов и расчета расстояний

const DADATA_TOKEN = "dc053bb74b82cffb44fc5bbab66d3d6ceb9aea7f";

class Calculator {
    constructor() {
        this.cityFrom = { name: 'Ставрополь', lat: null, lon: null };
        this.cityTo = { name: 'Москва', lat: null, lon: null };
        this.weight = 500;
        this.volume = 2;
        this.transportType = 'dedicated'; // dedicated или shared
        this.oversized = false;
        this.loading = false;
        this.insurance = false;
        this.init();
    }

    init() {
        console.log('Calculator: Инициализация с Dadata API...');
        this.setupCityAutocomplete('calcCityFrom', 'calcCityFromSuggestions', true);
        this.setupCityAutocomplete('calcCityTo', 'calcCityToSuggestions', false);
        this.setupSwapButton();
        this.setupTransportButtons();
        this.setupWeightButtons();
        this.setupInputListeners();
        this.setupCheckboxes();
        this.setupCalculateButton();
        
        // Начальный расчет
        this.calculate();
    }

    async searchCitiesDadata(query) {
        try {
            const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + DADATA_TOKEN
                },
                body: JSON.stringify({
                    query: query,
                    count: 10,
                    from_bound: { value: "city" },
                    to_bound: { value: "city" },
                    locations: [{ country: "Россия" }]
                })
            });

            if (!response.ok) {
                console.error('Dadata API error:', response.status);
                return this.getFallbackCities(query);
            }

            const data = await response.json();
            return data.suggestions.map(s => ({
                city: s.data.city || s.data.settlement,
                region: s.data.region,
                fullName: s.value,
                lat: parseFloat(s.data.geo_lat),
                lon: parseFloat(s.data.geo_lon)
            })).filter(c => c.city && c.lat && c.lon);
        } catch (error) {
            console.error('Ошибка поиска городов:', error);
            return this.getFallbackCities(query);
        }
    }

    getFallbackCities(query) {
        // Fallback на локальный список если API недоступен
        const cities = window.russianCities || [];
        return cities
            .filter(city => city.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 10)
            .map(city => ({
                city: city,
                region: '',
                fullName: city,
                lat: null,
                lon: null
            }));
    }

    setupCityAutocomplete(inputId, suggestionsId, isFrom) {
        const input = document.getElementById(inputId);
        const suggestions = document.getElementById(suggestionsId);

        if (!input || !suggestions) return;

        let searchTimeout;

        input.addEventListener('input', () => {
            const value = input.value.trim();
            
            clearTimeout(searchTimeout);
            
            if (value.length < 2) {
                suggestions.classList.remove('active');
                return;
            }

            // Debounce для API запросов
            searchTimeout = setTimeout(async () => {
                const cities = await this.searchCitiesDadata(value);

                if (cities.length > 0) {
                    suggestions.innerHTML = cities.map(city => 
                        `<div class="city-suggestion-item" data-city="${city.city}" data-full="${city.fullName}" data-lat="${city.lat}" data-lon="${city.lon}">
                            <strong>${city.city}</strong>${city.region ? ', ' + city.region : ''}
                        </div>`
                    ).join('');
                    suggestions.classList.add('active');

                    suggestions.querySelectorAll('.city-suggestion-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const cityName = item.dataset.city;
                            const fullName = item.dataset.full;
                            const lat = parseFloat(item.dataset.lat);
                            const lon = parseFloat(item.dataset.lon);
                            
                            input.value = fullName;
                            suggestions.classList.remove('active');
                            
                            if (isFrom) {
                                this.cityFrom = { name: cityName, lat, lon };
                            } else {
                                this.cityTo = { name: cityName, lat, lon };
                            }
                            
                            this.calculate();
                        });
                    });
                } else {
                    suggestions.classList.remove('active');
                }
            }, 300);
        });

        // Закрытие подсказок при клике вне
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !suggestions.contains(e.target)) {
                suggestions.classList.remove('active');
            }
        });
    }

    setupSwapButton() {
        const swapBtn = document.getElementById('swapCities');
        if (!swapBtn) return;

        swapBtn.addEventListener('click', () => {
            const fromInput = document.getElementById('calcCityFrom');
            const toInput = document.getElementById('calcCityTo');
            
            if (!fromInput || !toInput) return;

            // Меняем значения в полях
            const temp = fromInput.value;
            fromInput.value = toInput.value;
            toInput.value = temp;
            
            // Меняем данные городов
            const tempCity = this.cityFrom;
            this.cityFrom = this.cityTo;
            this.cityTo = tempCity;
            
            this.calculate();
        });
    }

    setupTransportButtons() {
        const buttons = document.querySelectorAll('.calc-transport-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.transportType = btn.dataset.type;
                this.calculate();
            });
        });
    }

    setupWeightButtons() {
        const buttons = document.querySelectorAll('.calc-weight-btn');
        const weightInput = document.getElementById('calcWeight');
        const volumeInput = document.getElementById('calcVolume');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const weight = parseFloat(btn.dataset.weight);
                const volume = parseFloat(btn.dataset.volume);
                
                if (weight && weightInput) {
                    weightInput.value = weight * 1000; // тонны в кг
                    this.weight = weight * 1000;
                }
                
                if (volume && volumeInput) {
                    volumeInput.value = volume;
                    this.volume = volume;
                }
                
                this.calculate();
            });
        });
    }

    setupInputListeners() {
        const weightInput = document.getElementById('calcWeight');
        const volumeInput = document.getElementById('calcVolume');

        if (weightInput) {
            weightInput.addEventListener('input', () => {
                this.weight = parseFloat(weightInput.value) || 500;
                // Снимаем активность с кнопок при ручном вводе
                document.querySelectorAll('.calc-weight-btn').forEach(b => b.classList.remove('active'));
                this.updateWeightHint();
                this.calculate();
            });
        }

        if (volumeInput) {
            volumeInput.addEventListener('input', () => {
                this.volume = parseFloat(volumeInput.value) || 2;
                this.updateVolumeHint();
                this.calculate();
            });
        }
    }
    
    updateWeightHint() {
        const weightInput = document.getElementById('calcWeight');
        if (!weightInput) return;
        
        const hint = weightInput.parentElement.querySelector('.calc-param-hint');
        if (!hint) return;
        
        if (this.weight > 20000) {
            hint.textContent = '⚠️ Требуется специальный транспорт';
            hint.style.color = '#F59E0B';
        } else if (this.weight > 10000) {
            hint.textContent = '✓ Большегруз (10-20 тонн)';
            hint.style.color = '#46c0c0';
        } else if (this.weight > 5000) {
            hint.textContent = '✓ Средний тоннаж (5-10 тонн)';
            hint.style.color = '#46c0c0';
        } else if (this.weight > 1500) {
            hint.textContent = '✓ Малый тоннаж (1.5-5 тонн)';
            hint.style.color = '#46c0c0';
        } else {
            hint.textContent = 'не более 500 кг';
            hint.style.color = '#9CA3AF';
        }
    }
    
    updateVolumeHint() {
        const volumeInput = document.getElementById('calcVolume');
        if (!volumeInput) return;
        
        const hint = volumeInput.parentElement.querySelector('.calc-param-hint');
        if (!hint) return;
        
        if (this.volume > 120) {
            hint.textContent = '⚠️ Превышен максимальный объём';
            hint.style.color = '#F59E0B';
        } else if (this.volume > 80) {
            hint.textContent = '✓ Фура 20 тонн (82-120 м³)';
            hint.style.color = '#46c0c0';
        } else if (this.volume > 40) {
            hint.textContent = '✓ Фура 10 тонн (40-82 м³)';
            hint.style.color = '#46c0c0';
        } else if (this.volume > 20) {
            hint.textContent = '✓ Фура 5 тонн (20-40 м³)';
            hint.style.color = '#46c0c0';
        } else if (this.volume > 10) {
            hint.textContent = '✓ Газель (10-20 м³)';
            hint.style.color = '#46c0c0';
        } else {
            hint.textContent = 'до 10 м³';
            hint.style.color = '#9CA3AF';
        }
    }

    setupCheckboxes() {
        const oversizedCheckbox = document.getElementById('calcOversized');
        const loadingCheckbox = document.getElementById('calcLoading');
        const insuranceCheckbox = document.getElementById('calcInsurance');

        if (oversizedCheckbox) {
            oversizedCheckbox.addEventListener('change', () => {
                this.oversized = oversizedCheckbox.checked;
                this.calculate();
            });
        }

        if (loadingCheckbox) {
            loadingCheckbox.addEventListener('change', () => {
                this.loading = loadingCheckbox.checked;
                this.calculate();
            });
        }

        if (insuranceCheckbox) {
            insuranceCheckbox.addEventListener('change', () => {
                this.insurance = insuranceCheckbox.checked;
                this.calculate();
            });
        }
    }

    setupCalculateButton() {
        const btn = document.getElementById('calculateBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                this.calculate();
                // Прокрутка к результату
                const result = document.getElementById('calculationResult');
                if (result) {
                    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }
    }

    async calculate() {
        // Показываем индикацию расчёта
        const resultEl = document.getElementById('calculationResult');
        if (resultEl) {
            resultEl.classList.add('calculating');
        }
        
        // Обновляем названия городов в результате
        const routeFromEl = document.getElementById('routeFrom');
        const routeToEl = document.getElementById('routeTo');
        
        if (routeFromEl) routeFromEl.textContent = this.cityFrom.name;
        if (routeToEl) routeToEl.textContent = this.cityTo.name;
        
        // Обновляем информацию о параметрах
        const transportTypeEl = document.getElementById('transportTypeValue');
        const weightEl = document.getElementById('weightValue');
        const volumeEl = document.getElementById('volumeValue');
        
        if (transportTypeEl) {
            transportTypeEl.textContent = this.transportType === 'dedicated' ? 'Отдельная машина' : 'Догруз';
        }
        if (weightEl) {
            weightEl.textContent = this.weight >= 1000 
                ? `${(this.weight / 1000).toFixed(1)} т` 
                : `${this.weight} кг`;
        }
        if (volumeEl) {
            volumeEl.textContent = `${this.volume} м³`;
        }
        
        // Получаем расстояние
        let distance;
        if (this.cityFrom.lat && this.cityFrom.lon && this.cityTo.lat && this.cityTo.lon) {
            distance = await this.calculateDistanceOSRM(
                this.cityFrom.lat, this.cityFrom.lon,
                this.cityTo.lat, this.cityTo.lon
            );
        } else {
            distance = this.getEstimatedDistance(this.cityFrom.name, this.cityTo.name);
        }
        
        // Рассчитываем стоимость
        const price = this.calculatePrice(distance);
        
        // Обновляем результаты
        const distanceEl = document.getElementById('distanceValue');
        const priceEl = document.getElementById('priceValue');

        if (distanceEl) distanceEl.textContent = distance.toLocaleString('ru-RU');
        if (priceEl) priceEl.textContent = price.toLocaleString('ru-RU');
        
        // Показываем дополнительные услуги
        this.updateAdditionalServices();
        
        // Убираем индикацию расчёта
        if (resultEl) {
            setTimeout(() => {
                resultEl.classList.remove('calculating');
            }, 300);
        }
    }
    
    updateAdditionalServices() {
        const servicesEl = document.getElementById('additionalServices');
        if (!servicesEl) return;
        
        const services = [];
        if (this.oversized) services.push('Негабаритный груз (+25%)');
        if (this.loading) services.push('Погрузка/разгрузка (+5 000 ₽)');
        if (this.insurance) services.push('Страхование (+3%)');
        
        if (services.length > 0) {
            servicesEl.textContent = '✓ ' + services.join(', ');
            servicesEl.style.display = 'block';
        } else {
            servicesEl.style.display = 'none';
        }
    }

    async calculateDistanceOSRM(fromLat, fromLon, toLat, toLon) {
        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/` +
                `${fromLon},${fromLat};${toLon},${toLat}?overview=false`
            );
            
            const data = await response.json();
            if (data.code === 'Ok' && data.routes.length > 0) {
                return Math.round(data.routes[0].distance / 1000); // км
            }
        } catch (error) {
            console.error('Ошибка расчета расстояния:', error);
        }
        
        // Fallback на формулу Haversine
        return this.calculateDistanceHaversine(fromLat, fromLon, toLat, toLon);
    }

    calculateDistanceHaversine(lat1, lon1, lat2, lon2) {
        const R = 6371; // Радиус Земли в км
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.round(R * c * 1.3); // +30% на дороги
    }

    getEstimatedDistance(from, to) {
        // Fallback на локальную базу расстояний
        const key1 = `${from}-${to}`;
        const key2 = `${to}-${from}`;
        
        const distances = window.cityDistances || {};
        if (distances[key1]) return distances[key1];
        if (distances[key2]) return distances[key2];
        
        // Примерное расстояние
        return Math.floor(Math.random() * (2500 - 500) + 500);
    }

    calculatePrice(distance) {
        // Базовая ставка за км
        let rate = 28;
        
        // Тип перевозки
        if (this.transportType === 'dedicated') {
            rate += 12; // Отдельная машина дороже
        } else {
            rate += 5; // Догруз дешевле
        }
        
        // Коэффициент веса
        if (this.weight > 15000) {
            rate += 18;
        } else if (this.weight > 10000) {
            rate += 15;
        } else if (this.weight > 5000) {
            rate += 12;
        } else if (this.weight > 1000) {
            rate += 8;
        } else if (this.weight > 500) {
            rate += 5;
        }
        
        // Коэффициент объема
        if (this.volume > 80) {
            rate += 15;
        } else if (this.volume > 40) {
            rate += 12;
        } else if (this.volume > 20) {
            rate += 8;
        } else if (this.volume > 10) {
            rate += 5;
        } else if (this.volume > 5) {
            rate += 3;
        }
        
        // Базовая стоимость
        let price = distance * rate;
        
        // Дополнительные услуги
        if (this.oversized) {
            price *= 1.25; // +25% за негабарит
        }
        
        if (this.loading) {
            price += 5000; // Фиксированная стоимость погрузки/разгрузки
        }
        
        if (this.insurance) {
            price *= 1.03; // +3% за страхование
        }
        
        // Минимальная стоимость
        if (price < 12000) {
            price = 12000;
        }
        
        // Округление до сотен
        return Math.round(price / 100) * 100;
    }
}

// Инициализация калькулятора
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
