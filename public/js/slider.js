// Testimonials Slider
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn-prev');
    const nextBtn = document.querySelector('.slider-btn-next');
    const dotsContainer = document.querySelector('.slider-dots');
    const sliderSection = document.querySelector('.testimonials-slider');
    
    let currentIndex = 0;
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 секунд
    const slideWidth = 33.333; // Ширина одного слайда в процентах
    let isAutoplayActive = false;
    let isInView = false;
    
    // Создаем точки навигации
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.slider-dot');
    
    // Устанавливаем начальный активный слайд
    slides[0].classList.add('active');
    
    // Функция перехода к слайду
    function goToSlide(index) {
        currentIndex = index;
        
        // Центрируем активный слайд
        const offset = -currentIndex * slideWidth + slideWidth;
        track.style.transform = `translateX(${offset}%)`;
        
        // Обновляем активный класс для слайдов
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });
        
        // Обновляем активную точку
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // Перезапускаем автопрокрутку
        if (isInView) {
            resetAutoplay();
        }
    }
    
    // Следующий слайд
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
    }
    
    // Автопрокрутка
    function startAutoplay() {
        if (!isAutoplayActive && isInView) {
            autoplayInterval = setInterval(nextSlide, autoplayDelay);
            isAutoplayActive = true;
        }
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
        isAutoplayActive = false;
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // Intersection Observer для отслеживания видимости секции
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Секция должна быть видна на 30%
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isInView = entry.isIntersecting;
            
            if (entry.isIntersecting) {
                // Секция видна - запускаем автопрокрутку
                startAutoplay();
            } else {
                // Секция не видна - останавливаем автопрокрутку
                stopAutoplay();
            }
        });
    }, observerOptions);
    
    // Начинаем наблюдение за секцией
    observer.observe(sliderSection);
    
    // События кнопок
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Остановка автопрокрутки при наведении
    const sliderWrapper = document.querySelector('.slider-wrapper');
    sliderWrapper.addEventListener('mouseenter', stopAutoplay);
    sliderWrapper.addEventListener('mouseleave', () => {
        if (isInView) {
            startAutoplay();
        }
    });
    
    // Свайп на мобильных устройствах
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        if (isInView) {
            startAutoplay();
        }
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
});
