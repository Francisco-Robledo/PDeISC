document.addEventListener('DOMContentLoaded', () => {
    const renderZone = document.getElementById('renderZone');
    const placeholderText = document.getElementById('placeholderText');
    const toastStackContainer = document.getElementById('toastStackContainer');
    const html = document.documentElement;

    // Referencias en memoria de nodos
    let miH1 = null;
    let miImg = null;

    // Control de Botones
    const btnCambiarH1 = document.getElementById('btnCambiarH1');
    const btnColorH1 = document.getElementById('btnColorH1');
    const btnCambiarImg = document.getElementById('btnCambiarImg');
    const btnTamanoImg = document.getElementById('btnTamanoImg');
    const btnScrollTop = document.getElementById('btnScrollTop');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    // Deshabilitar controles al inicio
    btnCambiarH1.disabled = true;
    btnColorH1.disabled = true;
    btnCambiarImg.disabled = true;
    btnTamanoImg.disabled = true;

    // --- MANEJO DE TEMA CLARO/OSCURO CON LOCALSTORAGE ---
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    function applyTheme(theme) {
        html.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeToggle.className = 'btn btn-light btn-floating';
        } else {
            themeIcon.textContent = '🌙';
            themeToggle.className = 'btn btn-dark btn-floating';
        }
    }

    // --- TOP SCROLLING CONTROLLER ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            btnScrollTop.classList.add('show');
        } else {
            btnScrollTop.classList.remove('show');
        }
    });

    btnScrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- TOASTS ACUMULABLES ABAJO A LA DERECHA (HASTA 3 FIJOS) ---
    function lanzarToastFijo(mensaje) {
        // Control de acumulación máxima: si hay 3, sacamos el de más arriba
        if (toastStackContainer.children.length >= 3) {
            toastStackContainer.children[0].remove();
        }

        const toastDiv = document.createElement('div');
        toastDiv.className = 'toast show custom-toast-msg align-items-center border-0';
        toastDiv.role = 'alert';
        toastDiv.ariaLive = 'assertive';
        toastDiv.ariaAtomic = 'true';
        // data-bs-autohide="false" para que NO desaparezcan solos
        toastDiv.setAttribute('data-bs-autohide', 'false'); 
        
        toastDiv.innerHTML = `
            <div class="d-flex py-1">
                <div class="toast-body fw-bold">${mensaje}</div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        // Evento para limpiar el nodo del DOM real cuando el usuario cliquee la cruz
        toastDiv.querySelector('.btn-close').addEventListener('click', () => {
            toastDiv.remove();
        });

        toastStackContainer.appendChild(toastDiv);
    }

    // --- ACCIONES DHTML DEL PUNTO 1 ---

    // 1. Agregar H1
    document.getElementById('btnCrearH1').addEventListener('click', () => {
        if (!miH1) {
            if (renderZone.contains(placeholderText)) placeholderText.remove();

            miH1 = document.createElement('h1');
            miH1.textContent = 'Hola DOM';
            miH1.className = 'fw-black text-primary m-0';
            
            renderZone.prepend(miH1);
            btnCrearH1.disabled = true;
            btnCambiarH1.disabled = false;
            btnColorH1.disabled = false;
        }
    });

    // 2. Cambiar Texto H1
    btnCambiarH1.addEventListener('click', () => {
        if (miH1) {
            miH1.textContent = miH1.textContent === 'Hola DOM' ? 'Chau DOM' : 'Hola DOM';
        }
    });

    // 3. Cambiar Color H1
    btnColorH1.addEventListener('click', () => {
        if (miH1) {
            miH1.classList.toggle('text-custom-color');
            const tieneColor = miH1.classList.contains('text-custom-color');
        }
    });

    // 4. Agregar Imagen
    document.getElementById('btnCrearImg').addEventListener('click', () => {
        if (!miImg) {
            if (renderZone.contains(placeholderText)) placeholderText.remove();

            miImg = document.createElement('img');
            miImg.src = 'https://picsum.photos/id/237/200/150';
            miImg.alt = 'Imagen Dinámica DOM';
            miImg.className = 'img-fluid rounded img-custom';
            miImg.style.width = '200px';
            
            renderZone.appendChild(miImg);

            btnCambiarImg.disabled = false;
            btnTamanoImg.disabled = false;
            btnCrearImg.disabled = true;
            lanzarToastFijo('Componente de imagen insertado correctamente.');
        }
    });

    // 5. Cambiar Imagen
    btnCambiarImg.addEventListener('click', () => {
        if (miImg) {
            if (miImg.src.includes('id/237')) {
                miImg.src = 'https://picsum.photos/id/1025/200/150';
            } else {
                miImg.src = 'https://picsum.photos/id/237/200/150';
            }
        }
    });

    // 6. Cambiar Tamaño Img
    btnTamanoImg.addEventListener('click', () => {
        if (miImg) {
            const esGrande = miImg.style.width === '350px';
            miImg.style.width = esGrande ? '200px' : '350px';
        }
    });
});