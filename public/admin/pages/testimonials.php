<?php
require_once '../config/session.php';
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: ../auth/login.php');
    exit;
}

include_once '../../../api/config/database.php';
include_once '../../../api/models/Testimonial.php';

$database = new Database();
$db = $database->getConnection();
$testimonial = new Testimonial($db);
$stmt = $testimonial->readAll();
$testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
$count = count($testimonials);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Благодарственные письма - Админ-панель</title>
    <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include '../includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include '../includes/header.php'; ?>
            
            <div class="admin-content">
                <div class="content-header">
                    <h1 class="page-title">Благодарственные письма</h1>
                    <button onclick="openModal()" class="btn btn-primary">+ Добавить письмо</button>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Фото</th>
                            <th>Компания</th>
                            <th>Автор</th>
                            <th>Текст</th>
                            <th>Статус</th>
                            <th>Дата</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($testimonials as $row): ?>
                        <tr style="background: white !important; color: black !important; height: 60px !important; border: 2px solid red !important;">
                            <td style="color: black !important; padding: 16px !important; background: white !important;"><?php echo $row['id']; ?></td>
                            <td style="color: black !important; padding: 16px !important; background: white !important;">
                                <?php if ($row['image_path']): ?>
                                    <img src="/<?php echo htmlspecialchars($row['image_path']); ?>" 
                                         alt="Фото" class="thumbnail">
                                <?php else: ?>
                                    <span class="no-image">Нет фото</span>
                                <?php endif; ?>
                            </td>
                            <td style="color: black !important; padding: 16px !important; background: white !important;"><?php echo htmlspecialchars($row['company_name']); ?></td>
                            <td style="color: black !important; padding: 16px !important; background: white !important;"><?php echo htmlspecialchars($row['author_name']); ?></td>
                            <td style="color: black !important; padding: 16px !important; background: white !important;" class="text-preview"><?php echo mb_substr(htmlspecialchars($row['content']), 0, 100); ?>...</td>
                            <td style="color: black !important; padding: 16px !important; background: white !important;">
                                <span class="status <?php echo $row['is_active'] ? 'active' : 'inactive'; ?>">
                                    <?php echo $row['is_active'] ? 'Активно' : 'Неактивно'; ?>
                                </span>
                            </td>
                            <td style="color: black !important; padding: 16px !important; background: white !important;"><?php echo date('d.m.Y', strtotime($row['created_at'])); ?></td>
                            <td style="color: black !important; padding: 16px !important; background: white !important;" class="actions">
                                <button onclick="editTestimonial(<?php echo $row['id']; ?>)" class="btn btn-edit">
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    Редактировать
                                </button>
                                <a href="../api/testimonial-delete.php?id=<?php echo $row['id']; ?>" 
                                   class="btn btn-delete" 
                                   onclick="return confirm('Удалить это письмо?')">
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Удалить
                                </a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if ($count == 0): ?>
                        <tr>
                            <td colspan="8" style="text-align: center; padding: 40px; color: #666;">
                                Нет благодарственных писем. Нажмите "Добавить письмо" чтобы создать первое.
                            </td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
                
                <?php if ($count > 0): ?>
                <p style="margin-top: 16px; color: #666;">Всего записей: <?php echo $count; ?></p>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Модальное окно для добавления -->
    <div id="testimonialModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle">Добавить благодарственное письмо</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <form id="testimonialForm" method="POST" enctype="multipart/form-data" class="testimonial-form">
                <input type="hidden" id="testimonial_id" name="id">
                
                <div class="form-group">
                    <label for="company_name">Название компании *</label>
                    <input type="text" id="company_name" name="company_name" required>
                </div>

                <div class="form-group">
                    <label for="author_name">ФИО автора</label>
                    <input type="text" id="author_name" name="author_name">
                </div>

                <div class="form-group">
                    <label for="content">Текст письма *</label>
                    <textarea id="content" name="content" rows="6" required></textarea>
                </div>

                <div class="form-group">
                    <label for="image">Фото письма (JPG, PNG, до 5MB)</label>
                    <input type="file" id="image" name="image" accept="image/*">
                    <div id="image-preview"></div>
                </div>

                <div class="form-group checkbox-group">
                    <label>
                        <input type="checkbox" name="is_active" id="is_active" checked>
                        Активно (отображать на сайте)
                    </label>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Сохранить</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Отмена</button>
                </div>
            </form>
        </div>
    </div>

    <script src="../js/testimonials.js"></script>
</body>
</html>
