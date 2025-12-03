document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.companies-slider');
    const indicator = document.querySelector('.scroll-indicator');
    
    if (!slider || !indicator) return;

    // Запрет перетаскивания изображений
    const logos = slider.querySelectorAll('.company-logo');
    logos.forEach(logo => {
        logo.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        logo.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    });

    // Создание индикаторов
    const items = slider.querySelectorAll('.company-item');
    const dotsCount = Math.min(items.length, 5); // Максимум 5 точек
    
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('scroll-indicator-dot');
        if (i === 0) dot.classList.add('active');
        indicator.appendChild(dot);
    }

    const dots = indicator.querySelectorAll('.scroll-indicator-dot');

    // Обновление активного индикатора
    function updateIndicator() {
        const scrollPercentage = slider.scrollLeft / (slider.scrollWidth - slider.clientWidth);
        const activeIndex = Math.round(scrollPercentage * (dotsCount - 1));
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    // Клик по индикатору
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const scrollAmount = (slider.scrollWidth - slider.clientWidth) * (index / (dotsCount - 1));
            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    });

    // Отслеживание прокрутки
    slider.addEventListener('scroll', updateIndicator);

    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let momentumID;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('dragging');
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        velocity = 0;
        cancelMomentumTracking();
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('dragging');
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('dragging');
        slider.style.cursor = 'grab';
        beginMomentumTracking();
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        const prevScrollLeft = slider.scrollLeft;
        slider.scrollLeft = scrollLeft - walk;
        velocity = slider.scrollLeft - prevScrollLeft;
    });

    // Инерция прокрутки
    function beginMomentumTracking() {
        cancelMomentumTracking();
        momentumID = requestAnimationFrame(momentumLoop);
    }

    function cancelMomentumTracking() {
        cancelAnimationFrame(momentumID);
    }

    function momentumLoop() {
        slider.scrollLeft += velocity;
        velocity *= 0.95; // Затухание
        if (Math.abs(velocity) > 0.5) {
            momentumID = requestAnimationFrame(momentumLoop);
        }
    }

    // Touch events для мобильных устройств
    let touchStartX = 0;
    let touchScrollLeft = 0;
    let touchVelocity = 0;
    let touchMomentumID;
    let lastTouchX = 0;
    let lastTouchTime = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX - slider.offsetLeft;
        touchScrollLeft = slider.scrollLeft;
        lastTouchX = e.touches[0].pageX;
        lastTouchTime = Date.now();
        touchVelocity = 0;
        cancelAnimationFrame(touchMomentumID);
    });

    slider.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - touchStartX) * 2;
        const prevScrollLeft = slider.scrollLeft;
        slider.scrollLeft = touchScrollLeft - walk;
        
        // Вычисление скорости
        const now = Date.now();
        const dt = now - lastTouchTime;
        const dx = e.touches[0].pageX - lastTouchX;
        touchVelocity = dx / dt * 16; // Нормализация к 60fps
        
        lastTouchX = e.touches[0].pageX;
        lastTouchTime = now;
    });

    slider.addEventListener('touchend', () => {
        beginTouchMomentum();
    });

    function beginTouchMomentum() {
        cancelAnimationFrame(touchMomentumID);
        touchMomentumID = requestAnimationFrame(touchMomentumLoop);
    }

    function touchMomentumLoop() {
        slider.scrollLeft -= touchVelocity * 2;
        touchVelocity *= 0.95; // Затухание
        if (Math.abs(touchVelocity) > 0.5) {
            touchMomentumID = requestAnimationFrame(touchMomentumLoop);
        }
    }
});
