<header class="admin-header-top">
    <div class="header-left">
        <button class="mobile-menu-btn" onclick="toggleSidebar()">☰</button>
    
        <a href="../../index.html" class="btn-back-to-site">← Вернуться на сайт</a>
    </div>
    <div class="header-right">
        <div class="user-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span><?php echo htmlspecialchars($_SESSION['admin_username']); ?></span>
        </div>
    </div>
</header>

<script>
function toggleSidebar() {
    document.querySelector('.admin-sidebar').classList.toggle('mobile-open');
}
</script>
