// Данные филиалов (синие маркеры)
const branches = [
    { city: 'Москва', terminals: 10, lat: 55.7558, lng: 37.6173, address: 'г. Москва, ул. Примерная, д. 1', phone: '+7 (499) 460-17-40', email: 'moscow@a2b.ru', type: 'branch', timezone: 'Europe/Moscow', utcOffset: 3 },
    { city: 'Санкт-Петербург', terminals: 4, lat: 59.9343, lng: 30.3351, address: 'г. Санкт-Петербург, пр. Невский, д. 100', phone: '+7 (812) 123-45-67', email: 'spb@a2b.ru', type: 'branch', utcOffset: 3 },
    { city: 'Екатеринбург', terminals: 5, lat: 56.8389, lng: 60.6057, address: 'г. Екатеринбург, ул. Ленина, д. 50', phone: '+7 (343) 123-45-67', email: 'ekb@a2b.ru', type: 'branch', utcOffset: 5 },
    { city: 'Новосибирск', terminals: 3, lat: 55.0084, lng: 82.9357, address: 'г. Новосибирск, ул. Красный проспект, д. 1', phone: '+7 (383) 123-45-67', email: 'nsk@a2b.ru', type: 'branch', utcOffset: 7 },
    { city: 'Казань', terminals: 3, lat: 55.8304, lng: 49.0661, address: 'г. Казань, ул. Баумана, д. 20', phone: '+7 (843) 123-45-67', email: 'kazan@a2b.ru', type: 'branch', utcOffset: 3 },
    { city: 'Нижний Новгород', terminals: 3, lat: 56.2965, lng: 43.9361, address: 'г. Нижний Новгород, ул. Большая Покровская, д. 10', phone: '+7 (831) 123-45-67', email: 'nn@a2b.ru', type: 'branch', utcOffset: 3 },
    { city: 'Челябинск', terminals: 3, lat: 55.1644, lng: 61.4368, address: 'г. Челябинск, пр. Ленина, д. 30', phone: '+7 (351) 123-45-67', email: 'chel@a2b.ru', type: 'branch', utcOffset: 5 },
    { city: 'Самара', terminals: 3, lat: 53.1952, lng: 50.1069, address: 'г. Самара, ул. Ленинградская, д. 5', phone: '+7 (846) 123-45-67', email: 'samara@a2b.ru', type: 'branch', utcOffset: 4 },
    { city: 'Ростов-на-Дону', terminals: 3, lat: 47.2357, lng: 39.7015, address: 'г. Ростов-на-Дону, пр. Буденновский, д. 15', phone: '+7 (863) 123-45-67', email: 'rostov@a2b.ru', type: 'branch', utcOffset: 3 },
    { city: 'Уфа', terminals: 2, lat: 54.7388, lng: 55.9721, address: 'г. Уфа, ул. Ленина, д. 25', phone: '+7 (347) 123-45-67', email: 'ufa@a2b.ru', type: 'branch', utcOffset: 5 },
    { city: 'Красноярск', terminals: 2, lat: 56.0153, lng: 92.8932, address: 'г. Красноярск, пр. Мира, д. 40', phone: '+7 (391) 123-45-67', email: 'krsk@a2b.ru', type: 'branch', utcOffset: 7 },
    { city: 'Воронеж', terminals: 2, lat: 51.6605, lng: 39.2005, address: 'г. Воронеж, пр. Революции, д. 12', phone: '+7 (473) 123-45-67', email: 'vrn@a2b.ru', type: 'branch', utcOffset: 3 },
    { city: 'Пермь', terminals: 2, lat: 58.0105, lng: 56.2502, address: 'г. Пермь, ул. Ленина, д. 35', phone: '+7 (342) 123-45-67', email: 'perm@a2b.ru', type: 'branch', utcOffset: 5 },
    { city: 'Волгоград', terminals: 2, lat: 48.7080, lng: 44.5133, address: 'г. Волгоград, пр. Ленина, д. 18', phone: '+7 (8442) 12-34-56', email: 'vlg@a2b.ru', type: 'branch', utcOffset: 3 },
    { city: 'Краснодар', terminals: 2, lat: 45.0355, lng: 38.9753, address: 'г. Краснодар, ул. Красная, д. 22', phone: '+7 (861) 123-45-67', email: 'krd@a2b.ru', type: 'branch', utcOffset: 3 },
    { city: 'Саратов', terminals: 2, lat: 51.5924, lng: 46.0348, address: 'г. Саратов, пр. Кирова, д. 8', phone: '+7 (8452) 12-34-56', email: 'sar@a2b.ru', type: 'branch', utcOffset: 4 },
    { city: 'Тюмень', terminals: 2, lat: 57.1522, lng: 65.5272, address: 'г. Тюмень, ул. Республики, д. 14', phone: '+7 (3452) 12-34-56', email: 'tmn@a2b.ru', type: 'branch', utcOffset: 5 },
    { city: 'Тольятти', terminals: 1, lat: 53.5303, lng: 49.3461, address: 'г. Тольятти, ул. Автостроителей, д. 7', phone: '+7 (8482) 12-34-56', email: 'tlt@a2b.ru', type: 'branch', utcOffset: 4 },
    { city: 'Ижевск', terminals: 1, lat: 56.8519, lng: 53.2048, address: 'г. Ижевск, ул. Пушкинская, д. 16', phone: '+7 (3412) 12-34-56', email: 'izh@a2b.ru', type: 'branch', utcOffset: 4 },
    { city: 'Барнаул', terminals: 1, lat: 53.3606, lng: 83.7636, address: 'г. Барнаул, пр. Ленина, д. 28', phone: '+7 (3852) 12-34-56', email: 'brn@a2b.ru', type: 'branch', utcOffset: 7 },
    { city: 'Ульяновск', terminals: 1, lat: 54.3142, lng: 48.4031, address: 'г. Ульяновск, ул. Гончарова, д. 9', phone: '+7 (8422) 12-34-56', email: 'uln@a2b.ru', type: 'branch', utcOffset: 4 },
    { city: 'Иркутск', terminals: 1, lat: 52.2869, lng: 104.3050, address: 'г. Иркутск, ул. Карла Маркса, д. 11', phone: '+7 (3952) 12-34-56', email: 'irk@a2b.ru', type: 'branch', utcOffset: 8 },
    { city: 'Хабаровск', terminals: 2, lat: 48.4827, lng: 135.0838, address: 'г. Хабаровск, ул. Муравьева-Амурского, д. 13', phone: '+7 (4212) 12-34-56', email: 'khv@a2b.ru', type: 'branch', utcOffset: 10 },
    { city: 'Владивосток', terminals: 1, lat: 43.1056, lng: 131.8735, address: 'г. Владивосток, ул. Светланская, д. 19', phone: '+7 (423) 123-45-67', email: 'vvo@a2b.ru', type: 'branch', utcOffset: 10 },
    { city: 'Ярославль', terminals: 1, lat: 57.6261, lng: 39.8845, address: 'г. Ярославль, пр. Ленина, д. 6', phone: '+7 (4852) 12-34-56', email: 'yar@a2b.ru', type: 'branch', utcOffset: 3 },
];

// Города адресной доставки (зеленые маркеры)
const deliveryCities = [
    { city: 'Абакан', lat: 53.7215, lng: 91.4425, servicedBy: 'Красноярск', phone: '+7 (391) 123-45-67', type: 'delivery' },
    { city: 'Анапа', lat: 44.8951, lng: 37.3167, servicedBy: 'Краснодар', phone: '+7 (861) 123-45-67', type: 'delivery' },
    { city: 'Архангельск', lat: 64.5401, lng: 40.5433, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Астрахань', lat: 46.3497, lng: 48.0408, servicedBy: 'Волгоград', phone: '+7 (8442) 12-34-56', type: 'delivery' },
    { city: 'Балашиха', lat: 55.7964, lng: 37.9378, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Белгород', lat: 50.5997, lng: 36.5982, servicedBy: 'Воронеж', phone: '+7 (473) 123-45-67', type: 'delivery' },
    { city: 'Бийск', lat: 52.5394, lng: 85.2072, servicedBy: 'Барнаул', phone: '+7 (3852) 12-34-56', type: 'delivery' },
    { city: 'Благовещенск', lat: 50.2903, lng: 127.5274, servicedBy: 'Хабаровск', phone: '+7 (4212) 12-34-56', type: 'delivery' },
    { city: 'Братск', lat: 56.1515, lng: 101.6343, servicedBy: 'Иркутск', phone: '+7 (3952) 12-34-56', type: 'delivery' },
    { city: 'Брянск', lat: 53.2521, lng: 34.3717, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Великий Новгород', lat: 58.5213, lng: 31.2752, servicedBy: 'Санкт-Петербург', phone: '+7 (812) 123-45-67', type: 'delivery' },
    { city: 'Владикавказ', lat: 43.0368, lng: 44.6681, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Владимир', lat: 56.1366, lng: 40.3966, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Волжский', lat: 48.7854, lng: 44.7753, servicedBy: 'Волгоград', phone: '+7 (8442) 12-34-56', type: 'delivery' },
    { city: 'Вологда', lat: 59.2239, lng: 39.8843, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Выборг', lat: 60.7086, lng: 28.7528, servicedBy: 'Санкт-Петербург', phone: '+7 (812) 123-45-67', type: 'delivery' },
    { city: 'Геленджик', lat: 44.5611, lng: 38.0767, servicedBy: 'Краснодар', phone: '+7 (861) 123-45-67', type: 'delivery' },
    { city: 'Грозный', lat: 43.3181, lng: 45.6986, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Дзержинск', lat: 56.2392, lng: 43.4609, servicedBy: 'Нижний Новгород', phone: '+7 (831) 123-45-67', type: 'delivery' },
    { city: 'Домодедово', lat: 55.4344, lng: 37.7539, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Евпатория', lat: 45.1903, lng: 33.3667, servicedBy: 'Краснодар', phone: '+7 (861) 123-45-67', type: 'delivery' },
    { city: 'Железногорск', lat: 56.2511, lng: 93.5325, servicedBy: 'Красноярск', phone: '+7 (391) 123-45-67', type: 'delivery' },
    { city: 'Жуковский', lat: 55.5952, lng: 38.1202, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Златоуст', lat: 55.1714, lng: 59.6508, servicedBy: 'Челябинск', phone: '+7 (351) 123-45-67', type: 'delivery' },
    { city: 'Иваново', lat: 57.0000, lng: 40.9737, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Йошкар-Ола', lat: 56.6315, lng: 47.8903, servicedBy: 'Казань', phone: '+7 (843) 123-45-67', type: 'delivery' },
    { city: 'Калининград', lat: 54.7104, lng: 20.4522, servicedBy: 'Санкт-Петербург', phone: '+7 (812) 123-45-67', type: 'delivery' },
    { city: 'Калуга', lat: 54.5293, lng: 36.2754, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Каменск-Уральский', lat: 56.4151, lng: 61.9189, servicedBy: 'Екатеринбург', phone: '+7 (343) 123-45-67', type: 'delivery' },
    { city: 'Канск', lat: 56.2015, lng: 95.7175, servicedBy: 'Красноярск', phone: '+7 (391) 123-45-67', type: 'delivery' },
    { city: 'Кемерово', lat: 55.3547, lng: 86.0861, servicedBy: 'Новосибирск', phone: '+7 (383) 123-45-67', type: 'delivery' },
    { city: 'Керчь', lat: 45.3569, lng: 36.4706, servicedBy: 'Краснодар', phone: '+7 (861) 123-45-67', type: 'delivery' },
    { city: 'Киров', lat: 58.6035, lng: 49.6680, servicedBy: 'Казань', phone: '+7 (843) 123-45-67', type: 'delivery' },
    { city: 'Кисловодск', lat: 43.9129, lng: 42.7214, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Коломна', lat: 55.0794, lng: 38.7783, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Комсомольск-на-Амуре', lat: 50.5497, lng: 137.0108, servicedBy: 'Хабаровск', phone: '+7 (4212) 12-34-56', type: 'delivery' },
    { city: 'Кострома', lat: 57.7679, lng: 40.9269, servicedBy: 'Ярославль', phone: '+7 (4852) 12-34-56', type: 'delivery' },
    { city: 'Курган', lat: 55.4500, lng: 65.3333, servicedBy: 'Челябинск', phone: '+7 (351) 123-45-67', type: 'delivery' },
    { city: 'Курск', lat: 51.7373, lng: 36.1873, servicedBy: 'Воронеж', phone: '+7 (473) 123-45-67', type: 'delivery' },
    { city: 'Липецк', lat: 52.6103, lng: 39.5708, servicedBy: 'Воронеж', phone: '+7 (473) 123-45-67', type: 'delivery' },
    { city: 'Магадан', lat: 59.5636, lng: 150.8027, servicedBy: 'Владивосток', phone: '+7 (423) 123-45-67', type: 'delivery' },
    { city: 'Магнитогорск', lat: 53.4115, lng: 58.9794, servicedBy: 'Челябинск', phone: '+7 (351) 123-45-67', type: 'delivery' },
    { city: 'Майкоп', lat: 44.6098, lng: 40.1006, servicedBy: 'Краснодар', phone: '+7 (861) 123-45-67', type: 'delivery' },
    { city: 'Махачкала', lat: 42.9849, lng: 47.5047, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Миасс', lat: 55.0450, lng: 60.1083, servicedBy: 'Челябинск', phone: '+7 (351) 123-45-67', type: 'delivery' },
    { city: 'Мурманск', lat: 68.9585, lng: 33.0827, servicedBy: 'Санкт-Петербург', phone: '+7 (812) 123-45-67', type: 'delivery' },
    { city: 'Муром', lat: 55.5753, lng: 42.0426, servicedBy: 'Нижний Новгород', phone: '+7 (831) 123-45-67', type: 'delivery' },
    { city: 'Набережные Челны', lat: 55.7430, lng: 52.4078, servicedBy: 'Казань', phone: '+7 (843) 123-45-67', type: 'delivery' },
    { city: 'Нальчик', lat: 43.4981, lng: 43.6189, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Находка', lat: 42.8133, lng: 132.8735, servicedBy: 'Владивосток', phone: '+7 (423) 123-45-67', type: 'delivery' },
    { city: 'Нефтекамск', lat: 56.0881, lng: 54.2667, servicedBy: 'Уфа', phone: '+7 (347) 123-45-67', type: 'delivery' },
    { city: 'Нефтеюганск', lat: 61.0998, lng: 72.6035, servicedBy: 'Тюмень', phone: '+7 (3452) 12-34-56', type: 'delivery' },
    { city: 'Нижневартовск', lat: 60.9344, lng: 76.5531, servicedBy: 'Тюмень', phone: '+7 (3452) 12-34-56', type: 'delivery' },
    { city: 'Нижнекамск', lat: 55.6364, lng: 51.8215, servicedBy: 'Казань', phone: '+7 (843) 123-45-67', type: 'delivery' },
    { city: 'Нижний Тагил', lat: 57.9191, lng: 59.9653, servicedBy: 'Екатеринбург', phone: '+7 (343) 123-45-67', type: 'delivery' },
    { city: 'Новокузнецк', lat: 53.7557, lng: 87.1099, servicedBy: 'Новосибирск', phone: '+7 (383) 123-45-67', type: 'delivery' },
    { city: 'Новомосковск', lat: 54.0097, lng: 38.2894, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Новороссийск', lat: 44.7239, lng: 37.7686, servicedBy: 'Краснодар', phone: '+7 (861) 123-45-67', type: 'delivery' },
    { city: 'Новочебоксарск', lat: 56.1022, lng: 47.4778, servicedBy: 'Казань', phone: '+7 (843) 123-45-67', type: 'delivery' },
    { city: 'Новочеркасск', lat: 47.4214, lng: 40.0936, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Новый Уренгой', lat: 66.0833, lng: 76.6333, servicedBy: 'Тюмень', phone: '+7 (3452) 12-34-56', type: 'delivery' },
    { city: 'Ногинск', lat: 55.8650, lng: 38.4444, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Норильск', lat: 69.3558, lng: 88.1893, servicedBy: 'Красноярск', phone: '+7 (391) 123-45-67', type: 'delivery' },
    { city: 'Обнинск', lat: 55.0969, lng: 36.6072, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Одинцово', lat: 55.6797, lng: 37.2828, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Омск', lat: 54.9885, lng: 73.3242, servicedBy: 'Новосибирск', phone: '+7 (383) 123-45-67', type: 'delivery' },
    { city: 'Орёл', lat: 52.9651, lng: 36.0785, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Оренбург', lat: 51.7727, lng: 55.0988, servicedBy: 'Уфа', phone: '+7 (347) 123-45-67', type: 'delivery' },
    { city: 'Орск', lat: 51.2045, lng: 58.4707, servicedBy: 'Оренбург', phone: '+7 (347) 123-45-67', type: 'delivery' },
    { city: 'Пенза', lat: 53.2001, lng: 45.0047, servicedBy: 'Самара', phone: '+7 (846) 123-45-67', type: 'delivery' },
    { city: 'Первоуральск', lat: 56.9081, lng: 59.9431, servicedBy: 'Екатеринбург', phone: '+7 (343) 123-45-67', type: 'delivery' },
    { city: 'Петрозаводск', lat: 61.7849, lng: 34.3469, servicedBy: 'Санкт-Петербург', phone: '+7 (812) 123-45-67', type: 'delivery' },
    { city: 'Петропавловск-Камчатский', lat: 53.0245, lng: 158.6433, servicedBy: 'Владивосток', phone: '+7 (423) 123-45-67', type: 'delivery' },
    { city: 'Подольск', lat: 55.4242, lng: 37.5544, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Прокопьевск', lat: 53.9061, lng: 86.7194, servicedBy: 'Новосибирск', phone: '+7 (383) 123-45-67', type: 'delivery' },
    { city: 'Псков', lat: 57.8136, lng: 28.3496, servicedBy: 'Санкт-Петербург', phone: '+7 (812) 123-45-67', type: 'delivery' },
    { city: 'Пятигорск', lat: 44.0486, lng: 43.0594, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Раменское', lat: 55.5675, lng: 38.2264, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Рубцовск', lat: 51.5136, lng: 81.2086, servicedBy: 'Барнаул', phone: '+7 (3852) 12-34-56', type: 'delivery' },
    { city: 'Рыбинск', lat: 58.0446, lng: 38.8275, servicedBy: 'Ярославль', phone: '+7 (4852) 12-34-56', type: 'delivery' },
    { city: 'Рязань', lat: 54.6269, lng: 39.6916, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Салават', lat: 53.3611, lng: 55.9278, servicedBy: 'Уфа', phone: '+7 (347) 123-45-67', type: 'delivery' },
    { city: 'Сарапул', lat: 56.4644, lng: 53.8028, servicedBy: 'Ижевск', phone: '+7 (3412) 12-34-56', type: 'delivery' },
    { city: 'Севастополь', lat: 44.6167, lng: 33.5250, servicedBy: 'Краснодар', phone: '+7 (861) 123-45-67', type: 'delivery' },
    { city: 'Северодвинск', lat: 64.5636, lng: 39.8303, servicedBy: 'Архангельск', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Северск', lat: 56.6000, lng: 84.8833, servicedBy: 'Новосибирск', phone: '+7 (383) 123-45-67', type: 'delivery' },
    { city: 'Сергиев Посад', lat: 56.3000, lng: 38.1333, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Серпухов', lat: 54.9156, lng: 37.4114, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Симферополь', lat: 44.9521, lng: 34.1024, servicedBy: 'Краснодар', phone: '+7 (861) 123-45-67', type: 'delivery' },
    { city: 'Смоленск', lat: 54.7818, lng: 32.0401, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Сочи', lat: 43.6028, lng: 39.7342, servicedBy: 'Краснодар', phone: '+7 (861) 123-45-67', type: 'delivery' },
    { city: 'Ставрополь', lat: 45.0428, lng: 41.9734, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Старый Оскол', lat: 51.2978, lng: 37.8411, servicedBy: 'Воронеж', phone: '+7 (473) 123-45-67', type: 'delivery' },
    { city: 'Стерлитамак', lat: 53.6247, lng: 55.9506, servicedBy: 'Уфа', phone: '+7 (347) 123-45-67', type: 'delivery' },
    { city: 'Сургут', lat: 61.2500, lng: 73.4167, servicedBy: 'Тюмень', phone: '+7 (3452) 12-34-56', type: 'delivery' },
    { city: 'Сызрань', lat: 53.1586, lng: 48.4681, servicedBy: 'Самара', phone: '+7 (846) 123-45-67', type: 'delivery' },
    { city: 'Сыктывкар', lat: 61.6681, lng: 50.8372, servicedBy: 'Пермь', phone: '+7 (342) 123-45-67', type: 'delivery' },
    { city: 'Таганрог', lat: 47.2362, lng: 38.8969, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Тамбов', lat: 52.7214, lng: 41.4525, servicedBy: 'Воронеж', phone: '+7 (473) 123-45-67', type: 'delivery' },
    { city: 'Тверь', lat: 56.8587, lng: 35.9176, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Томск', lat: 56.4977, lng: 84.9744, servicedBy: 'Новосибирск', phone: '+7 (383) 123-45-67', type: 'delivery' },
    { city: 'Тула', lat: 54.1961, lng: 37.6182, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Тында', lat: 55.1667, lng: 124.7167, servicedBy: 'Хабаровск', phone: '+7 (4212) 12-34-56', type: 'delivery' },
    { city: 'Улан-Удэ', lat: 51.8272, lng: 107.6063, servicedBy: 'Иркутск', phone: '+7 (3952) 12-34-56', type: 'delivery' },
    { city: 'Уссурийск', lat: 43.7985, lng: 131.9481, servicedBy: 'Владивосток', phone: '+7 (423) 123-45-67', type: 'delivery' },
    { city: 'Ухта', lat: 63.5672, lng: 53.6972, servicedBy: 'Сыктывкар', phone: '+7 (342) 123-45-67', type: 'delivery' },
    { city: 'Феодосия', lat: 45.0317, lng: 35.3817, servicedBy: 'Краснодар', phone: '+7 (861) 123-45-67', type: 'delivery' },
    { city: 'Химки', lat: 55.8970, lng: 37.4297, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Чебоксары', lat: 56.1439, lng: 47.2489, servicedBy: 'Казань', phone: '+7 (843) 123-45-67', type: 'delivery' },
    { city: 'Череповец', lat: 59.1333, lng: 37.9000, servicedBy: 'Вологда', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Черкесск', lat: 44.2233, lng: 42.0578, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Чита', lat: 52.0333, lng: 113.5000, servicedBy: 'Иркутск', phone: '+7 (3952) 12-34-56', type: 'delivery' },
    { city: 'Шахты', lat: 47.7089, lng: 40.2147, servicedBy: 'Ростов-на-Дону', phone: '+7 (863) 123-45-67', type: 'delivery' },
    { city: 'Щёлково', lat: 55.9211, lng: 37.9978, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Электросталь', lat: 55.7897, lng: 38.4464, servicedBy: 'Москва', phone: '+7 (499) 460-17-40', type: 'delivery' },
    { city: 'Элиста', lat: 46.3078, lng: 44.2553, servicedBy: 'Волгоград', phone: '+7 (8442) 12-34-56', type: 'delivery' },
    { city: 'Энгельс', lat: 51.4833, lng: 46.1167, servicedBy: 'Саратов', phone: '+7 (8452) 12-34-56', type: 'delivery' },
    { city: 'Южно-Сахалинск', lat: 46.9590, lng: 142.7386, servicedBy: 'Владивосток', phone: '+7 (423) 123-45-67', type: 'delivery' },
    { city: 'Якутск', lat: 62.0355, lng: 129.6755, servicedBy: 'Иркутск', phone: '+7 (3952) 12-34-56', type: 'delivery' },
];

// Объединяем все точки
const allPoints = [...branches, ...deliveryCities];

let map;
let branchesCollection;
let deliveryCollection;
let currentBranch = null;
let activeFilter = 'branches';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен');
    
    // Проверяем наличие ymaps
    if (typeof ymaps === 'undefined') {
        console.error('Яндекс.Карты не загружены!');
        return;
    }
    
    ymaps.ready(() => {
        console.log('Яндекс.Карты готовы');
        initMap();
    });
    
    renderCitiesList();
    setupSearch();
    setupFilters();
    updateBranchCount();
});

// Инициализация Яндекс.Карты
function initMap() {
    console.log('Инициализация карты...');
    
    try {
        map = new ymaps.Map('map', {
            center: [55.7558, 37.6173],
            zoom: 4,
            controls: ['zoomControl', 'fullscreenControl']
        });

        console.log('Карта создана');
        branchesCollection = new ymaps.GeoObjectCollection();
        deliveryCollection = new ymaps.GeoObjectCollection();
    
        // Добавляем метки филиалов (синие)
        branches.forEach(branch => {
            const placemark = new ymaps.Placemark(
                [branch.lat, branch.lng],
                {
                    balloonContentHeader: `<strong>${branch.city}</strong>`,
                    balloonContentBody: `<strong>ФИЛИАЛ</strong><br>${branch.terminals} терминал${getTerminalEnding(branch.terminals)}<br>${branch.address}`,
                    balloonContentFooter: `<a href="tel:${branch.phone}">${branch.phone}</a>`,
                    hintContent: branch.city
                },
                {
                    preset: 'islands#blueDotIcon',
                    iconColor: '#2196F3'
                }
            );

            placemark.events.add('click', () => {
                showBranchDetails(branch);
            });

            branchesCollection.add(placemark);
        });

        // Добавляем метки городов адресной доставки (зеленые)
        deliveryCities.forEach(city => {
            const placemark = new ymaps.Placemark(
                [city.lat, city.lng],
                {
                    balloonContentHeader: `<strong>${city.city}</strong>`,
                    balloonContentBody: `<strong>ГОРОД АДРЕСНОЙ ДОСТАВКИ</strong><br>Обслуживается филиалом г. ${city.servicedBy}`,
                    balloonContentFooter: `<a href="tel:${city.phone}">${city.phone}</a>`,
                    hintContent: city.city
                },
                {
                    preset: 'islands#greenDotIcon',
                    iconColor: '#4CAF50'
                }
            );

            placemark.events.add('click', () => {
                showDeliveryDetails(city);
            });

            deliveryCollection.add(placemark);
        });

        map.geoObjects.add(branchesCollection);
        map.geoObjects.add(deliveryCollection);
        
        console.log(`Добавлено ${branches.length} филиалов и ${deliveryCities.length} городов доставки`);
    } catch (error) {
        console.error('Ошибка при инициализации карты:', error);
    }
}

// Отрисовка списка городов
function renderCitiesList() {
    const citiesList = document.getElementById('citiesList');
    const sortedBranches = [...branches].sort((a, b) => a.city.localeCompare(b.city, 'ru'));
    
    let currentLetter = '';
    let html = '';
    
    sortedBranches.forEach(branch => {
        const firstLetter = branch.city[0].toUpperCase();
        
        if (firstLetter !== currentLetter) {
            if (currentLetter !== '') {
                html += '</div>';
            }
            currentLetter = firstLetter;
            html += `
                <div class="city-group">
                    <div class="city-letter">${currentLetter}</div>
            `;
        }
        
        html += `
            <div class="city-item" onclick="selectCity('${branch.city}')">
                <span class="city-name">${branch.city}</span>
                <span class="city-terminals">${branch.terminals} терминал${getTerminalEnding(branch.terminals)}</span>
            </div>
        `;
    });
    
    html += '</div>';
    citiesList.innerHTML = html;
}

// Окончание для слова "терминал"
function getTerminalEnding(count) {
    if (count === 1) return '';
    if (count >= 2 && count <= 4) return 'а';
    return 'ов';
}

// Выбор города
function selectCity(cityName) {
    const branch = branches.find(b => b.city === cityName);
    if (branch) {
        // Убираем активный класс со всех городов
        document.querySelectorAll('.city-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Добавляем активный класс выбранному городу
        event.target.closest('.city-item').classList.add('active');
        
        // Центрируем карту на городе
        map.setCenter([branch.lat, branch.lng], 12, {
            duration: 500
        });
        
        // Показываем детали
        showBranchDetails(branch);
    }
}

// Интервал для обновления времени
let timeUpdateInterval = null;

// Показать детали филиала
function showBranchDetails(branch) {
    currentBranch = branch;
    const details = document.getElementById('branchDetails');
    
    document.getElementById('branchCity').textContent = branch.city;
    document.getElementById('branchSubtitle').textContent = `ФИЛИАЛ`;
    document.getElementById('branchAddress').textContent = branch.address;
    
    const phoneLink = document.getElementById('branchPhone');
    phoneLink.href = `tel:${branch.phone}`;
    phoneLink.querySelector('.contact-text').textContent = branch.phone;
    
    const emailLink = document.getElementById('branchEmail');
    emailLink.href = `mailto:${branch.email}`;
    emailLink.querySelector('.contact-text').textContent = branch.email;
    
    // Обновляем время и часовой пояс
    updateLocalTime(branch);
    
    // Подсвечиваем текущий день недели для этого часового пояса
    highlightCurrentDay(branch);
    
    details.style.display = 'block';
    
    // Запускаем обновление времени каждую секунду
    if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval);
    }
    timeUpdateInterval = setInterval(() => updateLocalTime(branch), 1000);
}

// Обновить местное время
function updateLocalTime(branch) {
    const utcOffset = branch.utcOffset || 3; // По умолчанию МСК
    
    // Получаем текущее время UTC
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    
    // Добавляем смещение для города
    const localTime = new Date(utcTime + (3600000 * utcOffset));
    
    // Форматируем время
    const hours = String(localTime.getHours()).padStart(2, '0');
    const minutes = String(localTime.getMinutes()).padStart(2, '0');
    
    // Обновляем отображение
    const timeElement = document.getElementById('localTime');
    const timezoneElement = document.getElementById('timezoneLabel');
    
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes}`;
    }
    
    if (timezoneElement) {
        const offsetStr = utcOffset >= 0 ? `+${utcOffset}` : utcOffset;
        timezoneElement.textContent = `МСК${offsetStr === '+3' ? '' : offsetStr}`;
    }
}

// Подсветить текущий день недели
function highlightCurrentDay(branch) {
    const utcOffset = branch.utcOffset || 3;
    
    // Получаем текущий день с учетом часового пояса
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utcTime + (3600000 * utcOffset));
    const today = localTime.getDay();
    
    const scheduleDays = document.querySelectorAll('.schedule-day');
    
    scheduleDays.forEach(day => {
        day.classList.remove('today');
        if (parseInt(day.dataset.day) === today) {
            day.classList.add('today');
        }
    });
}

// Показать детали города доставки
function showDeliveryDetails(city) {
    currentBranch = city;
    const details = document.getElementById('branchDetails');
    
    document.getElementById('branchCity').textContent = city.city;
    document.getElementById('branchSubtitle').textContent = `ГОРОД АДРЕСНОЙ ДОСТАВКИ`;
    document.getElementById('branchAddress').textContent = `Обслуживается филиалом г. ${city.servicedBy}`;
    
    const phoneLink = document.getElementById('branchPhone');
    phoneLink.href = `tel:${city.phone}`;
    phoneLink.querySelector('.contact-text').textContent = city.phone;
    
    const emailLink = document.getElementById('branchEmail');
    emailLink.href = `mailto:info@a2b.ru`;
    emailLink.querySelector('.contact-text').textContent = 'info@a2b.ru';
    
    details.style.display = 'block';
}

// Закрыть детали филиала
function closeBranchDetails() {
    document.getElementById('branchDetails').style.display = 'none';
    currentBranch = null;
    
    // Останавливаем обновление времени
    if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval);
        timeUpdateInterval = null;
    }
    
    // Убираем активный класс со всех городов
    document.querySelectorAll('.city-item').forEach(item => {
        item.classList.remove('active');
    });
}

// Переключение списка городов
function toggleCitiesList() {
    const sidebar = document.getElementById('branchesSidebar');
    sidebar.classList.toggle('active');
}

// Поиск
function setupSearch() {
    const searchInput = document.getElementById('citySearch');
    const searchBtn = document.querySelector('.search-btn');
    
    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            renderCitiesList();
            return;
        }
        
        const filtered = branches.filter(b => 
            b.city.toLowerCase().includes(query) ||
            b.address.toLowerCase().includes(query)
        );
        
        renderFilteredCities(filtered);
        
        // Если найден один результат, показываем его
        if (filtered.length === 1) {
            selectCity(filtered[0].city);
        }
    };
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Отрисовка отфильтрованных городов
function renderFilteredCities(filtered) {
    const citiesList = document.getElementById('citiesList');
    
    if (filtered.length === 0) {
        citiesList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Ничего не найдено</div>';
        return;
    }
    
    let html = '<div class="city-group">';
    
    filtered.forEach(branch => {
        html += `
            <div class="city-item" onclick="selectCity('${branch.city}')">
                <span class="city-name">${branch.city}</span>
                <span class="city-terminals">${branch.terminals} терминал${getTerminalEnding(branch.terminals)}</span>
            </div>
        `;
    });
    
    html += '</div>';
    citiesList.innerHTML = html;
}

// Настройка фильтров
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс со всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Добавляем активный класс нажатой кнопке
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            activeFilter = filter;
            
            // Показываем/скрываем маркеры
            if (filter === 'branches') {
                map.geoObjects.add(branchesCollection);
                map.geoObjects.remove(deliveryCollection);
            } else if (filter === 'delivery') {
                map.geoObjects.remove(branchesCollection);
                map.geoObjects.add(deliveryCollection);
            } else if (filter === 'pickup') {
                // Пока пусто
                map.geoObjects.remove(branchesCollection);
                map.geoObjects.remove(deliveryCollection);
            }
            
            console.log('Фильтр:', filter);
        });
    });
}

// Обновить счетчик филиалов
function updateBranchCount() {
    document.getElementById('branchCount').textContent = branches.length;
    
    // Обновляем счетчик городов доставки в HTML
    const deliveryBtn = document.querySelector('[data-filter="delivery"]');
    if (deliveryBtn) {
        const countSpan = deliveryBtn.textContent.match(/\((\d+)\)/);
        if (countSpan) {
            deliveryBtn.innerHTML = deliveryBtn.innerHTML.replace(/\(\d+\)/, `(${deliveryCities.length})`);
        }
    }
}
