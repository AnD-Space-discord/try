/**
 * CCNA-LABS Theme Manager
 * Handles Dark/Light mode switching and persistence.
 */

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        this.addToggleToNav();
    }

    applyTheme() {
        if (this.theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        localStorage.setItem('theme', this.theme);
        this.updateToggleButton();
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
    }

    addToggleToNav() {
        // Try to find a place in nav or append to body as FAB
        const nav = document.querySelector('nav');
        if (nav) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'theme-toggle';
            toggleBtn.className = 'theme-toggle-btn';
            toggleBtn.setAttribute('aria-label', 'Toggle Theme');
            toggleBtn.innerHTML = this.getIcon();
            toggleBtn.onclick = () => this.toggleTheme();

            // Add style for the button if not in CSS
            nav.appendChild(toggleBtn);
        }
    }

    updateToggleButton() {
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.innerHTML = this.getIcon();
        }
    }

    getIcon() {
        return this.theme === 'dark'
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
