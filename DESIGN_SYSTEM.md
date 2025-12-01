# Единая система дизайна

Все стили сайта теперь используют единую систему дизайна с CSS переменными.

## Цвета

```css
--color-primary: #1a1a1a          /* Основной цвет (черный) */
--color-primary-hover: #333        /* Hover состояние */
--color-text: #1a1a1a             /* Основной текст */
--color-text-secondary: #666       /* Вторичный текст */
--color-text-light: #999          /* Светлый текст */
--color-background: #fafafa        /* Фон страницы */
--color-white: #ffffff            /* Белый */
--color-border: #e0e0e0           /* Рамки */
--color-border-light: #f0f0f0     /* Светлые рамки */
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
