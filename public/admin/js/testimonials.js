// Модальное окно
function openModal() {
    document.getElementById('testimonialModal').style.display = 'flex';
    document.getElementById('modalTitle').textContent = 'Добавить благодарственное письмо';
    document.getElementById('testimonialForm').reset();
    document.getElementById('testimonial_id').value = '';
    document.getElementById('image-preview').innerHTML = '';
}

function closeModal() {
    document.getElementById('testimonialModal').style.display = 'none';
}

function editTestimonial(id) {
    console.log('Загрузка письма ID:', id);
    
    fetch(`/api/testimonials/read-one.php?id=${id}`)
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Полученные данные:', data);
            console.log('Тип данных:', typeof data);
            console.log('Ключи объекта:', Object.keys(data));
            
            if (data.message) {
                alert('Ошибка: ' + data.message);
                return;
            }
            
            // Открываем модалку
            document.getElementById('testimonialModal').style.display = 'flex';
            
            // Заполняем поля
            document.getElementById('modalTitle').textContent = 'Редактировать письмо';
            document.getElementById('testimonial_id').value = data.id || '';
            document.getElementById('company_name').value = data.company_name || '';
            document.getElementById('author_name').value = data.author_name || '';
            document.getElementById('content').value = data.content || '';
            document.getElementById('is_active').checked = data.is_active == 1;
            
            // Показываем текущее изображение если есть
            const preview = document.getElementById('image-preview');
            if (data.image_path) {
                preview.innerHTML = `
                    <div style="margin-top: 10px;">
                        <p style="color: #666; font-size: 13px;">Текущее изображение:</p>
                        <img src="/${data.image_path}" alt="Текущее фото" style="max-width: 300px; border-radius: 8px; margin-top: 5px;">
                    </div>
                `;
            } else {
                preview.innerHTML = '';
            }
            
            console.log('Поля заполнены');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка загрузки данных: ' + error.message);
        });
}

// Закрытие по клику вне модального окна
window.onclick = function(event) {
    const modal = document.getElementById('testimonialModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Превью изображения
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('image-preview');
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 300px; margin-top: 10px; border-radius: 8px;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Отправка формы
    const form = document.getElementById('testimonialForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const id = document.getElementById('testimonial_id').value;
            
            const url = id ? '/api/testimonials/update.php' : '/api/testimonials/create.php';
            
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert(id ? 'Письмо обновлено!' : 'Письмо добавлено!');
                    location.reload();
                } else {
                    alert('Ошибка: ' + (result.message || 'Неизвестная ошибка'));
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка при сохранении');
            }
        });
    }
});
