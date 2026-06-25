// public/js/uiManager.js

export const initThemeToggle = (toggleBtnId) => {
    const btn = document.getElementById(toggleBtnId);
    const htmlEl = document.documentElement;

    btn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-bs-theme');
        if (currentTheme === 'light') {
            htmlEl.setAttribute('data-bs-theme', 'dark');
            btn.textContent = 'Modo Claro';
            btn.className = 'btn btn-light';
        } else {
            htmlEl.setAttribute('data-bs-theme', 'light');
            btn.textContent = 'Modo Oscuro';
            btn.className = 'btn btn-dark';
        }
    });
};

export const initScrollTop = (btnId) => {
    const btn = document.getElementById(btnId);

    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};