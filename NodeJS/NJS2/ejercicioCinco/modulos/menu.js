export function obtenerMenu() {
    return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">

        <a class="navbar-brand" href="/">Mi Sitio</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="menu">
          <ul class="navbar-nav ms-auto">

            <li class="nav-item">
              <a class="nav-link" href="/">Home</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/contacto">Contacto</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/servicios">Servicios</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/about">About</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/ayuda">Ayuda</a>
            </li>

          </ul>
        </div>

      </div>
    </nav>
    `;
}