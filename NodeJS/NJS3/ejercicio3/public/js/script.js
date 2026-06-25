document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const components = document.querySelectorAll('.component-card');

    navButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            components.forEach((component) => component.classList.add('d-none'));

            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('d-none');
        });
    });

    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

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

    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let count = 0;
    const clickCount = document.getElementById('clickCount');

    document.getElementById('btnClick').addEventListener('click', () => {
        count++;
        clickCount.textContent = count;
    });

    document.getElementById('btnReset').addEventListener('click', () => {
        count = 0;
        clickCount.textContent = count;
    });

    const hoverBox = document.getElementById('hoverBox');

    hoverBox.addEventListener('mouseover', () => {
        hoverBox.style.backgroundColor = '#ffc107';
        hoverBox.style.transform = 'scale(1.05)';
        hoverBox.textContent = 'Gracias';
    });

    hoverBox.addEventListener('mouseout', () => {
        hoverBox.style.backgroundColor = '#dee2e6';
        hoverBox.style.transform = 'scale(1)';
        hoverBox.textContent = 'Pasa el mouse aqui';
    });

    document.getElementById('textInput').addEventListener('keyup', (event) => {
        document.getElementById('textOutput').textContent = event.target.value;
    });

    const shape = document.getElementById('dblClickShape');

    shape.addEventListener('dblclick', () => {
        shape.classList.toggle('shape-square');
    });

    const form = document.getElementById('demoForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        formMessage.textContent = 'Formulario enviado (simulado)';
        formMessage.className = 'mt-3 fw-bold text-success';
        form.reset();
    });

    const btnContarHijos = document.getElementById('btnContarHijos');
    const listaPadre = document.getElementById('listaPadre');
    const resultadoHijos = document.getElementById('resultadoHijos');

    btnContarHijos.addEventListener('click', () => {
        const cantidadHijos = listaPadre.children.length;
        resultadoHijos.textContent = cantidadHijos;
    });
});
