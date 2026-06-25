/* =========================================
   LÓGICA DEL MODO OSCURO
   ========================================= */
const toggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;

if (toggleBtn) {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            toggleBtn.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            toggleBtn.textContent = '🌙';
        }
    });
}

/* =========================================
   LÓGICA VOLVER ARRIBA
   ========================================= */
const btnArriba = document.getElementById('btnVolverArriba');

if (btnArriba) {
    window.addEventListener('scroll', () => {
        if (
            document.body.scrollTop > 300 ||
            document.documentElement.scrollTop > 300
        ) {
            btnArriba.style.display = 'block';
        } else {
            btnArriba.style.display = 'none';
        }
    });

    btnArriba.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* =========================================
   VALIDACIÓN FORMULARIO CONTACTO
   ========================================= */
const form = document.getElementById('formulario-contacto');
const alertaExito = document.getElementById('alerta-exito');

if (form && alertaExito) {
    form.addEventListener('submit', function (event) {

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();

            alertaExito.classList.remove('d-none');

            setTimeout(() => {
                alertaExito.classList.add('d-none');
            }, 5000);

            form.reset();
            form.classList.remove('was-validated');

            return;
        }

        form.classList.add('was-validated');
    }, false);
}