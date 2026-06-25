// Datos iniciales para los 5 nodos
const initialLinks = [
    { text: "Google", href: "https://www.google.com" },
    { text: "MDN Web Docs", href: "https://developer.mozilla.org" },
    { text: "GitHub", href: "https://github.com" },
    { text: "StackOverflow", href: "https://stackoverflow.com" },
    { text: "Bootstrap", href: "https://getbootstrap.com" }
];

// Datos para la modificación
const updatedLinks = [
    { text: "DuckDuckGo", href: "https://duckduckgo.com" },
    { text: "W3Schools", href: "https://www.w3schools.com" },
    { text: "GitLab", href: "https://about.gitlab.com" },
    { text: "Reddit", href: "https://www.reddit.com" },
    { text: "Tailwind", href: "https://tailwindcss.com" }
];

// Estado global
let isModified = false;

// Crear nodos iniciales
export const createNodes = (container) => {
    container.innerHTML = '';

    initialLinks.forEach((linkData, index) => {
        const a = document.createElement('a');

        a.href = linkData.href;
        a.textContent = `${index + 1}. ${linkData.text}`;
        a.target = "_blank";
        a.className = "btn btn-outline-info text-start node-link";
        a.dataset.index = index;

        container.appendChild(a);
    });

    isModified = false;
};

// Alternar entre initialLinks y updatedLinks
export const modifyNodes = (container, logContainer) => {
    logContainer.innerHTML = '';

    const links = container.querySelectorAll('.node-link');

    // Elegir el conjunto de datos según el estado actual
    const targetData = isModified ? initialLinks : updatedLinks;

    links.forEach((link) => {
        const index = parseInt(link.dataset.index);

        const oldHref = link.getAttribute('href');
        const oldText = link.textContent;

        const newData = targetData[index];

        // Modificar atributos
        link.setAttribute('href', newData.href);
        link.textContent = `${index + 1}. ${newData.text}`;

        // Cambiar color según el estado
        link.className = isModified
            ? "btn btn-outline-info text-start node-link"
            : "btn btn-outline-success text-start node-link";

        // Registrar cambios
        const logItem = document.createElement('li');
        logItem.className = "list-group-item";

        logItem.innerHTML = `
            <strong>Nodo ${index + 1}</strong><br>
            <strong>href:</strong>
            <span class="text-danger">${oldHref}</span>
            →
            <span class="text-success">${newData.href}</span>
            <br>
            <strong>Texto:</strong>
            "${oldText}"
            →
            "${link.textContent}"
        `;

        logContainer.appendChild(logItem);
    });

    // Invertir estado para el próximo clic
    isModified = !isModified;
};