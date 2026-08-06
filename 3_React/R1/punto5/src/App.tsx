
// Importamos useState para manejar los inputs
import { useState } from 'react';

import './App.css';

function App() {
  // Estado para el Modo Día/Noche. (Inicia en Dark por defecto)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Estado para capturar el nombre actual en el input
  const [name, setName] = useState('');
  // Estado para guardar el nombre una vez que se hizo submit
  const [submittedName, setSubmittedName] = useState('');

  // Validamos y guardamos el dato
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setSubmittedName(name.trim());
      setName('');
    }
  };


  // Clase CSS dinámica según el modo
  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';

  return (
    <div className={`app-container ${themeClass}`}>
      {/* Contenedor central limitado a 1200px para pantallas grandes (Requisito Max-Width) */}
      <div className="content-wrapper">
        
      {/* Contenedor del formulario */}
      <div className="simple-form-container">
        <h3>Identificación</h3>
        {!submittedName ? (
          // Formulario visible si aún no se envió el nombre
          <form onSubmit={handleSubmit} className="simple-form">
            <div className="input-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input 
                id="username"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>
            <button type="submit" className="submit-btn">Enviar</button>
          </form>
        ) : (
          // Mensaje de éxito si ya se envió (sin usar alert)
          <div className="welcome-message">
            <div className="success-icon">✓</div>
            <h4>¡Bienvenido, {submittedName}!</h4>
            <button onClick={() => setSubmittedName('')} className="reset-btn">Volver</button>
          </div>
        )}
      </div>
    
      </div>

      {/* Botón flotante para alternar entre Modo Claro y Oscuro (Abajo a la izquierda) */}
      <button 
        className="theme-toggle-btn"
        onClick={() => setIsDarkMode(!isDarkMode)}
        title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

export default App;
