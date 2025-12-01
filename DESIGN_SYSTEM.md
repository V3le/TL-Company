# Единая система дизайна

Все стили сайта теперь используют единую систему дизайна с CSS переменными.

## Цветовая палитра

### Основные цвета

```css
--color-onyx: #222526           /* Onyx - самый темный (header/footer) */
--color-graphite: #353A3E       /* Graphite - темно-серый (текст/кнопки) */
--color-platinum: #E0E0E0       /* Platinum - светло-серый (фоны) */
--color-jet-black: #1A1A1A      /* Jet Black - черный (акценты) */
--color-ash: #BFBFBF            /* Ash - серый (вторичные элементы) */
--color-white: #ffffff          /* Белый */
```

### Применение цветов

```css
--color-primary: #1A1A1A          /* Основной цвет (Jet Black) */
--color-primary-hover: #353A3E    /* Hover (Graphite) */
--color-text: #1A1A1A             /* Основной текст (Jet Black) */
--color-text-secondary: #353A3E   /* Вторичный текст (Graphite) */
--color-text-light: #BFBFBF       /* Светлый текст (Ash) */
--color-background: #E0E0E0       /* Фон страницы (Platinum) */
--color-border: #BFBFBF           /* Рамки (Ash) */
--color-border-light: #E0E0E0     /* Светлые рамки (Platinum) */
```

## Тени

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04)
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08)
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12)
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.15)
```

## Радиусы

```css
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
--radius-full: 50%
```

## Отступы

```css
--spacing-xs: 8px
--spacing-sm: 12px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 40px
--spacing-3xl: 60px
```

## Размеры шрифтов

```css
--font-size-xs: 12px
--font-size-sm: 13px
--font-size-base: 14px
--font-size-md: 15px
--font-size-lg: 16px
--font-size-xl: 18px
--font-size-2xl: 24px
--font-size-3xl: 28px
--font-size-4xl: 36px
--font-size-5xl: 48px
```

## Переходы

```css
--transition-fast: 0.2s ease
--transition-base: 0.3s ease
--transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1)
```

## Использование

### В CSS файлах

```css
.my-element {
    background: var(--color-primary);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
}
```

### Fallback значения

Все переменные имеют fallback значения:

```css
background: var(--color-primary, #1a1a1a);
```

## Обновленные файлы

✅ **Система дизайна:**
- `css/design-system.css` - CSS переменные и базовые стили
- `css/modern-design.css` - Дополнительные утилиты

✅ **Обновленные компоненты:**
- `css/main.css` - Основные стили
- `css/header.css` - Header
- `css/how-we-work.css` - Секция "Как мы работаем"
- `css/transport-types.css` - Типы транспорта
- `css/russia-map.css` - Карта России
- `css/testimonials-slider.css` - Слайдер отзывов
- `css/contacts.css` - Контакты
- `css/footer.css` - Footer
- `css/modal.css` - Модальные окна
- `css/auth-modal.css` - Модальное окно авторизации

✅ **Не изменены:**
- `public/admin/**/*.css` - Админ-панель (как требовалось)

## Преимущества

1. **Единообразие** - все компоненты используют одинаковые цвета и стили
2. **Легкость изменений** - изменение одной переменной обновляет весь сайт
3. **Масштабируемость** - легко добавлять новые компоненты
4. **Поддержка** - проще поддерживать и обновлять код

## Как изменить цветовую схему

Отредактируйте переменные в `css/design-system.css`:

```css
:root {
    --color-primary: #your-color;
    --color-primary-hover: #your-hover-color;
    /* и т.д. */
}
```

Все компоненты автоматически обновятся!
