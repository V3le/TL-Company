// Загрузка footer
async function loadFooter() {
    try {
        const response = await fetch('components/footer.html?v=' + Date.now());
        if (!response.ok) {
            throw new Error('Не удалось загрузить footer');
        }
        const html = await response.text();
        
        const footerPlaceholder = document.getElementById('footer-placeholder');
        
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = html.trim();
        }
    } catch (error) {
        console.error('Ошибка загрузки footer:', error);
    }
}

// Загружаем footer при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}
