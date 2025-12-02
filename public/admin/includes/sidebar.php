<aside class="admin-sidebar">
    <div class="sidebar-header">
        <img src="../../images/logo/logo.png" alt="A2B Logistics" class="sidebar-logo">
        <h2>Админ-панель</h2>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="nav-text">Главная</span>
        </a>
        
        <a href="<?php echo $base; ?>testimonials.php" class="nav-item <?php echo basename($_SERVER['PHP_SELF']) == 'testimonials.php' ? 'active' : ''; ?>">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span class="nav-text">Благодарственные письма</span>
        </a>
        
        <a href="<?php echo $base; ?>orders.php" class="nav-item <?php echo basename($_SERVER['PHP_SELF']) == 'orders.php' || basename($_SERVER['PHP_SELF']) == 'order-view.php' ? 'active' : ''; ?>">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span class="nav-text">Заявки</span>
            <?php
            include_once '../../../api/config/database.php';
            $database = new Database();
            $db = $database->getConnection();
            $query = "SELECT COUNT(*) as total FROM orders WHERE status = 'new'";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $new_orders_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            if ($new_orders_count > 0):
            ?>
            <span class="nav-badge"><?php echo $new_orders_count; ?></span>
            <?php endif; ?>
        </a>
        
        <a href="<?php echo $base; ?>contacts.php" class="nav-item <?php echo basename($_SERVER['PHP_SELF']) == 'contacts.php' || basename($_SERVER['PHP_SELF']) == 'contact-view.php' ? 'active' : ''; ?>">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="nav-text">Обращения</span>
            <?php
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
            <span class="nav-text exit">Выход</span>
        </a>
    </div>
</aside>
