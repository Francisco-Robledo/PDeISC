import { createServer } from 'node:http';
import { ejercicio1 } from '../ejercicio1/ejercicio1.js';
import { ejercicio2 } from '../ejercicio2/ejercicio2.js';
import { ejercicio3 } from '../ejercicio3/ejercicio3.js';
import { ejercicio4 } from '../ejercicio4/ejercicio4.js';

const server = createServer((req, res) => {
    const r1 = ejercicio1();
    const r2 = ejercicio2();
    const r3 = ejercicio3();
    const r4 = ejercicio4();

    const html = `<!DOCTYPE html>
<html lang="es" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Control | NJS1</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <style>
        :root {
            --transition-speed: 0.3s;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
            background-color: var(--bs-body-bg);
            min-height: 100vh;
        }

        .custom-card {
            border: 1px solid var(--bs-border-color-translucent);
            border-radius: 16px;
            backdrop-filter: blur(8px);
            background-color: var(--bs-surface-bg);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .custom-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .output-box {
            background-color: var(--bs-tertiary-bg);
            border-radius: 10px;
            padding: 1rem;
            font-family: var(--bs-font-monospace);
            border-left: 4px solid var(--bs-primary);
        }

        /* --- BOTONES FLOTANTES (UX/UI Checklist) --- */
        .floating-actions {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            z-index: 1050;
        }

        .btn-floating {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            transition: transform 0.2s ease, opacity 0.2s ease, visibility 0.2s ease;
            border: 1px solid var(--bs-border-color-translucent);
        }

        .btn-floating:hover {
            transform: scale(1.1);
        }

        /* Estado oculto inicial para el botón de ir arriba */
        #btnScrollTop {
            opacity: 0;
            visibility: hidden;
        }

        #btnScrollTop.show {
            opacity: 1;
            visibility: visible;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        main {
            animation: fadeIn 0.4s ease-out forwards;
        }
    </style>
</head>
<body class="d-flex flex-column min-vh-100">

    <!-- Navbar Minimalista fija -->
    <nav class="navbar navbar-expand-lg border-bottom sticky-top bg-body">
        <div class="container py-1">
            <div class="d-flex align-items-center gap-2">
                <div class="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                <span class="navbar-brand fw-bold tracking-tight">NJS1</span>
            </div>
        </div>
    </nav>

<!-- Contenedor Principal Adaptable (Layout) -->
    <main class="container my-auto py-5">
        <div class="row justify-content-center">
            <div class="col-12 col-xl-10">

                <!-- TABLA REAL CON ESTÉTICA PREMIUM (Cumple 100% el requisito de tabla) -->
                <div class="card custom-card p-4">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle m-0">
                            <thead class="border-bottom">
                                <tr>
                                    <th scope="col" class="py-3" style="width: 10%">#</th>
                                    <th scope="col" class="py-3" style="width: 25%">Ejercicio</th>
                                    <th scope="col" class="py-3">Resultado obtenido desde el Servidor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row"><span class="badge bg-primary-subtle text-primary rounded-pill">1</span></th>
                                    <td class="fw-bold">Ejercicio 1</td>
                                    <td><div class="output-box">${r1}</div></td>
                                </tr>
                                <tr>
                                    <th scope="row"><span class="badge bg-success-subtle text-success rounded-pill">2</span></th>
                                    <td class="fw-bold">Ejercicio 2</td>
                                    <td><div class="output-box">${r2}</div></td>
                                </tr>
                                <tr>
                                    <th scope="row"><span class="badge bg-warning-subtle text-warning rounded-pill">3</span></th>
                                    <td class="fw-bold">Ejercicio 3</td>
                                    <td><div class="output-box">${r3}</div></td>
                                </tr>
                                <tr>
                                    <th scope="row"><span class="badge bg-info-subtle text-info rounded-pill">4</span></th>
                                    <td class="fw-bold">Ejercicio 4</td>
                                    <td><div class="output-box">${r4}</div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> <!-- Fin de la tabla -->

            </div>
        </div>
    </main>

    <!-- Panel de Acciones Flotantes Fijas -->
    <div class="floating-actions">
        <!-- Botón Top Scrolling -->
        <button id="btnScrollTop" class="btn btn-primary btn-floating" aria-label="Volver arriba" title="Volver arriba">
            ▲
        </button>
        <!-- Botón Tema Claro/Oscuro Flotante -->
        <button id="themeToggle" class="btn btn-secondary btn-floating" aria-label="Cambiar tema visual" title="Cambiar tema visual">
            <span id="themeIcon">☀️</span>
        </button>
    </div>

    <footer class="footer mt-auto py-3 border-top bg-body-tertiary">
        <div class="container text-center">
            <span class="text-muted small">Entorno de desarrollo local activo • Puerto 3005</span>
        </div>
    </footer>

    <!-- Sistema de Notificaciones Toast -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080;">
        <div id="statusToast" class="toast align-items-center text-bg-primary border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <span>⚡</span> <span>Servidor sincronizado correctamente.</span>
                </div>
                <button type="button" class="btn-close btn-close-white m-auto me-2" data-bs-dismiss="toast" aria-label="Cerrar"></button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = document.getElementById('themeIcon');
            const btnScrollTop = document.getElementById('btnScrollTop');
            const html = document.documentElement;

            // 1. Manejo y persistencia del tema claro/oscuro
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

            // 2. Control del scroll y visibilidad del botón flotante "Volver Arriba"
            window.addEventListener('scroll', () => {
                if (window.scrollY > 200) {
                    btnScrollTop.classList.add('show');
                } else {
                    btnScrollTop.classList.remove('show');
                }
            });

            btnScrollTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth' // Desplazamiento suave controlado
                });
            });

            // 3. Feedback Inicial Toast
            const toastEl = document.getElementById('statusToast');
            const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
            toast.show();
        });
    </script>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

server.listen(3005, '127.0.0.1', () => {
    console.log('Servidor corriendo con acciones flotantes fijas en http://127.0.0.1:3005');
});