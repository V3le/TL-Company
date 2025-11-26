<header class="admin-header-top">
    <div class="header-left">
        <button class="mobile-menu-btn" onclick="toggleSidebar()">☰</button>
        <a href="../../index.html" class="btn-back-to-site">← Вернуться на сайт</a>
    </div>
    <div class="header-right">
        <span class="user-info">👤 <?php echo htmlspecialchars($_SESSION['admin_username']); ?></span>
    </div>
</header>

<script>
function toggleSidebar() {
    document.querySelector('.admin-sidebar').classList.toggle('mobile-open');
}
</script>
