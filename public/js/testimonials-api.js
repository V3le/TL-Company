// API для работы с благодарственными письмами
const API_URL = '../api';

class TestimonialsAPI {
    // Получить все письма
    static async getAll() {
        try {
            const response = await fetch(`${API_URL}/testimonials/read.php`);
            if (!response.ok) {
                throw new Error('Ошибка загрузки данных');
            }
            const data = await response.json();
            return data.records || [];
        } catch (error) {
            console.error('Ошибка:', error);
            return [];
        }
    }

    // Создать новое письмо
    static async create(testimonialData) {
        try {
            const response = await fetch(`${API_URL}/testimonials/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testimonialData)
            });
            
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Ошибка:', error);
            return { success: false, error };
        }
    }

    // Отобразить письма на странице
    static async displayTestimonials(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const testimonials = await this.getAll();
        
        if (testimonials.length === 0) {
            container.innerHTML = '<p>Благодарственные письма не найдены</p>';
            return;
        }

        container.innerHTML = testimonials.map(t => `
            <div class="testimonial-item">
                <div class="testimonial-header">
                    <h3>${t.company_name}</h3>
                    ${t.author_name ? `<p class="author">${t.author_name}</p>` : ''}
                </div>
                <div class="testimonial-content">
                    <p>${t.content}</p>
                </div>
                ${t.image_path ? `<img src="${t.image_path}" alt="Благодарственное письмо">` : ''}
                <div class="testimonial-date">${new Date(t.created_at).toLocaleDateString('ru-RU')}</div>
            </div>
        `).join('');
    }
}
