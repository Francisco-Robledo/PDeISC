// public/js/main.js
import { getCardHTML, getAlertHTML, getProgressHTML } from './htmlTemplates.js';
import { initThemeToggle, initScrollTop } from './uiManager.js'; // Importamos la UI

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar UI
    initThemeToggle('themeToggle');
    initScrollTop('scrollTopBtn');

    // Lógica de inyección
    const container = document.getElementById('htmlContainer');
    const emptyMessage = document.getElementById('emptyMessage');

    const removeEmptyMessage = () => {
        if (emptyMessage && emptyMessage.parentNode) {
            emptyMessage.remove();
        }
    };

    document.getElementById('btnCard').addEventListener('click', () => {
        removeEmptyMessage();
        container.innerHTML += getCardHTML();
    });

    document.getElementById('btnAlert').addEventListener('click', () => {
        removeEmptyMessage();
        container.innerHTML += getAlertHTML();
    });

    document.getElementById('btnProgress').addEventListener('click', () => {
        removeEmptyMessage();
        container.innerHTML += getProgressHTML();
    });

    document.getElementById('btnClear').addEventListener('click', () => {
        container.innerHTML = '<p class="text-muted text-center" id="emptyMessage">Hacé click en los botones para agregar elementos acá...</p>';
    });
});