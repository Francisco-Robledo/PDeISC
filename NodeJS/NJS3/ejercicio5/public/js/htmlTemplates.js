// Retornan strings de HTML
export const getCardHTML = () => {
    return `
        <div class="card mb-3 border-primary">
            <div class="card-body">
                <h5 class="card-title">Nueva Tarjeta</h5>
                <p class="card-text">Soy un objeto HTML inyectado directamente usando <code>innerHTML</code>.</p>
            </div>
        </div>
    `;
};

export const getAlertHTML = () => {
    return `
        <div class="alert alert-warning alert-dismissible fade show mb-3" role="alert">
            <strong>¡Atención!</strong> Soy una alerta HTML generada al hacer click.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
};

export const getProgressHTML = () => {
    // Generamos un ancho aleatorio para que sea más dinámico
    const randomWidth = Math.floor(Math.random() * 100) + 1;
    return `
        <div class="mb-3">
            <label class="form-label">Nivel de carga (${randomWidth}%)</label>
            <div class="progress">
                <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                     role="progressbar" style="width: ${randomWidth}%;"></div>
            </div>
        </div>
    `;
};