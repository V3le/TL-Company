<aside class="admin-sidebar">
    <div class="sidebar-header">
        <h2>TL Web</h2>
        <p>Админ-панель</p>
    </div>
    
    <nav class="sidebar-nav">
        <?php
        $current_dir = dirname($_SERVER['PHP_SELF']);
        if (strpos($current_dir, '/admin/pages') !== false) {
            $base = '';
        } elseif (strpos($current_dir, '/admin/auth') !== false) {
            $base = '../pages/';
        } else {
            $base = 'pages/';
        }
        ?>
        <a href="<?php echo $base; ?>dashboard.php" class="nav-item <?php echo basename($_SERVER['PHP_SELF']) == 'dashboard.php' ? 'active' : ''; ?>">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Главная</span>
        </a>
        
        <a href="<?php echo $base; ?>testimonials.php" class="nav-item <?php echo basename($_SERVER['PHP_SELF']) == 'testimonials.php' ? 'active' : ''; ?>">
            <span class="nav-icon">📝</span>
            <span class="nav-text">Благодарственные письма</span>
        </a>
        
        <a href="<?php echo $base; ?>contacts.php" class="nav-item <?php echo basename($_SERVER['PHP_SELF']) == 'contacts.php' || basename($_SERVER['PHP_SELF']) == 'contact-view.php' ? 'active' : ''; ?>">
            <span class="nav-icon">✉️</span>
            <span class="nav-text">Обращения</span>
            <?php
            include_once '../../../api/config/database.php';
            $database = new Database();
            $db = $database->getConnection();
            $query = "SELECT COUNT(*) as total FROM contacts WHERE status = 'new'";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $new_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            if ($new_count > 0):
            ?>
            <span class="nav-badge"><?php echo $new_count; ?></span>
            <?php endif; ?>
        </a>
    </nav>
    
    <div class="sidebar-footer">
        <?php
        if (strpos($current_dir, '/admin/pages') !== false) {
            $logout_path = '../auth/logout.php';
        } else {
            $logout_path = 'logout.php';
        }
        ?>
        <a href="<?php echo $logout_path; ?>" class="nav-item logout">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">Выход</span>
        </a>
    </div>
</aside>
