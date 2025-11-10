// Интерактивная карта России
document.addEventListener('DOMContentLoaded', () => {
    // Hover на регионах
    const regions = document.querySelectorAll('[data-code]');
    const district = document.querySelector('.district');
    const districtSpan = document.querySelector('.district span');
    
    regions.forEach(region => {
        region.addEventListener('mouseenter', function() {
            districtSpan.textContent = this.getAttribute('data-title');
            district.style.display = 'block';
        });
        
        region.addEventListener('mouseleave', function() {
            if (!document.querySelector('.rf-map').classList.contains('open')) {
                district.style.display = 'none';
            }
        });
        
        // Клик по региону
        region.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            districtSpan.textContent = title;
            district.style.display = 'block';
            
            regions.forEach(r => r.classList.add('dropfill'));
            this.classList.add('mainfill');
            document.querySelector('.rf-map').classList.add('open');
        });
    });
    
    // Закрытие карты
    const closeBtn = document.querySelector('.close-district');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMap();
    });
    
    document.body.addEventListener('click', (e) => {
        if (!e.target.closest('.rf-map')) {
            closeMap();
        }
    });
    
    document.querySelector('.rf-map').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    function closeMap() {
        document.querySelector('.rf-map').classList.remove('open');
        regions.forEach(r => {
            r.classList.remove('dropfill');
            r.classList.remove('mainfill');
        });
        district.style.display = 'none';
    }
    
    // Поиск городов
    const searchInput = document.getElementById('citySearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        document.querySelectorAll('.city-btn').forEach(btn => {
            const cityName = btn.textContent.toLowerCase();
            if (cityName.includes(searchTerm)) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
    });
    
    // Клики по кнопкам городов
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});
