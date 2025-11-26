// Testimonials Slider
document.addEventListener('DOMContentLoaded', async () => {
    const track = document.querySelector('.slider-track');
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
    let slides = [];
    let dots = [];
    
    // Загружаем благодарственные письма из API
    try {
        const response = await fetch('../api/testimonials/read.php');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.records && data.records.length > 0) {
            // Очищаем track
            track.innerHTML = '';
            
            // Создаем слайды из данных API
            data.records.forEach((testimonial, index) => {
                const slide = document.createElement('div');
                slide.classList.add('slide');
                if (index === 0) slide.classList.add('active');
                
                const slideContent = document.createElement('div');
                slideContent.classList.add('slide-content');
                
                if (testimonial.image_path) {
                    const img = document.createElement('img');
                    img.src = '../' + testimonial.image_path;
                    img.alt = `Благодарственное письмо от ${testimonial.company_name}`;
                    img.dataset.index = index;
                    img.onclick = function() {
                        openImageModal(this.src, index);
                    };
                    img.onerror = function() {
                        // Если изображение не загрузилось, показываем текст
                        this.style.display = 'none';
                        const textDiv = document.createElement('div');
                        textDiv.classList.add('testimonial-text');
                        textDiv.innerHTML = `
                            <h3>${testimonial.company_name}</h3>
                            ${testimonial.author_name ? `<p class="author">${testimonial.author_name}</p>` : ''}
                            <p>${testimonial.content}</p>
                        `;
                        slideContent.appendChild(textDiv);
                    };
                    slideContent.appendChild(img);
                } else {
                    // Если нет изображения, показываем текст
                    const textDiv = document.createElement('div');
                    textDiv.classList.add('testimonial-text');
                    textDiv.innerHTML = `
                        <h3>${testimonial.company_name}</h3>
                        ${testimonial.author_name ? `<p class="author">${testimonial.author_name}</p>` : ''}
                        <p>${testimonial.content}</p>
                    `;
                    slideContent.appendChild(textDiv);
                }
                
                slide.appendChild(slideContent);
                track.appendChild(slide);
            });
            
            slides = document.querySelectorAll('.slide');
            
            // Создаем точки навигации
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('slider-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            
            dots = document.querySelectorAll('.slider-dot');
        } else {
            // Нет данных
            track.innerHTML = `
                <div class="slide active">
                    <div class="slide-content">
                        <div class="testimonial-text">
                            <p>Благодарственные письма пока не добавлены</p>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Ошибка загрузки благодарственных писем:', error);
        track.innerHTML = `
            <div class="slide active">
                <div class="slide-content">
                    <div class="testimonial-text">
                        <p>Ошибка загрузки данных. Проверьте подключение к API.</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Функция перехода к слайду
    function goToSlide(index) {
        if (slides.length === 0) return;
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
        if (slides.length === 0) return;
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        if (slides.length === 0) return;
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
    
    // Начинаем наблюдение за секцией (только если она существует)
    if (sliderSection) {
        observer.observe(sliderSection);
    }
    
    // Модальное окно для полноэкранного просмотра
    let currentModalIndex = 0;
    let allImages = [];
    
    // Создаем модальное окно
    const imageModal = document.createElement('div');
    imageModal.className = 'image-modal';
    imageModal.innerHTML = `
        <span class="image-modal-close">&times;</span>
        <span class="image-modal-nav image-modal-prev">&#10094;</span>
        <img class="image-modal-content" src="" alt="Благодарственное письмо">
        <span class="image-modal-nav image-modal-next">&#10095;</span>
    `;
    document.body.appendChild(imageModal);
    
    const modalImg = imageModal.querySelector('.image-modal-content');
    const closeBtn = imageModal.querySelector('.image-modal-close');
    const prevModalBtn = imageModal.querySelector('.image-modal-prev');
    const nextModalBtn = imageModal.querySelector('.image-modal-next');
    
    window.openImageModal = function(src, index) {
        // Собираем все изображения
        allImages = Array.from(document.querySelectorAll('.slide-content img')).map(img => img.src);
        currentModalIndex = index;
        
        modalImg.src = src;
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    function closeImageModal() {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showPrevImage() {
        currentModalIndex = (currentModalIndex - 1 + allImages.length) % allImages.length;
        modalImg.src = allImages[currentModalIndex];
    }
    
    function showNextImage() {
        currentModalIndex = (currentModalIndex + 1) % allImages.length;
        modalImg.src = allImages[currentModalIndex];
    }
    
    closeBtn.onclick = closeImageModal;
    prevModalBtn.onclick = showPrevImage;
    nextModalBtn.onclick = showNextImage;
    
    // Закрытие по клику вне изображения
    imageModal.onclick = function(e) {
        if (e.target === imageModal) {
            closeImageModal();
        }
    };
    
    // Закрытие по Escape и навигация стрелками
    document.addEventListener('keydown', function(e) {
        if (imageModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeImageModal();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
    
    // События кнопок (только если есть кнопки)
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Остановка автопрокрутки при наведении
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', stopAutoplay);
        sliderWrapper.addEventListener('mouseleave', () => {
            if (isInView) {
                startAutoplay();
            }
        });
    }
    
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
