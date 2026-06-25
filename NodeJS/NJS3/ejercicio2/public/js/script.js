document.addEventListener('DOMContentLoaded', () => {
    
    // --- NAVEGACIÓN (Ocultar/Mostrar con Bootstrap d-none) ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const components = document.querySelectorAll('.component-card');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Ocultar todos añadiendo la clase d-none de Bootstrap
            components.forEach(comp => comp.classList.add('d-none'));
            // Mostrar el objetivo quitando d-none
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('d-none');
        });
    });

    // --- MODO CLARO / OSCURO (Nativo de Bootstrap 5.3) ---
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement; // Etiqueta <html>

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        if (currentTheme === 'light') {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            themeToggle.textContent = 'Modo Claro';
            themeToggle.classList.replace('btn-outline-secondary', 'btn-light');
        } else {
            htmlElement.setAttribute('data-bs-theme', 'light');
            themeToggle.textContent = 'Modo Oscuro';
            themeToggle.classList.replace('btn-light', 'btn-outline-secondary');
        }
    });

    // --- BOTÓN TOP SCROLLING ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- EVENTOS DE COMPONENTES ---

    // 1. Click
    let count = 0;
    document.getElementById('btnClick').addEventListener('click', () => {
        count++;
        document.getElementById('clickCount').textContent = count;
    });
    document.getElementById('btnReset').addEventListener('click', () => {
        count = 0;
        document.getElementById('clickCount').textContent = count;
    });
    // 2. Hover
    const hoverBox = document.getElementById('hoverBox');
    hoverBox.addEventListener('mouseover', () => {
        hoverBox.style.backgroundColor = '#ffc107'; // Warning color
        hoverBox.style.transform = 'scale(1.05)';
        hoverBox.textContent = '¡Gracias!';
    });
    hoverBox.addEventListener('mouseout', () => {
        hoverBox.style.backgroundColor = '#dee2e6';
        hoverBox.style.transform = 'scale(1)';
        hoverBox.textContent = 'Pasa el mouse aquí';
    });

    // 3. Keyup
    document.getElementById('textInput').addEventListener('keyup', (e) => {
        document.getElementById('textOutput').textContent = e.target.value;
    });

    // 4. DblClick
    const shape = document.getElementById('dblClickShape');
    shape.addEventListener('dblclick', () => {
        shape.classList.toggle('shape-square');
    });

    // 5. Submit
    const form = document.getElementById('demoForm');
    const formMessage = document.getElementById('formMessage');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formMessage.textContent = '¡Formulario enviado! (Simulado)';
        formMessage.className = 'mt-3 fw-bold text-success';
        form.reset();
    });
});