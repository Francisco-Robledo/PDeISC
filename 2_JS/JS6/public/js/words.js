const elements = {
    list: document.querySelector('#wordsList'),
    total: document.querySelector('#wordsTotal'),
    message: document.querySelector('#wordsMessage'),
    search: document.querySelector('#wordSearch'),
    form: document.querySelector('#addWordForm'),
    newWord: document.querySelector('#newWord'),
    feedback: document.querySelector('#newWordFeedback'),
    addButton: document.querySelector('#addWordButton'),
    theme: document.querySelector('#themeToggle'),
    scrollTop: document.querySelector('#scrollTopButton')
};

let palabras = [];

const aplicarTema = (oscuro) => {
    document.body.classList.toggle('dark-mode', oscuro);
    elements.theme.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
};

const renderizar = (filtro = '') => {
    const texto = filtro.trim().toLocaleUpperCase('es-AR');
    const visibles = palabras.filter((palabra) => palabra.includes(texto));
    elements.list.replaceChildren();

    visibles.forEach((palabra) => {
        const item = document.createElement('span');
        item.className = 'word-chip';
        item.textContent = palabra;
        elements.list.append(item);
    });

    elements.message.textContent = visibles.length === palabras.length
        ? `${palabras.length} palabras listas para jugar.`
        : `${visibles.length} resultado${visibles.length === 1 ? '' : 's'} encontrado${visibles.length === 1 ? '' : 's'}.`;
};

const cargarPalabras = async () => {
    try {
        const response = await fetch('/api/game/words', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok || !Array.isArray(data.palabras)) throw new Error(data.mensaje || 'No se pudo obtener el diccionario.');
        palabras = data.palabras;
        elements.total.textContent = data.total;
        renderizar();
    } catch (error) {
        elements.message.textContent = error.message;
    }
};

const mostrarError = (mensaje = '') => {
    elements.newWord.classList.toggle('is-invalid', Boolean(mensaje));
    elements.feedback.textContent = mensaje;
};

const agregarPalabra = async (event) => {
    event.preventDefault();
    const palabra = elements.newWord.value.trim();
    if (!palabra) {
        mostrarError('Escribe una palabra antes de agregarla.');
        return;
    }

    elements.addButton.disabled = true;
    mostrarError();
    try {
        const response = await fetch('/api/game/words/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ palabra })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok) throw new Error(data.mensaje || 'No se pudo agregar la palabra.');
        palabras.push(data.palabra);
        palabras.sort((a, b) => a.localeCompare(b, 'es'));
        elements.total.textContent = data.total;
        elements.newWord.value = '';
        elements.search.value = '';
        renderizar();
        elements.message.textContent = data.mensaje;
    } catch (error) {
        mostrarError(error.message);
    } finally {
        elements.addButton.disabled = false;
    }
};

elements.search.addEventListener('input', () => renderizar(elements.search.value));
elements.form.addEventListener('submit', agregarPalabra);
elements.theme.addEventListener('click', () => {
    const oscuro = !document.body.classList.contains('dark-mode');
    localStorage.setItem('hangman-theme', oscuro ? 'dark' : 'light');
    aplicarTema(oscuro);
});
elements.scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => elements.scrollTop.classList.toggle('visible', window.scrollY > 300));
document.querySelectorAll('#menuPrincipal .nav-link').forEach((link) => link.addEventListener('click', () => {
    bootstrap.Collapse.getOrCreateInstance(document.querySelector('#menuPrincipal')).hide();
}));

aplicarTema(localStorage.getItem('hangman-theme') === 'dark');
cargarPalabras();
