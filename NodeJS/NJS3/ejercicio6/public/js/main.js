import { initThemeToggle, initScrollTop } from './uiManager.js';
import { handleFormSubmit, initFormValidation } from './formHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la interfaz (Modo Oscuro y Scroll)
    initThemeToggle('themeToggle');
    initScrollTop('scrollTopBtn');

    // Elementos del DOM para el formulario
    const form = document.getElementById('registrationForm');
    const resultsContainer = document.getElementById('resultsContainer');
    const emptyMessage = document.getElementById('emptyMessage');

    // Activar validacion visual en tiempo real
    initFormValidation(form);

    // Escuchar el evento 'submit' del formulario
    form.addEventListener('submit', (e) => {
        handleFormSubmit(e, form, resultsContainer, emptyMessage);
    });
});
