import { createNodes, modifyNodes } from './nodeManager.js';
import { initThemeToggle, initScrollTop } from './uiManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar UI (Modo Oscuro y Top Scroll)
    initThemeToggle('themeToggle');
    initScrollTop('scrollTopBtn');

    // Elementos del DOM para la lógica de nodos
    const btnCreate = document.getElementById('btnCreate');
    const btnModify = document.getElementById('btnModify');
    const nodesContainer = document.getElementById('nodesContainer');
    const logContainer = document.getElementById('logContainer');

    // Eventos
    btnCreate.addEventListener('click', () => {
        createNodes(nodesContainer);
        logContainer.innerHTML = '<li class="list-group-item text-muted">Nodos creados. Esperando modificación...</li>';
        btnModify.disabled = false; // Habilitar botón de modificación
        btnCreate.disabled = true
    });

    btnModify.addEventListener('click', () => {
        modifyNodes(nodesContainer, logContainer);
    });
});